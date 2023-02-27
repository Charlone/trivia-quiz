import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

export interface Session {
  sessionData: SessionState;
  fallbackSession: string;
}

// Define a type for the slice state
export interface SessionState {
  response_code: number;
  response_message: string;
  token: string;
}

// Define the initial state using that type
const initialState: Session = {
  sessionData: {
    response_code: 0,
    response_message: '',
    token: '',
  },
  fallbackSession: ''
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    resetTokenToInitial: (state) => {
      state = initialState
    },
    setToken: (state, action: PayloadAction<SessionState>) => {
      state.sessionData = action.payload;
    },
    setFallbackToken: (state, action: PayloadAction<string>) => {
      state.fallbackSession = action.payload;
    }
  }
})

export const {resetTokenToInitial, setToken, setFallbackToken} = sessionSlice.actions;

export const selectSession = (state: RootState) => state.session.sessionData;

export const selectSessionFallback = (state: RootState) => state.session.fallbackSession;

export default sessionSlice.reducer;