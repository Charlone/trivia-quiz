import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface TriviaCategories {
    trivia_categories : CategoryState[];
    chosen_category: string;
    overall: CategoryGlobalCount;
    categories: CategoryByIdCount;
}

export interface TriviaCategoriesCount {
    overall: CategoryGlobalCount;
    categories: CategoryByIdCount;
}

export interface CategoryByIdCount {
    [index: string] : CategoryGlobalCount;
}

export interface CategoryGlobalCount {
    total_num_of_questions: number;
    total_num_of_pending_questions: number;
    total_num_of_verified_questions: number;
    total_num_of_rejected_questions: number;
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
    overall: {
        total_num_of_questions: 0,
        total_num_of_pending_questions: 0,
        total_num_of_verified_questions: 0,
        total_num_of_rejected_questions: 0
    },
    categories: {}
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
            state.overall = action.payload.overall;
            state.categories = action.payload.categories;
        }
    }
})

export const { setCategories, setChosenCategory, initializeCategoryCount } = categorySlice.actions;

export const selectCategories = (state: RootState) => state.category.trivia_categories;

export const selectChosenCategory = (state: RootState) => state.category.chosen_category;

export const selectCategoryCount = (state: RootState) => state.category.categories;

export const selectCategoryOverallCount = (state: RootState) => state.category.overall;

export default categorySlice.reducer;