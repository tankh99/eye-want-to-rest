import React, { useEffect, useRef, useState } from "react"
import {View, ScrollView, Text, Dimensions, TouchableOpacity} from 'react-native'
import tailwind from "tailwind-rn"
import {Audio } from 'expo-av'
import { addSeconds, differenceInSeconds } from "date-fns"
import { calculateTick, formatDurationToString, formatSecondsToDuration, getTotalSeconds } from "../util/time"
import { intervalToDuration } from "date-fns/esm"
import { playTimerDoneSound } from "../util/sounds"
import { cancelAllNotifications, scheduleNotification } from "../util/notifications"
import * as Notifications from 'expo-notifications'

const {width, height} = Dimensions.get("screen")
const ITEM_WIDTH = 75

interface P {
    exerciseDefaultDurationIndex: number,
    exerciseDurationRange: number[],
    navigation: any,
    setModalTitle: Function,
    setIsCompleted: Function,
    isOpen: boolean,
    closeSlide: Function,
    style?: any,
    // defaultDurationInSec: number,
    // data: any[]
}

export default function EyeExerciseTimer(props: P) {


    const {exerciseDurationRange, exerciseDefaultDurationIndex, navigation, setModalTitle, setIsCompleted, isOpen, closeSlide, ...rest} = props
    const defaultDuration = exerciseDurationRange[exerciseDefaultDurationIndex]
    const [offsets, setOffsets] = useState([])
    const [time, setTime] = useState(defaultDuration) // number
    const [notificationId, setNotificationId] = useState("")
    const [timerID, setTimerID]: any = useState(undefined)
    const [started, setStarted] = useState(false)
    const [filteredData, setFilteredData]: any = useState([])

    const timerIDRef = useRef(timerID)
    timerIDRef.current = timerID

    const notificationIdRef = useRef(notificationId);
    notificationIdRef.current = notificationId;

    const scrollviewRef: any = useRef()
  
    useEffect(() => {
    
        // Initialising horizontal scrollview picker
        let filteredData: any = []
        let offsets: any = []
        for(let i = 0; i < exerciseDurationRange.length; i+=1){
            
            offsets.push(ITEM_WIDTH * i)
            let time = exerciseDurationRange[i]
            const timeObj = {
                label: "",
                value: time
            }
            if(time >= 60){
                const min = Math.floor(time / 60)
                const sec = time % 60
                const timeString = sec > 0 ? `${min}m ${sec}s` : `${min}m`
                timeObj.label = timeString
                filteredData.push(timeObj)
            } else {
                timeObj.label = `${time}s`
                filteredData.push(timeObj)
            }
        }
        setFilteredData(filteredData)
        setOffsets(offsets)

        return () => {
            // console.log("Clearing timer");
            clearTimer()
            try{
                // console.log("Cancelled notification of ID: ", notificationIdRef.current);
                Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
            } catch (ex) {
                console.error(ex);
            }
        }
    }, [])

    useEffect(() => {

        if(isOpen){
            setTimeout(() => { // Have to include a setTimeout, otherwise it won't even scroll
                // Scrolls to the default duration position
                scrollviewRef.current?.scrollTo({x: exerciseDefaultDurationIndex * ITEM_WIDTH})
            }, 0)
        }
    }, [isOpen])
    
    const startExerciseTimer = async () => {
        const startTime = new Date()
        setStarted(true)
        
        // console.log(calculateTick(5, new Date(), () => {}))
        closeSlide()
        await setupNotifications();
        const timerID = setInterval(() => {
            const timeLeft: Duration = calculateTick(time, startTime, onTimerDone)
            // setTimeLeft(timeLeft)
            setModalTitle(formatDurationToString(timeLeft));
        }, 200)
        setTimerID(timerID)
    }

    const setupNotifications = async () => {
        const notifs = await Notifications.getAllScheduledNotificationsAsync();
        let notifStackEmpty = true;
        if(notifs.length > 0){
            console.log("There's notifications in the queue, going to cancel that")
            notifStackEmpty = await cancelAllNotifications()
        }
        
        const id = await scheduleNotification(
            "Exercise Done",
            "Time for work",
            time,
            false
        )
        console.log("Scheduled notification ", id, " of time: ", time);
        setNotificationId(id);

    }

    const onTimerDone = () => {
        setStarted(false)
        closeSlide()
        setIsCompleted(true);
        return clearTimer()
    }

    const clearTimer = () => {
        clearInterval(timerIDRef.current)
        setTimerID(null)
        // setTimeLeft(new Date())
    }

    const updateTimer = (timeInSeconds: number) => {
        const duration = formatSecondsToDuration(timeInSeconds)
        setModalTitle(formatDurationToString(duration));
    }


    return (
      <View style={tailwind("flex justify-center items-center")} {...rest}>

        {/* Timer */}
        {/* <Text style={tailwind("text-white text-xl text-center pb-2")}>
            Duration: {timeLeft.minutes?.toLocaleString("en-US", {minimumIntegerDigits: 2})}:{timeLeft.seconds?.toLocaleString("en-US", {minimumIntegerDigits: 2})}
        </Text> */}
        {/* Horizontal Exercise Duration Picker */}
        {!started && // Hide after starting
        <>
        <Text style={tailwind("text-center text-white font-bold")}>Exercise Duration</Text>
        <View style={tailwind("my-2")}>
            <View style={[tailwind("opacity-50 bg-white absolute top-0 bottom-0"), {width: ITEM_WIDTH, left: width/2 - ITEM_WIDTH/2, right: 0 }]}></View>
            
            <ScrollView 
                ref={scrollviewRef}
                contentContainerStyle={[{paddingRight: width/2 - ITEM_WIDTH/2, paddingLeft: (width/2 - ITEM_WIDTH/2)}]}
                // contentOffset={{x: (exerciseDefaultDurationIndex+1*2) * ITEM_WIDTH/2, y: 0}}
                // contentInset={{right: (exerciseDefaultDurationIndex+1*2) * ITEM_WIDTH/2, top:0,bottom:0,left:0}}
                // contentInsetAdjustmentBehavior={"always"}
                snapToInterval={width} // value should be element width!
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                snapToOffsets={offsets}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                    if(e.nativeEvent.contentOffset.x % ITEM_WIDTH == 0){
                        const time = filteredData[e.nativeEvent.contentOffset.x / ITEM_WIDTH].value
                        // playsound()
                        setTime(time)
                        updateTimer(time)
                    }
                }}
                maximumZoomScale={2}
                zoomScale={1}
                horizontal>
                
            {filteredData.map((item: any, index: number) => {
                return (
                    <Text style={[tailwind(`text-xl text-center text-white`), {width: ITEM_WIDTH}]} key={index}>{item.label}</Text>
                )
            })}
            </ScrollView>
        </View>
        </>
        }
        
        {/* </View> */}
        <View style={tailwind("mx-8")}>
        {/* {isCompleted ?
            <TouchableOpacity style={tailwind("p-2 border border-white w-full ")}
                onPress={() => {
                    navigation.navigate("Main", {
                        exerciseDone: true // true: To tell MainScreen not to show "Start Exercise button"
                    })
                }} >
                <Text style={tailwind("text-white text-center")}>
                Done
                </Text>
            </TouchableOpacity>
           :  */}
           {!started ?
            <TouchableOpacity style={tailwind("p-2 border border-white w-full ")}
            onPress={() => {
                startExerciseTimer()
            }} >
                <Text style={tailwind("text-white text-center")}>
                Start
                </Text>
            </TouchableOpacity>
        : (<TouchableOpacity style={tailwind("p-2 border border-white w-full ")}
            onPress={() => {
                cancelAllNotifications();
                onTimerDone()
            }} >
            <Text style={tailwind("text-white text-center")}>
            Skip
            </Text>
        </TouchableOpacity>)}
        </View>
      </View>
    )
  }