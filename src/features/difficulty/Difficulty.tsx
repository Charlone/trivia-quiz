import React from 'react';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {MenuButton} from "../../components/Button";
import {selectChosenDifficulty, selectDifficulties, setChosenDifficulty} from "./DifficultySlice";
import {selectUrl} from "../url/UrlSlice";
import {selectCategoryCount} from "../category/CategorySlice";
import {handleUrlParams} from "../../utils/Utils";

export function Difficulty(): JSX.Element {
  const url = useAppSelector(selectUrl);
  const categoryCount = useAppSelector(selectCategoryCount);
  const difficulties = useAppSelector(selectDifficulties);
  const chosenDifficulty = useAppSelector(selectChosenDifficulty);
  const dispatch = useAppDispatch();

  const handleOnChange = (event: any) => {
    handleUrlParams(url, 'difficulty', event.target.value, chosenDifficulty, dispatch, categoryCount, event.target.value);
    dispatch(setChosenDifficulty(event.target.value));
  }

  return (
    <>
      {
        difficulties &&
        difficulties.map(difficulty => <MenuButton
          key={difficulty.slug}
          selector={"difficulty"}
          id={difficulty.slug}
          name={difficulty.label}
          chosen={chosenDifficulty}
          onChange={handleOnChange}
          pointer={true}
        />)
      }
    </>
  );
}
