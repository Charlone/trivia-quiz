import styles from '../../styles/components/Modal.module.scss';
import React, {ReactNode} from "react";
import Button from "./Button";
import {handleCloseModal, handleLoader, handleShowModal} from "../utils/Utils";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectModal} from "../features/modalSelection/ModalSelectionSlice";
import {selectUrl} from "../features/url/UrlSlice";
import {fetchQuestions} from "../features/questions/QuestionsAPI";
import {selectQuestions, setCurrentQuestion, setQuestions} from "../features/questions/QuestionsSlice";
import {useRouter} from "next/router";
import {setIsLoading} from "../features/isLoading/IsLoadingSlice";

interface Modal {
  handleClose: () => void;
  show: false | 'category' | 'difficulty' | 'type' | 'start' | 'playModal';
  title: string;
  style?: object;
  children: ReactNode;
}

const Modal = ({ handleClose, show, title, style, children }: Modal): JSX.Element => {
  const dispatch = useAppDispatch();
  const url = useAppSelector(selectUrl);
  const modalShow = useAppSelector(selectModal);
  const { current_question, results } = useAppSelector(selectQuestions);
  const { push } = useRouter();
  const {modal, modalmain, section, modaltitle, options, buttons} = styles;
  const showHideClassName = show ? `${modal} d-block` : `${modal} d-none`;

  return (
    <div className={showHideClassName}>
      <section className={modalmain}>
        <h2 className={modaltitle}>{title}</h2>
        <section className={section}>
          <div className={options} style={style}>
            {children}
          </div>
        </section>
        <div className={buttons}>
          {/*  TODO add buttons for return to home after all questions have been played + component to inject in modal*/}
          {
            modalShow
            && modalShow === 'start'
              ? <Button text={"Play"} classname={'primary'} link={'#'} onClick={() => {
                  handleLoader(true, dispatch);
                  fetchQuestions(url).then(data => dispatch(setQuestions(data)));
                  handleCloseModal(dispatch);
                  push("/play")
                }}
              />
              : modalShow && modalShow === 'playModal'
                ? <Button text={"Next"} classname={'primary'} onClick={() => {
                  if (results[current_question + 1]) {
                    dispatch(setCurrentQuestion(current_question + 1));
                  }

                  handleClose();
                }} style={{margin: 0}} />
                : <Button text={"Start"} classname={'primary'} onClick={() => handleShowModal(dispatch, 'start')} />
          }
          {
            modalShow
            && modalShow !== 'playModal'
              ? <Button text={"Close"} classname={'secondary'} onClick={handleClose} />
              : null
          }
        </div>
      </section>
    </div>
  );
};

export default Modal;