import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface Points {
    current_points: CurrentPoints[];
    initial_points: number;
}

export interface CurrentPoints {
    user: string;
    points: number;
}

const initialState: Points = {
    current_points: [],
    initial_points: 0,
}

export const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        setInitialPoints: (state, action: PayloadAction<Points>) => {
            state = action.payload;
        },
        setUserInitialPoints: (state, action: PayloadAction<CurrentPoints>) => {
            state.current_points.push(action.payload);
        },
        incrementPoints: (state, action: PayloadAction<CurrentPoints>) => {
            if (state.current_points.length === 0) {
                state.current_points.push(action.payload);
            } else {
                state.current_points = state.current_points.map(pointsObject => {
                    if (pointsObject.user === action.payload.user) {
                        return {user: action.payload.user, points: pointsObject.points += action.payload.points}
                    } else {
                        return pointsObject;
                    }
                })
            }
        }
    }
})

export const { setInitialPoints, setUserInitialPoints, incrementPoints } = pointsSlice.actions;

export const selectPoints = (state: RootState) => state.points;

export default pointsSlice.reducer;