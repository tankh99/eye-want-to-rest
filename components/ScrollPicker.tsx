import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from 'twrnc'
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface P {
  list: any[]
}

const ITEM_WIDTH = 100
const ITEM_HEIGHT = 50
const DEFAULT_ITEM_FONT_SIZE = 36;

export default function ScrollPicker({list}: P) {
  
  // useState
  const [scrollIndex, setScrollIndex] = useState(0);
  const [offsets, setOffsets]: any = useState([]);
  // const scrollIndex = useRef();

  useEffect(() => {
    initPicker()
  }, [])

  const initPicker = () => {
    const offsets = []
    for (let i = 0; i < list.length; i++) {
      offsets.push(i * ITEM_HEIGHT)
    }
    setOffsets(offsets)
  }
  const pickerHeight = Math.min(1.2 * ITEM_HEIGHT, offsets.length * ITEM_HEIGHT)
  
  const scrollPos = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollPos.value = e.contentOffset.y
    }
  })
  const itemStyle = useAnimatedStyle(() => {
    return {
      // fontSize: DEFAULT_ITEM_FONT_SIZE,
      transform: [{
        translateX: withSpring(Math.sin(scrollPos.value) * 50)
      }]
    }
  })
  return (
    <>
    
      <Animated.ScrollView
        style={{
          overflow: "hidden",
          width: ITEM_WIDTH,
          height: pickerHeight,
          // shadowColor: "black",
          // shadowOpacity: 0.9,
          // shadowRadius: 100
          // backgroundColor: "blue"
        }}
        contentContainerStyle={{
          paddingTop: pickerHeight / 2 - ITEM_HEIGHT /2,
          paddingBottom: pickerHeight / 2 - ITEM_HEIGHT /2
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={"fast"}
        snapToAlignment='center'
        snapToOffsets={offsets}
        onScroll={handleScroll}
        onMomentumScrollEnd={(e) => {
          if(e.nativeEvent.contentOffset.x % ITEM_HEIGHT == 0){
            const index = e.nativeEvent.contentOffset.y / ITEM_HEIGHT
            setScrollIndex(scrollIndex);
        }
        }}
        >
        {list.map((item, index) => {
          return (
            <View key={index}>
              <Animated.Text style={[
                tw`text-white text-center`,
                {
                  fontSize: 36,
                  height: pickerHeight,
                  
                }
              ]}>{item}</Animated.Text>
            </View>
          )
        })}
      </Animated.ScrollView>
    </>
  )
}
