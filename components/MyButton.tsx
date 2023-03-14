import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import tw from 'twrnc'

export default function MyButton({style="", onPress, children}: any) {
  return (
    <TouchableOpacity onPress={() => onPress()} 
        style={tw`p-2 w-full flex border border-white ${style}`}>
        {children}
    </TouchableOpacity>
  )
}
