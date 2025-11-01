import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Circle, Marker } from "react-native-maps";
import Colors from "../styles/color";
import Avatar from "../components/avatar";
import HeaderWithBackButton from "../components/headerWithBackButton";

const { width, height } = Dimensions.get("window");


const CLOCK_IN_AREA = {
  latitude: 10.762622,
  longitude: 106.660172,
  radius: 200,
};

const USER_LOCATION = {
  latitude: 10.762622,
  longitude: 106.660172,
};

const USER_INFO = {
  name: "thanhhyun_n",
  date: "5 Nov 2025",
  location: "Lat 6E 2521 Long P7697 576",
};

const SCHEDULE = {
  clockIn: "09:00",
  clockOut: "05:00",
};

const ClockInAreaScreen = ({ navigation }) => {
  const [isInArea, setIsInArea] = useState(true);

  const handleClockIn = () => {
    if (isInArea) {
      console.log("Clock in successfully!");
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton title="Clock In Area" onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.containerWrapper}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: CLOCK_IN_AREA.latitude,
            longitude: CLOCK_IN_AREA.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >

          <Circle
            center={{
              latitude: CLOCK_IN_AREA.latitude,
              longitude: CLOCK_IN_AREA.longitude,
            }}
            radius={CLOCK_IN_AREA.radius}
            fillColor="rgba(147, 112, 255, 0.2)"
            strokeColor="rgba(147, 112, 255, 0.5)"
            strokeWidth={2}
          />


          <Marker
            coordinate={{
              latitude: USER_LOCATION.latitude,
              longitude: USER_LOCATION.longitude,
            }}
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        </MapView>


        {isInArea && (
          <View style={styles.notification}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>
                You are in the clock-in area!
              </Text>
              <Text style={styles.notificationSubtitle}>
                Now you can clock in in this area
              </Text>
            </View>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationEmoji}></Text>
            </View>
          </View>
        )}
      </View>


      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY PROFILE</Text>
          <View style={styles.profileCard}>
            <Avatar name={USER_INFO.name} width={48} height={48} />
            <View style={styles.profileInfo}>
              <View style={styles.profileRow}>
                <Text style={styles.profileName}>{USER_INFO.name}</Text>
              </View>
              <Text style={styles.profileDate}>{USER_INFO.date}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationText}>{USER_INFO.location}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SCHEDULE</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>CLOCK IN</Text>
              <Text style={styles.scheduleTime}>{SCHEDULE.clockIn}</Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>CLOCK OUT</Text>
              <Text style={styles.scheduleTime}>{SCHEDULE.clockOut}</Text>
            </View>
          </View>
        </View>    

        <TouchableOpacity
          style={[
            styles.clockInButton,
            !isInArea && styles.clockInButtonDisabled,
          ]}
          onPress={handleClockIn}
          disabled={!isInArea}
        >
          <Text style={styles.clockInButtonText}>Clock-in</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClockInAreaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#000000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  mapContainer: {
    height: height * 0.4,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(147, 112, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  userMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  notification: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationEmoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D2D2D",
    marginRight: 6,
  },
  profileDate: {
    fontSize: 13,
    color:  Colors.primary,
    fontWeight: "bold",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#999999",
  },
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleItem: {
    flex: 1,
    alignItems: "center",
  },
  scheduleLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  scheduleTime: {
    fontSize: 25,
    fontWeight: "500",
    color: "#000000",
  },
  scheduleDivider: {
    width: 1.5,
    height: 45,
    backgroundColor: "#E8E8E8",
    marginHorizontal: 20,
  },
  clockInButton: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clockInButtonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0.1,
  },
  clockInButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

