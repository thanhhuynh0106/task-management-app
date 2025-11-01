import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../styles/color";

const MessageBubble = ({ message, isOwn, time }) => {
  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
          {message}
        </Text>
        <Text style={[styles.timeText, isOwn ? styles.ownTimeText : styles.otherTimeText]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ownContainer: {
    alignItems: "flex-end",
  },
  otherContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.frame,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  ownText: {
    color: "#FFFFFF",
  },
  otherText: {
    color: "#000000",
  },
  timeText: {
    fontSize: 11,
    alignSelf: "flex-end",
  },
  ownTimeText: {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  otherTimeText: {
    color: "#666666",
  },
});

