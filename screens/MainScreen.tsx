import React, { useEffect, useRef, useState } from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {View, Text, TouchableOpacity} from 'react-native'
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

// const DEFAULT_INTERVAL = 60 * 20 // 20 mins
const DEFAULT_TIME = new Date(0,0,0,0,20,0)
const Stack = createNativeStackNavigator()

export default function MainScreen({navigation}: any) {

        const [eyeOpen, setEyeOpen] = useState(false)
        const [notificationId, setNotificationId] = useState("")
        const [startTime, setStartTime]: any = useState(null)
        const [showExercises, setShowExercises] = useState(false)
        const [completedFully, setCompletedFully] = useState(false)

        const [exercise, setExercise]: any = useState(exercises[getRandomInt(exercises.length)])
        
        let eyeOpenRef = useRef(eyeOpen)
        eyeOpenRef.current = eyeOpen;


        // const [exerciseCount, setExerciseCount] = useState(0)
        // useEffect(() => {
        //     console.log(exerciseCount)
            
        //     if(exerciseCount + 1 <= exercises.length - 1){
        //         console.log("hello?")
        //         setExerciseCount(exerciseCount + 1)
        //     } else {
        //         setExerciseCount(0)
        //     }
        //     setExercise(exercises[exerciseCount])
        // }, [showExercises])
        

    const playSound = async () => {

        const { sound: dropletSound } = await Audio.Sound.createAsync(
        require("../assets/droplet-sound.wav")
        )
        await dropletSound.playAsync()
    }

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
                getTotalSeconds(DEFAULT_TIME), 
                false
            )
            setNotificationId(id)
        } else {
            cancelAllNotifications()
        }

    }

    // All functions from different components come together here
    const toggleEye = () => {
        setEyeOpen(!eyeOpen)
        setCompletedFully(false)
        setupNotifications()
        console.log(`eyeopnref: ${eyeOpenRef.current}`)
        if(eyeOpenRef.current) playSound()
    }

    const timesUp = () => {
        setShowExercises(true)
    }

    const handleFinishTask = () => {
        setCompletedFully(true)
    }

    const toggle = () => {
        setShowExercises(!showExercises)
    }


    return (
        <>
        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
        <SafeAreaView style={tailwind("flex-1")}>

        <View style={tailwind("flex-1 items-center justify-center")}>
        {/* {showExercises && 
        <EyeExercises setShowExercises={setShowExercises}/>
        } */}
        {showExercises 
        ? <EyeExercises 
            exercise={exercise}
            setCompletedFully={setCompletedFully}
            setShowExercises={setShowExercises}/>
        : (
        <>
        <Timer 
        interval={DEFAULT_TIME}
        setCompletedFully={setCompletedFully} 
        eyeOpen={eyeOpenRef.current} 
        setEyeOpen={setEyeOpen}
        setExercise={setExercise}  />
        <EyeButton eyeOpen={eyeOpen} toggleEye={toggleEye}/>
        </>
        )
        }
        {/* Bottom Aligned */}
        <View style={tailwind("absolute bottom-12")}>
        {
        eyeOpen 
        ? 
        <View>
            <Tips/>
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
            <>
                <Text style={tailwind("text-white text-2xl pb-4")}>Click the closed eye above to start</Text>
            </>
            : <></>
            }
        </View>
        <StatusBar style="light" />
        </View>
    </SafeAreaView>
    </>
    )
}
