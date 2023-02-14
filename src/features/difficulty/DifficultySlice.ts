import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface Difficulty {
    difficulties : DifficultyState[];
    chosen_difficulty: "mixed" | "easy" | "medium" | "hard";
}

export interface DifficultyState {
    label: string;
    slug: string;
}

const initialState: Difficulty = {
    difficulties : [
        {
            label: 'Mixed',
            slug: 'mixed',
        },
        {
            label: 'Easy',
            slug: 'easy',
        },
        {
            label: 'Medium',
            slug: 'medium',
        },
        {
            label: 'Hard',
            slug: 'hard',
        },
    ],
    chosen_difficulty: 'mixed',
}

export const difficultySlice = createSlice({
    name: 'difficulty',
    initialState,
    reducers: {
        setDifficulties: (state, action: PayloadAction<Difficulty>) => {
            return Object.assign({}, state, action.payload);
        },
        setChosenDifficulty: (state, action:PayloadAction<"mixed" | "easy" | "medium" | "hard">) => {
            state.chosen_difficulty = action.payload;
        }
    }
})

export const { setChosenDifficulty } = difficultySlice.actions;

export const selectDifficulties = (state: RootState) => state.difficulty.difficulties;

export const selectChosenDifficulty = (state: RootState) => state.difficulty.chosen_difficulty;

export default difficultySlice.reducer;