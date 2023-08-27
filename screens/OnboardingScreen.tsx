import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useRef } from 'react'
import { View, Text, Image, useWindowDimensions, TouchableOpacity } from 'react-native'
import { ONBOARDED_KEY } from '../constants/globals'
import ViewPager from 'react-native-pager-view'
import MyButton from '../components/MyButton'
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import BackgroundGradient from '../components/BackgroundGradient'

const ONBOARDING_ROOT = "../assets/onboarding"
const IMAGE_PATHS = [
    require(`${ONBOARDING_ROOT}/main.png`),
    require(`${ONBOARDING_ROOT}/main-icons-1.png`),
    require(`${ONBOARDING_ROOT}/main-icons-2.png`),
    require(`${ONBOARDING_ROOT}/main-icons-3.png`),
    require(`${ONBOARDING_ROOT}/stats.png`),
    require(`${ONBOARDING_ROOT}/settings.png`),
    require(`${ONBOARDING_ROOT}/exercise-timer-1.png`),
    require(`${ONBOARDING_ROOT}/exercise-timer-2.png`)
]

export default function OnboardingScreen() {

  const {height, width} = useWindowDimensions()
  const viewPager = useRef<any>()
  const navigation: any = useNavigation()

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDED_KEY, JSON.stringify(true))
    navigation.reset({
      index: 0,
      routes: [
        { name: 'Main' }
      ]
    })
    // navigation.dispatch(StackActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'Home' })
    //   ]
    // }))
  }
  return (
    // <SafeAreaView style={{flex:1}}>
    <BackgroundGradient>
      <ViewPager ref={viewPager} style={{flex: 1}}>

      
        {IMAGE_PATHS.map((image, index) => {
          const buttonHeight = 40;
          const marginTop = height/2 - buttonHeight/2
          if (index == IMAGE_PATHS.length - 1) {
            // Onboarindg last words
            const tipStyle = tw`text-white text-base mb-4`
            return (
                <View key={index} style={tw`flex-1 justify-center px-8`}>
                    <Text style={tw`text-white text-3xl text-center mb-4`}>Some last tips</Text>
                    <Text style={tipStyle}>You don't always have to immediately stop work when the timer runs out. Keep on going until you feel restless or tired</Text>
                    <Text style={tipStyle}>You can use the timer as a deep work timer. Stop work once either timer is over, or when you feel like it</Text>
                    <Text style={tipStyle}>If your eyes feel tired, even if the timer is still running, take a break and rest them. Feel free to let the timer continue running</Text>
                    <MyButton 
                      style={`w-full border border-white`}
                      onPress={finishOnboarding}>
                      <Text style={tw`text-base text-center text-white`}>
                        Okay, let's go!
                      </Text>  
                    </MyButton>
                </View>
            )
          }
          return (
            <View key={index}>
              {index != 0 ?
              <TouchableOpacity 
                onPress={() => viewPager.current.setPage(index - 1)}
                style={[
                  tw`p-2 absolute left-0 flex items-center justify-center bg-white border-black`, {
                  marginTop: marginTop,
                  height: buttonHeight
                }]}>
                <Text>Prev</Text>
              </TouchableOpacity>
              : ""
              }
              <TouchableOpacity 
                onPress={() => viewPager.current.setPage(index + 1)}
                style={[
                  tw`p-2 absolute right-0 flex items-center justify-center bg-white border-black`, {
                  marginTop: marginTop,
                  height: buttonHeight
                }]}>
                <Text>Next</Text>
              </TouchableOpacity>

              <Image source={image} style={{height: "100%", width: "100%", zIndex: -1}} />
            </View>
          )
        })}

        
      </ViewPager>
      </BackgroundGradient>
    // </SafeAreaView>
  )
}

const onboardingContent = [
  {
    title: "Onboarding is easy",
    content: `Take control of your own eye heatlh. 
      Give your eyes the rest they deserve. 
      Rest your eyes every 20 minutes.
    `
  }
]