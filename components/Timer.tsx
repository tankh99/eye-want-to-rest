import { add, addSeconds, format, intervalToDuration, sub } from 'date-fns'
import { differenceInMinutes, getMinutes } from 'date-fns/esm'
import differenceInSeconds from 'date-fns/esm/fp/differenceInSeconds/index.js'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Platform } from 'react-native'
import tw from 'twrnc'
import { DEFAULT_DB_NAME, insertHistory } from '../util/sqlite'
import { calculateTargetTime, calculateTick, getTotalSeconds } from '../util/time'

interface P {
    sessionDuration: Duration,
    eyeOpen: boolean,
    setEyeOpen: any,
    // setExercise: any,
    setShowStartExercise: Function,
    startTime: Date,
    style?: any,
    navigation: any
}

// const DEFAULT_TIME = new Date(0,0,0,0,20,0)
// const DEFAULT_DURATION = 60 * 20 // 20 minutes
const DEFAULT_FONT_SIZE = 80

export default function Timer({startTime, navigation, sessionDuration, eyeOpen, setEyeOpen, setShowStartExercise, style}: P) {

    const [timeLeft, setTimeLeft] = useState(sessionDuration)
    let timerId = useRef<any>(undefined)

    useEffect(() => {
        startTimer()
        return () => {
            clearTimer()
        }
    }, [eyeOpen])

    const startTimer = () => {
        if(eyeOpen){
            timerId.current = setInterval(() => {
                timeStep()
            }, 200)
        } else {
            // console.log("Timer interval already exists")
            clearTimer()
        }
    }

    const timeStep = () => {
        const now = new Date()
        const targetTime = addSeconds(startTime, getTotalSeconds(sessionDuration))
        const interval = {start: new Date(), end: targetTime}
        const timeLeft = intervalToDuration(interval);
        if(now.getTime() + 1000 >= targetTime.getTime()) { // timer is done . +1000 so that it ends on 0 seconds
            return onTimerDone()
        } else {   
            setTimeLeft(timeLeft)
        }
    }

    const clearTimer = () => {
        clearInterval(timerId.current)
        setTimeLeft(sessionDuration)
    }

    const onTimerDone = async () => { // Sound to be played will be left to the notification
        setEyeOpen(false) // Since this should always only run when the eye timer runs out
        setShowStartExercise(true)
        setTimeLeft(sessionDuration)
        // playTimerDoneSound();
        insertHistory(DEFAULT_DB_NAME, new Date(), getTotalSeconds(sessionDuration))
        return clearTimer()

    }

    return (
        <View style={style}>
            <View style={tw`flex flex-row justify-center`}>
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.minutes?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>:</Text>
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.seconds?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
            </View>
        </View>
    )
}