import { add, sub } from 'date-fns'
import { differenceInMinutes } from 'date-fns/esm'
import differenceInSeconds from 'date-fns/esm/fp/differenceInSeconds/index.js'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import tailwind from 'tailwind-rn'
import { getEmptyDate, getTotalSeconds, minutes, seconds } from '../util/time'
import {Audio} from 'expo-av'
import { getRandomInt } from '../util/utils'
import { exercises } from '../constants/exercises'

interface P {
    interval: Date,
    eyeOpen: boolean,
    setEyeOpen: any,
    setExercise: any,
    setCompletedFully: any
}

const DEFAULT_TIME = new Date(0,0,0,0,20,0)
const DEFAULT_DURATION = 60 * 20 // 20 minutes

export default function Timer({interval, eyeOpen, setEyeOpen, setExercise, setCompletedFully}: P) {

    const [timeLeft, setTimeLeft] = useState(interval)
    const [timerID, setTimerID]: any = useState(null)

    // let startTimeRef = useRef(startTime)
    // startTimeRef.current = startTime

    let timerIDRef = useRef(timerID)
    timerIDRef.current = timerID

    useEffect(() => {
        if(eyeOpen && !timerID){
            // console.log(`eyeopen: ${eyeOpen}`)
            const startTime = new Date()
            const id = setInterval(() => {
                
                calculateTick(getTotalSeconds(interval), startTime)
            }, 200)
            setTimerID(id)
        } else {
            console.log("Timer interval already exists")
            clearTimer()
        }
    }, [eyeOpen])


    const clearTimer = () => {
        console.log(`clearing timer id: ${timerIDRef.current}`)
        clearInterval(timerIDRef.current)
        setTimerID(null)
        setTimeLeft(interval)
    }

    const calculateTargetTime = (startTime: Date, delayInSeconds: number) => {
        const targetTime = add(startTime, {seconds: delayInSeconds})
        // console.log(startTime)
        // console.log(targetTime)
        return targetTime
    }

    const calculateTick = async (delayInSeconds: number, startTime: Date) => {
        const tick = new Date()
        const targetTime = calculateTargetTime(startTime, delayInSeconds)
        
        
        let seconds = differenceInSeconds(tick, targetTime)
        let minutes = seconds / 60
        seconds = seconds % 60
        if (minutes <= 0 && seconds <= 0){
            setEyeOpen(false) // Since this should always only run when the eye timer runs out
            setTimeout(async() => { // play bell sound after delay

                const { sound: bellSound } = await Audio.Sound.createAsync(
                    require("../assets/cowbell.wav")
                )
                await bellSound.playAsync()
            }, 250)
            setCompletedFully(true)
            setExercise(exercises[getRandomInt(exercises.length)])
            return clearTimer()
        }
        const timeLeft = new Date() // If you use this, will count up. But we want to count DOWN
        
        timeLeft.setMinutes(minutes)
        timeLeft.setSeconds(seconds)
        setTimeLeft(timeLeft)
    }

    const stopTimer = () => {

    }

    return (
        <View style={tailwind("absolute flex top-12")}>
            <View style={tailwind("flex flex-row")}>
                <Text style={tailwind("text-4xl text-white")}>{minutes(timeLeft)}</Text>
                <Text style={tailwind("text-4xl text-white")}>:</Text>
                <Text style={tailwind("text-4xl text-white")}>{seconds(timeLeft)}</Text>
            </View>
        </View>
    )
}
