import React, { useEffect, useState } from 'react'
import { Linking, TouchableOpacity, Text, View, Image, Dimensions, ScrollView, Touchable } from 'react-native'
import {SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { exercises } from '../constants/exercises'

const screenWidth = Dimensions.get("window").width

const widthBreakpoint = 768
// Not currently used
export default function ExerciseScreen({route, navigation}: any) {
    const {exercise} = route.params
    const [exerciseIdx, setExerciseIdx] = useState(0)
    // const exercise = exercises[exerciseIdx]
    const {width, height} = Image.resolveAssetSource(exercise.images[0])
    
    const [thumbnail, setThumbnail] = useState("")

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


    const getThumbnail = async (videoLink: string) => {
        console.log("getitng thumbnail for link:", videoLink)
        
        const {uri } = await VideoThumbnails.getThumbnailAsync(decodeURI(videoLink), {
            time: 3000
        })
        console.log("uri", uri)
        // setThumbnail(uri)
    }

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

    const cycleExercise = () => {
        if (exerciseIdx + 1 >= exercises.length){
            setExerciseIdx(0)
        } else {
            setExerciseIdx(exerciseIdx + 1)
        }
    }

    return (
        <>
            <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
            <SafeAreaView style={tailwind("flex-1 items-center")}>
            
                <ScrollView horizontal={false}
                    style={tailwind("mt-8")}
                    contentContainerStyle={[tailwind("items-center justify-center px-4"), {maxWidth: screenWidth}]}>
                    <Text style={tailwind("text-center text-4xl text-white")}>{exercise.name}</Text>
                    <Text style={tailwind("text-center text-white opacity-70 pb-4")}>Approx. duration: {exercise.approximateDuration < 60 ? `${exercise.approximateDuration} seconds` : `${exercise.approximateDuration/60} ${exercise.approximateDuration/60 > 1 ? "minutes": "minute"}`} </Text>
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

                        {/* <TouchableOpacity onPress={() => {
                            cycleExercise()
                        }} style={tailwind("p-2 border border-white w-full ")}>
                            <Text style={tailwind("text-white text-center")}>
                            Cycle
                            </Text>
                        </TouchableOpacity> */}
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
