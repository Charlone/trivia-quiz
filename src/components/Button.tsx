import React, {ChangeEventHandler} from "react";
import Link from "next/link";
import Image from "next/image";
import {cleanCategoryName} from "../utils/Utils";
import styles from "../../styles/components/Button.module.scss";

type Button = {
  link?: string;
  classname: 'primary' | 'secondary' | 'tertiary';
  style?: object | undefined;
  text: string;
  onClick?: any;
}

interface MenuButton {
  selector: string;
  id: number | string | undefined;
  name: string;
  chosen: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  style?: object;
  pointer?: boolean;
}

interface QuestionButton {
  text: string;
  selector: string;
  id: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  style?: object;
}

export default function Button({link = '#', classname, style = undefined, text, onClick}: Button): JSX.Element {
  return (
    <Link href={link}>
      <button
        id={styles['button']}
        type={"button"}
        className={styles[`${classname}`]}
        style={style}
        onClick={onClick}
      >
        {text}
      </button>
    </Link>
  )
}

export function MenuButton({selector, id, name, chosen, onChange, style, pointer = false}: MenuButton): JSX.Element {
  const {menubutton, item, input, inputContainer} = styles;

  return (
    <button
      id={menubutton}
      className={item}
      style={style}
    >
      <input
        style={pointer ? {'cursor': 'pointer'} : {}}
        id={selector}
        className={input}
        type={"radio"}
        value={id}
        name={selector}
        checked={typeof id === 'string' ? chosen === id : +chosen === id}
        onChange={onChange ? onChange : () => {}}
      />
      <label htmlFor={selector}>
        <span>
            <Image
              src={require("../images/tickmark.svg")}
              width={20}
              height={20}
              alt={"tick mark"}
            />
        </span>
        {cleanCategoryName(name)}
      </label>
    </button>
  )
}

export function QuestionButton({text, selector, id, checked, onChange, style = undefined}: QuestionButton) {
  const {menubutton, item, input, textStyle} = styles;

  return (
    <button
      id={menubutton}
      className={item}
      style={style}
    >
      <input
        style={{'cursor': 'pointer'}}
        id={selector}
        className={input}
        type={"radio"}
        value={id}
        name={selector}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={selector}>
        <span>
            <Image
              src={require("../images/tickmark.svg")}
              width={20}
              height={20}
              alt={"tick mark"}
            />
        </span>
        <span
          className={textStyle}
          dangerouslySetInnerHTML={{__html: text}}>
        </span>
      </label>
    </button>
  );
}