import {Platform} from 'react-native'
import * as Device from 'expo-device'
import AsyncStorage from '@react-native-async-storage/async-storage';

// export let getDefaultIconSize() = isPad ? 36 : 28

export function getDefaultIconSize(){
    if (getDeviceType() == Device.DeviceType.TABLET){
        return 36
    } else {
        return 28
    }
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