import { StatusBar } from 'expo-status-bar';
import { AppState, Button, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import * as Notifications from 'expo-notifications'
import EyeButton from './components/EyeButton';
import Timer from './components/Timer'
import React, { useEffect, useRef, useState } from 'react';
import {LinearGradient} from 'expo-linear-gradient'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import MainNavigator from './MainNavigator';
import {Audio} from 'expo-av'
import * as Sentry from 'sentry-expo'
import { getDeviceType } from './constants/globals';
import { MaxAdContentRating, MobileAds } from 'react-native-google-mobile-ads';


// Sentry.init({
//   dsn: "https://4dbc82d3aff846c2a4f48a2bd8dd0d94@o1229881.ingest.sentry.io/6376215",
//   enableInExpoDevelopment: true,
//   // TODO: Set debug to false in production mode
//   debug: true // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

MobileAds().setRequestConfiguration({
  maxAdContentRating: MaxAdContentRating.PG,
  tagForUnderAgeOfConsent: true
}).then(() => {
  console.log("successfully setup config")
})

export default function App() {

  const appState = useRef(AppState.currentState)
  useEffect(() => {
    
    setupDefaults()
    askForPermissions()
  }, [])

  const askForPermissions = async () => {
    const settings = await Notifications.getPermissionsAsync()
    // console.log(settings)
    if(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return console.log("Granted")
      try{
        const status: Notifications.NotificationPermissionsStatus = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowCriticalAlerts: true
          }
        })

        if(status.granted){
          console.log("permissions granted")
        } else {
          console.log("permissions not granted")
        }
      } catch (ex) {
        console.error("Exception occurred when requesting for permissions", ex);
      }
  }

  // const handleAppStateChange = (nextAppState: any) => {
  //   if(appState.current.match(/inactive|background/) && nextAppState == "active"){
  //     console.log("application is now in foreground")
  //   }
  //   appState.current = nextAppState
  // }
  
  // Sets up notification handler config and audio config
  const setupDefaults =  async () => {

    // Allows notification to show up in foreground
    Notifications.setNotificationHandler({
      handleNotification: async() => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
      })
    })

    await Audio.setAudioModeAsync({
      // staysActiveInBackground: true,
      // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, // Means that it interrupts ongoing audio
      // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false, // THIS REDUCES VOLUME OF ALL SOUNDS if SET TO TRUE!!
      // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      // playsInSilentModeIOS: true,
    })
  }

  

  return (
    <SafeAreaProvider>
          <LinearGradient
          colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
          style={tw`flex-1 absolute top-0 w-full h-full`}/>
            
          <NavigationContainer>
            <MainNavigator/>
        </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
