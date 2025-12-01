// screens/homeScreen.js
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotificationStore, useTaskStore } from "../../store/index";
import TodayFocusCard from '../components/home/todayFocusCard';
import UserHeader from "../components/home/userHeader";
import WelcomeCard from "../components/home/welcomeCard";
import Colors from "../styles/color";

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { fetchMyTasks, fetchTaskStats } = useTaskStore();
  const { fetchUnreadCount, fetchNotifications } = useNotificationStore();

  // Fetch data khi screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchHomeData();

      // Auto-refresh mỗi 60 giây
      const interval = setInterval(() => {
        fetchHomeData(true); // Silent refresh
      }, 60000);
      
      return () => clearInterval(interval);
    }, [])
  );

  // Fetch unread count khi mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);
  
  const fetchHomeData = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      await Promise.all([
        fetchMyTasks({ page: 1, limit: 10, status: 'in_progress' }),
        fetchTaskStats(),
        fetchUnreadCount(),
        fetchNotifications({ page: 1, limit: 5 }),
      ]);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar 
          backgroundColor={Colors.white} 
          barStyle="dark-content" 
          translucent={true} 
        />
        <UserHeader navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={Colors.white} 
        barStyle="dark-content" 
        translucent={true} 
      />
      <UserHeader navigation={navigation} />

      <ScrollView
        style={styles.body}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[Colors.primary]} 
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <WelcomeCard />
        <TodayFocusCard navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  body: { 
    backgroundColor: Colors.secondary 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: Colors.secondary, 
    gap: 12 
  },
  loadingText: { 
    fontSize: 14, 
    color: Colors.primary, 
    fontWeight: '500' 
  },
});