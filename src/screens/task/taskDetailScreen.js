// TaskDetailScreen.js - ĐÃ FIX HANDLE DOWNLOAD
import { useAuth } from "@/src/contexts/authContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { downloadToPublicStorage, shareAndDownload, simpleDownload } from "../../utils/downloadHelper"; // THÊM CÁC HÀM DOWNLOAD KHÁC

import DownloadIcon from "../../../assets/icons/arrow-down.svg";
import ChevronLeftIcon from "../../../assets/icons/chevron_left.svg";
import ChevronRightIcon from "../../../assets/icons/chevron_right.svg";
import CloseIcon from "../../../assets/icons/close-circle.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import TrashIcon from "../../../assets/icons/trash.svg";
import { CategoryMap, DefaultCategory } from "../../utils/categoryMapping";

import useTaskStore from "../../../store/taskStore";
import FileIcon from "../../components/fileIcon";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import AddComment from "../../components/task/addComment";
import CommentList from "../../components/task/commentList";
import Colors from "../../styles/color";

const { width, height } = Dimensions.get('window');

const TaskDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params;

  const { user } = useAuth(); 
  const {
    selectedTask,
    isLoading,
    fetchTaskById,
    updateTaskStatus,
    deleteTask,
  } = useTaskStore();

  // States for image viewer
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [downloadingImage, setDownloadingImage] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState({}); // THEO DÕI TRẠNG THÁI DOWNLOAD CỦA TỪNG FILE

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // ===== FIXED DOWNLOAD FUNCTIONS =====
  const handleDownloadFile = async (file, index) => {
    try {
      // Hiển thị trạng thái loading cho file cụ thể
      setDownloadingFiles(prev => ({ ...prev, [index]: true }));
      
      // Kiểm tra URL hợp lệ
      if (!file.url || !file.name) {
        throw new Error('File information is incomplete');
      }

      // Kiểm tra nếu URL bắt đầu bằng http
      if (!file.url.startsWith('http')) {
        throw new Error('Invalid file URL');
      }

      console.log('Downloading file:', { url: file.url, name: file.name, size: file.size });

      // Sử dụng downloadToPublicStorage cho Android, simpleDownload cho iOS
      let result;
      if (Platform.OS === 'android') {
        result = await downloadToPublicStorage(file.url, file.name);
      } else {
        result = await simpleDownload(file.url, file.name);
      }

      if (!result) {
        throw new Error('Download failed - no result returned');
      }

      console.log('Download successful:', result);

    } catch (error) {
      console.error('Download file error:', error);
      
      let errorMessage = 'Cannot download file. Please try again.';
      
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('Permission Denied')) {
        errorMessage = 'Storage permission denied. Please allow storage access.';
      } else if (error.message.includes('Invalid file URL')) {
        errorMessage = 'Invalid file URL. Cannot download this file.';
      }
      
      Alert.alert('Download Failed', errorMessage);
    } finally {
      // Ẩn trạng thái loading
      setDownloadingFiles(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDownloadWithOptions = (file, index) => {
    if (Platform.OS === 'android') {
      Alert.alert(
        'Download Options',
        'Choose download method:',
        [
          {
            text: 'Save to Downloads',
            onPress: async () => {
              try {
                setDownloadingFiles(prev => ({ ...prev, [index]: true }));
                await downloadToPublicStorage(file.url, file.name);
              } catch (error) {
                Alert.alert('Download Failed', 'Cannot save to Downloads');
              } finally {
                setDownloadingFiles(prev => ({ ...prev, [index]: false }));
              }
            }
          },
          {
            text: 'Choose Location',
            onPress: async () => {
              try {
                setDownloadingFiles(prev => ({ ...prev, [index]: true }));
                await shareAndDownload(file.url, file.name);
              } catch (error) {
                Alert.alert('Share Failed', 'Cannot share file');
              } finally {
                setDownloadingFiles(prev => ({ ...prev, [index]: false }));
              }
            }
          },
          {
            text: 'Simple Download',
            onPress: () => handleDownloadFile(file, index)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else {
      // iOS: chỉ dùng simple download
      handleDownloadFile(file, index);
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImages[currentImageIndex]) return;
    
    try {
      setDownloadingImage(true);
      const image = selectedImages[currentImageIndex];
      
      // Tạo tên file hợp lệ
      const filename = image.name || `image_${currentImageIndex + 1}_${Date.now()}.jpg`;
      
      console.log('Downloading image:', { url: image.url, name: filename });

      let result;
      if (Platform.OS === 'android') {
        result = await downloadToPublicStorage(image.url, filename);
      } else {
        result = await simpleDownload(image.url, filename);
      }

      if (!result) {
        throw new Error('Download failed');
      }

    } catch (error) {
      console.error('Download image error:', error);
      Alert.alert('Download Failed', 'Cannot download image. Please try again.');
    } finally {
      setDownloadingImage(false);
    }
  };

  // Các hàm khác giữ nguyên...
  const canUpdateStatus = (currentStatus, targetStatus) => {
    if (currentStatus === targetStatus) return false;
    
    const allowedTransitions = {
      'todo': ['in_progress', 'done'],
      'in_progress': ['todo', 'done'],
      'done': ['todo', 'in_progress']
    };
    return allowedTransitions[currentStatus]?.includes(targetStatus) || false;
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!canUpdateStatus(selectedTask.status, newStatus)) {
      Alert.alert("Không thể cập nhật", "Không thể chuyển trạng thái ngược lại");
      return;
    }

    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTaskById(taskId);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = () => {
    Alert.alert("Xóa công việc", "Bạn có chắc chắn muốn xóa công việc này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteTask(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  // Image Viewer Functions
  const openImageViewer = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < selectedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusConfig = (status) => {
    const map = {
      todo: { label: "To Do", color: "#8E8E93", bgColor: "#F2F2F7" },
      in_progress: { label: "In Progress", color: "#007AFF", bgColor: "#E6F2FF" },
      done: { label: "Done", color: "#34C759", bgColor: "#E6F7EC" },
    };
    return map[status] || map.todo;
  };

  const formatDeadline = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    let color = "#34C759";
    let bgColor = "#E6F7EC";
    let label = formatted;

    if (diffDays < 0) {
      color = "#FF3B30";
      bgColor = "#FFE6E6";
      label = `Overdue (${formatted})`;
    } else if (diffDays === 0) {
      color = "#FF9500";
      bgColor = "#FFF4E6";
      label = `Today (${formatted})`;
    } else if (diffDays === 1) {
      color = "#FF9500";
      bgColor = "#FFF4E6";
      label = `Tomorrow (${formatted})`;
    } else if (diffDays <= 3) {
      color = "#FF9500";
      bgColor = "#FFF4E6";
      label = `${diffDays}d left`;
    }

    return { label, color, bgColor };
  };

  const getPriorityConfig = (priority) => {
    const map = {
      high: { color: "#FF3B30", bgColor: "#FFE6E6", label: "High" },
      medium: { color: "#FF9500", bgColor: "#FFF4E6", label: "Medium" },
      low: { color: "#34C759", bgColor: "#E6F7EC", label: "Low" },
    };
    return map[priority] || map.medium;
  };

  if (isLoading || !selectedTask) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </View>
    );
  }

  const statusKey = selectedTask.status === "in_progress" ? "inprogress" : selectedTask.status;
  const StatusIcon = CategoryMap[statusKey] || DefaultCategory;
  const statusConfig = getStatusConfig(selectedTask.status);
  const priorityConfig = getPriorityConfig(selectedTask.priority);
  const deadlineInfo = selectedTask.dueDate ? formatDeadline(selectedTask.dueDate) : null;

  // Lọc ảnh và file
  const imageAttachments = selectedTask.attachments?.filter((att) =>
    att.type?.includes("image") || /\.(jpe?g|png|gif|webp)$/i.test(att.url)
  ) || [];

  const fileAttachments = selectedTask.attachments?.filter(
    (att) => !att.type?.includes("image") && !/\.(jpe?g|png|gif|webp)$/i.test(att.url)
  ) || [];

  const currentImage = selectedImages[currentImageIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <HeaderWithBackButton 
        title="Task Details" 
        onBackPress={() => navigation.goBack()}
        backgroundColor={Colors.white}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={() => fetchTaskById(taskId)}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <Text style={styles.taskTitle}>{selectedTask.title}</Text>
              <Text style={styles.createdDate}>
                Created {formatDate(selectedTask.createdAt)}
              </Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => navigation.navigate("EditTask", { taskId })} 
                style={[styles.actionBtn, styles.editBtn]}
              >
                <EditIcon width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDelete} 
                style={[styles.actionBtn, styles.deleteBtn]}
              >
                <TrashIcon width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <StatusIcon width={16} height={16} fill={statusConfig.color} />
            <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* === HIỂN THỊ ẢNH === */}
        {imageAttachments.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Images ({imageAttachments.length})</Text>
            
            {imageAttachments.length === 1 && (
              <TouchableOpacity
                onPress={() => openImageViewer(imageAttachments)}
                style={styles.singleImageWrapper}
              >
                <Image source={{ uri: imageAttachments[0].url }} style={styles.singleImage} resizeMode="cover" />
              </TouchableOpacity>
            )}

            {imageAttachments.length === 2 && (
              <View style={styles.twoImagesRow}>
                {imageAttachments.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => openImageViewer(imageAttachments, idx)}
                    style={styles.twoImageItem}
                  >
                    <Image source={{ uri: img.url }} style={styles.twoImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {imageAttachments.length >= 3 && (
              <View style={styles.threePlusLayout}>
                {/* Ảnh đầu to */}
                <TouchableOpacity
                  onPress={() => openImageViewer(imageAttachments)}
                  style={styles.mainImageWrapper}
                >
                  <Image source={{ uri: imageAttachments[0].url }} style={styles.mainImage} resizeMode="cover" />
                </TouchableOpacity>

                {/* 2 ảnh nhỏ */}
                <View style={styles.smallImagesRow}>
                  {imageAttachments.slice(1, 3).map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => openImageViewer(imageAttachments, idx + 1)}
                      style={styles.smallImageWrapper}
                    >
                      <Image source={{ uri: img.url }} style={styles.smallImage} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* === FILE ATTACHMENTS SECTION === */}
        {fileAttachments.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Files ({fileAttachments.length})</Text>
            
            {fileAttachments.map((file, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDownloadWithOptions(file, index)}
                style={styles.fileItem}
                disabled={downloadingFiles[index]}
              >
                <View style={styles.fileIconContainer}>
                  <FileIcon 
                    mimeType={file.type} 
                    filename={file.name} 
                    size={24} 
                  />
                </View>
                
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => handleDownloadWithOptions(file, index)}
                  style={styles.downloadBtn}
                  disabled={downloadingFiles[index]}
                >
                  {downloadingFiles[index] ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <DownloadIcon width={20} height={20} fill={Colors.primary} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Description Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {selectedTask.description || "No description provided"}
            </Text>
          </View>
        </View>

        {/* Compact Info Row */}
        <View style={styles.compactInfoRow}>
          {/* Priority */}
          <View style={styles.compactInfoItem}>
            <Text style={styles.compactInfoLabel}>Priority</Text>
            <View style={[styles.compactInfoBadge, { backgroundColor: priorityConfig.bgColor }]}>
              <View style={[styles.dot, { backgroundColor: priorityConfig.color }]} />
              <Text style={[styles.compactInfoBadgeText, { color: priorityConfig.color }]}>
                {priorityConfig.label}
              </Text>
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.compactInfoItem}>
            <Text style={styles.compactInfoLabel}>Difficulty</Text>
            <View style={[styles.compactInfoBadge, { backgroundColor: "#F0F7FF" }]}>
              <View style={[styles.dot, { backgroundColor: "#007AFF" }]} />
              <Text style={[styles.compactInfoBadgeText, { color: "#007AFF" }]}>
                Easy
              </Text>
            </View>
          </View>

          {/* Deadline */}
          {deadlineInfo && (
            <View style={styles.compactInfoItem}>
              <Text style={styles.compactInfoLabel}>Deadline</Text>
              <View style={[styles.compactInfoBadge, { backgroundColor: deadlineInfo.bgColor }]}>
                <View style={[styles.dot, { backgroundColor: deadlineInfo.color }]} />
                <Text style={[styles.compactInfoBadgeText, { color: deadlineInfo.color }]}>
                  {deadlineInfo.label}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Status Update Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <Text style={styles.sectionSubtitle}>Progress forward only</Text>
          
          <View style={styles.statusButtonsContainer}>
            {["todo", "in_progress", "done"].map((status) => {
              const config = getStatusConfig(status);
              const isActive = selectedTask.status === status;
              const isDisabled = !canUpdateStatus(selectedTask.status, status);
              
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusUpdate(status)}
                  disabled={isDisabled}
                  style={[
                    styles.statusBtn,
                    isActive && styles.statusBtnActive,
                    isDisabled && styles.statusBtnDisabled,
                    { borderColor: config.color }
                  ]}
                >
                  <View style={[styles.statusIcon, { backgroundColor: config.bgColor }]}>
                    <StatusIcon width={16} height={16} fill={config.color} />
                  </View>
                  <Text style={[
                    styles.statusBtnText,
                    { color: isActive ? config.color : isDisabled ? '#CCC' : '#666' }
                  ]}>
                    {config.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.activeDot, { backgroundColor: config.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.sectionCard}>
          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <Text style={styles.commentsCount}>
              ({selectedTask.comments?.length || 0})
            </Text>
          </View>
          
          <CommentList comments={selectedTask.comments || []} />
          <AddComment taskId={taskId} />
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={closeImageViewer}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeImageViewer}>
            <CloseIcon width={24} height={24} />
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity 
            style={styles.downloadButton} 
            onPress={handleDownloadImage}
            disabled={downloadingImage}
          >
            {downloadingImage ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <DownloadIcon width={24} height={24} />
            )}
          </TouchableOpacity>

          {/* Main Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: currentImage?.url }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>

          {/* Navigation Arrows */}
          {currentImageIndex > 0 && (
            <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={goToPreviousImage}>
              <ChevronLeftIcon width={24} height={24} />
            </TouchableOpacity>
          )}

          {currentImageIndex < selectedImages.length - 1 && (
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={goToNextImage}>
              <ChevronRightIcon width={24} height={24} />
            </TouchableOpacity>
          )}

          {/* Image Counter */}
          {selectedImages.length > 1 && (
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {currentImageIndex + 1} / {selectedImages.length}
              </Text>
            </View>
          )}

          {/* Image Name */}
          <View style={styles.nameContainer}>
            <Text style={styles.imageName} numberOfLines={1}>
              {currentImage?.name || `Image ${currentImageIndex + 1}`}
            </Text>
            {currentImage?.size && (
              <Text style={styles.imageSize}>
                {formatFileSize(currentImage.size)}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  loading: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F8F9FA"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500"
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: Colors.white,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 32,
  },
  createdDate: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  editBtn: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F7FF",
  },
  deleteBtn: {
    borderColor: "#FFE6E6",
    backgroundColor: "#FFF0F0",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 8,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  descriptionBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FAFBFC",
    borderWidth: 1,
    borderColor: "#E8E9EB",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  // Compact Info Row Styles
  compactInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  compactInfoItem: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  compactInfoLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: "500",
  },
  compactInfoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  compactInfoBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // ===== IMAGE STYLES =====
  singleImageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0003",
  },
  singleImage: { 
    width: "100%", 
    height: 320 
  },
  twoImagesRow: { 
    flexDirection: "row", 
    gap: 10 
  },
  twoImageItem: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0002",
  },
  twoImage: { 
    width: "100%", 
    height: 200 
  },
  threePlusLayout: { 
    gap: 10 
  },
  mainImageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  mainImage: { 
    width: "100%", 
    height: 240 
  },
  smallImagesRow: { 
    flexDirection: "row", 
    gap: 10 
  },
  smallImageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  smallImage: { 
    width: "100%", 
    height: 120 
  },
  // ===== FILE ATTACHMENT STYLES =====
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: '#E8E9EB',
    marginBottom: 8,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIcon: {
    fontSize: 18,
  },
  fileInfo: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 13,
    color: '#8E8E93',
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Status Buttons
  statusButtonsContainer: {
    gap: 12,
    marginTop: 8,
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "#FAFBFC",
    gap: 12,
  },
  statusBtnActive: {
    backgroundColor: "#FAFBFC",
  },
  statusBtnDisabled: {
    opacity: 0.5,
    borderColor: "#E5E5EA",
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBtnText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Comments
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  commentsCount: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },
  // ===== MODAL STYLES =====
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  downloadButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalImage: {
    width: width,
    height: height * 0.8,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -25 }],
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  counterContainer: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  nameContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: width * 0.8,
    alignItems: 'center',
  },
  imageName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageSize: {
    color: '#CCC',
    fontSize: 12,
    marginTop: 4,
  },
});