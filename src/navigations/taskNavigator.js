import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
// import EditTaskScreen from "../screens/task/editTaskScreen";
import CreateTaskScreen from "../screens/createTaskScreen";
import EditTaskSCreen from "../screens/task/editTaskScreen";
import TaskDetailScreen from "../screens/task/taskDetailScreen";
import TaskScreen from "../screens/taskScreen";


const Stack = createNativeStackNavigator();

const TaskNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TaskScreen" component={TaskScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="EditTask" component={EditTaskSCreen} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />

    </Stack.Navigator>
  );
};

export default TaskNavigator;