import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

export interface IsLoadingState {
  isLoading: boolean;
}

const initialState: IsLoadingState = {
  isLoading: false
}

export const isLoadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<IsLoadingState>) => {
      return Object.assign({}, state, action.payload);
    },
  }
})

export const {setIsLoading} = isLoadingSlice.actions;

export const selectIsLoading = (state: RootState) => state.loading;

export default isLoadingSlice.reducer;