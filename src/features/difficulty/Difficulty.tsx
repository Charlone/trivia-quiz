import React, {ChangeEvent} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { MenuButton } from "../../components/Button";
import { selectChosenDifficulty, selectDifficulties, setChosenDifficulty } from "./DifficultySlice";
import { selectUrl } from "../url/UrlSlice";
import { handleUrlParams } from "../../utils/Utils";

export function Difficulty(): JSX.Element {
    const url = useAppSelector(selectUrl);
    const difficulties = useAppSelector(selectDifficulties);
    const chosenDifficulty = useAppSelector(selectChosenDifficulty);
    const dispatch = useAppDispatch();

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleUrlParams(url, 'difficulty', event.target.value, chosenDifficulty, dispatch);
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
