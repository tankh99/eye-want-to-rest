import { add, addSeconds, intervalToDuration, sub } from 'date-fns'
import { differenceInMinutes, getMinutes } from 'date-fns/esm'
import differenceInSeconds from 'date-fns/esm/fp/differenceInSeconds/index.js'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Platform } from 'react-native'
import tailwind from 'tailwind-rn'
import { calculateTargetTime, calculateTick, getEmptyDate, getTotalSeconds } from '../util/time'
import {Audio} from 'expo-av'
import { getRandomInt } from '../util/utils'
import { exercises } from '../constants/exercises'
import { insertHistory } from '../util/sqlite'
import * as Device from 'expo-device'

interface P {
    sessionDuration: Duration,
    eyeOpen: boolean,
    setEyeOpen: any,
    setExercise: any,
    setCompletedFully?: any,
    setShowExercises: any, // deprecated
    startTime: Date,
    style?: any,
    navigation: any
}

// const DEFAULT_TIME = new Date(0,0,0,0,20,0)
// const DEFAULT_DURATION = 60 * 20 // 20 minutes
const DEFAULT_FONT_SIZE = 80

export default function Timer({startTime, navigation, sessionDuration, eyeOpen, setEyeOpen, setExercise, setCompletedFully, setShowExercises, style}: P) {

    const [timeLeft, setTimeLeft] = useState(sessionDuration)
    const [timerID, setTimerID]: any = useState(null)

    const [dropletSound ,setDropletSound]: any = useState()
    const [bellSound, setBellSound]: any = useState()
    // let startTimeRef = useRef(startTime)
    // startTimeRef.current = startTime

    let timerIDRef = useRef(timerID)
    timerIDRef.current = timerID

    useEffect(() => {
        startTimer()

        return () => {
            clearTimer()
        }
    }, [eyeOpen])

    const startTimer = () => {
        if(eyeOpen && !timerID){
            // console.log(`eyeopen: ${eyeOpen}`)
            const startTime = new Date()
            const id = setInterval(() => {
                // calculateTick(getTotalSeconds(sessionDuration), startTime, () => onTimerDone())
                // const timeLeft = calculateTick(getTotalSeconds(sessionDuration), startTime, onTimerDone)

                const now = new Date()
                const targetTime = addSeconds(startTime, getTotalSeconds(sessionDuration))
                const interval = {start: new Date(), end: targetTime}
                const timeLeft = intervalToDuration(interval);
                console.log("now", now, " targetTime", targetTime);
                if(now.getTime() + 1000 >= targetTime.getTime()) { // timer is done . +1000 so that it ends on 0 seconds
                    return onTimerDone()
                } else {   
                    setTimeLeft(timeLeft)
                }
            }, 200)
            setTimerID(id)
        } else {
            // console.log("Timer interval already exists")
            clearTimer()
        }
    }

    const clearTimer = () => {
        // console.log(`clearing timer id: ${timerIDRef.current}`)
        clearInterval(timerIDRef.current)
        setTimerID(null)
        setTimeLeft(sessionDuration)
    }

    const onTimerDone = () => {
        setEyeOpen(false) // Since this should always only run when the eye timer runs out
        
        setTimeout(async() => { // play bell sound after delay
            const { sound: bellSound } = await Audio.Sound.createAsync(
                require("../assets/cowbell.wav")
            )
            await bellSound.playAsync()
        }, 200)
        setExercise(exercises[getRandomInt(exercises.length)])

        insertHistory(new Date(), getTotalSeconds(sessionDuration))
        setCompletedFully(true)
        setTimeLeft(sessionDuration)
        return clearTimer()

    }

    // const onTick =

    // const calculateTick = async (delayInSeconds: number, startTime: Date) => {
    //     const now = new Date()
    //     const targetTime = calculateTargetTime(startTime, delayInSeconds)
        
    //     let seconds = differenceInSeconds(now, targetTime)
    //     let minutes = seconds / 60
    //     seconds = seconds % 60
    //     try{
    //         if (minutes <= 0 && seconds <= 0){
    //             // Ensure that time remains 0 even after more than 5 minutes of not coming back to screen
    //             minutes = 0;
    //             seconds = 0;
    //         }
    //     } catch (ex: any) {
    //         console.error(ex.toString())
    //     }
    //     const timeLeft = new Date() // If you use this, will count up. But we want to count DOWN
        
    //     timeLeft.setMinutes(minutes)
    //     timeLeft.setSeconds(seconds)
    //     setTimeLeft(timeLeft)
    // }

    return (
        <View style={style}>
            <View style={tailwind("flex flex-row justify-center")}>
                <Text style={[tailwind("text-white"), {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.minutes?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
                <Text style={[tailwind("text-white"), {fontSize: DEFAULT_FONT_SIZE}]}>:</Text>
                <Text style={[tailwind("text-white"), {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.seconds?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
            </View>
        </View>
    )
}