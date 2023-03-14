import {Platform} from 'react-native'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestIds } from "react-native-google-mobile-ads";

const IOS_BANNER_ID="ca-app-pub-4743735900113393/8504467556"
const ANDROID_BANNER_ID="ca-app-pub-4743735900113393/9885344286"
export const SESSION_DURATION_KEY = "@default-session-duration"


// export const adUnitId = IOS_BANNER_ID
export const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === "ios" 
        ? IOS_BANNER_ID
        : ANDROID_BANNER_ID

export const DEFAULT_SESSION_DURATION: Duration = {
    hours: 0,
    minutes: 0,
    seconds: 5
}

export function getDefaultIconSize(){
    // if (getDeviceType() == Device.DeviceType.TABLET){
    //     return 36
    // } else {
    //     return 28
    // }
    return 28
}


export function getDeviceType(): any{
    let deviceType = AsyncStorage.getItem("@deviceType");
    if (!deviceType){
        Device.getDeviceTypeAsync()
        .then(deviceType => {  
            AsyncStorage.setItem("@deviceType", deviceType.toString())
        })
    } 

    return deviceType
}