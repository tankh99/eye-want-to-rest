import { DEFAULT_SESSION_DURATION } from './../constants/globals';
import { SESSION_DURATION_KEY } from "../constants/globals";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSessionDuration() {
  const sessionDuration = await AsyncStorage.getItem(SESSION_DURATION_KEY);
  if (sessionDuration) {
    console.log(JSON.parse(sessionDuration))
    return JSON.parse(sessionDuration);
  } else {
    console.warn("No session duration found. Uh oh")
    return DEFAULT_SESSION_DURATION
  }
}

export function saveSessionDuration(sessionDuration: Duration) {
  console.log("saving", sessionDuration)
  AsyncStorage.setItem(SESSION_DURATION_KEY, JSON.stringify(sessionDuration))
}