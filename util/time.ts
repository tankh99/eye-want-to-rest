import { add, addSeconds, differenceInSeconds, intervalToDuration } from "date-fns"

export function formatTime(time: number): string{
    const result = time < 10 ? `0${time}` : time.toString()
    return result
}

export function formatSecondsToDuration(seconds: number): Duration{
    const date = intervalToDuration({start: 0, end: seconds * 1000})
    return date;
}

// export function minutes(time: Date): string{
//     if(time == null) return "00"
//     return formatTime(time.getMinutes())
// }

// export function seconds(time: Date): string{
//     if(time == null) return "00"
//     return formatTime(time.getSeconds())
// }

export function getEmptyDate(): Date{
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    return date;
}

export function getTotalSeconds(date: Duration): number{ // Only converts up to hours
    const totalSeconds = date.hours! * 3600 + date.minutes! * 60 + date.seconds!
    return totalSeconds
}


export function calculateTargetTime (startTime: Date, delayInSeconds: number): Date {
    const targetTime = add(startTime, {seconds: delayInSeconds})
    // console.log(startTime)
    // console.log(targetTime)
    return targetTime
}


// onTimerDone should clear interval
export function calculateTick (timeToWaitInSeconds: number, startTime: Date, onTimerDone: Function): Duration {
    const now = new Date()
    const targetTime = addSeconds(startTime, timeToWaitInSeconds)
    const interval = {start: new Date(), end: targetTime}
    const duration = intervalToDuration(interval);
    console.log("now", now, " targetTime", targetTime);
    if(now.getTime() + 1000 >= targetTime.getTime()) { // timer is done . +1000 so that it ends on 0 seconds
        onTimerDone()
        return duration
    }

    // console.log(duration);
    // const targetTime = calculateTargetTime(startTime, timeToWaitInSeconds)
    // let seconds = differenceInSeconds(targetTime, now)
    // let minutes = seconds / 60
    // seconds = seconds % 60
    // try{
    //     if (minutes <= 0 && seconds <= 0){
    //         // Ensure that time remains 0 even after more than 5 minutes of not coming back to screen
    //         minutes = 0;
    //         seconds = 0;
    //         if(onTimerDone) onTimerDone()
    //     }
    // } catch (ex: any) {
    //     console.error(ex.toString())
    // }
    // const timeLeft = new Date() // If you use this, will count up. But we want to count DOWN
    
    // timeLeft.setMinutes(minutes)
    // timeLeft.setSeconds(seconds)
    return duration;
}
