
import {View, Text} from 'react-native'
import tailwind from 'tailwind-rn'
import {LinearGradient} from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { insertHistory, readHistory } from '../util/sqlite'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isToday, format, differenceInDays } from 'date-fns/esm'
import _ from "lodash"
import { Table, Row, Rows } from 'react-native-table-component-2';
import { Card } from 'react-native-ui-lib'
import { intervalToDuration, isThisWeek, isYesterday } from 'date-fns'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function StatsScreen({navigation}: any) {

    const [history, setHistory]: any[] = useState({})
    const DEFAULT_DATE_FORMAT = "d/M/yyyy"

    useEffect(() => {
        // setHistory(readHistory())
        const init = async () => {
            const results = await readHistory()
            // console.log("Results in Stats Screen", results)
            
            const groupedDates = groupDates(results)
            setHistory(groupedDates)
        }
        init()
    }, [])

    const formatDataForTable = (data: any[]) => {
        let tableData: any = {
            tableHead: [],
            tableData: []
        }

        for (let key of data[0]){
            tableData.tableHead.push(key)
        }
    }

    const groupDates = (list: any[]) => {
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

            const formattedStartDate = format(startDate, DEFAULT_DATE_FORMAT)
            // const objected
            
            // Initialise the basic object before doing anything else
            if(!groupedHistory[formattedStartDate]){
                groupedHistory[formattedStartDate] = {
                    sessions: 0,
                    duration: 0
                }
            }
            
            // Update sessions
            if(groupedHistory[formattedStartDate] && groupedHistory[formattedStartDate].sessions) {
                groupedHistory[formattedStartDate].sessions+=1
            } else {
                groupedHistory[formattedStartDate].sessions = 1
            }

            if(isThisWeek(startDate)){
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
        const todayDuration = (intervalToDuration({start:0, end: secondsToday * 1000}))
        groupedHistory.todayDuration = todayDuration

        const yesterdayDuration = intervalToDuration({start:0, end: secondsYesterday * 1000})
        groupedHistory.yesterdayDuration = yesterdayDuration
        
        const weekDuration = intervalToDuration({start:0, end: secondsThisWeek * 1000})
        groupedHistory.weekDuration = weekDuration;
        return groupedHistory


    }

    return (
        <>
            <LinearGradient
                colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
                style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
            <SafeAreaView>
                <View style={tailwind("flex items-center justify-between flex-row px-4")}>
                    <TouchableOpacity 
                        style={tailwind("flex ")} 
                        onPress={() => navigation.navigate("Main")}>
                        <Ionicons name="arrow-back" size={28} color="white"  />
                    </TouchableOpacity>
                    <Text style={tailwind("text-white text-center text-4xl my-8 flex justify-center")}>Progress</Text>
                    
                    <Ionicons name="arrow-back" size={28} style={tailwind("")} color="transparent"  />
                </View>
                
                <ProgressCard title="Today's Focus" duration={history.todayDuration} sessions={history.todaySessions}/>
                <ProgressCard title="Yesterday's Focus" duration={history.yesterdayDuration} sessions={history.yesterdaySessions}/>
                <ProgressCard title="This Week's Focus" duration={history.weekDuration} sessions={history.weeklySessions}/>
                {/* {Object.keys(history).length > 0 ? Object.keys(history).map((dateKey: any, index: number) => {
                    const {sessions} = history[dateKey]
                    
                    return (
                        <View key={index}>
                            <Text style={tailwind("text-white")}>Date: {dateKey}</Text>
                            <Text style={tailwind("text-white")}>Sessions: {sessions}</Text>
                        </View>
                    )
                }) :
                    <Text style={tailwind("text-white")}>No History</Text>
                } */}
            </SafeAreaView>
        </>
    )
}

function ProgressCard({title, duration, sessions}: any) {
    return (
        <View style={tailwind("mx-4 bg-transparent border border-gray-300 border-2 mb-8 ")}>
                    {/* <LinearGradient
                        colors={['rgba(50, 20, 100, 1)', `rgba(30, 1, 55, 1)`]}
                        style={tailwind("flex-1 absolute w-full h-full")}/> */}
            <View style={tailwind("py-4")}>
                <View style={tailwind("flex justify-center px-8")}>
                    <View style={tailwind("flex mb-4")}>
                        <Text style={tailwind("text-center text-gray-300 text-lg")}>{title}</Text>
                        {duration != null && 
                        <Text style={tailwind("text-center text-white text-2xl")}>
                            {duration.hours > 0 && `${duration.hours}h `}
                            {duration.minutes > 0 && `${duration.minutes}m `}
                            {duration.seconds > 0 ? `${duration.seconds}s ` : 
                            duration.hours == 0 && duration.minutes == 0 && duration.seconds == 0 && "0s"}
                        </Text>
                        }
                    </View>
                    <View style={tailwind("flex")}>
                        <Text style={tailwind("text-center text-gray-300 text-xl text-sm")}>Sessions</Text>
                        <Text style={tailwind("text-center text-center text-white text-lg")}>{sessions}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}