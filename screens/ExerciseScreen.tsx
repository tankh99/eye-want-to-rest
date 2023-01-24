import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Text, View, Image, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import EyeExerciseTimer from '../components/EyeExerciseTimer'
import { formatDurationToString, formatSecondsToDuration } from '../util/time'
import { adUnitId, getDefaultIconSize } from '../constants/globals'
import { getExercisePreference } from '../util/sqlite'
import { Exercise } from '../constants/exercises'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'

const screenWidth = Dimensions.get("window").width

const widthBreakpoint = 768

const CLOSED_SLIDE_HEIGHT = 75
const OPEN_SLIDE_HEIGHT = 100

// Not currently used
const DEFAULT_MODAL_TITLE = `Open Exercise Timer`
export default function ExerciseScreen({route, navigation}: any) {
    const {exercise} = route.params
    // const exercise = exercises[exerciseIdx]
    const {width, height} = Image.resolveAssetSource(exercise.images[0])
    const [isCompleted, setIsCompleted] = useState(false)
    const [modalTitle, setModalTitle]: any = useState(DEFAULT_MODAL_TITLE)
    const [modalOpen, setModalOpen] = useState(false)

    const [imageHeight, setImageHeight] = useState(height)
    const [imageWidth, setImageWidth] = useState(width)

    const [defaultExderciseDurationIndex, setDefaultExerciseDurationIndex] = useState(-1);

    useEffect(() => {
        const newWidth = screenWidth > widthBreakpoint ? widthBreakpoint : screenWidth - 24
        const percDecrease = newWidth / width;
        const newHeight = Math.floor(height * percDecrease)
        setImageWidth(newWidth)
        setImageHeight(newHeight)

        const getPreferences = async () => {
            getExercisePreference(exercise.id)
            .then((pref: any) => {
                if (!pref) {
                    setDefaultExerciseDurationIndex(exercise.defaultDurationIndex)
                    return;
                }
                console.log(pref.defaultIndex)
                setDefaultExerciseDurationIndex(pref.defaultIndex);
            }).catch((err) => {
                console.error(err)
            })
        }
        getPreferences();
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
        setModalOpen(true)
        // setModalTitle(<AntDesign name="caretdown" size={24} color="white" />)  // Open
        slideValue.value = OPEN_SLIDE_HEIGHT + 100;
    }

    const closeSlide = () => {
        setModalOpen(false)
        // setModalTitle("Open Exercise Timer")  // Open
        slideValue.value = CLOSED_SLIDE_HEIGHT;
        // else slideValue.value = OPEN_SLIDE_HEIGHT + 100
    }


    
    const exerciseDefaultDuration = exercise.durationRange[exercise.defaultDurationIndex]
    return (
        <>
        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tw`flex-1 absolute top-0 w-full h-full`}/>
        
            
            <SafeAreaView style={tw`flex-1 mt-8`} >
            {/* <Text style={tw("text-white")} >Duration: {value}</Text> */}
            <View style={tw`mt-4`}>
                <BannerAd unitId={adUnitId} size={BannerAdSize.FLUID}/>
            </View>
                <View style={tw`flex items-center justify-between flex-row px-4`}>
                    <TouchableOpacity 
                        style={tw``} 
                        onPress={() => {
                            navigation.goBack()
                        }}>
                        <Ionicons name="arrow-back" size={getDefaultIconSize()} color="white"  />
                    </TouchableOpacity>
                    <View>
                    <Text style={tw`text-white text-center text-4xl flex justify-center mx-4`}>{exercise.name}</Text>
                    <Text style={tw`text-center text-white opacity-70`}>Approx. duration: {exerciseDefaultDuration < 60 ? `${exerciseDefaultDuration} seconds` : `${exerciseDefaultDuration/60} ${exerciseDefaultDuration/60 > 1 ? "minutes": "minute"}`} </Text>
                    </View>
                    <Ionicons name="arrow-back" size={getDefaultIconSize()} style={tw``} color="transparent"  />
                </View>
                <ScrollView horizontal={false}
                    style={tw`mt-8`}
                    contentContainerStyle={[tw`items-center justify-center px-4`, {maxWidth: screenWidth}]}>
                    <TouchableOpacity style={[tw`mx-6`,{flex: 1}]} activeOpacity={1} onPress={() => closeSlide()}>
                    {/* <Text style={tw("text-center text-4xl text-white")}>{exercise.name}</Text> */}
                        {/* Image */}
                        <View style={tw``}>
                            <Image source={exercise.images[0]} resizeMode="contain" 
                                style={[tw``, {height: imageHeight, width:imageWidth}]}/>
                            <TouchableOpacity
                                style={tw`text-white opacity-70`}
                                onPress={() => {
                                    openBrowser(exercise.credit)
                                }}>
                                <Text style={tw`text-center underline text-white opacity-70 mt-2 mb-4`}>
                                    Image Credit
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* {exercise && exercise.images.map((image: any, index: number) => (
                            <Image key={index} source={(image)} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/>
                        ))} */}
                        {/* <Text style={tw("text-center text-white pb-2 leading-8")}>{exercise.description.trim()}</Text> */}
                        <View style={tw`flex-col mb-4`}>
                        {exercise.steps && exercise.steps.map((step: string, index: number) => (
                            <View key={index} style={tw`flex-row flex-wrap`}>
                                {/* <Text style={tw("flex flex-wrap text-left text-white")}>{index + 1}. </Text> */}
                                <Text style={tw`flex flex-wrap w-full text-left text-white pb-2`}>
                                    {step}
                                </Text>
                            </View>
                        ))}
                        
                        </View>


                        <TouchableOpacity
                            style={tw`mb-6 self-start`}
                            onPress={async () => {
                                openBrowser(exercise.reference)
                            }}>
                            <Text style={tw`text-white underline`}>
                                Reference
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
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
                    tw``
                ]}>
                <TouchableOpacity // Opens up the exercise timer
                    style={[tw`justify-center items-center`, {height: CLOSED_SLIDE_HEIGHT}]}
                    onPress={() => {
                        if(!isCompleted){
                            if(modalOpen) closeSlide()
                            else openSlide()
    
                            const exerciseDurationInSeconds = exercise.durationRange[exercise.defaultDurationIndex];
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

                {defaultExderciseDurationIndex != -1 &&
                    <EyeExerciseTimer 
                        exerciseId={exercise.id}
                        exerciseDefaultDurationIndex={defaultExderciseDurationIndex} 
                        navigation={navigation}
                        isOpen={modalOpen}
                        setModalTitle={setModalTitle}
                        setIsCompleted={setIsCompleted}
                        closeSlide={closeSlide}
                        exerciseDurationRange={exercise.durationRange} 
                        style={tw``} />
                }

            </Animated.View>
        </>
    )
}
