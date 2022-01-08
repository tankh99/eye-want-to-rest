import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import tailwind from 'tailwind-rn'
import { getRandomInt } from '../util/utils'

export default function Tips() {

    const tips = [
        "Follow the 20-20-20 rule",
        "Eat more green leafy vegetables, salmon or tuna, eggs, nuts, and oranges",
        "Cover your eyes with your palms if your eyes feel dry",
        "Visit the eye doctor annually",
        "Avoid looking at dark and light colours to prevent eye strain"
    ]

    const [tip, setTip] = useState("")

    useEffect(() => {

        const randomIndex = getRandomInt(tips.length)
        setTip(tips[randomIndex])
        const id = setInterval(() => {
            const randomIndex = getRandomInt(tips.length)
            setTip(tips[randomIndex])
        }, 10000)
        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <View style={tailwind("flex flex-col px-12")}>
            <Text style={tailwind("text-white flex-wrap text-lg font-bold text-center")}>Tip: </Text>
            <Text style={tailwind("text-white flex-wrap text-center")}>{tip}</Text>
            
        </View>
    )
}
