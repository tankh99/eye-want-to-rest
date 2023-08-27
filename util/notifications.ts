import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'
import { getNotificationLoudnessPref } from './prefs';
import { SOUNDS } from './sounds';

export async function scheduleNotification(title: string, body: string, seconds: number, repeats?: boolean){

    let sound = "";
    const loudnessPref = await getNotificationLoudnessPref()
    console.log("loudness pref", loudnessPref)
    switch (loudnessPref) {
        case SOUNDS.BELL:
            sound = "ding-sound.wav"
            break;
        case SOUNDS.COWBELL:
            sound = "cowbell.wav"
            break;
        case SOUNDS.ALARM:
            sound = "alarm-ring.wav"
            break
        default:
            sound = "ding-sound.wav";
            break;
    }

    console.log(sound)
    // Setting up android channel to allow custom notification sound
    if(Device.osName == "Android"){
        await Notifications.setNotificationChannelAsync("timer-done", {
            name: "Timer Done",
            importance: Notifications.AndroidImportance.HIGH,
            sound,
            enableVibrate: true,

        })
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound
        }, 
        trigger: {
            seconds,
            channelId: "timer-done",
            repeats
        }
    })
    return id
}

export async function cancelAllNotifications(){
    try{
        await Notifications.cancelAllScheduledNotificationsAsync()
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}