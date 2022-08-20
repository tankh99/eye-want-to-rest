import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { exercises, Exercise } from '../constants/exercises'
import tailwind from 'tailwind-rn'
import {SafeAreaView } from 'react-native-safe-area-context'
import {LinearGradient} from 'expo-linear-gradient'
import { convertSecondsToLowestDenom } from '../util/utils'
import { getDefaultIconSize } from '../constants/globals'
import { Ionicons } from '@expo/vector-icons'


const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window")

export default function BestiaryScreen({navigation}: any) {

    const [imageHeight, setImageHeight] = useState(150)
    const [imageWidth, setImageWidth] = useState(SCREEN_WIDTH / 2 - 16)
    
    useEffect(() => {

        

    }, [])


  return (
    <>

        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
        <SafeAreaView style={tailwind("")}>
            <View style={tailwind("flex items-center justify-between flex-row px-4")}>
                <TouchableOpacity 
                    style={tailwind("")} 
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Ionicons name="arrow-back" size={getDefaultIconSize()} color="white"  />
                </TouchableOpacity>
                <Text style={tailwind("text-white text-center text-2xl py-8 flex justify-center")}>Exercises</Text>
                
                <Ionicons name="arrow-back" size={getDefaultIconSize()} style={tailwind("")} color="transparent"  />
            </View>
            <ScrollView style={tailwind("mb-24")} contentContainerStyle={[tailwind("flex flex-wrap flex-row")]} >
                    {exercises.map((exercise: Exercise, index: number) => {
                        const {time, denom} = convertSecondsToLowestDenom(exercise.durationRange[exercise.defaultDurationIndex])
                        return (
                            <TouchableOpacity 
                                key={index} 
                                onPress={() => navigation.navigate("Exercises", {
                                    exercise
                                })}
                                style={tailwind("p-2")}>
                                <Image source={exercise.images[0]} style={[tailwind("mb-2"), {height: imageHeight, width: imageWidth}]} resizeMode="cover"/>
                                <Text style={tailwind("text-white font-bold text-base")}>{exercise.name}</Text>
                                <Text style={tailwind("text-white")}>~{time}{denom}</Text>
                            </TouchableOpacity>
                        )
                    })}
            </ScrollView>
        </SafeAreaView>
                
    </>
  )
}