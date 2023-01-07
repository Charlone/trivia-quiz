import Link from "next/link";
import styles from "../../styles/components/Button.module.scss";
import Image from "next/image";
import React, {ChangeEventHandler} from "react";

type Button = {
    link?: string;
    classname: 'primary' | 'secondary' | 'tertiary';
    style?: object | undefined;
    text: string;
    onClick?: () => void;
}

export default function Button({link = '#', classname, style = undefined, text, onClick}: Button) {
    return (
        <Link href={link}>
            <button id={styles['button']} type={"button"} className={styles[`${classname}`]} style={style} onClick={onClick}>{text}</button>
        </Link>
    )
}

interface MenuButton {
    selector: string;
    id: number | string | undefined;
    name: string;
    chosen: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    style?: object;
}

export function MenuButton({selector, id, name, chosen, onChange, style}: MenuButton) {
    const {menubutton, item, input} = styles;

    return (
        <button id={menubutton} className={item} style={style}>
            <input id={selector} className={input} type={"radio"} value={id} name={selector} checked={typeof id === 'string' ? chosen === id : +chosen === id} onChange={onChange ? onChange : () => {}}/>
            <label htmlFor={selector}>
                <span>
                    <Image priority={true} src={require("../images/tickmark.svg")} width={20} height={20} alt={"tick mark"}/>
                </span>
                {name.replace('Entertainment: ', ''). replace('Science: ', '')}
            </label>
        </button>
    )
}