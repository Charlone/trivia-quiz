import {Dispatch} from "react";
import {AnyAction} from "redux";
import {fetchCategories, fetchCategoriesGlobalCount} from "../features/category/CategoryAPI";
import {
    CategoryByIdCount,
    CategoryGlobalCount,
    CategoryState,
    initializeCategoryCount,
    setCategories
} from "../features/category/CategorySlice";
import {setModalSelection} from "../features/modalSelection/ModalSelectionSlice";
import {setIsLoading} from "../features/isLoading/IsLoadingSlice";
import {fetchSession} from "../features/session/SessionAPI";
import {setFallbackToken, setToken} from "../features/session/SessionSlice";
import {setUrlToCall} from "../features/url/UrlSlice";
import {setGuest} from "../features/guest/GuestSlice";

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

export function setUpCategoryCount(overall: CategoryGlobalCount, dispatch: Dispatch<AnyAction>) {
    if (overall && overall.total_num_of_questions === 0) {
        fetchCategoriesGlobalCount().then(count => dispatch(initializeCategoryCount(count)));
    }
}

export const handleCloseModal = (dispatch: Dispatch<AnyAction>) => {
    dispatch(setModalSelection({chosen: false}));
}

export const handleShowModal = (dispatch: Dispatch<AnyAction>, modalType: "category" | "difficulty" | "type" | "start") => {
    dispatch(setModalSelection({chosen: modalType}));
}

export const handleLoader = (isLoading: boolean, dispatch: Dispatch<AnyAction>, delay: boolean = false, time: number = 0) => {
    if (delay && time) {
        setTimeout(() => dispatch(setIsLoading({isLoading: isLoading})), time);
    } else {
        dispatch(setIsLoading({isLoading: isLoading}));
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

export const handleUrlParams = (url: string, type: 'category' | 'difficulty' | 'type', param: string, paramToReplace: string, dispatch: Dispatch<AnyAction>, categories: CategoryByIdCount | null = null) => {
    let needle: string = '';
    let questionsAmount = 50;

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

        if (categories !== null) {
            questionsAmount = param === 'mixed'
                ? 50
                : +categories[+param].total_num_of_questions > 50
                    ? 50
                    : categories[+param].total_num_of_questions;
        }

        if (!url.includes('&amount=')) {
            url += `&amount=${questionsAmount}`;
        } else {
            let position = url.indexOf('&amount=');
            url = url.replace(url.substring((position + 8), (position + 10)), `${questionsAmount}`);
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