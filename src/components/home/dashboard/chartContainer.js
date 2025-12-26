import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChartContainer = ({ children, noDataMessage = "No data available" }) => {
  const hasData = React.Children.count(children) > 0;

  return (
    <View style={styles.chartContainer}>
      {hasData ? children : <Text style={styles.noData}>{noDataMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noData: {
    textAlign: "center",
    color: "#9CA3AF",
    padding: 30,
    fontSize: 14,
  },
});

export default ChartContainer;
