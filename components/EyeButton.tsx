import React, { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import {Image, Pressable, Text, View} from 'react-native'
import { TouchableOpacity } from 'react-native'
import tailwind from 'tailwind-rn'
import LottieView from 'lottie-react-native'
import { cancelAllNotifications, scheduleNotification } from '../util/notifications'

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

    return (
        <View style={tailwind("absolute")}>
            <Pressable onPress={() => toggleEye()} 
            onPressIn={() => setButtonStyle(PRESSED_EYE_STYLE)} 
            onPressOut={() => setButtonStyle(DEFAULT_EYE_STYLE)} >
                <Image 
                    style={{width: buttonStyle}}
                    resizeMode="contain"
                    source={eyeOpen ? require(OPEN_EYE_PATH) : require(CLOSE_EYE_PATH)}/>
            </Pressable>
        </View>
    )
}
