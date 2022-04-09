import * as Notifications from 'expo-notifications';

export async function scheduleNotification(title: string, body: string, seconds: number, repeats?: boolean){

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound: "cowbell.wav"
        }, 
        trigger: {
            seconds,
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