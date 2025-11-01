import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "../../styles/color";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import ChatThread from "../../components/message/chatThread";

const MessageScreen = ({ navigation }) => {
  const threads = [
    { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?', time: '2:30 PM', unreadCount: 2 },
    { id: '2', name: 'Bob', lastMessage: 'Let\'s catch up later.', time: '1:15 PM', unreadCount: 0 },
    { id: '3', name: 'Charlie', lastMessage: 'Did you see the game last night?', time: 'Yesterday', unreadCount: 5 },
    { id: '4', name: 'Diana', lastMessage: 'Happy Birthday!', time: 'Yesterday', unreadCount: 0 },
    { id: '5', name: 'Eve', lastMessage: 'Can you send me the report?', time: '2 days ago', unreadCount: 1 },
    { id: '6', name: 'Frank', lastMessage: 'Meeting at 10 AM tomorrow.', time: '2 days ago', unreadCount: 0 },
  ];

  const handleThreadPress = (thread) => {
    navigation.navigate('Chat', { threadName: thread.name, threadId: thread.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderWithBackButton title="Messages" onBackPress={() => navigation.goBack()} />
      </View>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {threads.map(thread => (
          <ChatThread
            key={thread.id}
            thread={thread}
            onPress={() => handleThreadPress(thread)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

