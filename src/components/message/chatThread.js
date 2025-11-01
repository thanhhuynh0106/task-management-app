import React from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import Avatar from "../avatar"

const chatThread = ({thread, onPress}) => {
    return (
        <Pressable
            onPress={onPress}
            style={styles.container}
        >
            <Avatar name={thread.name} width={50} height={50} />
            <View style={styles.content}>
                            <View style={styles.mid}>
                <Text style={styles.threadName}>{thread.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{thread.lastMessage}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.time}>{thread.time}</Text>
                {thread.unreadCount > 0 && (
                    <View style={styles.unreadCountContainer}>
                        <Text style={styles.unreadCountText}>{thread.unreadCount}</Text>
                    </View>
                )}
            </View>
            </View>
        </Pressable>
    )
}


export default chatThread

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "#ccc",
    height: 90,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16
  },
  mid: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  threadName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666666",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: "#999999",
  },
  unreadCountContainer: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
})



