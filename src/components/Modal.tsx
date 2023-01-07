import styles from '../../styles/components/Modal.module.scss';
import React, {ReactNode} from "react";
import Button from "./Button";
import {handleCloseModal, handleShowModal} from "../utils/Utils";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectModal} from "../features/modalSelection/ModalSelectionSlice";

interface Modal {
    handleClose: () => void;
    show: false | 'category' | 'difficulty' | 'type' | 'start';
    title: string;
    style?: object;
    children: ReactNode;
}

const Modal = ({ handleClose, show, title, style, children }: Modal) => {
    const dispatch = useAppDispatch();
    const modalShow = useAppSelector(selectModal);
    const {modal, modalmain, section, options, buttons} = styles;
    const showHideClassName = show ? `${modal} d-block` : `${modal} d-none`;

    return (
        <div className={showHideClassName}>
            <section className={modalmain}>
                <section className={section}>
                    <h2>{title}</h2>
                    <div className={options} style={style}>
                        {children}
                    </div>
                </section>
                <div className={buttons}>
                    {
                        modalShow
                        && modalShow === 'start'
                            ? <Button text={"Play"} classname={'primary'} onClick={() => handleCloseModal(dispatch)} link={'/play'} />
                            : <Button text={"Start"} classname={'primary'} onClick={() => handleShowModal(dispatch, 'start')} />
                    }
                    <Button text={"Close"} classname={'secondary'} onClick={handleClose} />
                </div>
            </section>
        </div>
    );
};

export default Modal;