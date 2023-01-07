import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { exercises, Exercise } from '../constants/exercises'
import {SafeAreaView } from 'react-native-safe-area-context'
import {LinearGradient} from 'expo-linear-gradient'
import { convertSecondsToLowestDenom } from '../util/utils'
import { getDefaultIconSize } from '../constants/globals'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'

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
            style={tw`flex-1 absolute top-0 w-full h-full`}/>
        <SafeAreaView>
            <View style={tw`flex items-center justify-between flex-row px-4`}>
                <TouchableOpacity 
                    style={tw``} 
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Ionicons name="arrow-back" size={getDefaultIconSize()} color="white"  />
                </TouchableOpacity>
                <Text style={tw`text-white text-center text-2xl py-8 flex justify-center`}>Exercises</Text>
                <Ionicons name="arrow-back" size={getDefaultIconSize()} style={tw``} color="transparent"  />
            </View>
            <ScrollView style={tw`mb-24`} contentContainerStyle={[tw`flex flex-wrap flex-row`]} >
                    {exercises.map((exercise: Exercise, index: number) => {
                        const {time, denom} = convertSecondsToLowestDenom(exercise.durationRange[exercise.defaultDurationIndex])
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={[{width: SCREEN_WIDTH/2}, tw`p-2`]}
                                onPress={() => navigation.navigate("Exercises", {
                                    exercise
                                })}>
                                <Image source={exercise.images[0]} style={[tw`mb-2`, {height: imageHeight, width: imageWidth}]} resizeMode="cover"/>
                                <Text style={tw`text-white font-bold text-base`}>{exercise.name}</Text>
                                <Text style={tw`text-white`}>~{time}{denom}</Text>
                            </TouchableOpacity>
                        )
                    })}
            </ScrollView>
        </SafeAreaView>
                
    </>
  )
}