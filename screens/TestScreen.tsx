import { View, Text, Dimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native-safe-area-context'
import {LinearGradient} from 'expo-linear-gradient'
import tailwind from 'tailwind-rn'
import { PanGestureHandler, ScrollView, TapGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

const dummyData = [10, 20,30,40,50,60]

const {width, height} = Dimensions.get("screen")
const ITEM_WIDTH = 100

export default function TestScreen() {
  const [data, setData] = useState([])
  const [intervals, setIntervals] = useState([])
  useEffect(() => {
    let arr: any = []
    let offsets: any = []
    for(let i = 0; i < 500; i+=1){
      arr.push(i)
      offsets.push(ITEM_WIDTH * i)
    }
    setData(arr)
    setIntervals(offsets)

  
  }, [])
  
  return (
    <>
      <SafeAreaView style={tailwind("flex-1")}>
        <Text>Test Screen</Text>
        {/* <View style={tailwind("flex-1 items-center justify-center")}>
        <AnimatedBall/>
        </View> */}
        {/* <AnimatedScrollView/> */}
        {/* <HorizontalPager data={["red", "blue", "yellow"]}/> */}
        <TimePicker data={data} offsets={intervals}/>
        {/* <HorizontalPicker 
          defaultIndex={1}
          data={[20,30,40,50, 60]}/> */}
      </SafeAreaView>
    </>
  )
}


function TimePicker(props: any) {
  return (
    <View>
      <ScrollView 
        style={[{paddingLeft: width/2 -50}]}
        snapToInterval={100} // element width!
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        snapToOffsets={props.offsets}
        // scrollToOverflowEnabled
        // contentOffset={{x:-135, y:0}}
        // alwaysBounceVertical={false}
        // contentInset={{left: 100, top:0, right: 0, bottom: 0}}
        // contentInsetAdjustmentBehavior="never"
        // disableIntervalMomentum={true}
        decelerationRate="fast"
        maximumZoomScale={2}
        zoomScale={1}
        horizontal>
        {props.data.map((item: any, index: number) => {
          return (
            // <View style={{width: width, height, backgroundColor: item}}></View>
            <Text style={[tailwind(`text-3xl text-center font-bold`), {width: 100}]} key={index}>{item}</Text>
          )
        })}
      </ScrollView>
      <Text style={tailwind("w-full text-center font-bold text-4xl")}>^</Text>
    </View>
  )
}

function HorizontalPager(props: any) {
  return (
    <ScrollView 
      // snapToOffsets={[0,1,2]}
      // snapToEnd={false}\
      pagingEnabled
      decelerationRate="fast"
      horizontal>
      {props.data.map((item: any, index: number) => {
        return (
          <View style={{width: width, height, backgroundColor: item}}></View>
          // <Text style={tailwind(`text-3xl font-bold mx-2`)} key={index}>{item}</Text>
        )
      })}
    </ScrollView>
  )
}

function AnimatedScrollView(props: any) {
  const x = useSharedValue(0)
  const isScrolling = useSharedValue(false)
  const handler = useAnimatedScrollHandler({
    onBeginDrag(event, context) {
      console.log("Begin drag")
      isScrolling.value = true
    },
    onScroll(event, context) {
      x.value = event.contentOffset.y
      
    },
    onEndDrag(event, context) {
      console.log("ending drag ")
      isScrolling.value = false
    },
  }, [])

  const animatedShapeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value
        }
      ]
    }
  })
  return (
    <View>
      <Animated.View style={[tailwind("w-16 h-16 rounded"), animatedShapeStyle, {backgroundColor:"red"}]} />
      <Animated.ScrollView 
        onScroll={handler}
        scrollEventThrottle={16}
        style={[tailwind(""), {height: 1000}]}>
          <Text>Hello</Text>
      </Animated.ScrollView>
    </View>
  )
}

// function AnimatedSensor(props: any) {
  
//   <Animated.View style={[tailwind("rounded-full w-16 h-16"), uas]} />
// }

function AnimatedBall(props: any) {
  const pressed = useSharedValue(false)

  const startingPosition = 100
  const x = useSharedValue(startingPosition)
  const y = useSharedValue(startingPosition)

  const eventHandler: any = useAnimatedGestureHandler({
    // Context is a mini-state for reanimated
    onStart: (event, ctx: any) => {
      pressed.value = true
      ctx.startX = x.value
      ctx.startY = y.value
      ctx.cumshot = "YES"
    }, 
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX
      y.value = ctx.startY +event.translationY
    },
    onEnd: (event, ctx) => {
      pressed.value = false
      // x.value = withSpring(startingPosition)
      // y.value = withSpring(startingPosition)
      console.log("cumshot", ctx.cumshot)
    }
  })


  console.log("x value", x.value)

  const uas = useAnimatedStyle(() => {
    
    return {
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [
        // { scale: withSpring(pressed.value ? 1.2 : 1)},
        {translateX: withSpring(x.value)},
        {translateY: withSpring(y.value)}
      ],

    }
  })

  return (
    <View style={tailwind("flex-1 items-center justify-center")}>    
      <PanGestureHandler onGestureEvent={eventHandler}>
        {/* <Text>{x.value}</Text> */}
        <Animated.View style={[tailwind("rounded-full w-16 h-16"), uas]} />
      </PanGestureHandler>
    </View>
  )
}

function HorizontalPicker(props: any) {
  const {defaultIndex, data} = props
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  return (
    <View style={tailwind("flex flex-row")}>
      {data.map((item: any, index: number) => {
        return (
          <View key={index}>
            <Text>{item}</Text>
          </View>
        )
      })}
    </View>
  )
}