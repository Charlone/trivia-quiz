import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface TriviaCategories {
    trivia_categories : CategoryState[];
    chosen_category: string;
    category_id: number | undefined;
    category_question_count: CategoryByIdCount;
}

export interface TriviaCategoriesCount {
    category_id: number;
    category_question_count: CategoryByIdCount;
}

export interface CategoryByIdCount {
    total_question_count: number;
    total_easy_question_count: number;
    total_medium_question_count: number;
    total_hard_question_count: number;
}

// Define a type for the slice state
export interface CategoryState {
    id: number | undefined;
    name: string;
}

// Define the initial state using that type
const initialState: TriviaCategories = {
    trivia_categories : [
        {
            id: undefined,
            name: '',
        }
    ],
    chosen_category: 'mixed',
    category_id: undefined,
    category_question_count: {
        total_question_count: 0,
        total_easy_question_count: 0,
        total_medium_question_count: 0,
        total_hard_question_count: 0,
    }
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action: PayloadAction<TriviaCategories>) => {
            return Object.assign({}, state, action.payload);
        },
        setChosenCategory: (state, action:PayloadAction<string>) => {
            state.chosen_category = action.payload;
        },
        initializeCategoryCount: (state, action: PayloadAction<TriviaCategoriesCount>) => {
            state.category_id = action.payload.category_id;
            state.category_question_count = action.payload.category_question_count;
        }
    }
})

export const { setCategories, setChosenCategory, initializeCategoryCount } = categorySlice.actions;

export const selectCategories = (state: RootState) => state.category.trivia_categories;

export const selectChosenCategory = (state: RootState) => state.category.chosen_category;

export const selectCategoryCount = (state: RootState) => state.category.category_question_count;

export default categorySlice.reducer;