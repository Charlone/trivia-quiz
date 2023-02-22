import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

export interface Questions {
  response_code: 0 | 1 | 2 | 3 | 4;
  results: Question[];
  current_question: number;
}

export interface Question {
  "category": string,
  "type": string,
  "difficulty": string,
  "question": string,
  "correct_answer": string,
  "incorrect_answers": string[]
}

// Define the initial state using that type
const initialState: Questions = {
  response_code: 0,
  results: [],
  current_question: 0,
}

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Questions>) => {
      const stateObject = {...action.payload, current_question: state.current_question};
      return Object.assign({}, state, stateObject);
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.current_question = action.payload;
    }
  }
})

export const {setQuestions, setCurrentQuestion} = questionsSlice.actions;

export const selectQuestions = (state: RootState) => state.questions;

export default questionsSlice.reducer;