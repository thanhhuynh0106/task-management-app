import { Text, View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Colors from "../styles/color";
import HeaderPromo from "../components/headerPromo";
import IconCardText from "../components/iconCardText";
import { CategoryMap } from "../utils/categoryMapping";
import TaskStatusCard from "../components/task/taskStatusCard";
import NoTask from "../../assets/icons/notask.svg";
import { TouchableOpacity } from "react-native";
import CardTask from "../components/cardTask"

const TaskScreen = () => {
  const Todo = CategoryMap["todo"];
  const Inprogress = CategoryMap["inprogress"];
  const Done = CategoryMap["done"];

  const todoCount = 1;
  const inProgressCount = 0;
  const doneCount = 1;

  const taskData = {
    all: [
    //   {
    //     id: 1,
    //     name: "Design Landing Page",
    //     endDate: "10 Dec",
    //     comment: 4,
    //     progress: 80,
    //     category: "in_progress",
    //     flag: "high",
    //   },
    //   {
    //     id: 2,
    //     name: "Fix Login Bug",
    //     endDate: "12 Dec",
    //     comment: 2,
    //     progress: 100,
    //     category: "finish",
    //     flag: "medium",
    //   },
    //   {
    //     id: 3,
    //     name: "Write Documentation",
    //     endDate: "15 Dec",
    //     comment: 1,
    //     progress: 40,
    //     category: "in_progress",
    //     flag: "low",
    //   },
    //   {
    //     id: 4,
    //     name: "Deploy to Production",
    //     endDate: "20 Dec",
    //     comment: 3,
    //     progress: 100,
    //     category: "finish",
    //     flag: "high",
    //   },
    ],

    inProgress: [
      {
        id: 1,
        name: "Design Landing Page",
        endDate: "10 Dec",
        comment: 4,
        progress: 80,
        category: "in_progress",
        flag: "high",
      },
      {
        id: 3,
        name: "Write Documentation",
        endDate: "15 Dec",
        comment: 1,
        progress: 40,
        category: "in_progress",
        flag: "low",
      },
    ],

    finish: [
      {
        id: 2,
        name: "Fix Login Bug",
        endDate: "12 Dec",
        comment: 2,
        progress: 100,
        category: "done",
        flag: "medium",
      },
      {
        id: 4,
        name: "Deploy to Production",
        endDate: "20 Dec",
        comment: 3,
        progress: 100,
        category: "done",
        flag: "high",
      },
    ],
  };

  const [selectedTab, setSelectedTab] = React.useState("All");
  const renderTabContent = () => {
    let data = [];
    switch (selectedTab) {
      case "All":
        data = taskData.all;
        break;
      case "InProgress":
        data = taskData.inProgress;
        break;
      case "Finished":
        data = taskData.finish;
        break;
      default:
        data = [];
    }

    if (data.length === 0) {
      return (
      <View style={styles.noTaskContainer}>
        <View style={styles.noTask}>
          <NoTask width={126} height={86} />
          <Text style={{ fontSize: 19, fontWeight: "bold" }}>
            No Task Assigned
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#555555ff",
            }}
          >
            It looks like you don't have any task right now. This place will be
            updated as new task are added!!!
          </Text>
        </View>
      </View>
      );
    }

    return (
        <View style={styles.contentContainer}>
            {data.map((item) => (
                <CardTask 
                    key={item.id}
                    name={item.name}
                    endDate={item.endDate}
                    comment={item.comment}
                    progress={item.progress}
                    category={item.category}
                    flag={item.flag}
                    bgColor={Colors.white}
                />
            ))}
        </View>
    )
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary }}>
      <HeaderPromo
        text="Challenges ahead!"
        subtext="Don't worry, they're not multiplying.. yet."
        color={Colors.primary}
      />
      
      <View style={styles.summary}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Summary of your work</Text>
          <Text style={styles.headerSubtext}>
            Current status of this week's work
          </Text>
        </View>
        <View style={styles.body}>
          <IconCardText
            icon={<Todo width={16} height={16} />}
            text="To do"
            subtext={todoCount}
            subtextStyle={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
            }}
            textStyle={{
              fontSize: 12,
            }}
          />
          <IconCardText
            icon={<Inprogress width={16} height={16} />}
            text="Ongoing"
            subtext={inProgressCount}
            subtextStyle={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
            }}
            textStyle={{
              fontSize: 12,
            }}
          />
          <IconCardText
            icon={<Done width={16} height={16} />}
            text="Done"
            subtext={doneCount}
            subtextStyle={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000000",
            }}
            textStyle={{
              fontSize: 12,
            }}
          />
        </View>
      </View>
        <ScrollView>
      <TaskStatusCard
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        doneCount={doneCount}
      />
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "All" && styles.activeTab]}
          onPress={() => setSelectedTab("All")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "All" && styles.activeTabText,
            ]}
          >
            All
          </Text>
          {taskData.all.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{taskData.all.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "InProgress" && styles.activeTab]}
          onPress={() => setSelectedTab("InProgress")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "InProgress" && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
          {taskData.inProgress.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{taskData.inProgress.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Finished" && styles.activeTab]}
          onPress={() => setSelectedTab("Finished")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Finished" && styles.activeTabText,
            ]}
          >
            Finished
          </Text>
          {taskData.finish.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{taskData.finish.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </View>
    </ScrollView>
    </View>
    
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
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
    marginVertical: 16,
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
    alignItems: "center",
  },
  scrollViewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  contentContainer: {
    gap: 12,
    width: "90%"
  },
  noTask: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 13,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noTaskContainer: {
    alignItems: "center",
  }
});
