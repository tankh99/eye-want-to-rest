import { add, addSeconds, format, intervalToDuration, minutesInHour, sub } from 'date-fns'
import { differenceInMinutes, getMinutes } from 'date-fns/esm'
import differenceInSeconds from 'date-fns/esm/fp/differenceInSeconds/index.js'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Platform, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import tw from 'twrnc'
import { DEFAULT_DB_NAME, insertHistory } from '../util/sqlite'
import { calculateTargetTime, calculateTick, getTotalSeconds } from '../util/time'
import {Picker} from '@react-native-picker/picker'
import { DEFAULT_SESSION_DURATION } from '../constants/globals'
import { getSessionDuration } from '../util/prefs'
import useSessionTimer from '../util/useSessionTimer'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSessionDuration } from '../store/session/sessionSlice'

interface P {
    eyeOpen: boolean,
    setEyeOpen: any,
    // setExercise: any,
    setShowStartExercise: Function,
    
    style?: any,
    navigation: any,
}

const MINUTES = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
const SECONDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
const PICKER_WIDTH = 175;
const PICKER_HEIGHT = 100;
// const DEFAULT_TIME = new Date(0,0,0,0,20,0)
// const DEFAULT_DURATION = 60 * 20 // 20 minutes
const DEFAULT_FONT_SIZE = 80

export default function Timer({eyeOpen, setEyeOpen, setShowStartExercise, style}: P) {

    // const [startTime, setStartTime] = useState(new Date())
    // const [sessionDuration, setSessionDuration] = useSessionTimer();
    let timerId = useRef<any>(undefined)
    const sessionDuration = useAppSelector(state => state.session.sessionDuration)
    const [timeLeft, setTimeLeft] = useState(sessionDuration)
    const dispatch = useAppDispatch();

    useEffect(() => {
        getSessionDuration()
        .then(sd => {
            setSessionDuration(sd)
            dispatch(setSessionDuration(sd))
        })
    }, [])
    useEffect(() => {
        if (!eyeOpen) { // only update timer if not running
            setTimeLeft(sessionDuration) // Set it, otherwise the timeLeft will just default to the default sesion duration
        }
    }, [sessionDuration])

    useEffect(() => {
        startTimer(new Date())
        return () => {
            clearTimer()
        }
    }, [eyeOpen])

    const startTimer = (startTime: Date) => {
        
        if(eyeOpen){
            timeStep(startTime);
            timerId.current = setInterval(() => {
                timeStep(startTime)
            }, 200)
        } else {
            clearTimer()
        }
    }

    const timeStep = (startTime: Date) => {
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
        insertHistory(DEFAULT_DB_NAME, new Date(), getTotalSeconds(sessionDuration))
        return clearTimer()

    }
    
    return (
        <View style={style}>
            <View style={tw`flex flex-row items-center justify-center`}>
                {/* <TextInput onChangeText={onChangeSessionMinutes} 
                    keyboardType="numeric"
                    style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}
                    value={sessionDuration.minutes?.toString()}/> */}
                {/* <Picker itemStyle={[tw`text-white`, 
                {width: PICKER_WIDTH, height: PICKER_HEIGHT, fontSize: DEFAULT_FONT_SIZE}]} 
                    selectedValue={sessionDuration.minutes}
                    onValueChange={(val, index) => onMinutesChange(val)}>
                    {MINUTES.map((minute, index) => (
                        <Picker.Item key={index} label={`${minute}`} value={minute}/>
                    ))}
                </Picker> */}
                
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.minutes?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>:</Text>
                <Text style={[tw`text-white`, {fontSize: DEFAULT_FONT_SIZE}]}>{timeLeft.seconds?.toLocaleString('en-US', {minimumIntegerDigits: 2})}</Text>
            </View>
        </View>
    )
}