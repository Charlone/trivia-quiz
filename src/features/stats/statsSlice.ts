import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

export interface Stats {
  current_points: CurrentPoints[];
  initial_points: number;
  categories: CategoriesStats[];
  questions: QuestionStats[];
}

export interface CurrentPoints {
  user: string;
  points: number;
}

export interface CategoriesStats {
  user: string;
  categoriesPlayed: any;
}

export interface QuestionStats {
  user: string;
  correct: number;
  wrong: number;
  easy: number;
  medium: number;
  hard: number;
}

const initialState: Stats = {
  current_points: [],
  initial_points: 0,
  categories: [],
  questions: [],
}

export const statsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setUserInitialPoints: (state, action: PayloadAction<CurrentPoints>) => {
      if (action.payload.user !== '') {
        state.current_points.push(action.payload);
        state.categories.push({user: action.payload.user, categoriesPlayed: []});
        state.questions.push({user: action.payload.user, correct: 0, wrong: 0, easy: 0, medium: 0, hard: 0});
      }
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
    },
    addCategoryPlayed: (state, action: PayloadAction<CategoriesStats>) => {
      state.categories = state.categories.map(categoryObject => {
        if (categoryObject.user === action.payload.user) {
          return {
            user: action.payload.user,
            categoriesPlayed: categoryObject.categoriesPlayed.concat(action.payload.categoriesPlayed),
          }
        } else {
          return categoryObject;
        }
      });
    },
    incrementQuestionStats: (state, action: PayloadAction<QuestionStats>) => {
      state.questions = state.questions.map(questionsObject => {
        if (questionsObject.user === action.payload.user) {
          return {
            user: action.payload.user,
            correct: action.payload.correct,
            wrong: action.payload.wrong,
            easy: action.payload.easy,
            medium: action.payload.medium,
            hard: action.payload.hard
          };
        } else {
          return questionsObject;
        }
      })
    }
  }
})

export const {setUserInitialPoints, incrementPoints, addCategoryPlayed, incrementQuestionStats} = statsSlice.actions;

export const selectStats = (state: RootState) => state.stats;

export default statsSlice.reducer;