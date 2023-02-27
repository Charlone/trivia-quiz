import {Dispatch} from "react";
import {AnyAction} from "redux";
import {toast} from "react-toastify";
import {fetchCategories} from "../features/category/CategoryAPI";
import {fetchSession} from "../features/session/SessionAPI";
import {setModalSelection} from "../features/modalSelection/ModalSelectionSlice";
import {setIsLoading} from "../features/isLoading/IsLoadingSlice";
import {resetTokenToInitial, setFallbackToken, setToken} from "../features/session/SessionSlice";
import {setUrlToCall} from "../features/url/UrlSlice";
import {setGuest} from "../features/guest/GuestSlice";
import {Question} from "../features/questions/QuestionsSlice";
import {setChosenDifficulty} from "../features/difficulty/DifficultySlice";
import {setChosenType} from "../features/type/TypeSlice";
import {unSetUser} from "../features/user/UserSlice";
import {
  CurrentPoints,
  incrementPoints,
  incrementQuestionStats,
  QuestionStats,
  setUserInitialPoints
} from "../features/stats/statsSlice";
import {
  CategoryByIdCount,
  CategoryState,
  setCategories,
  setChosenCategory
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

export const handleInitialisation = (dispatch: Dispatch<any>, user: string, current_points: CurrentPoints[], initial_points: number) => {
  if (current_points.length === 0 || !current_points.find(userPointsObject => userPointsObject.user === user)) {
    dispatch(setUserInitialPoints({user, points: initial_points}));
  }
}

export function capitalise(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.substring(1);
}

export function setUpCategories(categories: CategoryState[], dispatch: Dispatch<AnyAction>) {
  if (categories[0].id === undefined) {
    fetchCategories().then(cat => dispatch(setCategories(cat)));
  }
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

export const resetSession = (dispatch: Dispatch<any>) => {
  dispatch(resetTokenToInitial());
}

export const resetToken = (dispatch: Dispatch<any>, token?: string) => {
  token
    ? fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`)
    : fetchSession().then(data => dispatch(setToken(data)));
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

export const points = {
  easy: 5,
  medium: 10,
  hard: 20
}

export const handlePointsIncrement = (dispatch: Dispatch<any>, results: Question[], current_question: number, user: string) => {
  let pointsToAdd = 0;

  switch (results[current_question].difficulty) {
    case 'easy':
      pointsToAdd = points.easy;
      break;
    case 'medium':
      pointsToAdd = points.medium;
      break;
    case 'hard':
      pointsToAdd = points.hard;
      break;
    default:
      break;
  }

  dispatch(incrementPoints({user, points: pointsToAdd}));
}

export const uniqueValues = (array: string[]): string => {
  let valuesToCheck: string[] = [];

  array.map(item => !valuesToCheck.includes(item) && valuesToCheck.push(item));

  return valuesToCheck.join(", ");
}

interface FetchMaxCount {
  name: string;
  count: number;
}

export const fetchMaxCount = (array: string[]): FetchMaxCount => {
  let counts: any = {};
  let maxCount = {
    name: "",
    count: 0
  };

  array.forEach(function (x: string) {
    counts[x] = (counts[x] || 0) + 1;
  });

  for (let key in counts) {
    if (maxCount.name === '') {
      maxCount.name = key;
      maxCount.count = counts[key];
    } else if (maxCount.count < counts[key]) {
      maxCount.name = key;
      maxCount.count = counts[key];
    }
  }

  return maxCount;
}

export const cleanCategoryName = (name: string): string => {
  return name.replace('Entertainment: ', '').replace('Science: ', '')
}

export const handleStatsIncrement = (dispatch: Dispatch<any>, user: string, results: Question[], current_question: number, chosen: string, questions: QuestionStats | undefined) => {
  if (questions === undefined) {
    return;
  }

  dispatch(incrementQuestionStats({
    user: user,
    correct: results[current_question].correct_answer === chosen ? questions.correct + 1 : questions.correct,
    wrong: results[current_question].correct_answer !== chosen ? questions.wrong + 1 : questions.wrong,
    easy: results[current_question].difficulty === 'easy' ? questions.easy + 1 : questions.easy,
    medium: results[current_question].difficulty === 'medium' ? questions.medium + 1 : questions.medium,
    hard: results[current_question].difficulty === 'hard' ? questions.hard + 1 : questions.hard,
  }));
}

export const customToast = (type: 'info' | 'success' | 'warning' | 'error' | 'default', message: string) => {
  return toast(message, {
    type: type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export const resetPlay = (dispatch: Dispatch<any>, user?: boolean) => {
  dispatch(setChosenCategory("mixed"));
  dispatch(setChosenDifficulty("mixed"));
  dispatch(setChosenType("mixed"));
  resetSession(dispatch);
  user && dispatch(unSetUser());
}

export const debounce = (fn: () => void, delay: number | undefined) => {
  let timer: string | number | NodeJS.Timeout | undefined;
  return () => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(fn, delay)
  }
}

export const handleUserSessionExpired = (dispatch: Dispatch<any>, user: string | null | undefined, stateUser: string | null | undefined, push: (s: string) => void) => {
  if (!user && stateUser) {
    dispatch(unSetUser());
    customToast("warning", "Session expired, logging you out");
    setTimeout(() => push("/"), 750);
  }
}