import React, { useEffect, useState } from 'react'
import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import { getRandomInt } from '../util/utils'
import { exercises, getWeightedExercises } from '../constants/exercises'
import * as Linking from 'expo-linking'

interface P {
    exercise: any,
    setExercise: any,
    setShowExercises: any
    setCompletedFully: any
}

export default function EyeExercises({exercise, setExercise, setShowExercises, setCompletedFully}: P) {

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const animateSequencedImages = () => {
        if(currentImageIndex + 1 < exercise.images.length){
            setCurrentImageIndex(currentImageIndex + 1)
        } else {
            setCurrentImageIndex(0)
        }
    }

    useEffect(() => {
        let cycleId: any;
        if(exercise.images.length > 1){ // only trigger the animation if there are 2 or more images
            console.log("animating cycle. current image index: ", currentImageIndex)
            // cycleId = setInterval(() => {
            //     animateSequencedImages()
            //     console.log("animating")
            // }, 1000)
        }
        return () => {
            if(cycleId){
                clearInterval(cycleId)
            }
        }
    }, [])
    
    if(!exercise ) return null;
    return (
        <View style={tailwind("flex mx-8 flex-col items-center justify-center h-full w-full p-8")}>
            {/* <Image source={exercise.images[currentImageIndex]} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/> */}
            {/* {exercise && exercise.images.map((image: any, index: number) => (
                <Image key={index} source={(image)} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/>
            ))} */}
            <Text style={tailwind("text-center text-2xl text-white")}>{exercise.name}</Text>
            <Text style={tailwind("text-center text-white opacity-70 pb-4")}>Approx. duration: {exercise.approximateDuration < 60 ? "seconds" : `${exercise.approximateDuration/60} ${exercise.approximateDuration/60 > 1 ? "minutes": "minute"}`} </Text>

            <TouchableOpacity
                style={tailwind("absolute bottom-20")}
                onPress={() => {
                    Linking.openURL(exercise.reference)
                }}>
                <Text style={tailwind("text-white text-center underline")}>
                    Reference video
                </Text>
            </TouchableOpacity>
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
                const randomInt = getRandomInt(getWeightedExercises().length)
                setExercise(getWeightedExercises()[randomInt])
            }} style={tailwind("p-2 border border-white w-full")}>
                <Text style={tailwind("text-white text-center")}>
                Done
                </Text>
            </TouchableOpacity>
        </View>
            
    )
}
