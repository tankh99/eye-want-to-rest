import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import tw from 'twrnc'
import { getRandomInt } from '../util/utils'

export default function Tips() {

    const tips = [
        "Palm your eyes after every eye exercise",
        "Follow the 20-20-20 rule",
        "Eat more green leafy vegetables, salmon or tuna, eggs, nuts, and oranges",
        "Cover your eyes with your palms if your eyes feel dry",
        "Visit the local optometrist annually",
        "Avoid looking at bright colours to prevent eye strain",
        "Keep your head an arm's length from the screen",
        "Always keep an arm's length away from the screen",
        "Allow yourself to both sit upright and slouch"
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
        <View style={tw`flex-col px-4`}>
        <Text style={tw`text-white flex-wrap text-lg font-bold text-center`}>Tip: </Text>
            <Text style={tw`text-white flex-wrap text-center`}>{tip}</Text>
        </View>
    )
}
