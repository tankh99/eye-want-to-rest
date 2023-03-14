import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { getDefaultIconSize } from '../constants/globals'
import tw from 'twrnc';

export default function Navbar({navigation, title, children}: any) {
  return (
    <View style={tw`flex items-center justify-between flex-row px-4`}>
        <TouchableOpacity 
            style={tw``} 
            onPress={() => {
                navigation.goBack()
            }}>
            <Ionicons name="arrow-back" size={getDefaultIconSize()} color="white"  />
        </TouchableOpacity>
        <View>
        {children}
        </View>
        <Ionicons name="arrow-back" size={getDefaultIconSize()} style={''} color="transparent"  />
    </View>
  )
}
