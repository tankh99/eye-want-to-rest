import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { adUnitId } from '../constants/globals'

interface P {
  children: any
}

export default function BackgroundGradient({children}: P) {
  return (
    <>
      <LinearGradient
      colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
      style={tw`flex-1 absolute top-0 w-full h-full`}/>
      <SafeAreaView style={tw`flex-1`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            {children}
          </>
        </TouchableWithoutFeedback>

        <View style={tw`mt-4`}>
          <BannerAd unitId={adUnitId} 
            requestOptions={{requestNonPersonalizedAdsOnly: true}}
            size={BannerAdSize.FLUID}/>
        </View>
      </SafeAreaView>
    </>
  )
}
