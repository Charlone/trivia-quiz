import React, {ChangeEvent, useEffect} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCategories, selectCategoryCount, selectChosenCategory, setChosenCategory } from './CategorySlice';
import { MenuButton } from "../../components/Button";
import { handleUrlParams, setUpCategories } from "../../utils/Utils";
import { selectUrl } from "../url/UrlSlice";

export function Category(): JSX.Element {
    const url = useAppSelector(selectUrl);
    const categoryCount = useAppSelector(selectCategoryCount);
    const categories = useAppSelector(selectCategories);
    const chosenCategory = useAppSelector(selectChosenCategory);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setUpCategories(categories, dispatch);

        return () => {}
    }, [categories]);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleUrlParams(url, 'category', event.target.value, chosenCategory, dispatch, categoryCount);
        dispatch(setChosenCategory(event.target.value));
    }

    return (
        <>
            <MenuButton
                selector={"category"}
                id={'mixed'}
                name={"Mixed"}
                chosen={chosenCategory}
                onChange={handleOnChange}
            />
            {
                categories &&
                categories.map(category => <MenuButton
                    key={category.id}
                    selector={"category"}
                    id={category.id}
                    name={category.name}
                    chosen={chosenCategory}
                    onChange={handleOnChange}
                />)
            }
        </>
    );
}
