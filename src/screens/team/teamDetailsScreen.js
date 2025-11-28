import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import Avatar from "../../components/avatar";
import AppButton from "../../components/appButton";
import Colors from "../../styles/color";
import { useTeamStore } from "../../../store";
import { useAuth } from "../../contexts/authContext";
import TeamIcon from "../../../assets/icons/team_ac.svg";
import EditIcon from "../../../assets/icons/setting-2.svg";

const MemberCard = ({ member, isLeader, onRemove, canRemove }) => {
  return (
    <View style={styles.memberCard}>
      <View style={styles.memberLeft}>
        <Avatar
          name={member.profile?.fullName || member.email}
          width={48}
          height={48}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>
            {member.profile?.fullName || member.email}
          </Text>
          <Text style={styles.memberPosition}>
            {member.profile?.position || "Employee"}
          </Text>
          {isLeader && (
            <View style={styles.leaderBadge}>
              <Text style={styles.leaderBadgeText}>Team Lead</Text>
            </View>
          )}
        </View>
      </View>

      {canRemove && !isLeader && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(member)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const TeamDetailsScreen = ({ navigation, route }) => {
  const { teamId } = route.params;
  const { user } = useAuth();
  const {
    currentTeam,
    isLoading,
    fetchTeamById,
    removeMember,
    clearError,
    error,
  } = useTeamStore();

  const [members, setMembers] = useState([]);

  const isHR = user?.role === "hr_manager";
  const isTeamLead = currentTeam?.leaderId?._id === user?._id;
  const canManage = isHR || isTeamLead;

  useEffect(() => {
    loadTeamDetails();
  }, [teamId]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error]);

  useEffect(() => {
    if (currentTeam?.memberIds) {
      setMembers(currentTeam.memberIds);
    }
  }, [currentTeam]);

  const loadTeamDetails = async () => {
    try {
      await fetchTeamById(teamId);
    } catch (error) {
      console.error("Error loading team:", error);
      Alert.alert("Error", "Failed to load team details");
    }
  };

  const handleRemoveMember = async (member) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${
        member.profile?.fullName || member.email
      } from this team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMember(teamId, member._id);
              Alert.alert("Success", "Member removed successfully");
              await loadTeamDetails();
            } catch (error) {
              Alert.alert("Error", "Failed to remove member");
            }
          },
        },
      ]
    );
  };

  const handleAddMember = () => {
    navigation.navigate("AddMember", { teamId });
  };

  const handleEditTeam = () => {
    navigation.navigate("EditTeam", { teamId });
  };

  if (isLoading || !currentTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton
          title="Team Details"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading team details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton
        title="Team Details"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.teamIconContainer}>
              <TeamIcon width={32} height={32} />
            </View>
            {isHR && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditTeam}
              >
                <EditIcon width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.teamName}>{currentTeam.name}</Text>
          {currentTeam.description && (
            <Text style={styles.teamDescription}>
              {currentTeam.description}
            </Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{members.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentTeam.leaderId?.profile?.fullName || "N/A"}
              </Text>
              <Text style={styles.statLabel}>Team Lead</Text>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            {canManage && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddMember}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.membersContainer}>
            {members.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                isLeader={member._id === currentTeam.leaderId?._id}
                onRemove={handleRemoveMember}
                canRemove={canManage}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  teamIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  teamName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  teamDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E8E8E8",
    marginHorizontal: 16,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  membersContainer: {
    gap: 12,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  memberPosition: {
    fontSize: 13,
    color: "#666666",
  },
  leaderBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  leaderBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default TeamDetailsScreen;
