import React, { useEffect, useState } from 'react'
import { Linking, TouchableOpacity, Text, View, Button, Image, Dimensions, ScrollView, Modal, Touchable } from 'react-native'
import {SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import * as WebBrowser from 'expo-web-browser';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { exercises } from '../constants/exercises'
import DateTimePicker from '@react-native-community/datetimepicker'
import {Picker} from '@react-native-picker/picker'
// import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import HorizontalPicker from 'react-native-picker-horizontal'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'

const screenWidth = Dimensions.get("window").width

const widthBreakpoint = 768

const dummySecData = [0, 10, 20,30,40,50]
const dummyMinData = [0,1,2,3,4,5]
// Not currently used
export default function ExerciseScreen({route, navigation}: any) {
    const {exercise} = route.params
    const [exerciseIdx, setExerciseIdx] = useState(0)
    // const exercise = exercises[exerciseIdx]
    const {width, height} = Image.resolveAssetSource(exercise.images[0])
    
    const [exerciseDuration, setExerciseDuration] = useState(exercise.approximateDuration)
    const [exerciseDurationSuffix, setExerciseDurationSuffix] = useState("sec")

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

    const [show, setShow] = useState(false)

    const [value, setValue]: any = useState(new Date())
    useState()

    const onChange = (value: any) => {
        setValue(value)
    }
    
    const openPicker = () => {
        setShow(!show)
    }

    const updateDuration = (time: number) => {
        const newDuration = exerciseDuration + time;
        if (exerciseDuration % 60 > 0) {
            setExerciseDurationSuffix("min")
        } else {
            setExerciseDurationSuffix("sec")
        }
        // setExerciseDuration(newDuration + )
    }

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

                    </ScrollView>
                    <Button onPress={openPicker} title="Adjust Duration"/>
                    {/* <View style={tailwind("flex flex-row items-center justify-center my-4")}>
                        <TouchableOpacity>
                            <AntDesign name="minus" color="white" size={24}/>
                        </TouchableOpacity>
                        <View style={tailwind("p-2 border border-white px-8 mx-2")}>
                            <Text style={tailwind("text-white")}>{exerciseDuration}</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="ios-add" color="white" size={24}/>
                        </TouchableOpacity>
                    </View> */}
                    <Modal
                        animationType='slide'
                        onRequestClose={() => setShow(false)}
                        transparent
                        visible={show}>
                            <View style={[tailwind("absolute top-1/2 left-1/2 bg-black"),{ width: 200, height: 400,
                            transform: [
                                {translateX: -screenWidth/1}
                            ]}]}>
                                <Text style={tailwind("text-white")}>HELLO</Text>
                            </View>
                    </Modal>
                    {/* {show &&
                        <View style={[tailwind("flex-row items-center mx-8"), {height:150}]}>
                            <View style={[tailwind("flex-1"), {}]}>
                                <Picker selectedValue={value}
                                itemStyle={[tailwind("text-white"), {}]}
                                prompt="Exercise Duration" // for Android only
                                onValueChange={(value, index) => onChange(value)}>
                                    {dummyMinData.map((value: any, index) => {
                                        return <Picker.Item key={index} style={{}} label={value.toString()} value={value}/>
                                    })}
                                </Picker>
                            </View>
                            <Text style={tailwind("text-white")}>min</Text>
                            <View style={[tailwind("flex-1"), {}]}>
                                <Picker selectedValue={value}
                                itemStyle={[tailwind("text-white"), {}]}
                                prompt="Exercise Duration" // for Android only
                                onValueChange={(value, index) => onChange(value)}>
                                    {dummySecData.map((value: any, index) => {
                                        console.log(value)
                                        return <Picker.Item key={index} style={{}} label={value.toString()} value={value}/>
                                    })}
                                </Picker>
                                
                            </View>
                            <Text style={tailwind("text-white")}>sec</Text>
                        </View>
                    } */}
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
            </SafeAreaView>
        </>
    )
}
