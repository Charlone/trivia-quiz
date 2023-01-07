import React, {ChangeEvent} from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { MenuButton } from "../../components/Button";
import { selectChosenType, selectTypes, setChosenType } from "./TypeSlice";
import Image from "next/image";
import styles from "../../../styles/components/Type.module.scss";

export function Type(): JSX.Element {
    const types = useAppSelector(selectTypes);
    const chosenType = useAppSelector(selectChosenType);
    const dispatch = useAppDispatch();
    const { section, image } = styles;

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setChosenType(event.target.value));
    }

    return (
        <>
            {
                types &&
                types.map(type => (
                    <div key={type.slug}
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
                        />
                    </div>
                    ))
            }
        </>
    );
}
