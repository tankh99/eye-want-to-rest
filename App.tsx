import { getAllScheduledNotificationsAsync } from 'expo-notifications';
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


    // Allows notification to show up in foreground
    Notifications.setNotificationHandler({
      handleNotification: async() => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
      })
    })

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
