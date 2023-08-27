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

export enum SOUNDS {
    BELL = 'bell',
    COWBELL = 'cowbell',
    ALARM = 'loud'
  }

export async function playTimerDoneSound(soundId: string){

    
    if (soundId == SOUNDS.BELL){
        const audio = require(`../assets/sounds/ding-sound.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    } else if (soundId == SOUNDS.COWBELL){

        const audio = require(`../assets/sounds/cowbell.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    } else {
        const audio = require(`../assets/sounds/alarm-ring-short.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    }
}