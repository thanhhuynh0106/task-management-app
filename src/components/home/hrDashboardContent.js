import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import statisticsService from "../../services/statisticsService";
import Colors from "../../styles/color";
import {
  WelcomeCard,
  OverviewCards,
  TaskStatusChart,
  LeaveTypeChart,
  TeamPerformanceChart,
  MonthlyLeaveChart,
  TeamPerformanceTable,
  SectionTitle,
} from "./dashboard";

const HRDashboardContent = ({ onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [leaveStats, setLeaveStats] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);

  const loadAllStats = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, taskRes, leaveRes, teamRes] = await Promise.all([
        statisticsService.getOverviewStats(),
        statisticsService.getTaskStats(),
        statisticsService.getLeaveStats(new Date().getFullYear()),
        statisticsService.getTeamPerformance(),
      ]);

      setOverview(overviewRes.data);
      setTaskStats(taskRes.data);
      setLeaveStats(leaveRes.data);
      setTeamPerformance(teamRes.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllStats();
  }, [loadAllStats]);

  useEffect(() => {
    if (onRefresh) {
      onRefresh.current = loadAllStats;
    }
  }, [onRefresh, loadAllStats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WelcomeCard title="HR Dashboard" subtitle="Company activity overview" />

      <SectionTitle>Overview</SectionTitle>
      <OverviewCards data={overview} />

      <SectionTitle>Task Status</SectionTitle>
      <TaskStatusChart data={taskStats} />

      <SectionTitle>Leave Types</SectionTitle>
      <LeaveTypeChart data={leaveStats} />

      <SectionTitle>Team Performance (%)</SectionTitle>
      <TeamPerformanceChart data={teamPerformance} />

      <SectionTitle>Monthly Leave Requests</SectionTitle>
      <MonthlyLeaveChart data={leaveStats} />

      <SectionTitle>Team Performance Details</SectionTitle>
      <TeamPerformanceTable data={teamPerformance} />

      <View style={{ height: 30 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HRDashboardContent;
