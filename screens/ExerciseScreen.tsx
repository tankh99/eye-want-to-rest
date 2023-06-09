import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Text, View, Image, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { LinearGradient } from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser'
import EyeExerciseTimer from '../components/EyeExerciseTimer'
import { adUnitId } from '../constants/globals'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import Navbar from '../components/Navbar'

const screenWidth = Dimensions.get("window").width

const widthBreakpoint = 768

export default function ExerciseScreen({route, navigation}: any) {
    const {exercise} = route.params
    // const exercise = exercises[exerciseIdx]
    const {width, height} = Image.resolveAssetSource(exercise.images[0])

    const [imageHeight, setImageHeight] = useState(height)
    const [imageWidth, setImageWidth] = useState(width)

    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const newWidth = screenWidth > widthBreakpoint ? widthBreakpoint : screenWidth - 24
        const percDecrease = newWidth / width;
        const newHeight = Math.floor(height * percDecrease)
        setImageWidth(newWidth)
        setImageHeight(newHeight)

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

    
    const openSlide = () => {
        setModalOpen(true)
    }

    const closeSlide = () => {
        setModalOpen(false)
    }

    const exerciseDefaultDuration = exercise.durationRange[exercise.defaultDurationIndex]
    return (
        <>
        <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tw`flex-1 absolute top-0 w-full h-full text-base`}/>
        
            
            <SafeAreaView style={tw`flex-1 `} >
            {/* <Text style={tw("text-white")} >Duration: {value}</Text> */}
            <View style={tw``}>
                <BannerAd unitId={adUnitId} size={BannerAdSize.FLUID}/>
            </View>
                <View style={tw`flex items-center justify-between flex-row px-4 mt-4`}>
                    
                    <Navbar navigation={navigation}>
                        <Text style={tw`text-white text-center text-4xl flex justify-center mx-4`}>{exercise.name}</Text>
                        <Text style={tw`text-center text-white opacity-70`}>Approx. duration: {exerciseDefaultDuration < 60 ? `${exerciseDefaultDuration} seconds` : `${exerciseDefaultDuration/60} ${exerciseDefaultDuration/60 > 1 ? "minutes": "minute"}`} </Text>
                    </Navbar>
                </View>
                <ScrollView horizontal={false}
                    style={tw`mt-8`}
                    contentContainerStyle={[tw`items-center justify-center px-4`, {maxWidth: screenWidth}]}>
                    <TouchableOpacity style={[tw`mx-6`,{flex: 1}]} activeOpacity={1} onPress={() => closeSlide()}>
                    {/* <Text style={tw("text-center text-4xl text-white")}>{exercise.name}</Text> */}
                        {/* Image */}
                        <View style={tw`mb-4`}>
                            <Image source={exercise.images[0]} resizeMode="contain" 
                                style={[tw``, {height: imageHeight, width:imageWidth}]}/>
                        </View>
                        {/* {exercise && exercise.images.map((image: any, index: number) => (
                            <Image key={index} source={(image)} resizeMode="contain" style={{height: 300, aspectRatio: 1}}/>
                        ))} */}
                        {/* <Text style={tw("text-center text-white pb-2 leading-8")}>{exercise.description.trim()}</Text> */}
                        <View style={tw`flex-col mb-4 px-4`}>
                        {exercise.steps && exercise.steps.map((step: string, index: number) => (
                            <View key={index} style={tw`flex-row flex-wrap`}>
                                {/* <Text style={tw("flex flex-wrap text-left text-white")}>{index + 1}. </Text> */}
                                <Text style={tw`flex flex-wrap w-full text-left text-base text-white pb-2`}>
                                    {step}
                                </Text>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={tw`mb-6 self-start`}
                            onPress={async () => {
                                openBrowser(exercise.reference)
                            }}>
                            <Text style={tw`text-white text-sm opacity-70 underline`}>
                                Reference
                            </Text>
                        </TouchableOpacity>
                        
                        </View>

                        {/* <TouchableOpacity
                            style={tw`text-white opacity-70`}
                            onPress={() => {
                                openBrowser(exercise.credit)
                            }}>
                            <Text style={tw`underline text-white opacity-70`}>
                                Credit
                            </Text>
                        </TouchableOpacity> */}
                    </TouchableOpacity>
                </ScrollView>
                
            </SafeAreaView>

            
                

            {/* {defaultExerciseDurationIndex != -1 && */}
            <EyeExerciseTimer 
                onOpen={openSlide}
                onClose={closeSlide}
                exercise={exercise}
                navigation={navigation}
                exerciseDurationRange={exercise.durationRange}
                style={tw``} 
                isOpen={modalOpen} />
            {/* } */}

        </>
    )
}
