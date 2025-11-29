// components/home/todayFocusCard.js
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ClockIcon from "../../../assets/icons/clock.svg";
import NoTask from "../../../assets/icons/notask.svg";
import { useTaskStore } from "../../../store";
import Colors from "../../styles/color";
import AppNumber from "../appNumber";
import CardTask from "../task/cardTask";

const TodayFocusCard = ({ navigation }) => {
  const { myTasks } = useTaskStore();

  // Lọc và sắp xếp task theo độ ưu tiên (overdue → today → soon → in_progress)
  const getPriorityTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sorted = [...myTasks]
      .filter(task => 
        task.status === "in_progress" || 
        task.status === "todo"
      )
      .map(task => {
        const due = task.due_date ? new Date(task.due_date) : null;

        due?.setHours(0, 0, 0, 0);

        let mathPriority = 0;
        let dueLabel = "No due date";
        if (due) {
          const diffDays = Math.floor((due - now) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) {
            mathPriority = 100 + Math.abs(diffDays); // overdue = ưu tiên cao nhất
            dueLabel = `Overdue ${Math.abs(diffDays)}d`;
          } else if (diffDays === 0) {
            mathPriority = 90;
            dueLabel = "Today";
          } else if (diffDays <= 2) {
            mathPriority = 80 - diffDays;
            dueLabel = diffDays === 1 ? "Tomorrow" : `In ${diffDays} days`;
          } else {
            mathPriority = 10;
            dueLabel = due.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          }
        } else {
          mathPriority = task.status === "in_progress" ? 20 : 5;
        }

        return { ...task, mathPriority, dueLabel };
      })
      .sort((a, b) => b.mathPriority - a.mathPriority)
      .slice(0, 3);

    return sorted;
  };

  const priorityTasks = getPriorityTasks();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <ClockIcon width={20} height={20} fill={Colors.primary} />
            <Text style={styles.title}>Today's Focus</Text>
            {priorityTasks.length > 0 && <AppNumber number={priorityTasks.length} />}
          </View>
          {priorityTasks.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Main', {
                screen: 'task',
                params: {
                    screen: 'TaskScreen',
                }
            })
            }>
              <Text style={styles.viewAll}>View all →</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subtitle}>
          {priorityTasks.length > 0 
            ? "Your most important tasks for today" 
            : "No urgent tasks right now. Enjoy your day!"}
        </Text>

        {priorityTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <NoTask width={100} height={80} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>
              You're all set. No urgent tasks today.
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {priorityTasks.map((task) => (
            <TouchableOpacity
                key={task._id || task.id}
                onPress={() => navigation.navigate('Main', {
                screen: 'task',
                params: {
                    screen: 'TaskDetail',
                    params: { taskId: task._id || task.id}
                }
                })}
                activeOpacity={0.7}
            >
                <View style={styles.taskItem}>
                <CardTask
                    name={task.title}
                    endDate={task.dueLabel || "No date"}
                    comment={task.comments?.length || 0}
                    progress={task.progress || 0}
                    category={task.status}
                    flag={task.originalPriority || task.priority || "medium"} // Sửa: dùng priority gốc
                    description={task.description || ""}
                />
                </View>
            </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: "92%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    marginBottom: 4,
  },
});

export default TodayFocusCard;