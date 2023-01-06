import { add, addSeconds, differenceInSeconds, intervalToDuration } from "date-fns"


export function getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  

export function formatTime(time: number): string{
    const result = time < 10 ? `0${time}` : time.toString()
    return result
}

export function formatSecondsToDuration(seconds: number): Duration{
    const duration = intervalToDuration({start: 0, end: seconds * 1000})
    return duration;
}

export function formatDurationToString(duration: Duration): string {
    return `${duration.minutes?.toLocaleString("en-US", {minimumIntegerDigits: 2})}:${duration.seconds?.toLocaleString("en-US", {minimumIntegerDigits: 2})}`
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
    // console.log("startTime", startTime, " seconds ot wait", timeToWaitInSeconds);
    const targetTime = addSeconds(startTime, timeToWaitInSeconds)
    const interval = {start: now, end: targetTime}
    const duration = intervalToDuration(interval);
    // console.log("now", now, " targetTime", targetTime);
    if(now.getTime() + 1000 >= targetTime.getTime()) { // timer is done . +1000 so that it ends on 0 seconds
        onTimerDone()
        return duration
    }

    return duration;
}
