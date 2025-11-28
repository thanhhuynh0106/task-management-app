import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../styles/color";
import HeaderPromo from "../components/headerPromo";
import AppButton from "../components/appButton";
import { useTeamStore } from "../../store";
import { useAuth } from "../contexts/authContext";
import NoSchedules from "../../assets/icons/no_schedules.svg";
import TeamIcon from "../../assets/icons/team_ac.svg";
import UserIcon from "../../assets/icons/user.svg";

const TeamCard = ({ team, onPress }) => {
  const memberCount = team.memberIds?.length || 0;

  return (
    <TouchableOpacity style={styles.teamCard} onPress={onPress}>
      <View style={styles.teamHeader}>
        <View style={styles.teamIconContainer}>
          <TeamIcon width={24} height={24} />
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          {team.description && (
            <Text style={styles.teamDescription} numberOfLines={2}>
              {team.description}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.teamFooter}>
        <View style={styles.memberCount}>
          <UserIcon width={16} height={16} />
          <Text style={styles.memberCountText}>
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
        </View>
        {team.leaderId && (
          <Text style={styles.leaderText}>
            Lead: {team.leaderId.profile?.fullName || team.leaderId.email}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const TeamScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { teams, isLoading, error, fetchTeams, clearError } = useTeamStore();
  const [refreshing, setRefreshing] = useState(false);

  const isHR = user?.role === "hr_manager";

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error]);

  const loadTeams = async () => {
    try {
      await fetchTeams();
    } catch (error) {
      console.error("Error loading teams:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeams();
    setRefreshing(false);
  };

  const handleTeamPress = (team) => {
    navigation.navigate("TeamDetails", { teamId: team._id });
  };

  const handleCreateTeam = () => {
    navigation.navigate("CreateTeam");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary }}>
      <HeaderPromo
        text="Team Collaboration"
        subtext="Work together, achieve together"
        color={Colors.primary}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>All Teams</Text>
          <Text style={styles.headerSubtext}>
            {teams.length} {teams.length === 1 ? "team" : "teams"} in your
            organization
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          {isLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading teams...</Text>
            </View>
          ) : teams.length === 0 ? (
            <View style={styles.emptyState}>
              <NoSchedules width={120} height={120} />
              <Text style={styles.emptyTitle}>No Teams Yet</Text>
              <Text style={styles.emptyText}>
                {isHR
                  ? "Create your first team to get started"
                  : "No teams available at the moment"}
              </Text>
            </View>
          ) : (
            <View style={styles.teamsContainer}>
              {teams.map((team) => (
                <TeamCard
                  key={team._id}
                  team={team}
                  onPress={() => handleTeamPress(team)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {isHR && (
          <View style={styles.buttonContainer}>
            <AppButton
              text="Create New Team"
              onPress={handleCreateTeam}
              style={styles.createButton}
              textStyle={styles.createButtonText}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  content: {
    flex: 1,
    marginTop: -80,
  },
  header: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: "#666666",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  teamsContainer: {
    gap: 12,
  },
  teamCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  teamIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  teamDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  teamFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  memberCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberCountText: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
  },
  leaderText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  createButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TeamScreen;
