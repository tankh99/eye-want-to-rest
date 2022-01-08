export function formatTime(time: number): string{
    const result = time < 10 ? `0${time}` : time.toString()
    return result
}

export function minutes(time: Date): string{
    if(time == null) return "00"
    return formatTime(time.getMinutes())
}

export function seconds(time: Date): string{
    if(time == null) return "00"
    return formatTime(time.getSeconds())
}

export function getEmptyDate(){
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    return date;
}

export function getTotalSeconds(date: Date){
    const totalSeconds = date.getMinutes() * 60 + date.getSeconds()
    return totalSeconds
}