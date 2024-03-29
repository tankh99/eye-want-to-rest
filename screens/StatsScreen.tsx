
import { View, Text } from 'react-native'
import tw from 'twrnc'
import { useEffect, useState } from 'react'
import { DEFAULT_DB_NAME, readHistory } from '../util/sqlite'
import { isToday } from 'date-fns/esm'
import { intervalToDuration, isThisWeek, isYesterday } from 'date-fns'
import Navbar from '../components/Navbar'
import BackgroundGradient from '../components/BackgroundGradient'

export default function StatsScreen({navigation}: any) {

    const [history, setHistory]: any[] = useState({})

    useEffect(() => {
        // setHistory(readHistory())
        const init = async () => {
            const results = await readHistory(DEFAULT_DB_NAME)
            const groupedDates = groupDates(results)
            setHistory(groupedDates)
        }
        init()
    }, [])

    return (
        <>
            {/* <LinearGradient
                colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
                style={tw`flex-1 absolute top-0 w-full h-full`}/>
            <SafeAreaView> */}
            <BackgroundGradient>
                <Navbar navigation={navigation}>
                    <Text style={tw`text-white text-center text-4xl my-8 flex justify-center`}>Statistics</Text>
                </Navbar>
                
                <ProgressCard title="Today's Screen Time" duration={history.todayDuration} sessions={history.todaySessions}/>
                <ProgressCard title="Yesterday's Screen Time" duration={history.yesterdayDuration} sessions={history.yesterdaySessions}/>
                <ProgressCard title="This Week's Screen Time" duration={history.weeklyDuration} sessions={history.weeklySessions}/>
                {/* {Object.keys(history).length > 0 ? Object.keys(history).map((dateKey: any, index: number) => {
                    const {sessions} = history[dateKey]
                    
                    return (
                        <View key={index}>
                            <Text style={tw`text-white`}>Date: {dateKey}</Text>
                            <Text style={tw`text-white`}>Sessions: {sessions}</Text>
                        </View>
                    )
                }) :
                    <Text style={tw`text-white`}>No History</Text>
                } */}
            </BackgroundGradient>
        </>
    )
}

function ProgressCard({title, duration, sessions}: any) {
    return (
        <View style={tw`mx-4 bg-transparent border border-gray-300 border-2 mb-8 `}>
                    {/* <LinearGradient
                        colors={['rgba(50, 20, 100, 1)', `rgba(30, 1, 55, 1)`]}
                        style={tw`flex-1 absolute w-full h-full`}/> */}
            <View style={tw`py-4`}>
                <View style={tw`flex justify-center px-8`}>
                    <View style={tw`flex mb-4`}>
                        <Text style={tw`text-center text-gray-300 text-lg`}>{title}</Text>
                        {duration != null && 
                        <Text style={tw`text-center text-white text-2xl`}>
                            {duration.days > 0 && `${duration.days}d `} 
                            {duration.hours > 0 && `${duration.hours}h `}
                            {duration.minutes > 0 && `${duration.minutes}m `}
                            {duration.seconds > 0 ? `${duration.seconds}s ` : 
                            duration.hours == 0 && duration.minutes == 0 && duration.seconds == 0 && "0s"}
                        </Text>
                        }
                    </View>
                    <View style={tw`flex`}>
                        <Text style={tw`text-center text-gray-300 text-xl text-sm`}>Sessions</Text>
                        <Text style={tw`text-center text-center text-white text-lg`}>{sessions}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}



const formatDataForTable = (data: any[]) => {
    let tableData: any = {
        tableHead: [],
        tableData: []
    }

    for (let key of data[0]){
        tableData.tableHead.push(key)
    }
}


const DEFAULT_DATE_FORMAT = "d/M/yyyy"

export const groupDates = (list: any[]) => {
    const groupedHistory: any = {
        todayDuration: 0,
        todaySessions: 0,
        yesterdayDuration: 0,
        yesterdaySessions: 0,
        weeklySessions: 0,
        weeklyDuration: 0,
    }

    let secondsToday = 0;
    let secondsYesterday = 0
    let secondsThisWeek = 0
    // Loops through all rows in the database.
    list.map((row: any, index: number) => {
        let {startDate, duration} = row
        startDate = (new Date(JSON.parse(startDate)))

        if(isThisWeek(startDate, {weekStartsOn: 1})){
            groupedHistory.weeklySessions += 1
            secondsThisWeek += duration
        }

        if(isToday(startDate)) {
            groupedHistory.todaySessions += 1
            secondsToday += duration;
        } else if (isYesterday(startDate)){
            groupedHistory.yesterdaySessions += 1
            secondsYesterday += duration;
        }
        
    })
    
    // secondsToday = 25 * 60 * 60;
    const todayDuration = (intervalToDuration({start:0, end: secondsToday * 1000}))
    groupedHistory.todayDuration = todayDuration

    const yesterdayDuration = intervalToDuration({start:0, end: secondsYesterday * 1000})
    groupedHistory.yesterdayDuration = yesterdayDuration
    
    const weeklyDuration = intervalToDuration({start:0, end: secondsThisWeek * 1000})
    groupedHistory.weeklyDuration = weeklyDuration;
    console.log(groupedHistory)
    return groupedHistory
}