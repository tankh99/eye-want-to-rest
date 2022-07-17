import React, { useEffect, useRef, useState } from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {View, Text, Image, TouchableOpacity, Button} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import tailwind from 'tailwind-rn'
import { cancelAllNotifications, scheduleNotification } from '../util/notifications';
import EyeExercises from '../components/EyeExercises';
import Tips from '../components/Tips';
import { exercises } from '../constants/exercises';
import * as Notifications from 'expo-notifications'
import EyeButton from '../components/EyeButton';
import Timer from '../components/Timer';
import {SafeAreaView } from 'react-native-safe-area-context'
import {LinearGradient} from 'expo-linear-gradient'
import { getRandomInt } from '../util/utils'
import { getTotalSeconds } from '../util/time'
import {Audio} from 'expo-av'
import { Ionicons } from '@expo/vector-icons';
import { getDefaultIconSize} from '../constants/globals'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import DateTimePicker from '@react-native-community/datetimepicker'

const DEFAULT_SESSION_DURATION = new Date(0,0,0,0,20,0) // 5 seconds

export default function MainScreen({navigation, route}: any) {

    const [eyeOpen, setEyeOpen] = useState(false)
    const [notificationId, setNotificationId] = useState("")
    const [startTime, setStartTime]: any = useState(null)
    const [showExercises, setShowExercises] = useState(false)
    const [completedFully, setCompletedFully] = useState(false)
    

    const [exercise, setExercise]: any = useState(exercises[0])

    // const [eyeOpenSound, setEyeOpenSound]: any = useState(null)
    // const [eyeCloseSound, setEyeCloseSound]: any = useState(null)

    // useEffect(() => {

        // const loadSounds = async () => {

            // const sound = new Audio.Sound()
            // await sound.loadAsync(require("../assets/eye-open.wav"))
            // await sound.playAsync()   

        //     setEyeOpenSound(eyeOpenSound)
        //     setEyeCloseSound(eyeCloseSound)
        // }
        // loadSounds()
    // }, [])

    let eyeOpenRef = useRef(eyeOpen)
    eyeOpenRef.current = eyeOpen;

    useEffect(() => {
        
        if(route.params && route.params.exerciseDone){ // Remove the "Start Execise" button
            setCompletedFully(false)
        }

    }, [route.params])
    

    const setupNotifications = async () => {
        const notifs = await Notifications.getAllScheduledNotificationsAsync()
        
        let noNotifications: any = true;
        if (notifs.length > 0){
            console.log("There's notifications in the queue, going to cancel that")
            noNotifications = await cancelAllNotifications()
        }
        // console.log(`noNotifs: ${noNotifications}`)
        // console.log(`eyeOpen: ${eyeOpenRef.current}`)
        if(eyeOpenRef.current && noNotifications){
            console.log("Scheduled notification")
            // const totalSeconds = DEFAULT_TIME.getMinutes() * 60 + DEFAULT_TIME.getSeconds()
            const id = await scheduleNotification(
                "Break Time", 
                "It's time to rest your eyes", 
                getTotalSeconds(DEFAULT_SESSION_DURATION), 
                false
            )
            setNotificationId(id)
        } else {
            cancelAllNotifications()
        }

    }

    // All functions from different components come together here
    const toggleEye = async () => {
        const tempEyeOpen = !eyeOpen; // a bit confusing, but it's because we want to inverse inverse the boolean. This makes somewhat more sense
        setEyeOpen(!eyeOpen)
        setCompletedFully(false)
        setupNotifications()
        setStartTime(new Date())
        // dropDatabase()
        // updateDatabase()


        if(!tempEyeOpen) {
            const { sound: eyeCloseSound } = await Audio.Sound.createAsync(
                require("../assets/droplet-sound.wav"),
                // {shouldPlay: true}
            )
            eyeCloseSound.playAsync()
        } else {
            try{
                const { sound: eyeOpenSound } = await Audio.Sound.createAsync(
                    require("../assets/eye-open.wav"),
                    // {shouldPlay: true}
                )
                eyeOpenSound.playAsync()
            } catch (ex) {
                console.error("error", ex)
            }
        }
    }

    

    return (
        <>
        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
        <SafeAreaView style={tailwind("flex-1 pb-8 pt-4")}>
        
        <View style={[tailwind("flex-1 flex items-center justify-between")]}>

            {/* Top-right stats icon */}
            <View style={tailwind("w-full px-6 flex items-center justify-center flex-row z-10")}>

            <Button onPress={() => navigation.navigate("Test")} title="Test"/>
                {/* Placeholder Icon used to center text */}
                {/* <Ionicons name="arrow-back" size={DEFAULT_ICON_SIZE} style={tailwind("")} color="transparent"  /> */}

                {/*  */}
                <View style={tailwind("flex-1")}></View>
                
                <View style={tailwind("flex flex-row items-center")}>
                    <TouchableOpacity
                        style={tailwind("flex mr-4")}
                        onPress={() => navigation.navigate("Bestiary")}>
                        <Ionicons name="book" style={[tailwind("")]} size={getDefaultIconSize()} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tailwind("flex")}
                        onPress={() => navigation.navigate("Stats")}>
                        <Ionicons name="stats-chart" style={[tailwind("")]} size={getDefaultIconSize()} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={tailwind("absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center z-0")}>

                <EyeButton eyeOpen={eyeOpen} toggleEye={toggleEye}/>
                <Timer 
                    style={tailwind("")}
                    startTime={startTime}
                    sessionDuration={DEFAULT_SESSION_DURATION}
                    setShowExercises={setShowExercises} 
                    setCompletedFully={setCompletedFully}
                    eyeOpen={eyeOpenRef.current} 
                    setEyeOpen={setEyeOpen}
                    navigation={navigation}
                    setExercise={setExercise}  />
            </View>
            {/* {showExercises 
            && <EyeExercises 
                exercise={exercise}
                setExercise={setExercise}
                setCompletedFully={setCompletedFully}
                setShowExercises={setShowExercises}/>
            } */}

            {/* Eye Button */}
            <View style={tailwind("flex w-full px-6 items-center max-w-screen-md")}>
                {/* <EyeButton eyeOpen={eyeOpen} toggleEye={toggleEye}/> */}
                <View style={tailwind("w-full flex items-center")}>
                {completedFully ?
                    <View style={[tailwind("w-full"), {}]}>
                        {/* <Text style={tailwind("text-white text-2xl pb-4")}>It's time to relax your eyes</Text> */}
                        
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("Exercises", {
                                exercise: exercises[getRandomInt(exercises.length)]
                            })
                        }} style={tailwind("p-2 w-full flex border border-white")}>
                            <Text style={tailwind("text-white w-full text-center text-lg")}>
                            Start Exercise
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : eyeOpen ? 
                        <Tips/>
                    : <Text style={tailwind("text-white text-center text-xl")}>Press the closed eye to start</Text>
                }
                </View>
            </View>

        {/* Bottom Aligned */}
        {/* <View style={tailwind("absolute bottom-12")}>
        {
        eyeOpen 
        ? 
        <View>
        </View>
            : !showExercises ?
            completedFully ?
                <View>
                    <Text style={tailwind("text-white text-2xl pb-4")}>It's time to relax your eyes</Text>
                    <TouchableOpacity onPress={() => setShowExercises(true)} style={tailwind("p-2 border border-white")}>
                        <Text style={tailwind("text-white text-center")}>
                        Start Exercise
                        </Text>
                    </TouchableOpacity>
                </View>
            : 
            <View style={tailwind("flex-row")}>
                <Text style={tailwind("text-white text-xl p-4 text-center flex-wrap")}>Click the closed eye above to start</Text>
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
