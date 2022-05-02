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
import { insertHistory } from '../util/sqlite'

interface P {
    sessionDuration: Date,
    eyeOpen: boolean,
    setEyeOpen: any,
    setExercise: any,
    setCompletedFully: any,
    startTime: Date
}

const DEFAULT_TIME = new Date(0,0,0,0,20,0)
const DEFAULT_DURATION = 60 * 20 // 20 minutes


export default function Timer({startTime, sessionDuration, eyeOpen, setEyeOpen, setExercise, setCompletedFully}: P) {

    const [timeLeft, setTimeLeft] = useState(sessionDuration)
    const [timerID, setTimerID]: any = useState(null)

    const [dropletSound ,setDropletSound]: any = useState()
    const [bellSound, setBellSound]: any = useState()
    // let startTimeRef = useRef(startTime)
    // startTimeRef.current = startTime

    let timerIDRef = useRef(timerID)
    timerIDRef.current = timerID

    useEffect(() => {
        initSounds()
        if(eyeOpen && !timerID){
            // console.log(`eyeopen: ${eyeOpen}`)
            const startTime = new Date()
            const id = setInterval(() => {
                calculateTick(getTotalSeconds(sessionDuration), startTime)
            }, 200)
            setTimerID(id)
        } else {
            console.log("Timer interval already exists")
            clearTimer()
        }
    }, [eyeOpen])

    const initSounds = async () => {
        
        // const { sound: dropletSound } = await Audio.Sound.createAsync(
        //     require("../assets/droplet-sound.wav")
        // )
        // setDropletSound(dropletSound)

        // const { sound: bellSound } = await Audio.Sound.createAsync(
        //     require("../assets/cowbell.wav")
        // )
        // setBellSound(bellSound)
        
    }

    const clearTimer = () => {
        console.log(`clearing timer id: ${timerIDRef.current}`)
        clearInterval(timerIDRef.current)
        setTimerID(null)
        setTimeLeft(sessionDuration)
    }

    const calculateTargetTime = (startTime: Date, delayInSeconds: number) => {
        const targetTime = add(startTime, {seconds: delayInSeconds})
        // console.log(startTime)
        // console.log(targetTime)
        return targetTime
    }

    const calculateTick = async (delayInSeconds: number, startTime: Date) => {
        const now = new Date()
        const targetTime = calculateTargetTime(startTime, delayInSeconds)
        
        let seconds = differenceInSeconds(now, targetTime)
        let minutes = seconds / 60
        seconds = seconds % 60
        try{
            if (minutes <= 0 && seconds <= 0){
                // Ensure that time remains 0 even after more than 5 minutes of not coming back to screen
                minutes = 0;
                seconds = 0;
                setEyeOpen(false) // Since this should always only run when the eye timer runs out
                setCompletedFully(true)

                const { sound: dropletSound } = await Audio.Sound.createAsync(
                    require("../assets/droplet-sound.wav")
                )
                dropletSound.playAsync()
                setTimeout(async() => { // play bell sound after delay
                    const { sound: bellSound } = await Audio.Sound.createAsync(
                        require("../assets/cowbell.wav")
                    )
                    await bellSound.playAsync()
                }, 200)
                setExercise(exercises[getRandomInt(exercises.length)])

                // insertHistory(new Date(), sessionDuration.getSeconds())
                insertHistory(new Date(), 1500)
                return clearTimer()
            }
        } catch (ex: any) {
            console.error(ex.toString())
        }
        const timeLeft = new Date() // If you use this, will count up. But we want to count DOWN
        
        timeLeft.setMinutes(minutes)
        timeLeft.setSeconds(seconds)
        setTimeLeft(timeLeft)
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
