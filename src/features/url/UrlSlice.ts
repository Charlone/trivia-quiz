import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Define a type for the slice state
export interface UrlState {
  urlToCall: string;
}

// Define the initial state using that type
const initialState: UrlState = {
  urlToCall: `${process.env.NEXT_PUBLIC_TRIVIA_API}amount=50&`
}

export const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrlToCall: (state, action: PayloadAction<UrlState>) => {
      return Object.assign({}, state, action.payload);
    }
  }
})

export const { setUrlToCall } = urlSlice.actions;

export const selectUrl = (state: RootState) => state.url.urlToCall;

export default urlSlice.reducer;