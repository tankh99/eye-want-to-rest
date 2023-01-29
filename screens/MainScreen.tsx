import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Platform, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import tw from 'twrnc'
import { cancelAllNotifications, scheduleNotification } from '../util/notifications'
import Tips from '../components/Tips'
import { getWeightedExercises } from '../constants/exercises'
import * as Notifications from 'expo-notifications'
import EyeButton from '../components/EyeButton'
import Timer from '../components/Timer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { getRandomInt } from '../util/utils'
import { getTotalSeconds } from '../util/time'
import { Ionicons } from '@expo/vector-icons'
import { DEFAULT_SESSION_DURATION, adUnitId, getDefaultIconSize } from '../constants/globals'
import { playCloseEyeSound, playOpenEyeSound } from '../util/sounds'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

export default function MainScreen({navigation, route}: any) {
    // console.log("ad id", adUnitId)
    const [eyeOpen, setEyeOpen] = useState(false)
    const [startTime, setStartTime]: any = useState(null)
    const [showStartExercise, setShowStartExercise] = useState(false)
    const notificationId = useRef<any>(undefined);
    let eyeOpenRef = useRef(eyeOpen)
    eyeOpenRef.current = eyeOpen;

    

    useEffect(() => {
        if(route.params && route.params.exerciseCompleted){ // Remove the "Start Execise" button
            setShowStartExercise(false)
        }

    }, [route.params])
    
    // TODO: Move this function into Timer component
    const setupNotifications = async () => {
        const notifs = await Notifications.getAllScheduledNotificationsAsync()
        
        let noNotifications: any = true;
        if (notifs.length > 0){
            console.log("There's notifications in the queue, going to cancel that")
            noNotifications = await cancelAllNotifications()
        }
        if(eyeOpenRef.current && noNotifications){
            console.log("Scheduled notification")
            // const totalSeconds = DEFAULT_TIME.getMinutes() * 60 + DEFAULT_TIME.getSeconds()
            notificationId.current = await scheduleNotification(
                "Break Time", 
                "It's time to rest your eyes", 
                getTotalSeconds(DEFAULT_SESSION_DURATION), 
                false
            )
        } else {
            cancelAllNotifications()
        }
    }

    // All functions from different components come together here
    const toggleEye = async () => {
        const tempEyeOpen = !eyeOpen; // a bit confusing, but it's because we want to inverse inverse the boolean. This makes somewhat more sense
        setEyeOpen(!eyeOpen)

        if(!tempEyeOpen) {
            playCloseEyeSound()
        } else {
            try{
                playOpenEyeSound()
            } catch (ex) {
                console.error("error", ex)
            }
        }
        setShowStartExercise(false);
        setupNotifications()
        setStartTime(new Date())
        // dropDatabase()
        // updateDatabase()

    }

    return (
        <>
        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tw`flex-1 absolute top-0 w-full h-full`}/>
        <SafeAreaView style={tw`flex-1 pb-8 pt-4`}>
        {/* {eyeOpen && */}
        <BannerAd unitId={adUnitId} size={BannerAdSize.FLUID}/>
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
                        style={tw`flex`}
                        onPress={() => navigation.navigate("Stats")}>
                        <Ionicons name="stats-chart" style={[tw``]} size={getDefaultIconSize()} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={tw`absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center z-0`}>
                <EyeButton eyeOpen={eyeOpen} toggleEye={toggleEye}/>
                <Timer 
                    style={tw``}
                    startTime={startTime}
                    sessionDuration={DEFAULT_SESSION_DURATION}
                    setShowStartExercise={setShowStartExercise}
                    eyeOpen={eyeOpenRef.current} 
                    setEyeOpen={setEyeOpen}
                    navigation={navigation} />
            </View>

            {/* Eye Button */}
            <View style={tw`flex w-full px-6 items-center max-w-screen-md`}>
                {/* <EyeButton eyeOpen={eyeOpen} toggleEye={toggleEye}/> */}
                <View style={tw`w-full flex items-center`}>
                {showStartExercise ?
                    <View style={[tw`w-full`, {}]}>
                        {/* <Text style={tw`text-white text-2xl pb-4`}>It's time to relax your eyes</Text> */}
                        
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Exercises", {
                                exercise: getWeightedExercises()[getRandomInt(getWeightedExercises().length)]
                            })
                        }} style={tw`p-2 w-full flex border border-white`}>
                            <Text style={tw`text-white w-full text-center text-lg`}>
                            Start Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : eyeOpen ? 
                        <Tips/>
                    : <Text style={tw`text-white text-center text-xl`}>Press the closed eye to start</Text>
                }
                </View>
            </View>

        {/* Bottom Aligned */}
        {/* <View style={tw`absolute bottom-12`}>
        {
        eyeOpen 
        ? 
        <View>
        </View>
            : !showExercises ?
            completedFully ?
                <View>
                    <Text style={tw`text-white text-2xl pb-4`}>It's time to relax your eyes</Text>
                    <TouchableOpacity onPress={() => setShowExercises(true)} style={tw`p-2 border border-white`}>
                        <Text style={tw`text-white text-center`}>
                        Start Exercise
                        </Text>
                    </TouchableOpacity>
                </View>
            : 
            <View style={tw`flex-row`}>
                <Text style={tw`text-white text-xl p-4 text-center flex-wrap`}>Click the closed eye above to start</Text>
            </View>
            : <></>
            }
        </View> */}
        <StatusBar style="light" />
        </View>
    </SafeAreaView>
    </>
    )
}
