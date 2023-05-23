import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {Image, Pressable, Text, View, Platform} from 'react-native'
import { TouchableOpacity } from 'react-native'
import tw from 'twrnc'
import openEye from "../assets/open-eye-white.png"
import closedEye from "../assets/close-eye-white.png"

const ASSET_PATH = `../assets`
const OPEN_EYE_PATH = `${ASSET_PATH}/open-eye-white.png`
const CLOSE_EYE_PATH = `${ASSET_PATH}/close-eye-white.png`
const ANIMATED_EYE_PATH = `${ASSET_PATH}/animated-eye.gif`

const DEFAULT_EYE_STYLE = 100 // tablet: 150
const PRESSED_EYE_STYLE = 125 // tablet: 175

interface P {
    eyeOpen: boolean,
    toggleEye: any
}

export default function EyeButton({eyeOpen, toggleEye}: P) {

    const toggleEyeCallback = useCallback(() => toggleEye(), [eyeOpen, toggleEye])
    const [buttonStyle, setButtonStyle] = useState(DEFAULT_EYE_STYLE)
    // const openEye = useMemo(() => require(`${ASSET_PATH}/open-eye-white.png`), []);
    // const closedEye = useMemo(() => require(`${ASSET_PATH}/close-eye-white.png`), [])
    
    return (
        <View style={tw`flex w-full px-6 items-center max-w-screen-md`}>
            <TouchableOpacity
                activeOpacity={1} // A workaround alternative for TouchableWithoutFeedback because it for some reason doesn't properly fire on Android
                style={[{
                    height: PRESSED_EYE_STYLE
                }]}
                
                onPress={() => {
                    toggleEyeCallback()
                }}
                onPressIn={() => {
                    setButtonStyle(PRESSED_EYE_STYLE)
                }} 
                onPressOut={() => {
                    setButtonStyle(DEFAULT_EYE_STYLE)
                }} 
            >
                <Image
                    style={[{width: buttonStyle, height:buttonStyle}]}
                    resizeMode="contain"
                    source={eyeOpen ? openEye : closedEye}/>

                
                {/* <WebView
                    scalesPageToFit={false}
                    originWhitelist={["*"]}
                    domStorageEnabled={true} */}
                
                {/* <Svg height="200px" width="200px" viewBox="0 0 300 300">
                    <Path d="m0,0q140,190 280,0" stroke="white" strokeWidth={5}/>
                    <Path d="m0,0q140,190 280,0" stroke="white" strokeWidth={5}/>
                    <Path d="m5,5 L100,5 L100,100 L0,100, L0,5" stroke="white" strokeWidth={5}/>
                    <Path d="m5,5 h100 v100, h-100 z" stroke="white" strokeWidth={5}/> 

                    <Path d="m0,0q140,150 300,0" stroke="white" strokeWidth={5} />
                    <Ellipse cx="50%" cy="50%" rx="100" ry="50" stroke="white" strokeWidth="5" fill="none"/>
                    <Circle cx="50%" cy="50%" r="45" stroke="white" strokeWidth="2.5" fill="none"/>
                </Svg> */}
            </TouchableOpacity>
        </View>
    )
}
