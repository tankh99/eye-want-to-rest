import React, { useEffect } from 'react';
import {View, Text, Button, ScaledSize, Dimensions, PanResponderGestureState} from 'react-native'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming, } from 'react-native-reanimated';
import {PanGestureHandler, PanGestureHandlerGestureEvent} from 'react-native-gesture-handler'

const HANDLE_WIDTH = 20;

export default function Slider() {

    const size = useSharedValue(100)
    // slider
    const sliderWidth = useSharedValue(0)
    const progress = useSharedValue(0)

    const animatedHandleStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: progress.value - HANDLE_WIDTH / 2}]
        }
    })

    //
    const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, {startProgress: number}>({
        onStart: (_, ctx) => {
            ctx.startProgress = progress.value
        },
        onActive :(event, ctx) => {
            progress.value = ctx.startProgress + event.translationX
        },
        onEnd: () => {
            if(progress.value > sliderWidth.value){
                progress.value = withSpring(sliderWidth.value)
            } else if (progress.value < 0){
                progress.value = withSpring(0)
            }
        }
    })

    useEffect(() => {
        // const interval = setInterval(() => {
        //     progress.value = withSpring(Math.random() * sliderWidth.value)
        // }, 1500)
        // return () => {
        //     clearInterval(interval)
        // }
    })

    // end slider

    return (
        <View style={{
            height: 20,
            width: Dimensions.get("screen").width * 0.5
        }}>
            {/* <Button title="Resize" onPress={() => size.value  = withSpring(size.value + 50)}/> */}
            {/* <Button title="Resize" onPress={() => progress.value = withTiming(progress.value + 10)}/> */}
            {/* <Animated.View style={style}/> */}
            {/* Start Slider */}
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgb(234,234,234)",
                    justifyContent: "flex-end",
                    borderRadius: 10
                }}
                onLayout={(e) => {
                    sliderWidth.value = e.nativeEvent.layout.width
                }}
                >
                <PanGestureHandler onGestureEvent={panGestureHandler}>
                    <Animated.View
                        style={[
                            {
                                width: HANDLE_WIDTH,
                                backgroundColor: "white",
                                borderRadius: 10,
                                position: "absolute",
                                bottom: -HANDLE_WIDTH / 2,
                                top: -HANDLE_WIDTH / 2
                            },
                            animatedHandleStyle
                        ]}>

                    </Animated.View>
                </PanGestureHandler>
            </View>
            {/* End Slider */}
        </View>
    )
}
