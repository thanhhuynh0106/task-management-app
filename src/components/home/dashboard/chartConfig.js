import Colors from "../../../styles/color";

export const baseChartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(112, 87, 252, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(16, 24, 40, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: Colors.primary,
  },
};

export const STATUS_COLORS = {
  todo: "#F59E0B",
  in_progress: "#3B82F6",
  done: "#10B981",
};

export const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Completed",
};

export const LEAVE_TYPE_COLORS = {
  sick: "#EF4444",
  vacation: "#3B82F6",
  personal: "#8B5CF6",
};

export const LEAVE_TYPE_LABELS = {
  sick: "Sick",
  vacation: "Vacation",
  personal: "Personal",
};

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
