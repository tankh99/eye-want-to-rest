import React from 'react'
import { View } from 'react-native'
import {SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'

// Not currently used
export default function ExerciseScreen({navigation}: any) {
    
    return (
        <>
            <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
            <SafeAreaView style={tailwind("flex-1")}>
                <View>
                    
                </View>
            </SafeAreaView>
        </>
    )
}
