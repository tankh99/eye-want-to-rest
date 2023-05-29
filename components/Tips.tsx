import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import tw from 'twrnc'
import { getRandomInt } from '../util/utils'

export default function Tips() {

    const tips = [
        "Palm your eyes after every eye exercise",
        "Follow the 20-20-20 rule",
        "Green leafy vegetables, salmon or tuna, eggs, nuts, and oranges are good for your eyes",
        "If your eyes feel dry, it might mean that you've been straining your eyes too much. Blink more often",
        "Dry eye syndrome stems from poor blinking habits or staring at computer screens for long periods of time",
        "Blinking regularly helps to stimulate tear production",
        "Drinking lots of water keeps you awake",
        "Visit the local optometrist annually",
        "Ensure proper lighting in wherever you work",
        "Avoid rubbing your eyes too hard. It can damage your eyes and even cause infections",
        "Lower the brightness of yoru screen to reduce yee strain",
        "Always keep an arm's length away from the screen",
        "You don't always have to immediately stop work when the timer runs out. Keep on going until you feel restless or tired",
        'You can use the timer as a deep work timer. Stop work once either timer is over, or when you feel like it',
        "If your eyes feel tired, even if the timer is still running, take a break and rest them. Feel free to let the timer continue running",
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
