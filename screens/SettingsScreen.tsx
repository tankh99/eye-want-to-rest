import { useEffect, useMemo, useState } from 'react'
import { View, Text, Button, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import BackgroundGradient from '../components/BackgroundGradient'
import tw from 'twrnc'
import WhiteText from '../components/typography/WhiteText'
import { getNotificationLoudnessPref, saveSessionDuration, setNotificationLoudnessPref } from '../util/prefs'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setSessionDuration } from '../store/session/sessionSlice'
// import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { credits } from '../constants/exercises'
import MyButton from '../components/MyButton'
import Navbar from '../components/Navbar'
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOUDNESS, playTimerDoneSound } from '../util/sounds'



export default function SettingsScreen({navigation}: any) {

  // const [sessionDuration, setSessionDuration] = useSessionTimer();
  const sessionDuration = useAppSelector(state => state.session.sessionDuration)
  const [sessionDurationInput, setSessionDurationInput] = useState(sessionDuration)
  // TODO: Replace with value from prefs
  const [selectedLoudnessId, setSelectedLoudnessId] = useState(LOUDNESS.SOFT.toString())
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getNotificationLoudness() {
      try {
        const result = await getNotificationLoudnessPref()
        if (!result) return
        setSelectedLoudnessId(result)
      } catch (ex) {
        console.error(ex)
      }
    }
    getNotificationLoudness()
  }, [])
  
  
  const onminuteChange = (minutes: string) => {
    if (!minutes) {
      minutes = "0";
    }
    let minutesInt = parseInt(minutes);
    
    if (minutesInt >= 60 || minutesInt < 0) {
      return;
    }

    // dispatch(

    setSessionDurationInput(prev => ({
      ...prev,
      minutes: minutesInt
    })
    )
    // )
  }

  const onSecondsChange = (secondsStr: string) => {
    if (!secondsStr) secondsStr = "0";
    const seconds = parseInt(secondsStr);
    
    if (seconds >= 60 || seconds < 0) {
      return;
    }

    setSessionDurationInput(prev => ({
      ...prev,
      seconds
    }))
  }

  const [showCredits, setShowCredits] = useState(false)

  const radioButtonStyle = {
    containerStyle: tw`flex m-0 mr-4`,
    color: 'white',
    labelStyle: tw`text-white`
  }
  const radioButtons= useMemo(() => [
    {
      id: LOUDNESS.SOFT.toString(),
      label: "Soft",
      value: "soft",
      ...radioButtonStyle
    }, 
    {
      id: LOUDNESS.NORMAL.toString(),
      label: "Normal",
      value: "normal",
      ...radioButtonStyle
    }, 
    {
      id: LOUDNESS.LOUD.toString(),
      label: "Loud",
      value: "loud",
      ...radioButtonStyle
    },
  ], [])



  const updateNotificationLoudness = (id: string) => {
    setSelectedLoudnessId(id)
    setNotificationLoudnessPref(id)
    playTimerDoneSound(id)
  }

  return (
    <BackgroundGradient>
      <Navbar navigation={navigation}>
        <Text style={tw`text-white text-center text-4xl my-2 flex justify-center`}>Settings</Text>
      </Navbar>
      <View style={tw`flex-1`}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={tw`p-4`}>
            <WhiteText style={`text-xl mb-2`}>Session duration</WhiteText>
            {/* <Text style={tw`text-gray-500 mb-2`}>Update your session duration </Text> */}
            <FormInput label="Minutes" 
                value={sessionDurationInput.minutes!.toString()} 
                onChange={onminuteChange}/>
            <FormInput label="Seconds" 
                value={sessionDurationInput.seconds!.toString()} 
                onChange={onSecondsChange}/>
            <MyButton onPress={() => {
              saveSessionDuration(sessionDurationInput)
              dispatch(setSessionDuration(sessionDurationInput))
            }}>
                <Text style={tw`text-white w-full text-center`}>
                    Save
                </Text>
            </MyButton>
          </View>
          
      </TouchableWithoutFeedback>
      <View style={tw`p-4`}>
        <WhiteText style={`text-xl mb-2`}>Sounds</WhiteText>
        <Text style={tw`text-white mb-2`}>Notification Loudness</Text>

        <RadioGroup
          layout='row'
          containerStyle={tw`mx-auto mt-4`}
          radioButtons={radioButtons}
          onPress={(id) => updateNotificationLoudness(id)}
          selectedId={selectedLoudnessId}/>
      </View>


      <TouchableOpacity style={tw`absolute right-0 left-0 bottom-0`} onPress={() => {
              setShowCredits(!showCredits)
            }}>
                <Text style={tw`underline text-white w-full text-center`}>
                    Credits
                </Text>
            </TouchableOpacity>
            {/* <Button onPress={getSessionDuration1} title="Get"/> */}
            {showCredits &&

              <View style={[tw`absolute bottom-0 m-4 w-full p-4 left-0 bg-black`, 
              // {height: 300, width: 400}
              ]}>
                <Text style={tw`font-bold text-xl text-white`}>Credits</Text>
                <ScrollView>
                  {credits.map((credit, index) => {
                    if (credit.credit) {
                      return (
                        <CreditLink key={index} name={credit.name} url={credit.credit}/>
                        )
                      }
                  })}
                </ScrollView>
                <Button onPress={() => setShowCredits(false)} title="Close"/>
              </View>
            }
        </View>
    </BackgroundGradient>
  )
}

const CreditLink = ({name, url}: any) => {
  return (
    <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(url)}>
      <Text style={tw`text-blue-700 underline`}>{name}</Text>
    </TouchableOpacity>
  )
}

function FormInput({label, value, onChange}: any) {
  return (
    <View style={tw`flex-col mb-2`}>
      <WhiteText style={''}>{label}: </WhiteText>
      
      <TextInput style={tw`px-4 py-2 bg-black w-full text-white`} keyboardType='numeric' 
        onChangeText={onChange} 
        value={value}/>
    </View>
  )
}