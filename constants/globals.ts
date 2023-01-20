import {Platform} from 'react-native'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestIds } from "react-native-google-mobile-ads";

export const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === "ios" 
        ? process.env.REACT_APP_IOS_BANNER_ID!
        : process.env.REACT_APP_ANDROID_BANNER_ID!

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