import {Dispatch} from "react";
import {AnyAction} from "redux";
import {fetchCategories, fetchCategoriesGlobalCount} from "../features/category/CategoryAPI";
import {fetchSession} from "../features/session/SessionAPI";
import {setModalSelection} from "../features/modalSelection/ModalSelectionSlice";
import {setIsLoading} from "../features/isLoading/IsLoadingSlice";
import {setFallbackToken, setToken} from "../features/session/SessionSlice";
import {setUrlToCall} from "../features/url/UrlSlice";
import {setGuest} from "../features/guest/GuestSlice";
import {incrementPoints} from "../features/points/PointsSlice";
import {Question} from "../features/questions/QuestionsSlice";
import {
  CategoryByIdCount,
  CategoryState,
  initializeCategoryCount,
  setCategories
} from "../features/category/CategorySlice";

export async function handleFetchedData(url: RequestInfo | URL) {
  return await fetch(url)
    .then(res => {
      if (!res.ok) {
        throw Error('could not fetch the data for that resource');
      }
      return res.json();
    })
    .then(data => {
      return data
    })
    .catch(err => {
      if (err instanceof Error) {
        console.error(err.message);
      }
    });
}

export function capitalise(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.substring(1);
}

export function setUpCategories(categories: CategoryState[], dispatch: Dispatch<AnyAction>) {
  if (categories[0].id === undefined) {
    fetchCategories().then(cat => dispatch(setCategories(cat)));
  }
}

export function setUpCategoryCount(categoryId: number, dispatch: Dispatch<AnyAction>) {
  fetchCategoriesGlobalCount(categoryId).then(count => dispatch(initializeCategoryCount(count)));
}

export const handleCloseModal = (dispatch: Dispatch<AnyAction>) => {
  dispatch(setModalSelection({chosen: false}));
}

export const handleShowModal = (dispatch: Dispatch<AnyAction>, modalType: "category" | "difficulty" | "type" | "start" | "playModal" | "gameFinished" | "noQuestions") => {
  dispatch(setModalSelection({chosen: modalType}));
}

export const handleLoader = (isLoading: boolean, dispatch: Dispatch<AnyAction>, delay: boolean = false, time: number = 0) => {
  if (delay && time) {
    setTimeout(() => dispatch(setIsLoading({isLoading})), time);
  } else {
    dispatch(setIsLoading({isLoading}));
  }
}

export const generateToken = (token: string, code: number, dispatch: Dispatch<AnyAction>) => {
  if (token === '' || code === 3 || code === 4) {
    fetchSession().then(data => dispatch(setToken(data)));
  }
}

export const resetToken = (dispatch: Dispatch<AnyAction>) => {
  fetchSession().then(data => dispatch(setToken(data)));
}

export const handleUrlSession = (url: string, token: string, fallbackToken: string, dispatch: Dispatch<AnyAction>) => {
  if (token !== '' && token !== fallbackToken) {
    if (!url.includes('token=')) {
      url += `token=${token}`;
    } else {
      url = url.replace(fallbackToken, token);
    }

    dispatch(setFallbackToken(token));
    dispatch(setUrlToCall({urlToCall: url}))
  }
}

export const handleUrlParams = (url: string, type: 'category' | 'difficulty' | 'type', param: string, paramToReplace: string, dispatch: Dispatch<AnyAction>, categories?: CategoryByIdCount, difficulty?: "mixed" | "easy" | "medium" | "hard") => {
  let needle: string = '';
  let questionsAmount = 0;

  switch (type) {
    case 'category':
      needle = '&category';
      break;
    case 'difficulty':
      needle = '&difficulty';
      break;
    case 'type':
      needle = '&type';
      break;
    default:
      break;
  }

  if (needle !== '') {
    if (param === 'mixed') {
      url = url.replace(`${needle}=${paramToReplace}`, '');
    } else if (!url.includes(needle)) {
      url += `${needle}=${param}`;
    } else {
      url = url.replace(`${needle}=${paramToReplace}`, `${needle}=${param}`);
    }

    if (categories !== undefined && difficulty !== undefined) {
      switch (difficulty) {
        case 'mixed':
          questionsAmount = categories.total_question_count > 50
            ? 50
            : categories.total_question_count
          ; break;
        case 'easy':
          questionsAmount = categories.total_easy_question_count > 50
            ? 50
            : categories.total_easy_question_count;
          break;
        case 'medium':
          questionsAmount = categories.total_medium_question_count > 50
            ? 50
            : categories.total_medium_question_count;
          break;
        case 'hard':
          questionsAmount = categories.total_hard_question_count > 50
            ? 50
            : categories.total_hard_question_count;
          break;
        default:
          questionsAmount = 50;
          break;
      }
    }

    if (!url.includes('amount=')) {
      url += `&amount=${questionsAmount}`;
    } else {
      let parsedUrl = url.split('&');
      parsedUrl[0] = parsedUrl[0].substring(0, 35) + questionsAmount;
      url = parsedUrl.join('&');
    }

    dispatch(setUrlToCall({urlToCall: url}));
  }
}

export const generateGuest = (dispatch: Dispatch<any>): void => {
  const newGuest = {
    username: `guest_${Date.now()}`
  }

  dispatch(setGuest(newGuest));
}

export const handlePointsIncrement = (dispatch: Dispatch<any>, results: Question[], current_question: number, user: string) => {
  let pointsToAdd = 0;

  switch (results[current_question].difficulty) {
    case 'easy':
      pointsToAdd = 5;
      break;
    case 'medium':
      pointsToAdd = 10;
      break;
    case 'hard':
      pointsToAdd = 20;
      break;
    default:
      break;
  }

  dispatch(incrementPoints({user, points: pointsToAdd}));
}