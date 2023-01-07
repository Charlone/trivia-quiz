import React, {ChangeEvent} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { MenuButton } from "../../components/Button";
import {selectChosenDifficulty, selectDifficulties, setChosenDifficulty} from "./DifficultySlice";

export function Difficulty(): JSX.Element {
    const difficulties = useAppSelector(selectDifficulties);
    const chosenDifficulty = useAppSelector(selectChosenDifficulty);
    const dispatch = useAppDispatch();

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                />)
            }
        </>
    );
}
