import { DEFAULT_SESSION_DURATION } from './../constants/globals';
import { SESSION_DURATION_KEY } from "../constants/globals";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exercises } from '../constants/exercises';

export async function getSessionDuration() {
  const sessionDuration = await AsyncStorage.getItem(SESSION_DURATION_KEY);
  if (sessionDuration) {
    return JSON.parse(sessionDuration);
  } else {
    // console.warn("No session duration found. Uh oh")
    return DEFAULT_SESSION_DURATION
  }
}

export function saveSessionDuration(sessionDuration: Duration) {
  console.log("saving", sessionDuration)
  AsyncStorage.setItem(SESSION_DURATION_KEY, JSON.stringify(sessionDuration))
}

function getExerciseKey(id: string) {
  return `@exercise-${id}`
}
// returns number of seconds the exercise takes
export async function getExercisePref(id: string): Promise<number> {
  const exercise = exercises.filter(e => e.id == id)[0];
  if (!exercise) {
    console.error(`Exercise ${id} doesn't exist`);
    return -1;
  }

  const exDurationPref = await AsyncStorage.getItem(getExerciseKey(id))
  if (exDurationPref) {
    return JSON.parse(exDurationPref)
  } else {
    return -1
  }
}

export async function setExercisePref(id: string, index: number) {
  AsyncStorage.setItem(getExerciseKey(id), JSON.stringify(index))
}