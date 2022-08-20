import React, { useEffect, useRef, useState } from 'react'
import { Linking, TouchableOpacity, Text, View, Button, Image, Dimensions, ScrollView, Modal, Touchable } from 'react-native'
import {SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { exercises } from '../constants/exercises'
import DateTimePicker from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker'
// import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import HorizontalPicker from 'react-native-picker-horizontal'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import EyeExerciseTimer from '../components/EyeExerciseTimer'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'

const screenWidth = Dimensions.get("window").width

const widthBreakpoint = 768

const dummySecData = [0, 10, 20,30,40,50]
const dummyMinData = [0,1,2,3,4,5]
// Not currently used
export default function ExerciseScreen({route, navigation}: any) {
    const {exercise} = route.params
    // const exercise = exercises[exerciseIdx]
    const {width, height} = Image.resolveAssetSource(exercise.images[0])
    const [isCompleted, setIsCompleted] = useState(false)
    const [exerciseDurationSuffix, setExerciseDurationSuffix] = useState("sec")
    const [showExerciseTimer, setShowExerciseTimer] = useState(false)
    const [modalEntryText, setModalEntryText] = useState("Start Exercise")

    const [imageHeight, setImageHeight] = useState(height)
    const [imageWidth, setImageWidth] = useState(width)
    useEffect(() => {
        console.log("width", width, "height", height)
        // console.log("width", Image.resolveAssetSource(exercise.images[0]).width)
        // console.log("height", Image.resolveAssetSource(exercise.images[0]).height)

        // 600 is an arbitrary breakpoint
        const newWidth = screenWidth > widthBreakpoint ? widthBreakpoint : screenWidth - 24
        const percDecrease = newWidth / width;
        const newHeight = Math.floor(height * percDecrease)
        setImageWidth(newWidth)
        setImageHeight(newHeight)
        console.log("new width", newWidth, "new height", newHeight);
    }, [])

    const openBrowser = async (link: string) => {
        // Close previous browsers before moving on
        try {
            await WebBrowser.dismissBrowser()
            console.info("Browser session dismissed")
        } catch (ex){
            console.log("Brower session doesn't already exist", ex)

        }

        try {
            console.log("Opening link", link)
            await WebBrowser.openBrowserAsync(link)
        } catch (ex) {
            console.error("Error opening browser", ex)
        }
    }

    const CLOSED_SLIDE_HEIGHT = 75
    const OPEN_SLIDE_HEIGHT = 150
    const slideValue = useSharedValue(CLOSED_SLIDE_HEIGHT)
    const slideStyle = useAnimatedStyle(() => {
        return {
            height: withSpring(slideValue.value, {
                stiffness: 90,
                damping: 100
            })
        }
    })

    const openSlide = () => {
        setModalEntryText("Close")  // Open
        slideValue.value = OPEN_SLIDE_HEIGHT + 100;
    }

    const closeSlide = () => {
        setModalEntryText("Open Exercise Timer")  // Open
        slideValue.value = CLOSED_SLIDE_HEIGHT;
        // else slideValue.value = OPEN_SLIDE_HEIGHT + 100
    }



    const exerciseDefaultDuration = exercise.durationRange[exercise.defaultDurationIndex]
    return (
        <>
            <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
            <SafeAreaView style={tailwind("flex-1")}>
            {/* <Text style={tailwind("text-white")} >Duration: {value}</Text> */}
            
                <ScrollView horizontal={false}
                    style={tailwind("mt-8")}
                    contentContainerStyle={[tailwind("items-center justify-center px-4"), {maxWidth: screenWidth}]}>
                    <Text style={tailwind("text-center text-4xl text-white")}>{exercise.name}</Text>
                    <Text style={tailwind("text-center text-white opacity-70 pb-4")}>Approx. duration: {exerciseDefaultDuration < 60 ? `${exerciseDefaultDuration} seconds` : `${exerciseDefaultDuration/60} ${exerciseDefaultDuration/60 > 1 ? "minutes": "minute"}`} </Text>
                        {/* Image */}
                        <View style={tailwind("relative mx-6")}>
                            <Image source={exercise.images[0]} resizeMode="contain" 
                                style={[tailwind(""), {height: imageHeight, width:imageWidth}]}/>
                            <TouchableOpacity
                                style={tailwind("text-white opacity-70")}
                                onPress={() => {
                                    openBrowser(exercise.credit)
                                }}>
                                <Text style={tailwind("text-center underline text-white opacity-70 mt-2 mb-4")}>
                                    Image Credit
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* {exercise && exercise.images.map((image: any, index: number) => (
                            <Image key={index} source={(image)} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/>
                        ))} */}
                        {/* <Text style={tailwind("text-center text-white pb-2 leading-8")}>{exercise.description.trim()}</Text> */}
                        <View style={tailwind("flex-col mb-4")}>
                        {exercise.steps && exercise.steps.map((step: string, index: number) => (
                            <View key={index} style={tailwind("flex-row flex-wrap")}>
                                {/* <Text style={tailwind("flex flex-wrap text-left text-white")}>{index + 1}. </Text> */}
                                <Text style={tailwind("flex flex-wrap w-full text-left text-white pb-2")}>
                                    {step}
                                </Text>
                            </View>
                        ))}
                        
                        </View>


                        <TouchableOpacity
                            style={tailwind("mb-6 self-start")}
                            onPress={async () => {
                                openBrowser(exercise.reference)
                            }}>
                            <Text style={tailwind("text-white underline")}>
                                Reference
                            </Text>
                        </TouchableOpacity>
                        {isCompleted &&
                            <TouchableOpacity style={tailwind("p-2 border border-white w-full ")}
                            onPress={() => {
                                navigation.navigate("Main")
                            }} >
                                <Text style={tailwind("text-white text-center")}>
                                Done
                                </Text>
                            </TouchableOpacity>
                        }
                </ScrollView>
                
                
            </SafeAreaView>
            {/* Outside safeareaview because it interferes with how it appears and animates */}
            <Animated.View
                style={[
                    {
                        backgroundColor: "#222",
                        height: OPEN_SLIDE_HEIGHT,
                        width: '100%',
                        
                    },
                    slideStyle,
                    tailwind("")
                ]}>

                <TouchableOpacity
                    style={[tailwind("justify-center items-center"), {height: CLOSED_SLIDE_HEIGHT}]}
                    onPress={() => {
                        const closed = slideValue.value <= OPEN_SLIDE_HEIGHT;
                        const open = slideValue.value > CLOSED_SLIDE_HEIGHT
                        if(open) closeSlide()
                        else openSlide()
                        // console.log(slideValue.value, height)
                        // if(slideValue.value >= OPEN_SLIDE_HEIGHT) slideValue.value = CLOSED_SLIDE_HEIGHT;
                        // else slideValue.value = OPEN_SLIDE_HEIGHT + 100
                    }}>
                    <View style={[tailwind("flex w-full px-4 flex-row justify-center")]}>
                        
                        {/* <Entypo name="cross" size={24} color="transparent" /> */}
                        <Text style={[tailwind("text-white text-center text-lg font-bold self-center ")]}>{modalEntryText}</Text>
                        
                        {/* <Text style={[tailwind("text-white text-lg self-end font-bold")]}>
                            {slideValue.value <= OPEN_SLIDE_HEIGHT 
                                ? <FontAwesome name="caret-up" size={24} color="white" />
                                : <Entypo name="cross" size={24} color="white" />
                            } 
                            
                        </Text> */}
                    </View>
                </TouchableOpacity>

                <EyeExerciseTimer exerciseDefaultDurationIndex={exercise.defaultDurationIndex} 
                    navigation={navigation}
                    onDone={() => {
                        setIsCompleted(true);
                        closeSlide()
                    }}
                    exerciseDurationRange={exercise.durationRange} style={tailwind("py-2 border-white")} />
            </Animated.View>

        </>
    )
}
