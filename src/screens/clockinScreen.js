import { View, Text, StyleSheet } from "react-native";
import HeaderPromo from "../components/headerPromo";
import IconCardText from "../components/iconCardText";
import Clock from "../../assets/icons/clock.svg";
import Colors from "../styles/color";
import AppButton from "../components/appButton";
import React from "react";
import BigCard from "../components/clockin/bigCard";
import { ScrollView } from "react-native";

const ClockinScreen = () => {
  const clockinDays = [
    {
      id: 1,
      day: "10 Dec 2025",
      totalHours: "08:00 hrs",
      inOutTime: "09:00 AM - 05:00 PM",
    },
    {
      id: 2,
      day: "03 Dec 2025",
      totalHours: "07:45 hrs",
      inOutTime: "09:15 AM - 05:00 PM",
    },
    {
      id: 3,
      day: "08 Dec 2025",
      totalHours: "08:30 hrs",
      inOutTime: "08:45 AM - 05:15 PM",
    },
    {
      id: 4,
      day: "07 Dec 2025",
      totalHours: "06:50 hrs",
      inOutTime: "09:10 AM - 04:00 PM",
    },
    {
      id: 5,
      day: "06 Dec 2025",
      totalHours: "08:10 hrs",
      inOutTime: "09:00 AM - 05:10 PM",
    },
    {
      id: 6,
      day: "05 Dec 2025",
      totalHours: "04:30 hrs",
      inOutTime: "09:00 AM - 01:30 PM",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary }}>
      <HeaderPromo
        text={`Let's Clock-in`}
        subtext={"Start your day and do not forget to clock-in!!"}
        color={"#7155FF"}
      />
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Total working hours this week!
            </Text>
            <Text style={styles.headerSubtext}>10 Dec 2025 - 17 Dec 2025</Text>
          </View>
          <View style={styles.body}>
            <IconCardText
              icon={<Clock width={16} height={16} />}
              text="Today"
              subtext="00:00 hrs"
            />
            <IconCardText
              icon={<Clock width={16} height={16} />}
              text="This week"
              subtext="36:00 hrs"
            />
          </View>
          <View style={styles.bottom}>
            <AppButton
              text="Clock-in"
              onPress={() => {}}
              style={{
                width: "95%",
                height: 47,
                marginTop: 16,
              }}
              textStyle={{ fontSize: 15 }}
            />
          </View>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {clockinDays.map((item) => (
            <BigCard
                key={item.id}
                day={item.day}
                totalHours={item.totalHours}
                inOutTime={item.inOutTime}
            />
        )) }
      </ScrollView>
    </View>
  );
};

export default ClockinScreen;

const styles = StyleSheet.create({
  summary: {
    marginTop: -80,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
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
  content: {
    marginHorizontal: 16,
    marginTop: 24,
  }
});
