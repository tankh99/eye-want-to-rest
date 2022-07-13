import React from 'react'
import { View } from 'react-native'
import {SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'

// Not currently used
export default function ExerciseScreen({navigation}: any) {
    
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
            </SafeAreaView>
        </>
    )
}
