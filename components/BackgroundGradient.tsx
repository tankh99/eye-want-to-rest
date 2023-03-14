import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'

interface P {
  children: any
}

export default function BackgroundGradient({children}: P) {
  return (
    <>
    <LinearGradient
    colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
    style={tw`flex-1 absolute top-0 w-full h-full`}/>
      <SafeAreaView style={tw`flex-1 pb-8 pt-4`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {children}
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  )
}
