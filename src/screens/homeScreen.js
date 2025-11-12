import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Schedules from "../components/home/schedules";
import TaskCard from "../components/home/taskCard";
import UserHeader from "../components/home/userHeader";
import WelcomeCard from "../components/home/welcomeCard";
import Colors from "../styles/color";


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.white}
        barStyle="dark-content"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <UserHeader
          username="thanhhyun_n"
          usermail="thanhhuynh0106@gmail.com"
          useravatar="avt1"
          navigation={navigation}
        />

        <ScrollView style={styles.body}> 
            <WelcomeCard />
            <Schedules />
            <TaskCard />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
  },
  body: {
    backgroundColor: Colors.secondary
  }
});
