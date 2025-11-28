// TaskDetailScreen.js – PHIÊN BẢN HOÀN CHỈNH CUỐI CÙNG (20/11/2025)
import { useAuth } from "@/src/contexts/authContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DownloadIcon from "../../../assets/icons/download.svg";
import EditIcon from "../../../assets/icons/edit.svg";
import TrashIcon from "../../../assets/icons/trash.svg";
import { CategoryMap, DefaultCategory } from "../../utils/categoryMapping";

import { useState } from "react"; // Thêm useState nếu chưa có
import useTaskStore from "../../../store/taskStore";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import AddComment from "../../components/task/addComment";
import CommentList from "../../components/task/commentList";
import Colors from "../../styles/color";
import { downloadFile } from "../../utils/downloadHelper";

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

  useEffect(() => {
    fetchTaskById(taskId);
  }, [taskId]);

  const handleStatusUpdate = async (newStatus) => {
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

  const handleDownload = async (url, filename, fileId) => {
    try {
      // Set loading state cho file đang tải
      setDownloadingFileId(fileId);
      
      // Gọi helper function
      await downloadFile(url, filename);
      
      // Clear loading state
      setDownloadingFileId(null);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadingFileId(null);
      Alert.alert('Error', 'Failed to download file. Please try again.');
    }
  };

  const openImageViewer = (images, startIndex = 0) => {
    navigation.navigate("ImageViewer", {
      images: images.map((img) => img.url),
      initialIndex: startIndex,
    });
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusConfig = (status) => {
    const map = {
      todo: { label: "To Do", color: "#8E8E93" },
      in_progress: { label: "In Progress", color: "#007AFF" },
      done: { label: "Done", color: "#34C759" },
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
  
    let color = "#34C759"; // xanh
    let label = formatted;
  
    if (diffDays < 0) {
      color = "#FF3B30";
      label = `Overdue (${formatted})`;
    } else if (diffDays === 0) {
      color = "#FF9500";
      label = `Today (${formatted})`;
    } else if (diffDays === 1) {
      color = "#FF9500";
      label = `Tomorrow (${formatted})`;
    } else if (diffDays <= 3) {
      color = "#FF9500";
      label = `${diffDays} days left`;
    }
  
    return { label, color };
  };

  if (isLoading || !selectedTask) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const canManageTask = canManageTasks();
  const statusKey = selectedTask.status === "in_progress" ? "inprogress" : selectedTask.status;
  const StatusIcon = CategoryMap[statusKey] || DefaultCategory;
  const statusConfig = getStatusConfig(selectedTask.status);


  // Lọc ảnh và file
  const imageAttachments = selectedTask.attachments?.filter((att) =>
    att.type?.includes("image") || /\.(jpe?g|png|gif|webp)$/i.test(att.url)
  ) || [];

  const fileAttachments = selectedTask.attachments?.filter(
    (att) => !att.type?.includes("image") && !/\.(jpe?g|png|gif|webp)$/i.test(att.url)
  ) || [];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton title="Task Details" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={() => fetchTaskById(taskId)}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Title & Status Badge */}
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

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
            <StatusIcon width={16} height={16} fill="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.statusBadgeText}>{statusConfig.label}</Text>
          </View>
        </View>

       

        {/* === HIỂN THỊ ẢNH – ĐẸP NHƯ ẢNH MẪU === */}
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

        {/* === FILE KHÁC (PDF, DOC...) === */}
        {fileAttachments.length > 0 && (
          <View style={styles.section}>
            {fileAttachments.map((file, idx) => {
              const filename = file.name || file.url.split("/").pop().split("?")[0];
              const sizeMB = file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : null;
              
              return (
                <TouchableOpacity
                  key={file._id || idx}
                  style={styles.fileItem}
                  onPress={() => handleDownload(file.url, filename, file._id)}
                >
                  <DownloadIcon width={28} height={28} fill={Colors.primary} />
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.fileName} numberOfLines={2}>{filename}</Text>
                    {sizeMB && <Text style={styles.fileSize}>{sizeMB}</Text>}
                  </View>
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

         {/* Mô tả */}
         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {selectedTask.description || "Không có mô tả"}
          </Text>
        </View>

        {/* Priority, Difficulty & Deadline */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Priority</Text>
            <View style={[
              styles.priorityBadge,
              {
                backgroundColor:
                  selectedTask.priority === "high" ? "#FF3B30" :
                  selectedTask.priority === "medium" ? "#FF9500" : "#34C759"
              }
            ]}>
              <Text style={styles.badgeText}>
                {selectedTask.priority?.charAt(0).toUpperCase() + selectedTask.priority?.slice(1) || "Medium"}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Difficulty</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.badgeText}>Very Easy (Less Than a Day)</Text>
            </View>
          </View>

          {/* DEADLINE MỚI – SIÊU ĐẸP */}
          {selectedTask.dueDate && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Deadline</Text>
              {(() => {
                const deadline = formatDeadline(selectedTask.dueDate);
                return deadline ? (
                  <View style={[styles.deadlineBadge, { backgroundColor: deadline.color }]}>
                    <Text style={styles.badgeText}>{deadline.label}</Text>
                  </View>
                ) : null;
              })()}
            </View>
          )}
        </View>

        {/* Assignee */}
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

        {/* Status Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          {(selectedTask.assignedTo?.some((p) => p._id === user?._id) || canManageTask) && (
            <View style={styles.statusButtonsContainer}>
              {["todo", "in_progress", "done"].map((status) => {
                const config = getStatusConfig(status);
                const isActive = selectedTask.status === status;
                return (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleStatusUpdate(status)}
                    disabled={isActive}
                    style={[styles.statusBtn, {
                      backgroundColor: isActive ? config.color : "#F2F2F7",
                      borderColor: isActive ? config.color : "#DDD",
                    }]}
                  >
                    <Text style={[styles.statusBtnText, { color: isActive ? "#FFF" : "#666" }]}>
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {!(selectedTask.assignedTo?.some((p) => p._id === user?._id) || canManageTask) && (
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color, alignSelf: "flex-start" }]}>
              <StatusIcon width={18} height={18} fill="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.statusBadgeText}>{statusConfig.label}</Text>
            </View>
          )}
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments</Text>
          <CommentList comments={selectedTask.comments || []} />
          <AddComment taskId={taskId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetailScreen;

// ======================= STYLES =======================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Loading
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  // === HEADER ===
  headerSection: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
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

  // Title section
  titleSection: {
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 42,
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  createdDate: { fontSize: 13, color: "#999" },

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

  // Description box (giống ảnh mẫu)
  description: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FAFAFA",
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },

  // ===== IMAGE STYLES =====
  singleImageWrapper: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0003",
  },
  singleImage: { width: "100%", height: 320 },

  twoImagesRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  twoImageItem: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0002",
  },
  twoImage: { width: "100%", height: 260 },

  threePlusLayout: { marginTop: 8 },
  mainImageWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    elevation: 3,
  },
  mainImage: { width: "100%", height: 320 },

  smallImagesRow: { flexDirection: "row", gap: 10 },
  smallImageWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  smallImage: { width: "100%", height: 150 },

  // ===== FILE ITEM =====
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  fileName: { fontSize: 15, fontWeight: "600", color: "#000" },
  fileSize: { fontSize: 13, color: "#777", marginTop: 3 },
  downloadText: { color: Colors.primary, fontWeight: "600", fontSize: 14 },

  // ===== Priority / Difficulty Section =====
  infoRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#EFEFF0",
    gap: 12,
  },
  infoCard: { flex: 1 },
  infoLabel: { fontSize: 13, color: "#888", marginBottom: 6 },

  priorityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  difficultyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#34C759",
    alignSelf: "flex-start",
  },
  badgeText: { color: "#FFF", fontSize: 13, fontWeight: "600" },

  // ==== Deadline ===
  deadlineBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  // ===== Assignee =====
  assigneeItem: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  assigneeName: { fontSize: 15, fontWeight: "600", color: "#000" },
  assigneeRole: { fontSize: 13, color: Colors.primary, marginTop: 2 },

  // ===== Status Buttons =====
  statusButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  statusBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    minWidth: 100,
    alignItems: "center",
  },
  statusBtnText: { fontSize: 15, fontWeight: "600" },
});
