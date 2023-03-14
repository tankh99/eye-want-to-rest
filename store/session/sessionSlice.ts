import { DEFAULT_SESSION_DURATION } from './../../constants/globals';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface SessionState {
  sessionDuration: Duration
}

// Define the initial state using that type
const initialState: SessionState = {
  sessionDuration: DEFAULT_SESSION_DURATION
}

export const sessionSlice = createSlice({
  name: 'session',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSessionDuration: (state, action: PayloadAction<Duration>) => {
      state.sessionDuration = action.payload
    }
  },
})

export const { setSessionDuration } = sessionSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: any) => state.session.value

export default sessionSlice.reducer