import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBackButton from "../../components/headerWithBackButton"; 
import Avatar from "../../components/avatar"; 
import AppButton from "../../components/appButton"; 
import Colors from "../../styles/color"; 
import { useTeamStore } from "../../../store"; 
import { useUserStore } from "../../../store"; 
import SearchIcon from "../../../assets/icons/search.svg"; 

const UserCard = React.memo(
  ({ user, isSelected, onToggle, isAlreadyMember }) => {
    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          isSelected && styles.userCardSelected,
          isAlreadyMember && styles.userCardDisabled,
        ]}
        onPress={() => !isAlreadyMember && onToggle(user)}
        disabled={isAlreadyMember}
      >
        <View style={styles.userLeft}>
          <Avatar
            name={user.profile?.fullName || user.email}
            width={48}
            height={48}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.profile?.fullName || user.email}
            </Text>
            <Text style={styles.userPosition}>
              {user.profile?.position || "Employee"} •{" "}
              {user.profile?.department || "No Department"}
            </Text>
            {isAlreadyMember && (
              <View style={styles.memberBadge}>
                <Text style={styles.memberBadgeText}>Already a member</Text>
              </View>
            )}
          </View>
        </View>

        {!isAlreadyMember && (
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
            {isSelected && <View style={styles.checkboxInner} />}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

const AddMemberScreen = ({ navigation, route }) => {
  const { teamId } = route.params;
  const {
    currentTeam,
    addMember,
    fetchTeamById,
    isLoading: teamLoading,
  } = useTeamStore();

  const {
    users,
    fetchUsers,
    isLoading: userLoading,
    isLoadingMore,
    pagination,
  } = useUserStore();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    loadData();
  }, [teamId]);

  const loadData = async () => {
    try {
      setIsInitializing(true);
      await Promise.all([
        fetchTeamById(teamId),
        fetchUsers({ page: 1, limit: 10, search: "" }),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isInitializing) return;

    const delayDebounceFn = setTimeout(() => {
      fetchUsers({
        search: searchQuery,
        page: 1,
        limit: 10,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!userLoading && !isLoadingMore && pagination.page < pagination.pages) {
      fetchUsers(
        {
          search: searchQuery,
          page: pagination.page + 1,
          limit: 10,
        },
        true
      ); 
    }
  };

  const isUserAlreadyMember = (userId) => {
    if (!currentTeam?.members) return false;
    return currentTeam.members.some((member) => member._id === userId);
  };

  const handleToggleUser = useCallback((user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const isUserSelected = (userId) => {
    return selectedUsers.some((u) => u._id === userId);
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert(
        "Validation Error",
        "Please select at least one member to add"
      );
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const user of selectedUsers) {
        try {
          await addMember(teamId, user._id);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to add ${user.email}:`, error);
        }
      }

      await fetchTeamById(teamId);

      if (failCount === 0) {
        Alert.alert(
          "Success",
          `Successfully added ${successCount} ${
            successCount === 1 ? "member" : "members"
          }`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          "Partial Success",
          `Added ${successCount} members successfully. ${failCount} failed.`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert("Error", error?.error || "Failed to add members");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => (
      <UserCard
        user={item}
        isSelected={isUserSelected(item._id)}
        onToggle={handleToggleUser}
        isAlreadyMember={isUserAlreadyMember(item._id)}
      />
    ),
    [selectedUsers, currentTeam]
  ); 

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderWithBackButton
          title="Add Members"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton
        title="Add Members"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon width={20} height={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, position..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Selected Count */}
        {selectedUsers.length > 0 && (
          <View style={styles.selectedCountContainer}>
            <Text style={styles.selectedCountText}>
              {selectedUsers.length}{" "}
              {selectedUsers.length === 1 ? "user" : "users"} selected
            </Text>
          </View>
        )}

        <View style={styles.listContainer}>
          {users.length === 0 && !userLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? `No results found for "${searchQuery}"`
                  : "No users available"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5} 
              ListFooterComponent={renderFooter}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          )}

          {userLoading && !isLoadingMore && (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            text={
              teamLoading
                ? "Adding..."
                : `Add ${selectedUsers.length} ${
                    selectedUsers.length === 1 ? "Member" : "Members"
                  }`
            }
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              (teamLoading || selectedUsers.length === 0) &&
                styles.submitButtonDisabled,
            ]}
            textStyle={styles.submitButtonText}
            disabled={teamLoading || selectedUsers.length === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
    tintColor: "#666666",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  clearButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 18,
    color: "#666666",
  },
  selectedCountContainer: {
    backgroundColor: Colors.primary + "20",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  listContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 12, // Dùng gap thay cho marginBottom ở Item để khoảng cách đều
  },
  centerLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 12, // Dự phòng nếu gap không chạy trên máy cũ
  },
  userCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  userCardDisabled: {
    opacity: 0.5,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  userPosition: {
    fontSize: 13,
    color: "#666666",
  },
  memberBadge: {
    backgroundColor: "#FFD700" + "40",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#B8860B",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddMemberScreen;
