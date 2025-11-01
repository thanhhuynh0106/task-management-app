import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import BottomNavigator from './bottomNavigator';
import MessageScreen from "../screens/messages/messageScreen";
import ChatScreen from "../screens/messages/chatScreen";
import SubmitLeaveScreen from "../screens/submitLeaveScreen";
import ClockInAreaScreen from "../screens/clockInAreaScreen";
import CreateTaskScreen from "../screens/createTaskScreen";

const Stack = createNativeStackNavigator(); 

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomNavigator}/> 
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="SubmitLeave" component={SubmitLeaveScreen} />
      <Stack.Screen name="ClockInArea" component={ClockInAreaScreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;