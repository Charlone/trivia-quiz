import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

export interface Guest {
  username: string;
}

// Define the initial state using that type
const initialState: Guest = {
  username: '',
}

export const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setGuest: (state, action: PayloadAction<Guest>) => {
      return Object.assign({}, state, action.payload);
    }
  }
})

export const {setGuest} = guestSlice.actions;

export const selectGuest = (state: RootState) => state.guest.username;

export default guestSlice.reducer;