import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import MainScreen from './screens/MainScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import StatsScreen from './screens/StatsScreen';
import BestiaryScreen from './screens/BestiaryScreen'
import TestScreen from './screens/TestScreen'
import { LinearGradient } from 'expo-linear-gradient'
import SettingsScreen from './screens/SettingsScreen'
import OnboardingScreen from './screens/OnboardingScreen'

const Stack: any = createNativeStackNavigator()

interface P {
    isFirstTime: boolean
}

export default function MainNavigator({isFirstTime}: P) {
    return (
        <>
        <Stack.Navigator screenOptions={{
            headerShown: false,
            headerTitle: (props: any) => (
                <Ionicons name="stats-chart" size={24} color="black" />
            ),
            headerRight: () => (
                <Ionicons name="stats-chart" size={24} color="black" />
            )
        }}>
            
            {isFirstTime 
            ? <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            : ""
            }
            <Stack.Screen name="Main" component={MainScreen} options={{}}/>
            <Stack.Screen name="Exercises" component={ExerciseScreen}/>
            <Stack.Screen name="Stats" component={StatsScreen}/>
            <Stack.Screen name="Bestiary" component={BestiaryScreen}/>
            <Stack.Screen name="Test" component={TestScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen}/>
        </Stack.Navigator>
    </>
    )
}
