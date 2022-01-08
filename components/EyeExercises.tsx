import React, { useEffect, useState } from 'react'
import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import { getRandomInt } from '../util/utils'
import { exercises } from '../constants/exercises'

interface P {
    exercise: any,
    setExercise: any,
    setShowExercises: any
    setCompletedFully: any
}

export default function EyeExercises({exercise, setExercise, setShowExercises, setCompletedFully}: P) {


    
    if(!exercise ) return null;
    return (
        <View style={tailwind("flex mx-8 flex-col ")}>
            {exercise && exercise.images.map((image: any, index: number) => (
                    <Image key={index} source={(image)} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/>
                ))
            }
            <Text style={tailwind("text-center text-2xl text-white pb-4")}>{exercise.name}</Text>
            {/* <Text style={tailwind("text-center text-white pb-2 leading-8")}>{exercise.description.trim()}</Text> */}
            <View style={tailwind("flex-col mb-4")}>
            {exercise.steps && exercise.steps.map((step: string, index: number) => (
                <View key={index} style={tailwind("flex-row flex-wrap")}>
                    {/* <Text style={tailwind("flex flex-wrap text-left text-white")}>{index + 1}. </Text> */}
                    <Text style={tailwind("flex flex-wrap text-left text-white pb-2")}>
                        {step}
                    </Text>
                </View>
            ))}
            </View>
                <TouchableOpacity onPress={() => {
                    setShowExercises(false)
                    setCompletedFully(false)
                    const randomInt = getRandomInt(exercises.length)
                    setExercise(exercises[randomInt])
                }} style={tailwind("p-2 border border-white")}>
                    <Text style={tailwind("text-white text-center")}>
                    Done
                    </Text>
                </TouchableOpacity>
        </View>
    )
}
