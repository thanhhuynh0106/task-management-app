import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import HeaderPromo from "../components/headerPromo";
import Colors from "../styles/color";
import IconCardText from "../components/iconCardText";
import Available from "../../assets/icons/available.svg";
import Used from "../../assets/icons/used.svg";
import AppButton from "../components/appButton";
import NoLeave from "../../assets/icons/no_leave.svg";
import Approved from "../../assets/icons/approved.svg";
import Rejected from "../../assets/icons/rejected.svg";

const mockLeaveData = {
  review: [
    // { id: 1, title: "5 Nov 2025", startDate: "5 Nov", endDate: "5 Nov", totalDays: 1, status: "review", reviewer: "Manager A" },
    // { id: 2, title: "15 Dec 2025", startDate: "15 Dec", endDate: "17 Dec", totalDays: 3, status: "review", reviewer: "Manager B" },
  ],
  approved: [
    {
      id: 3,
      title: "10 Oct 2025",
      startDate: "10 Oct",
      endDate: "12 Oct",
      totalDays: 3,
      status: "approved",
      approvedBy: "HR Team",
    },
    {
      id: 4,
      title: "20 Sep2025",
      startDate: "20 Sep",
      endDate: "20 Sep",
      totalDays: 1,
      status: "approved",
      approvedBy: "Manager A",
    },
    {
      id: 5,
      title: "1 Aug 2025",
      startDate: "1 Aug",
      endDate: "5 Aug",
      totalDays: 5,
      status: "approved",
      approvedBy: "Manager C",
    },
  ],
  rejected: [
    {
      id: 6,
      title: "25 Oct 2025",
      startDate: "25 Oct",
      endDate: "25 Oct",
      totalDays: 1,
      status: "rejected",
      rejectedBy: "Manager B",
      reason: "Lack of coverage",
    },
  ],
};

const LeaveScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Review");

  const renderLeaveCard = (item) => (
    <View key={item.id} style={styles.leaveCard}>
      <View style={styles.leaveHeader}>
        <Text style={styles.leaveDate}>{item.title}</Text>
      </View>

      <View style={styles.leaveDetails}>
        <View style={styles.leaveRow}>
          <Text style={styles.leaveLabel}>Leave Date</Text>
          <Text style={styles.leaveLabel}>Total Leave</Text>
        </View>
        <View style={styles.leaveRow}>
          <Text style={styles.leaveValue}>
            {item.startDate} - {item.endDate}
          </Text>
          <Text style={styles.leaveValue}>
            {item.totalDays} {item.totalDays > 1 ? "Days" : "Day"}
          </Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        {selectedTab === "Approved" && !!item.approvedBy && (
          <View style={[styles.pill, styles.pillApproved]}>
            <Approved width={16} height={16} />
            <Text style={styles.pillTextApp}>Approved at ...</Text>
          </View>
        )}
        {selectedTab === "Rejected" && !!item.rejectedBy && (
          <View style={[styles.pill, styles.pillRejected]}>
            <Rejected width={16} height={16} />
            <Text style={styles.pillTextRej}>Rejected at ... modify date</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTabContent = () => {
    let data = [];
    switch (selectedTab) {
      case "Review":
        data = mockLeaveData.review;
        break;
      case "Approved":
        data = mockLeaveData.approved;
        break;
      case "Rejected":
        data = mockLeaveData.rejected;
        break;
      default:
        data = [];
    }

    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyTop}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Leave submitted
            </Text>
            <Text style={{ fontSize: 14, color: "#666666", marginTop: 8 }}>
              You have no {selectedTab.toLowerCase()} leaves at the moment.
            </Text>
          </View>

          <View style={styles.emptyBottom}>
            <NoLeave width={120} height={120} />
            <Text
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "black",
                fontWeight: "bold",
              }}
            >
              No leave requests to display.
            </Text>
            <Text
              style={{ marginTop: 8, textAlign: "center", color: "#7b7b7bff" }}
            >
              Ready to catch some fresh air? Click the "Submit leave" and take
              that well-deserve break. .
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {data.map((item) => renderLeaveCard(item))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary }}>
      <HeaderPromo
        text="Permission to escape!"
        subtext="Your annual escape hatch."
        color={Colors.primary}
      />

      <View style={styles.summary}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Total Leave</Text>
          <Text style={styles.headerSubtext}>
            Period 1 Jan 2024 - 30 Dec 2024
          </Text>
        </View>
        <View style={styles.body}>
          <IconCardText
            icon={<Available width={10} height={10} />}
            text={"Available"}
            subtext={20}
            subtextStyle={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          />
          <IconCardText
            icon={<Used width={10} height={10} />}
            text={"Leave Used"}
            subtext={2}
            subtextStyle={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Review" && styles.activeTab]}
          onPress={() => setSelectedTab("Review")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Review" && styles.activeTabText,
            ]}
          >
            Review
          </Text>
          {mockLeaveData.review.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {mockLeaveData.review.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Approved" && styles.activeTab]}
          onPress={() => setSelectedTab("Approved")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Approved" && styles.activeTabText,
            ]}
          >
            Approved
          </Text>
          {mockLeaveData.approved.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {mockLeaveData.approved.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Rejected" && styles.activeTab]}
          onPress={() => setSelectedTab("Rejected")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Rejected" && styles.activeTabText,
            ]}
          >
            Rejected
          </Text>
          {mockLeaveData.rejected.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {mockLeaveData.rejected.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <AppButton
          text="Submit Leave"
          onPress={() => navigation.navigate("SubmitLeave")}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>
    </View>
  );
};

export default LeaveScreen;

const styles = StyleSheet.create({
  container: {},
  summary: {
    marginTop: -80,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
    gap: 7,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerSubtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666666",
  },
  body: {
    flexDirection: "row",
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f7f7f7ff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  contentContainer: {
    gap: 12,
  },
  submitButtonContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  leaveCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leaveHeader: {
    marginBottom: 4,
  },
  leaveDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  leaveDetails: {
    backgroundColor: Colors.gray,
    padding: 8,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    paddingHorizontal: 12,
  },
  leaveRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leaveLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "400",
  },
  leaveValue: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
  statusContainer: {},
  emptyState: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pillTextApp: {
    fontSize: 12, 
    fontWeight: "600",
    color: "#3bb539ff"
  },
  pillTextRej: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d13a32ff"
  },
  emptyBottom: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
});
