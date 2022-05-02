
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
import { intervalToDuration } from 'date-fns'

export default function StatsScreen() {

    const [history, setHistory]: any[] = useState({})
    const DEFAULT_DATE_FORMAT = "d/M/yyyy"

    useEffect(() => {
        // setHistory(readHistory())
        const init = async () => {
            const results = await readHistory()
            console.log("Results in Stats Screen", results)
            
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
            todaySessions: 0
        }

        let totalSeconds = 0;
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

            // // Update duration
            // if(groupedHistory[formattedStartDate] && groupedHistory[formattedStartDate].duration){
            //     // groupedHistory[formattedStartDate].duration += (duration)
            // } else {
            //     groupedHistory[formattedStartDate].duration = duration
            // }
            totalSeconds += duration;
            
            if(isToday(startDate)) {
                groupedHistory.todaySessions += 1
            }
            
        })
        // totalSeconds -= (965 + 3600)
        const todayDuration = (intervalToDuration({start:0, end: totalSeconds * 1000}))
        groupedHistory.todayDuration = todayDuration
        // console.log(todayDuration)
        return groupedHistory
    }

    return (
        <>
            <LinearGradient
                        colors={['rgba(2,0,45,1)', 'rgba(85,1,84,1)']}
                style={tailwind("flex-1 absolute top-0 w-full h-full")}/>
            <SafeAreaView>
                <Text style={tailwind("text-white text-center text-xl my-8")}>Today's Progress</Text>

                <Card containerStyle={tailwind("mx-4")}>
                    <LinearGradient
                        colors={['rgba(63, 0, 112, 1)', `rgba(14, 1, 78, 1)`]}
                        style={tailwind("flex-1 absolute w-full h-full")}/>
                    <View style={tailwind("py-4")}>
                        <View style={tailwind("flex flex-row justify-center px-8")}>
                            <View style={tailwind("flex w-1/2")}>
                                <Text style={tailwind("text-center text-gray-300 text-lg")}>Focus</Text>
                                {history.todayDuration && 
                                <Text style={tailwind("text-center text-white text-2xl")}>
                                    {history.todayDuration.hours > 0 && `${history.todayDuration.hours}h `}
                                    {history.todayDuration.minutes > 0 && `${history.todayDuration.minutes}m `}
                                    {history.todayDuration.seconds > 0 ? `${history.todayDuration.seconds}s ` : 
                                    history.todayDuration.hours == 0 && history.todayDuration.minutes == 0 && history.todayDuration.seconds == 0 && "0s"}
                                </Text>
                                }
                            </View>
                            <View style={tailwind("flex w-1/2")}>
                                <Text style={tailwind("text-center text-gray-300 text-xl text-lg")}>Sessions</Text>
                                <Text style={tailwind("text-center text-center text-white text-2xl")}>{history.todaySessions}</Text>
                            </View>
                        </View>
                    </View>
                </Card>

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
