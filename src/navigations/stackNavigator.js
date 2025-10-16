import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import BottomNavigator from './bottomNavigator';
import MessageScreen from "../screens/messages/messageScreen";

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
    </Stack.Navigator>
  );
};

export default StackNavigator;