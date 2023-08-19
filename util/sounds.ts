import {Audio} from 'expo-av'

export async function playOpenEyeSound(){
    const {sound: eyeOpenSound} = await Audio.Sound.createAsync(
        require("../assets/sounds/eye-open.wav"),
    )
    eyeOpenSound.playAsync()   
}

export async function playCloseEyeSound(){
    const { sound: eyeCloseSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/droplet-sound.wav"),
    )
    eyeCloseSound.playAsync()
}

export async function playTimerDoneSound(){
    const { sound: bellSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/ding-sound.wav")
    )
    bellSound.playAsync()
}