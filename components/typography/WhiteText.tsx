import {Text} from 'react-native'
import tw from 'twrnc'

export default function WhiteText({style="", children}: any) {
  return (
    
    <Text style={tw`text-white ${style}`}>
      {children}
    </Text>
  )
}
