import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/homeScreen";
import ClockinScreen from "../screens/clockinScreen";
import TeamScreen from "../screens/teamScreen";
import LeaveScreen from "../screens/leaveScreen";
import TaskScreen from "../screens/taskScreen";
import HomeAc from "../../assets/icons/home_ac.svg"
import HomeInac from "../../assets/icons/home_inac.svg"
import React from "react";
import CalendarAc from "../../assets/icons/calendar_ac.svg"
import CalendarInac from "../../assets/icons/calendar_inac.svg"
import TaskAc from "../../assets/icons/task_ac.svg"
import TaskInac from "../../assets/icons/task_inac.svg"
import TeamAc from "../../assets/icons/team_ac.svg"
import TeamInac from "../../assets/icons/team_inac.svg"
import LeaveAc from "../../assets/icons/leave_ac.svg"
import LeaveInac from "../../assets/icons/leave_inac.svg"

const Bottom = createBottomTabNavigator();

const BottomNavigator = () => {
    return (
        <Bottom.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 90,
                    backgroundColor: 'black',
                },
                tabBarIconStyle: {
                    marginVertical: 15,
                },
            }}
        >
            <Bottom.Screen 
                name="home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused ? <HomeAc width={28} height={28} /> : <HomeInac width={28} height={28} />
                    ),
                }}
            />
            <Bottom.Screen
                name="clockin"
                component={ClockinScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused ? <CalendarAc width={28} height={28} /> : <CalendarInac width={28} height={28} />
                    ),
                }}
            />
            <Bottom.Screen
                name="task"
                component={TaskScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused ? <TaskAc width={28} height={28} /> : <TaskInac width={28} height={28} />
                    )
                }}
            />
            <Bottom.Screen
                name="team"
                component={TeamScreen}
                options={{
                    tabBarIcon: ({ focused}) => (
                        focused ? <TeamAc width={28} height={28} /> : <TeamInac width={28} height={28} />
                    )
                }}
            />
            <Bottom.Screen
                name="leave"
                component={LeaveScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        focused ? <LeaveAc width={28} height={28} /> : <LeaveInac width={28} height={28} />
                    )
                }}
            />
        </Bottom.Navigator>
    )
}


export default BottomNavigator;