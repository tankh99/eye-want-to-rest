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

export enum LOUDNESS {
    SOFT = 'soft',
    NORMAL = 'normal',
    LOUD = 'loud'
  }

export async function playTimerDoneSound(loudnessId: string){

    
    if (loudnessId == LOUDNESS.SOFT){
        const audio = require(`../assets/sounds/ding-sound-soft.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    } else if (loudnessId == LOUDNESS.NORMAL){

        const audio = require(`../assets/sounds/ding-sound.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    } else {
        const audio = require(`../assets/sounds/ding-sound-loud.wav`)
        const { sound: bellSound } = await Audio.Sound.createAsync(
            audio
        )
        bellSound.playAsync()
    }
}