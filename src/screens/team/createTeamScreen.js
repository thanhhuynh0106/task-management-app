import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithBackButton from "../../components/headerWithBackButton";
import LabeledTextInput from "../../components/profile/labeledTextInput";
import SelectInputField from "../../components/profile/selectInputField";
import AppButton from "../../components/appButton";
import Colors from "../../styles/color";
import { useTeamStore } from "../../../store";
import { useUserStore } from "../../../store";
import TeamIcon from "../../../assets/icons/task-square.svg";
import UserIcon from "../../../assets/icons/user_delegation.svg";
import SearchIcon from "../../../assets/icons/search.svg";

const CreateTeamScreen = ({ navigation }) => {
  const { createTeam, isLoading: teamLoading } = useTeamStore();

  const {
    users,
    fetchUsers,
    isLoading: userLoading,
    isLoadingMore,
    pagination,
  } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leaderId: null,
  });

  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!showLeaderModal) return;

    const delayDebounceFn = setTimeout(() => {
      fetchUsers({
        search: searchQuery,
        page: 1,
        limit: 10,
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [showLeaderModal, searchQuery]);

  const handleLoadMoreUsers = () => {
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectLeader = (user) => {
    setSelectedLeader(user);
    handleChange("leaderId", user._id);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Team name is required");
      return;
    }

    if (!formData.leaderId) {
      Alert.alert("Validation Error", "Please select a team leader");
      return;
    }

    try {
      const response = await createTeam({
        name: formData.name.trim(),
        description: formData.description.trim(),
        leaderId: formData.leaderId,
      });

      if (response.success) {
        Alert.alert("Success", "Team created successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", error?.error || "Failed to create team");
    }
  };

  const renderUserItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.modalItem,
          selectedLeader?._id === item._id && styles.modalItemSelected,
        ]}
        onPress={() => handleSelectLeader(item)}
      >
        <View style={styles.userItemContent}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.itemName,
                selectedLeader?._id === item._id && styles.itemNameSelected,
              ]}
            >
              {item.profile?.fullName || item.email}
            </Text>
            <Text style={styles.itemSubtext}>
              {item.profile?.position || "Employee"} •{" "}
              {item.profile?.department || "No Department"}
            </Text>
          </View>
          {selectedLeader?._id === item._id && (
            <View style={styles.selectedIndicator} />
          )}
        </View>
      </TouchableOpacity>
    ),
    [selectedLeader]
  );

  const renderLeaderModal = () => (
    <Modal
      visible={showLeaderModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLeaderModal(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setShowLeaderModal(false)}
      >
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Team Leader</Text>
            <View style={styles.modalDivider} />

            <View style={styles.searchContainer}>
              <SearchIcon width={16} height={16} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={{ color: "#999" }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.listContainer}>
            {userLoading && !isLoadingMore && users.length === 0 ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={renderUserItem}
                onEndReached={handleLoadMoreUsers}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  isLoadingMore ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                      style={{ padding: 10 }}
                    />
                  ) : null
                }
                ListEmptyComponent={
                  !userLoading && (
                    <Text style={styles.emptyText}>No users found</Text>
                  )
                }
              />
            )}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonClose]}
              onPress={() => setShowLeaderModal(false)}
            >
              <Text style={styles.modalButtonTextClose}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalButtonConfirm,
                !selectedLeader && styles.modalButtonDisabled,
              ]}
              onPress={() => setShowLeaderModal(false)}
              disabled={!selectedLeader}
            >
              <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton
        title="Create New Team"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <LabeledTextInput
            label="Team Name"
            placeholder="Enter team name"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            Icon={TeamIcon}
          />

          <LabeledTextInput
            label="Description"
            placeholder="Enter team description"
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            multiline
            numberOfLines={4}
          />

          <SelectInputField
            label="Team Leader"
            value={selectedLeader?.profile?.fullName || selectedLeader?.email}
            placeholder="Select team leader"
            onPress={() => {
              setSearchQuery(""); // Reset search khi mở lại
              setShowLeaderModal(true);
            }}
            Icon={UserIcon}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <AppButton
          text={teamLoading ? "Creating..." : "Create Team"}
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            teamLoading && styles.submitButtonDisabled,
          ]}
          textStyle={styles.submitButtonText}
          disabled={teamLoading}
        />
        {teamLoading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={styles.loadingIndicator}
          />
        )}
      </View>

      {renderLeaderModal()}
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
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 20,
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
  loadingIndicator: {
    position: "absolute",
    right: 40,
    top: "50%",
    marginTop: -10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%", // Tăng chiều cao để hiển thị danh sách tốt hơn
    maxHeight: "90%",
  },
  modalHeader: {
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    tintColor: "#999",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  listContainer: {
    flex: 1,
  },
  modalLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalItemSelected: {
    backgroundColor: "#F4F3FF",
  },
  userItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  itemNameSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  itemSubtext: {
    fontSize: 13,
    color: "#666666",
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonClose: {
    backgroundColor: "#F5F5F5",
  },
  modalButtonConfirm: {
    backgroundColor: Colors.primary,
  },
  modalButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  modalButtonTextClose: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default CreateTeamScreen;
