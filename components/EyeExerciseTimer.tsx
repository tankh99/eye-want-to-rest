import React, { useEffect, useRef, useState } from "react"
import { View, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import { calculateTick, formatDurationToString, formatSecondsToDuration } from "../util/time"
import { cancelAllNotifications, scheduleNotification } from "../util/notifications"
import * as Notifications from 'expo-notifications'
import { getExercisePreference, saveExercisePreference } from "../util/sqlite"
import { Exercise, exercises } from "../constants/exercises"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"

const {width, height} = Dimensions.get("screen")
const ITEM_WIDTH = 75

interface P {
    exercise: Exercise,
    exerciseDurationRange: number[],
    navigation: any,
    isOpen: boolean,
    onOpen: Function,
    onClose: Function,
    style?: any,
    // defaultDurationInSec: number,
    // data: any[]
}

const CLOSED_SLIDE_HEIGHT = 75
const OPEN_SLIDE_HEIGHT = 100

// Not currently used
const DEFAULT_MODAL_TITLE = `Open Exercise Timer`

export default function EyeExerciseTimer(props: P) {


    const [defaultExerciseDurationIndex, setDefaultExerciseDurationIndex] = useState(0);

    const [isCompleted, setIsCompleted] = useState(false)
    const [modalTitle, setModalTitle]: any = useState(DEFAULT_MODAL_TITLE)

    const {exercise, exerciseDurationRange, navigation, onOpen, onClose, isOpen, ...rest} = props
    const defaultDuration = exerciseDurationRange[defaultExerciseDurationIndex]
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
        initialiseTimePicker()
        return () => {
            clearTimer()
            try{
                Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
            } catch (ex) {
                console.error(ex);
            }
        }
    }, [])


    const slideValue = useSharedValue(CLOSED_SLIDE_HEIGHT)
    const slideStyle = useAnimatedStyle(() => {
        return {
            height: withSpring(slideValue.value, {
                stiffness: 90,
                damping: 100
            })
        }
    })

    useEffect(() => {
        if (isOpen) {
            onOpen()
            // setModalTitle(<AntDesign name="caretdown" size={24} color="white" />)  // Open
            slideValue.value = OPEN_SLIDE_HEIGHT + 100;
        } else {
            onClose()
            // setModalTitle("Open Exercise Timer")  // Open
            slideValue.value = CLOSED_SLIDE_HEIGHT;
            // else slideValue.value = OPEN_SLIDE_HEIGHT + 100
        }
    }, [isOpen])


    const initialiseTimePicker = () => {
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
    }

    useEffect(() => {
        const updateTimePicker = () => {
            if(isOpen){
                setTimeout(() => { // Have to include a setTimeout, otherwise it won't even scroll
                    // Scrolls to the default duration position
                    scrollviewRef.current?.scrollTo({x: defaultExerciseDurationIndex * ITEM_WIDTH})
                }, 0)
            }
        }
        getPreferences()
        updateTimePicker()
        // getPreferences();
    }, [isOpen])

    const getPreferences = async () => {
        getExercisePreference(exercise.id)
        .then((pref: any) => {
            console.log("pref:",pref)
            if (!pref) {
                setDefaultExerciseDurationIndex(exercise.defaultDurationIndex)
                return;
            }
            setDefaultExerciseDurationIndex(pref.defaultIndex);
        }).catch((err) => {
            console.error(err)
        })
    }
    
    const startExerciseTimer = async () => {
        const startTime = new Date()
        setStarted(true)
        
        // console.log(calculateTick(5, new Date(), () => {}))
        onClose()
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
        onClose()
        setIsCompleted(true);
        return clearTimer()
    }

    const clearTimer = () => {
        clearInterval(timerIDRef.current)
        setTimerID(null)
        // setTimeLeft(new Date())
    }

    // When choosing exercise time
    const updateTimer = (timeInSeconds: number, index: number) => {
        const duration = formatSecondsToDuration(timeInSeconds)
        setModalTitle(formatDurationToString(duration));
        // console.log("Index and time in seconds:", index, timeInSeconds)
        saveExercisePreference(exercise.id, index);

    }

    return (
        <>
            
            {/* Outside safeareaview because it interferes with how it appears and animates */}
            <Animated.View
                style={[
                    {
                        backgroundColor: "#222",
                        height: OPEN_SLIDE_HEIGHT,
                        width: '100%',
                    },
                    slideStyle,
                    tw``
                ]}>
                    <TouchableOpacity // Opens up the exercise timer
                    style={[tw`justify-center items-center`, {height: CLOSED_SLIDE_HEIGHT}]}
                    onPress={() => {
                        if(!isCompleted){
                            if(isOpen) onClose()
                            else onOpen()

                            const exerciseDurationInSeconds = exercise.durationRange[defaultExerciseDurationIndex];
                            const duration = formatSecondsToDuration(exerciseDurationInSeconds);
                            if(modalTitle == DEFAULT_MODAL_TITLE) setModalTitle(formatDurationToString(duration));

                        } else {
                            navigation.navigate("Main", {
                                exerciseCompleted: true
                            })
                        }

                    }}>
                    <View style={[tw`flex w-full px-4 flex-row justify-center`]}>
                        <Text style={[tw`text-white text-center text-2xl font-bold self-center`]}>{isCompleted ? "Done" : modalTitle}</Text>
                    </View>
                </TouchableOpacity>
                <View style={tw`flex justify-center items-center`} {...rest}>
                {/* Horizontal Exercise Duration Picker */}
                {!started &&
                <>
                <Text style={tw`text-center text-white font-bold`}>Exercise Duration</Text>
                <View style={tw`my-2`}>
                    <View style={[tw`opacity-50 bg-white absolute top-0 bottom-0`, {width: ITEM_WIDTH, left: width/2 - ITEM_WIDTH/2, right: 0 }]}></View>
                    
                    <ScrollView 
                        ref={scrollviewRef}
                        contentContainerStyle={[{paddingRight: width/2 - ITEM_WIDTH/2, paddingLeft: (width/2 - ITEM_WIDTH/2)}]}
                        snapToInterval={width} // value should be element width!
                        snapToAlignment="center"
                        showsHorizontalScrollIndicator={false}
                        snapToOffsets={offsets}
                        decelerationRate="fast"
                        onMomentumScrollEnd={(e) => {
                            if(e.nativeEvent.contentOffset.x % ITEM_WIDTH == 0){
                                const index = e.nativeEvent.contentOffset.x / ITEM_WIDTH
                                const time = filteredData[index].value
                                // playsound()
                                setTime(time)
                                updateTimer(time, index)
                            }
                        }}
                        maximumZoomScale={2}
                        zoomScale={1}
                        horizontal>
                        
                    {filteredData.map((item: any, index: number) => {
                        return (
                            <Text style={[tw`text-xl text-center text-white`, {width: ITEM_WIDTH}]} key={index}>{item.label}</Text>
                        )
                    })}
                    </ScrollView>
                </View>
                </>
                }

                {/* </View> */}
                <View style={tw`mx-8`}>
                {!started ?
                    <TouchableOpacity style={tw`p-2 border border-white w-full `}
                    onPress={() => {
                        startExerciseTimer()
                    }} >
                        <Text style={tw`text-white text-center`}>
                        Start
                        </Text>
                    </TouchableOpacity>
                : (<TouchableOpacity style={tw`p-2 border border-white w-full `}
                    onPress={() => {
                        cancelAllNotifications();
                        onTimerDone()
                    }} >
                    <Text style={tw`text-white text-center`}>
                    Skip
                    </Text>
                </TouchableOpacity>)}
                </View>
                </View>

            </Animated.View>
        </>
    )
  }