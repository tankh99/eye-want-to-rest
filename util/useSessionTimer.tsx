import React, { useEffect, useState } from 'react'
import { DEFAULT_SESSION_DURATION } from '../constants/globals'
import { getSessionDuration, saveSessionDuration } from './prefs'

export default function useSessionTimer() {
  const [sessionDuration, setSessionDuration] = useState(DEFAULT_SESSION_DURATION);
  useEffect(() => {
    getSessionDuration()
    .then(session => {
      console.log(session)
      setSessionDuration(session);
    })
  }, [])

  return [sessionDuration, setSessionDuration] as const
}
