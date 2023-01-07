import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define a type for the slice state
export interface SessionState {
    response_code: number;
    response_message: string;
    token: string;
}

// Define the initial state using that type
const initialState: SessionState = {
    response_code: 0,
    response_message: '',
    token: '',
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<SessionState>) => {
            return Object.assign({}, state, action.payload);
        }
    }
})

export const { setToken } = sessionSlice.actions;

export const selectSession = (state: RootState) => state.session;

export default sessionSlice.reducer;