import {Dispatch} from "react";
import {AnyAction} from "redux";
import {fetchCategories, fetchCategoriesGlobalCount} from "../features/category/CategoryAPI";
import {
    CategoryGlobalCount,
    CategoryState,
    initializeCategoryCount,
    setCategories
} from "../features/category/CategorySlice";
import {setModalSelection} from "../features/modalSelection/ModalSelectionSlice";
import {setIsLoading} from "../features/isLoading/IsLoadingSlice";

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