import React, { useEffect, useRef, useState } from "react"
import {View, ScrollView, Text, Dimensions, TouchableOpacity} from 'react-native'
import tailwind from "tailwind-rn"
import {Audio } from 'expo-av'
import { addSeconds, differenceInSeconds } from "date-fns"
import { calculateTick, formatSecondsToDuration } from "../util/time"
import { intervalToDuration } from "date-fns/esm"

const {width, height} = Dimensions.get("screen")
const ITEM_WIDTH = 100

interface P {
    exerciseDefaultDurationIndex: number,
    exerciseDurationRange: number[],
    navigation: any,
    onDone: Function,
    style?: any,
    // defaultDurationInSec: number,
    // data: any[]
}

export default function EyeExerciseTimer(props: P) {


    const {exerciseDurationRange, exerciseDefaultDurationIndex, navigation, onDone, ...rest} = props
    const defaultDuration = exerciseDurationRange[exerciseDefaultDurationIndex]
    const [offsets, setOffsets] = useState([])
    const [time, setTime] = useState(defaultDuration) // number
    const [isCompleted, setIsCompleted] = useState(false)
    
    const [timeLeft, setTimeLeft] = useState(formatSecondsToDuration(defaultDuration)) // Date
    const [timerID, setTimerID]: any = useState(undefined)
    
    const [started, setStarted] = useState(false)


    const [filteredData, setFilteredData]: any = useState([])

    const timerIDRef = useRef(timerID)
    timerIDRef.current = timerID

    const scrollviewRef: any = useRef()
  
    const playsound = async () => {
  
      const {sound} = await Audio.Sound.createAsync(
        require("../assets/cowbell.wav")
      )
      sound.playAsync()
    }

    useEffect(() => {
        
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
        setTimeout(() => { // Have to include a setTimeout, otherwise it won't even scroll
            // Scrolls to the default duration position
            scrollviewRef.current.scrollTo({x: exerciseDefaultDurationIndex * ITEM_WIDTH})
        }, 0)

        return () => {
            clearTimer()
        }
    }, [])
    
    const startExerciseTimer = () => {
        const startTime = new Date()
        setStarted(true)
        // console.log(calculateTick(5, new Date(), () => {}))
        const timerID = setInterval(() => {
            const timeLeft = calculateTick(time, startTime, onTimerDone)
            setTimeLeft(timeLeft)
        }, 200)
        setTimerID(timerID)
    }

    const onTimerDone = () => {
        console.log("exercise timer is done!")
        setStarted(false)
        setIsCompleted(true)
        playsound()
        onDone()
        return clearTimer()
    }

    const clearTimer = () => {
        console.log(`clearing timer id: ${timerIDRef.current}`)
        
        clearInterval(timerIDRef.current)
        setTimerID(null)
        
        // setTimeLeft(new Date())
    }

    const updateTimer = (timeInSeconds: number) => {
        const now = new Date()
        const interval: Interval = {start: now, end: addSeconds(now, timeInSeconds)};
        const duration = intervalToDuration(interval);
        console.log(duration);
        setTimeLeft(duration)
    }


    return (
      <View {...rest}>

        {/* Timer */}
        <Text style={tailwind("text-white text-xl text-center pb-2")}>
            Duration: {timeLeft.minutes?.toLocaleString("en-US", {minimumIntegerDigits: 2})}:{timeLeft.seconds?.toLocaleString("en-US", {minimumIntegerDigits: 2})}
        </Text>
        {/* Horizontal Exercise Duration Picker */}
        {!started && // Hide after starting
        <View style={tailwind("mt-2 mb-4")}>
            <View style={[tailwind("opacity-50 p-2 bg-white absolute top-0 bottom-0"), {width: ITEM_WIDTH, left: width/2 - ITEM_WIDTH/2, right: 0 }]}></View>
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
        }
        
        {/* </View> */}
        <View style={tailwind("pt-2 mx-8")}>
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
                setStarted(false)
                setIsCompleted(true)
                updateTimer(time)
                clearTimer()
            }} >
            <Text style={tailwind("text-white text-center")}>
            Skip
            </Text>
        </TouchableOpacity>)}
        </View>
      </View>
    )
  }