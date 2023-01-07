import React, {ChangeEvent, useEffect} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectCategories, selectChosenCategory, setChosenCategory } from './CategorySlice';
import { MenuButton } from "../../components/Button";
import {setUpCategories} from "../../utils/Utils";

export function Category(): JSX.Element {
    const categories = useAppSelector(selectCategories);
    const chosenCategory = useAppSelector(selectChosenCategory);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setUpCategories(categories, dispatch);

        return () => {}
    }, [categories]);

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
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
