import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import MainScreen from './screens/MainScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import { View } from 'react-native'
import tailwind from 'tailwind-rn'
import { Ionicons } from '@expo/vector-icons';
import StatsScreen from './screens/StatsScreen';

const Stack: any = createNativeStackNavigator()

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            // headerTitle: (props: any) => (
            //     <Ionicons name="stats-chart" size={24} color="black" />
            // ),
            // headerRight: () => (
            //     <Ionicons name="stats-chart" size={24} color="black" />
            // )
        }}>
            <Stack.Screen name="Main" component={MainScreen} options={{}}/>
            <Stack.Screen name="Exercises" component={ExerciseScreen}/>
            <Stack.Screen name="Stats" component={StatsScreen}/>
        </Stack.Navigator>
    )
}
