import React, {ChangeEvent} from 'react';
import Image from "next/image";
import {MenuButton} from "../../components/Button";
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {selectChosenType, selectTypes, setChosenType} from "./TypeSlice";
import {selectUrl} from "../url/UrlSlice";
import {selectCategoryCount} from "../category/CategorySlice";
import {selectChosenDifficulty} from "../difficulty/DifficultySlice";
import {handleUrlParams} from "../../utils/Utils";
import styles from "../../../styles/components/Type.module.scss";

export function Type(): JSX.Element {
  const url = useAppSelector(selectUrl);
  const types = useAppSelector(selectTypes);
  const chosenType = useAppSelector(selectChosenType);
  const categoryCount = useAppSelector(selectCategoryCount);
  const chosenDifficulty = useAppSelector(selectChosenDifficulty);
  const dispatch = useAppDispatch();
  const {section, image} = styles;
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleUrlParams(url, 'type', event.target.value, chosenType, dispatch, categoryCount, chosenDifficulty);
    dispatch(setChosenType(event.target.value));
  }

  return (
    <>
      {
        types &&
        types.map(type => (
          <div
            key={type.slug}
            className={section}
          >
            <Image
              className={image}
              priority={true}
              width={100}
              src={require(`../../../src/images/${type.image}`)}
              alt={type.label}
            />

            <MenuButton
              style={{padding: '0.375rem 0.75rem'}}
              selector={"types"}
              id={type.slug}
              name={type.label}
              chosen={chosenType}
              onChange={handleOnChange}
              pointer={true}
            />
          </div>
        ))
      }
    </>
  );
}
