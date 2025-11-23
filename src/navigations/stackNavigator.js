import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ClockInAreaScreen from "../screens/clockInAreaScreen";
import ChatScreen from "../screens/messages/chatScreen";
import MessageScreen from "../screens/messages/messageScreen";
import SubmitLeaveScreen from "../screens/submitLeaveScreen";
import CreateTaskScreen from "../screens/task/createTaskScreen";
// import EditTaskScreen from "../screens/task/editTaskScreen";
import NotificationScreen from "../screens/notificationScreen";
import BottomNavigator from "./bottomNavigator";
import ProfileStackNavigator from "./profileStackNavigatior";


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      
      <Stack.Screen name="Main" component={BottomNavigator} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SubmitLeave" component={SubmitLeaveScreen} />
      <Stack.Screen name="ClockInArea" component={ClockInAreaScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;