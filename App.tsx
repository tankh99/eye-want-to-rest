import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import tailwind from 'tailwind-rn';
import * as Notifications from 'expo-notifications'
import EyeButton from './components/EyeButton';
import Timer from './components/Timer'
import React, { useEffect, useRef, useState } from 'react';
import {LinearGradient} from 'expo-linear-gradient'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {NavigationContainer} from '@react-navigation/native'
import MainNavigator from './MainNavigator';


export default function App() {

  useEffect(() => {
    
    const askForPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync()
      console.log(settings)
      if(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return console.log("Granted")
      const status: Notifications.NotificationPermissionsStatus = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowCriticalAlerts: true,
          allowProvisional: true
        }
      })

      alert("HE")
      if(status.granted){
        console.log("yay")
      } else {
        console.log("boo")
      }
      
    }
    askForPermissions()
    // Allows notification to show up in foreground
    Notifications.setNotificationHandler({
      handleNotification: async() => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
      })
    })
  }, [])

  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <LinearGradient
            colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
            style={tailwind("flex-1 absolute top-0 ")}/>
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
