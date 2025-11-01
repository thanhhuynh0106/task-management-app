import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../styles/color";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import MessageBubble from "../../components/message/messageBubble";
import MessageType from "../../components/message/messageType";

const mockMessages = [
  {
    id: 1,
    message: "Hey, how are you?",
    isOwn: false,
    time: "10:30 AM",
  },
  {
    id: 2,
    message: "I'm good! Thanks for asking. How about you?",
    isOwn: true,
    time: "10:32 AM",
  },
  {
    id: 3,
    message: "I'm doing great! Just finished the project presentation.",
    isOwn: false,
    time: "10:35 AM",
  },
  {
    id: 4,
    message: "That's awesome! How did it go?",
    isOwn: true,
    time: "10:36 AM",
  },
  {
    id: 5,
    message: "It went really well! The team loved the design and features we proposed.",
    isOwn: false,
    time: "10:38 AM",
  },
  {
    id: 6,
    message: "Congratulations! I knew you'd do great 🎉",
    isOwn: true,
    time: "10:40 AM",
  },
  {
    id: 7,
    message: "Thanks! Couldn't have done it without the team's support.",
    isOwn: false,
    time: "10:42 AM",
  },
  {
    id: 8,
    message: "When do you think we can start the implementation phase?",
    isOwn: true,
    time: "10:45 AM",
  },
];

const ChatScreen = ({ navigation, route }) => {
  const { threadName } = route?.params || { threadName: "User" };
  const [messages, setMessages] = useState(mockMessages);
  const scrollViewRef = React.useRef();

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      message: text,
      isOwn: true,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <HeaderWithBackButton
          title={threadName}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.message}
              isOwn={msg.isOwn}
              time={msg.time}
            />
          ))}
        </ScrollView>

        <MessageType onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginBottom: 5
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});

