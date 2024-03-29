import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import tw from 'twrnc'
import { cancelAllNotifications } from '../util/notifications'
import Tips from '../components/Tips'
import { getWeightedExercises } from '../constants/exercises'
import EyeButton from '../components/EyeButton'
import Timer from '../components/Timer'
import { getRandomInt } from '../util/utils'
import { Ionicons } from '@expo/vector-icons'
import { getDefaultIconSize } from '../constants/globals'
import { playCloseEyeSound, playOpenEyeSound } from '../util/sounds'
import BackgroundGradient from '../components/BackgroundGradient'
import MyButton from '../components/MyButton'

export default function MainScreen({navigation, route}: any) {
    const [eyeOpen, setEyeOpen] = useState(false)
    const [showStartExercise, setShowStartExercise] = useState(false)
    let eyeOpenRef = useRef(eyeOpen)
    eyeOpenRef.current = eyeOpen;

    useEffect(() => {
        if(route.params && route.params.exerciseCompleted){ // Remove the "Start Execise" button
            setShowStartExercise(false)
        }

    }, [route.params])
    

    // All functions from different components come together here
    const toggleEye = () => {

        const tempEyeOpen = !eyeOpen; // a bit confusing, but it's because we want to inverse inverse the boolean. 
        
        if(!tempEyeOpen) {
            Alert.alert("Ending Session", "Are you sure you want to stop the session early?",
            [
                {
                    text: "Cancel"
                }, 
                {
                    text: "Confirm",
                    onPress: () => {
                        playCloseEyeSound()
                        setEyeOpen(!eyeOpen)
                        setShowStartExercise(false);
                        cancelAllNotifications()
                    }
                }
            ])
        } else {
            setEyeOpen(!eyeOpen)
            setShowStartExercise(false);
            try{
                playOpenEyeSound()
            } catch (ex) {
                console.error("error", ex)
            }
        }

    }
    
    const onStartExercise = () => {
        navigation.navigate("Exercises", {
            exercise: getWeightedExercises()[getRandomInt(getWeightedExercises().length)]
        })
    }

    return (
        <BackgroundGradient>
        {/* {eyeOpen && */}
            {/* } */}
            <View style={[tw`flex-1 flex items-center justify-between`]}>
            
                {/* Top-right stats icon */}
                <View style={tw`w-full mt-4 px-6 flex items-center justify-center flex-row z-10`}>
                    <View style={tw`flex-1`}></View>
                    <View style={tw`flex flex-row items-center`}>
                        <TouchableOpacity
                            style={tw`flex mr-4`}
                            onPress={() => navigation.navigate("Bestiary")}>
                            <Ionicons name="book" style={[tw``]} size={getDefaultIconSize()} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`flex mr-4`}
                            onPress={() => navigation.navigate("Stats")}>
                            <Ionicons name="stats-chart" style={[tw``]} size={getDefaultIconSize()} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`flex`}
                            onPress={() => navigation.navigate("Settings")}>
                            <Ionicons name="settings" style={[tw``]} size={getDefaultIconSize()} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* <KeyboardAvoidingView > */}
                    
                <View style={tw`absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center z-0`}>                        
                    <EyeButton 
                        eyeOpen={eyeOpen} 
                        toggleEye={toggleEye}/>

                    <Timer
                        style={tw``}
                        setShowStartExercise={setShowStartExercise}
                        eyeOpenRef={eyeOpenRef} 
                        setEyeOpen={setEyeOpen}
                        navigation={navigation} />
                </View>
                <View style={tw`w-full px-8 flex items-center`}>
                {showStartExercise ?
                    <View style={[tw`w-full`, {}]}>
                        <MyButton onPress={onStartExercise}>
                            <Text style={tw`text-white w-full text-center text-lg`}>
                                Start Exercise
                            </Text>
                        </MyButton>
                    </View>
                    : eyeOpen ? 
                        <Tips/>
                    : <Text style={tw`text-white text-center text-xl`}>Press the closed eye to start</Text>
                }
                </View>
                {/* </KeyboardAvoidingView> */}
                
            <StatusBar style="light" />
            </View>

        </BackgroundGradient>
    )
}
