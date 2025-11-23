// commentList.js
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../../styles/color";

const CommentList = ({ comments = [] }) => {
  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return (
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No comments yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {comments.map((comment, index) => (
        <View key={comment._id || index} style={styles.commentItem}>
          <View style={styles.commentHeader}>
            <View style={styles.commentUser}>
              <View style={styles.avatarContainer}>
                {comment.userId?.avatar ? (
                  <Image
                    source={{ uri: comment.userId.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {comment.userId?.profile?.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {comment.userId?.profile?.fullName || "Unknown"}
                </Text>
                <Text style={styles.userRole}>
                  {comment.userId?.role || "Employee"}
                </Text>
              </View>
            </View>
            <Text style={styles.commentTime}>
              {formatDateTime(comment.createdAt)}
            </Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      ))}
    </View>
  );
};

export default CommentList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  commentUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  userRole: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  commentTime: {
    fontSize: 11,
    color: "#999",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginLeft: 48,
  },
});