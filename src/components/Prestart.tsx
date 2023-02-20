import React from "react";
import Image from "next/image";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectCategories, selectChosenCategory} from "../features/category/CategorySlice";
import {selectChosenDifficulty, selectDifficulties} from "../features/difficulty/DifficultySlice";
import {selectChosenType, selectTypes} from "../features/type/TypeSlice";
import Button, {MenuButton} from "./Button";
import {capitalise, handleShowModal} from "../utils/Utils";
import styles from "../../styles/components/Prestart.module.scss";

const Prestart = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const chosenCategory = useAppSelector(selectChosenCategory);
  const difficulties = useAppSelector(selectDifficulties);
  const chosenDifficulty = useAppSelector(selectChosenDifficulty);
  const types = useAppSelector(selectTypes);
  const chosenType = useAppSelector(selectChosenType);
  const chosenCategoryName: {name: string} = chosenCategory === 'mixed' ? {name: 'Mixed'} : categories.filter(category => category.id === +chosenCategory).reduce(cat => cat);
  const chosenDifficultyName: {label: string} = difficulties.filter(difficulty => difficulty.slug === chosenDifficulty).reduce(cat => cat);
  const chosenTypeName: {label: string} = types.filter(type => type.slug === chosenType).reduce(cat => cat);
  const { selection, image, section } = styles;
  const inlineStyle = {padding: '0.375rem 0.75rem', fontSize: 13};

  return (
    <section className={section}>
      <div className={selection}>
        <h6>Category</h6>
        <Image
          className={image}
          priority={true}
          width={83}
          src={require(`../../src/images/idea.png`)}
          alt={"category"}
        />

        <MenuButton
          style={inlineStyle}
          selector={"category"}
          id={'category'}
          name={chosenCategoryName.name}
          chosen={chosenCategoryName.name}
        />

        <Button
          classname={'tertiary'}
          text={"Switch Category"}
          onClick={() => handleShowModal(dispatch, "category")}
        />
      </div>

      <div className={selection}>
        <h6>Difficulty</h6>
        <Image
          className={image}
          priority={true}
          width={133}
          src={require(`../../src/images/meter.png`)}
          alt={"difficulty"}
        />

        <MenuButton
          style={inlineStyle}
          selector={"difficulty"}
          id={"difficulty"}
          name={capitalise(chosenDifficultyName.label)}
          chosen={chosenDifficultyName.label}
        />

        <Button
          classname={'tertiary'}
          text={"Switch Difficulty"}
          onClick={() => handleShowModal(dispatch, "difficulty")}
        />
      </div>

      <div className={selection}>
        <h6>Type</h6>
        <Image
          className={image}
          priority={true}
          width={100}
          src={require(`../../src/images/multiple-question.png`)}
          alt={"type"}
        />

        <MenuButton
          style={inlineStyle}
          selector={"types"}
          id={"types"}
          name={capitalise(chosenTypeName.label)}
          chosen={chosenTypeName.label}
        />

        <Button
          classname={'tertiary'}
          text={"Switch Type"}
          onClick={() => handleShowModal(dispatch, "type")}
        />
      </div>
    </section>
  );
}

export default Prestart;