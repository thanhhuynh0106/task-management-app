import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Mouse from "../../assets/icons/mouse.svg";
import AppButton from "./appButton";
import Colors from "../styles/color";
import TaskCategory from "./taskCategory";
import ProgressBar from "./progressBar";

const CardTask = ({ name, endDate, comment, progress, category, flag, bgColor }) => {
  const bgColors = bgColor;
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: bgColors || Colors.frame }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Mouse width={24} height={24} />
            <Text style={styles.nameText}>{name}</Text>
          </View>
          <View style={styles.headerRight}>
            <AppButton text="Details" />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.progress}>
            <TaskCategory
              icon={category}
              name={category}
              textColor="#475467"
            />
            <TaskCategory
              icon="flag"
              name={flag}
              bgColor="#F95555"
              textColor="white"
            />
          </View>
          <View style={styles.footer}>
            <ProgressBar progress={progress} />
            <View style={styles.commentSection}>
              <TaskCategory
                icon="calendar_task"
                name={endDate}
                bgColor="#F0ECFE"
              />
              <TaskCategory icon="comment" name={comment} bgColor="#F0ECFE" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardTask;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  container: {
    backgroundColor: Colors.frame,
    borderRadius: 15,
    padding: 10,
    width: "100%",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    gap: 8,
  },
  nameText: {
    fontSize: 15,
    fontWeight: "600",
  },
  progress: {
    flexDirection: "row",
  },
  commentSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  footer: {
    marginTop: 10,
  }
});
