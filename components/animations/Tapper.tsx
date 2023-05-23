import { PanGestureHandler, PanGestureHandlerGestureEvent, TapGestureHandler, TapGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function Tapper() {

  const starting = 100;
  const pressed = useSharedValue(false);
  const x = useSharedValue(starting);
  const y = useSharedValue(starting);
  const style = useAnimatedStyle(() => {
    return {
      borderRadius: 999,
      width: withSpring(pressed.value ? 150 : 100),
      height: withSpring(pressed.value ? 150 : 100),
      backgroundColor: pressed.value ? "red" : "blue",
      transform: [
        {translateX: withSpring(x.value)},
        {translateY: withSpring(y.value)}
      ]
    }
  })
  

  const handlePan = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (e, ctx: any) => {
      // pressed.value = true;
      ctx.startX = x.value
      ctx.startY = y.value
    },
    onActive: (e, ctx: any) => {
      x.value = ctx.startX + e.translationX
      y.value = ctx.startY + e.translationY
    },
    onEnd: (e, ctx) => {
      // pressed.value = false;
      // x.value = starting;
      // y.value = starting;
    },
  })
  
  return (

    <PanGestureHandler onGestureEvent={handlePan}>
      <Animated.View style={[
        style
      ]}>
        
      </Animated.View>
    </PanGestureHandler>
  )
}

const TapDemo = ({style}: any) => {
  const handleTap = useAnimatedGestureHandler<TapGestureHandlerGestureEvent|PanGestureHandlerGestureEvent>({
    onStart: (e, ctx) => {
      // pressed.value = true;
    },
    onEnd: (e, ctx) => {
      // pressed.value = false;
    },
  })
  return (
    <TapGestureHandler onGestureEvent={handleTap}>
      <Animated.View style={[
        style
      ]}>
        
      </Animated.View>
    </TapGestureHandler>
  )
}

