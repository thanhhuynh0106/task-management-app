import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Colors from "../styles/color"

const ProgressBar = ({ progress = 0 }) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.progress, { width: `${clamped}%` }]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: 5,
    backgroundColor: "#D9D6FE",
    borderRadius: 8,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
});

