import React, {ChangeEvent, useEffect} from 'react';
import {MenuButton} from "../../components/Button";
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {
  initializeCategoryCount,
  selectCategories,
  selectCategoryCount,
  selectChosenCategory,
  setChosenCategory
} from './CategorySlice';
import {selectUrl} from "../url/UrlSlice";
import {selectChosenDifficulty} from "../difficulty/DifficultySlice";
import {handleUrlParams, setUpCategories} from "../../utils/Utils";
import {fetchCategoriesGlobalCount} from "./CategoryAPI";

export function Category(): JSX.Element {
  const url = useAppSelector(selectUrl);
  const categoryCount = useAppSelector(selectCategoryCount);
  const categories = useAppSelector(selectCategories);
  const chosenCategory = useAppSelector(selectChosenCategory);
  const chosenDifficulty = useAppSelector(selectChosenDifficulty);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setUpCategories(categories, dispatch);

    return () => {}
  }, [categories]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== 'mixed') {
      fetchCategoriesGlobalCount(+event.target.value).then(data => {
        dispatch(initializeCategoryCount(data));
        handleUrlParams(url, 'category', event.target.value, chosenCategory, dispatch, data.category_question_count, chosenDifficulty);
      });
    } else {
      handleUrlParams(url, 'category', event.target.value, chosenCategory, dispatch, categoryCount, chosenDifficulty);
    }
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
        pointer={true}
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
          pointer={true}
        />)
      }
    </>
  );
}
