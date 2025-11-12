/**
 * Leave Screen Example
 * This is an example showing how to integrate leaveService
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import leaveService from '../../services/leaveService';
import { useAuth } from '../../contexts/authContext';

export default function LeaveScreenExample() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadLeaves(),
        loadBalance()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadLeaves = async () => {
    try {
      const response = await leaveService.getMyLeaves();
      setLeaves(response.data);
    } catch (error) {
      console.error('Error loading leaves:', error);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await leaveService.getLeaveBalance();
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleSubmitLeave = async () => {
    try {
      const leaveData = {
        type: 'vacation',
        startDate: '2025-11-20',
        endDate: '2025-11-22',
        reason: 'Family vacation'
      };

      await leaveService.submitLeave(leaveData);
      Alert.alert('Success', 'Leave request submitted!');
      loadData(); // Refresh data
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to submit leave');
    }
  };

  const handleCancelLeave = async (leaveId) => {
    Alert.alert(
      'Cancel Leave',
      'Are you sure you want to cancel this leave request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await leaveService.cancelLeave(leaveId);
              Alert.alert('Success', 'Leave cancelled');
              loadData();
            } catch (error) {
              Alert.alert('Error', error.error || 'Failed to cancel leave');
            }
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderLeaveItem = ({ item }) => (
    <View style={{ padding: 16, backgroundColor: '#fff', marginBottom: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
        {item.type.toUpperCase()}
      </Text>
      <Text>{item.startDate} - {item.endDate}</Text>
      <Text>Days: {item.numberOfDays}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Reason: {item.reason}</Text>
      
      {item.status === 'pending' && (
        <TouchableOpacity
          onPress={() => handleCancelLeave(item._id)}
          style={{ marginTop: 8, padding: 8, backgroundColor: '#ff4444' }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Balance Card */}
      {balance && (
        <View style={{ padding: 16, backgroundColor: '#4CAF50', margin: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Leave Balance</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
            {balance.remaining} / {balance.total} days
          </Text>
          <Text style={{ color: '#fff' }}>Used: {balance.used} days</Text>
        </View>
      )}

      {/* Submit Leave Button */}
      <TouchableOpacity
        onPress={handleSubmitLeave}
        style={{ margin: 16, padding: 16, backgroundColor: '#2196F3' }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>
          Submit New Leave Request
        </Text>
      </TouchableOpacity>

      {/* Leave List */}
      <FlatList
        data={leaves}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No leave requests yet
          </Text>
        }
      />
    </View>
  );
}

