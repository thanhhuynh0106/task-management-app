import { useAuth } from "@/src/contexts/authContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { downloadFile } from "../../utils/downloadHelper";

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
import { getAbsoluteFileUrl } from "../../utils/fileUrlHelper";

const { width, height } = Dimensions.get('window');

const TaskDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params;
  const [downloadingFileId, setDownloadingFileId] = useState(null);

  const { user, canManageTasks } = useAuth(); 
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

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId]);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // ===== DOWNLOAD LOGIC TỪ FILE THỨ 2 =====
  const handleDownload = async (url, filename, fileId) => {
    Alert.alert(
      'Download File',
      `Do you want to download "${filename}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Download',
          onPress: async () => {
            try {
              setDownloadingFileId(fileId);
              await downloadFile(url, filename);
              setDownloadingFileId(null);
            } catch (error) {
              console.error('Download failed:', error);
              setDownloadingFileId(null);
              Alert.alert('Download Error', 'Failed to download file. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleDownloadImage = async () => {
    if (!selectedImages[currentImageIndex]) return;
    
    try {
      setDownloadingImage(true);
      const image = selectedImages[currentImageIndex];
      
      // Tạo tên file hợp lệ
      const filename = image.name || `image_${currentImageIndex + 1}_${Date.now()}.jpg`;
      
      console.log('Downloading image:', { url: image.url, name: filename });
      
      await downloadFile(image.url, filename);

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
      year: "numeric",
    });

    let color = "#34C759";
    let label = formatted;

    if (diffDays < 0) {
      color = "#c3271fff";
      label = `Overdue (${formatted})`;
    } else if (diffDays === 0) {
      color = "#cc8219ff";
      label = `Today (${formatted})`;
    } else if (diffDays === 1) {
      color = "#fdb550ff";
      label = `Tomorrow (${formatted})`;
    } else if (diffDays <= 3) {
      color = "#39d82aff";
      label = `${diffDays} days left`;
    }

    return { label, color };
  };

  const getPriorityConfig = (priority) => {
    const map = {
      high: { color: "#FF3B30", bgColor: "#FFE6E6", label: "High" },
      medium: { color: "#FF9500", bgColor: "#FFF4E6", label: "Medium" },
      low: { color: "#34C759", bgColor: "#E6F7EC", label: "Low" },
    };
    return map[priority] || map.medium;
  };

  const getDifficultyConfig = (difficulty) => {
    const map = {
      easy: { color: "#34C759", bgColor: "#E6F7EC", label: "Easy" },
      medium: { color: "#FF9500", bgColor: "#FFF4E6", label: "Medium" },
      hard: { color: "#FF3B30", bgColor: "#FFE6E6", label: "Hard" },
      very_hard: { color: "#8E8E93", bgColor: "#F2F2F7", label: "Very Hard" },
    };
    return map[difficulty] || map.medium;
  };
  if (isLoading || !selectedTask) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </View>
    );
  }

  const canManageTask = canManageTasks();
  const statusKey = selectedTask.status === "in_progress" ? "inprogress" : selectedTask.status;
  const StatusIcon = CategoryMap[statusKey] || DefaultCategory;
  const statusConfig = getStatusConfig(selectedTask.status);
  const priorityConfig = getPriorityConfig(selectedTask.priority);
  const difficultyConfig = getDifficultyConfig(selectedTask.difficulty);
  const deadlineInfo = selectedTask.dueDate ? formatDeadline(selectedTask.dueDate) : null;

  // Lọc ảnh và file, convert URL to absolute
  const imageAttachments = (selectedTask.attachments || [])
    .filter((att) =>
      att.type?.includes("image") || /\.(jpe?g|png|gif|webp)$/i.test(att.url)
    )
    .map((att) => ({
      ...att,
      url: getAbsoluteFileUrl(att.url),
    }));

  const fileAttachments = (selectedTask.attachments || [])
    .filter(
      (att) => !att.type?.includes("image") && !/\.(jpe?g|png|gif|webp)$/i.test(att.url)
    )
    .map((att) => ({
      ...att,
      url: getAbsoluteFileUrl(att.url),
    }));

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
        {/* Header Section - Giao diện mới như file 2 */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View style={styles.titleWrapper}>
              <Text style={styles.taskTitle}>{selectedTask.title}</Text>
              <Text style={styles.createdDate}>Created {formatDate(selectedTask.createdAt)}</Text>
            </View>
            
            {canManageTask && (
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate("EditTask", { taskId })} 
                  style={styles.actionBtn}
                >
                  <EditIcon width={20} height={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDelete} 
                  style={styles.actionBtn}
                >
                  <TrashIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelInline}>Status:</Text>
              <View style={[styles.infoBadge, { backgroundColor: Colors.primary }]}>
                <Text style={styles.badgeTextSmall}>{statusConfig.label}</Text>
              </View>
            </View>

            {/* Priority */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelInline}>Priority:</Text>
              <View style={[
                styles.infoBadge,
                {
                  backgroundColor:
                    selectedTask.priority === "high" ? "#FF3B30" :
                    selectedTask.priority === "medium" ? "#FF9500" : "#34C759"
                }
              ]}>
                <Text style={styles.badgeTextSmall}>
                  {selectedTask.priority?.charAt(0).toUpperCase() + selectedTask.priority?.slice(1) || "Medium"}
                </Text>
              </View>
            </View>


            {/* Difficulty */}
            <View style={styles.infoItem}>
              <Text style={styles.infoLabelInline}>Difficulty:</Text>
              <View style={[
                styles.infoBadge,
                {
                  backgroundColor:
                    selectedTask.difficulty === "easy" ? "#34C759" :
                    selectedTask.difficulty === "hard" ? "#FF3B30" : "#FF9500"
                }
              ]}>
                <Text style={styles.badgeTextSmall}>
                  {selectedTask.difficulty?.charAt(0).toUpperCase() + selectedTask.difficulty?.slice(1) || "Medium"}
                </Text>
              </View>
            </View>

            {/* Deadline */}
            {selectedTask.dueDate && (() => {
              const deadline = formatDeadline(selectedTask.dueDate);
              return deadline ? (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabelInline}>Deadline:</Text>
                  <View style={[styles.infoBadge, { backgroundColor: deadline.color }]}>
                    <Text style={styles.badgeTextSmall}>{deadline.label}</Text>
                  </View>
                </View>
              ) : null;
            })()}
          </View>
        </View>

        {/* === HIỂN THỊ ẢNH === */}
        {imageAttachments.length > 0 && (
          <View style={styles.section}>
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
          <View style={styles.section}>
            {fileAttachments.map((file, idx) => {
              const filename = file.name || file.url.split("/").pop().split("?")[0];
              const sizeMB = file.size ? formatFileSize(file.size) : null;
              const isDownloading = downloadingFileId === (file._id || idx);
              
              return (
                <TouchableOpacity
                  key={file._id || idx}
                  style={styles.fileItem}
                  onPress={() => handleDownload(file.url, filename, file._id || idx)}
                  disabled={isDownloading}
                >
                  <FileIcon 
                    mimeType={file.type} 
                    filename={file.name} 
                    size={28}
                    style={styles.fileIcon}
                  />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.fileName} numberOfLines={2}>{filename}</Text>
                    {sizeMB && <Text style={styles.fileSize}>{sizeMB}</Text>}
                  </View>
                  {isDownloading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <DownloadIcon width={24} height={24} fill={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Description Section - Giao diện mới */}
        <View style={styles.section}>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.descriptionText}>
              {selectedTask.description || "No description provided"}
            </Text>
          </View>
        </View>

        {/* Assignee Section - Thêm từ file 2 */}
        {selectedTask.assignedTo?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assignee</Text>
            {selectedTask.assignedTo?.map((person) => (
              <View key={person._id} style={styles.assigneeItem}>
                {person.profile?.avatar ? (
                  <Image source={{ uri: person.profile.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {person.profile?.fullName?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
                <View>
                  <Text style={styles.assigneeName}>{person.profile?.fullName || person.email}</Text>
                  <Text style={styles.assigneeRole}>
                    {person.role?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Employee"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Status Update Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          {(selectedTask.assignedTo?.some((p) => p._id === user?._id) || canManageTask) ? (
            <View style={styles.statusCheckboxContainer}>
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleStatusUpdate("todo")}
              >
                <View style={[
                  styles.checkbox,
                  selectedTask.status === "todo" && styles.checkboxChecked
                ]}>
                  {selectedTask.status === "todo" && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>To Do</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleStatusUpdate("in_progress")}
              >
                <View style={[
                  styles.checkbox,
                  selectedTask.status === "in_progress" && styles.checkboxChecked
                ]}>
                  {selectedTask.status === "in_progress" && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>In Progress</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleStatusUpdate("done")}
              >
                <View style={[
                  styles.checkbox,
                  selectedTask.status === "done" && styles.checkboxChecked
                ]}>
                  {selectedTask.status === "done" && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: Colors.primary, alignSelf: "flex-start" }]}>
              <StatusIcon width={18} height={18} fill="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.statusBadgeText}>{statusConfig.label}</Text>
            </View>
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.section}>
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
    backgroundColor: Colors.white 
  },
  loading: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: Colors.white
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
  // Header Section - Giao diện mới
  headerSection: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  createdDate: { 
    fontSize: 13, 
    color: "#999" 
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "column",
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabelInline: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    width: 70,
  },
  infoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
  },
  badgeTextSmall: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },

  // Generic section
  section: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },

  // Description box
  descriptionBox: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FAFAFA",
  },
  descriptionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },

  // ===== IMAGE STYLES =====
  singleImageWrapper: {
    borderRadius: 16,
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
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0002",
  },
  twoImage: { 
    width: "100%", 
    height: 260 
  },
  threePlusLayout: { 
    marginTop: 8 
  },
  mainImageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    elevation: 3,
  },
  mainImage: { 
    width: "100%", 
    height: 320 
  },
  smallImagesRow: { 
    flexDirection: "row", 
    gap: 10 
  },
  smallImageWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  smallImage: { 
    width: "100%", 
    height: 150 
  },

  // ===== FILE ATTACHMENT STYLES =====
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginBottom: 8,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileName: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#000" 
  },
  fileSize: { 
    fontSize: 13, 
    color: "#777", 
    marginTop: 3 
  },

  // Status Checkbox
  statusCheckboxContainer: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  checkboxLabel: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },

  // Assignee
  assigneeItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 8 
  },
  avatar: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    marginRight: 12 
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  assigneeName: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#000" 
  },
  assigneeRole: { 
    fontSize: 13, 
    color: Colors.primary, 
    marginTop: 2 
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
