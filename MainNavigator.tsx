import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import MainScreen from './screens/MainScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import { View } from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import tailwind from 'tailwind-rn'

const Stack = createNativeStackNavigator()

export default function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Main" component={MainScreen}/>
            <Stack.Screen name="Exercises" component={ExerciseScreen}/>
        </Stack.Navigator>
    )
}
