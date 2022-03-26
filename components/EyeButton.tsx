import React, { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import {Image, Pressable, Text, View} from 'react-native'
import { TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import LottieView from 'lottie-react-native'
import { cancelAllNotifications, scheduleNotification } from '../util/notifications'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'
import Svg, {Circle, Ellipse, Path} from 'react-native-svg';
import {WebView} from 'react-native-webview'
import Eye from './Eye'

const ASSET_PATH = `../assets`
const OPEN_EYE_PATH = `${ASSET_PATH}/open-eye-white.png`
const CLOSE_EYE_PATH = `${ASSET_PATH}/close-eye-white.png`
const ANIMATED_EYE_PATH = `${ASSET_PATH}/animated-eye.gif`
const DEFAULT_EYE_STYLE = 300
const PRESSED_EYE_STYLE = 325
export default function EyeButton({eyeOpen, toggleEye}: any) {

    const [buttonStyle, setButtonStyle] = useState(DEFAULT_EYE_STYLE)

    useEffect(() => {
        
    }, [eyeOpen])

    const size = useSharedValue(100)
    const style = useAnimatedStyle(() => {
        return {
            width: withTiming(size.value)
        }
    })

    return (
        <View style={tailwind("absolute")}>
            <Pressable onPress={() => toggleEye()} 
            // onPressIn={() => setButtonStyle(PRESSED_EYE_STYLE)} 
            // onPressOut={() => setButtonStyle(DEFAULT_EYE_STYLE)} 
            >
                {/* <Image 
                    style={{width: buttonStyle}}
                    resizeMode="contain"
                    source={eyeOpen ? require(OPEN_EYE_PATH) : require(CLOSE_EYE_PATH)}/> */}
                <Animated.View/>
                {/* <WebView
                    scalesPageToFit={false}
                    originWhitelist={["*"]}
                    domStorageEnabled={true} */}
                
                <Svg height="200px" width="200px" viewBox="0 0 300 300">
                    {/* <Path d="m0,0q140,190 280,0" stroke="white" strokeWidth={5}/>
                    <Path d="m0,0q140,190 280,0" stroke="white" strokeWidth={5}/> */}
                    {/* <Path d="m5,5 L100,5 L100,100 L0,100, L0,5" stroke="white" strokeWidth={5}/> */}
                    <Path d="m5,5 h100 v100, h-100 z" stroke="white" strokeWidth={5}/> 

                    {/* <Path d="m0,0q140,150 300,0" stroke="white" strokeWidth={5} /> */}
                    {/* <Ellipse cx="50%" cy="50%" rx="100" ry="50" stroke="white" strokeWidth="5" fill="none"/> */}
                    {/* <Circle cx="50%" cy="50%" r="45" stroke="white" strokeWidth="2.5" fill="none"/> */}
                </Svg>
            </Pressable>
        </View>
    )
}
