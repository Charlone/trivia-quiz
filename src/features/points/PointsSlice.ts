import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface Points {
    current_points: number;
    initial_points: number;
}

const initialState: Points = {
    current_points: 0,
    initial_points: 0,
}

export const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        setInitalPoints: (state, action: PayloadAction<Points>) => {
            state = action.payload;
        },
        incrementPoints: (state, action: PayloadAction<number>) => {
            state.current_points += action.payload
        }
    }
})

export const { setInitalPoints, incrementPoints } = pointsSlice.actions;

export const selectPoints = (state: RootState) => state.points;

export default pointsSlice.reducer;