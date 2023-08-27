import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'
import { getNotificationLoudnessPref } from './prefs';
import { LOUDNESS } from './sounds';

export async function scheduleNotification(title: string, body: string, seconds: number, repeats?: boolean){

    let sound = "ding-sound.wav";
    const loudnessPref = await getNotificationLoudnessPref()
    switch (loudnessPref) {
        case LOUDNESS.SOFT:
            sound = "ding-sound-soft.wav"
        case LOUDNESS.LOUD:
            sound = "ding-sound-loud.wav"
    }
    
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