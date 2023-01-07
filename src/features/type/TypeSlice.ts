import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface Types {
    types : TypeState[];
    chosen_type: string;
}

export interface TypeState {
    label: string;
    slug: string;
    image: string;
}

const initialState: Types = {
    types : [
        {
            label: 'Mixed',
            slug: 'mixed',
            image: 'question-mark.png',
        },
        {
            label: 'Multi-choice',
            slug: 'multiple',
            image: 'multiple-question.png'
        },
        {
            label: 'True / False',
            slug: 'boolean',
            image: 'true-false.png'
        },
    ],
    chosen_type: 'mixed',
}

export const typeSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {
        setTypes: (state, action: PayloadAction<Types>) => {
            return Object.assign({}, state, action.payload);
        },
        setChosenType: (state, action:PayloadAction<string>) => {
            state.chosen_type = action.payload;
        }
    }
})

export const { setChosenType } = typeSlice.actions;

export const selectTypes = (state: RootState) => state.type.types;

export const selectChosenType = (state: RootState) => state.type.chosen_type;

export default typeSlice.reducer;