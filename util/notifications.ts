import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device'

export async function scheduleNotification(title: string, body: string, seconds: number, repeats?: boolean){

    // Setting up android channel to allow custom notification sound
    if(Device.osName == "Android"){
        await Notifications.setNotificationChannelAsync("timer-done", {
            name: "Timer Done",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "cowbell.wav"
        })
    }

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound: "cowbell.wav"
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