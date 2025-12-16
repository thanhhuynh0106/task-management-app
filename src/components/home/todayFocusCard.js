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

  const getPriorityTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sorted = [...myTasks]
      .filter(task => 
        task.status === "in_progress" || 
        task.status === "todo"
      )
      .map(task => {
        const due = task.dueDate ? new Date(task.dueDate) : null;

        due?.setHours(0, 0, 0, 0);

        let priority = 0;
        let dueLabel = "No due date";

        if (due) {
          const diffDays = Math.floor((due - now) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) {
            priority = 100 + Math.abs(diffDays);
            dueLabel = `Overdue ${Math.abs(diffDays)}d`;
          } else if (diffDays === 0) {
            priority = 90;
            dueLabel = "Today";
          } else if (diffDays <= 2) {
            priority = 80 - diffDays;
            dueLabel = diffDays === 1 ? "Tomorrow" : `In ${diffDays} days`;
          } else {
            priority = 10;
            dueLabel = due.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          }
        } else {
          priority = task.status === "in_progress" ? 20 : 5;
        }

        return { ...task, priority, dueLabel };
      })
      .sort((a, b) => b.priority - a.priority)
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
            <Text style={styles.title}>Today's focus</Text>
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
              <Text style={styles.viewAll}>View all</Text>
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
                key={task._id}
                onPress={() => navigation.navigate('Main', {
                screen: 'task',
                params: {
                    screen: 'TaskDetail',
                    params: { taskId: task._id }
                }
                })}
                activeOpacity={0.7}
            >
                <View style={styles.taskItem}>
                <CardTask
                    name={task.title}
                    description={task.description || ""}
                    endDate={task.dueLabel}
                    comment={task.comments?.length || 0}
                    progress={task.progress || 0}
                    category={task.status}
                    flag={task.priority || "medium"}
                    assignees={task.assignedTo || []}
                    dueDate={task.dueDate}
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
    fontSize: 17,
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