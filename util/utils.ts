import { secondsToHours, secondsToMinutes } from "date-fns"

export function  getRandomInt (max: number) {
    return Math.floor(Math.random() * max)
}

export function convertSecondsToLowestDenom(seconds: number) {
    if (seconds >= 3600){
        return {time: secondsToHours(seconds), denom: "h"}
    }
    else if(seconds >= 60){
        return {time: secondsToMinutes(seconds), denom: "m"}
    } else {
        return {time: seconds, denom: "s"}
    }
}
