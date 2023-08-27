import { Text, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { exercises, Exercise } from '../constants/exercises'
import { convertSecondsToLowestDenom } from '../util/utils'
import tw from 'twrnc'
import Navbar from '../components/Navbar'
import BackgroundGradient from '../components/BackgroundGradient'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window")

export default function BestiaryScreen({navigation}: any) {

    const [imageHeight, setImageHeight] = useState(150)
    const [imageWidth, setImageWidth] = useState(SCREEN_WIDTH / 2 - 16)
    
    useEffect(() => {

        

    }, [])


  return (
    <>

        <BackgroundGradient>
            <Navbar navigation={navigation}>
                <Text style={tw`text-white text-center text-4xl my-8 flex justify-center`}>Exercises</Text>
            </Navbar>
            <ScrollView style={tw``} contentContainerStyle={[tw`flex flex-wrap flex-row`]} >
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
        </BackgroundGradient>
                
    </>
  )
}