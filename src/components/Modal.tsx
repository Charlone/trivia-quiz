import React, {ReactNode} from "react";
import {useRouter} from "next/router";
import Button from "./Button";
import {fetchQuestions} from "../features/questions/QuestionsAPI";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectModal} from "../features/modalSelection/ModalSelectionSlice";
import {selectUrl} from "../features/url/UrlSlice";
import {selectQuestions, setCurrentQuestion, setQuestions} from "../features/questions/QuestionsSlice";
import {addCategoryPlayed} from "../features/stats/statsSlice";
import {selectCategories, selectChosenCategory} from "../features/category/CategorySlice";
import {selectUser} from "../features/user/UserSlice";
import {selectGuest} from "../features/guest/GuestSlice";
import {
  cleanCategoryName,
  handleCloseModal,
  handleLoader,
  handleShowModal,
} from "../utils/Utils";
import styles from '../../styles/components/Modal.module.scss';

interface Modal {
  handleClose: () => void;
  show: false | 'category' | 'difficulty' | 'type' | 'start' | 'playModal' | 'gameFinished' | 'noQuestions';
  title: string;
  style?: object;
  children: ReactNode;
  modalmainStyle?: object
}

const Modal = ({ handleClose, show, title, style, children, modalmainStyle = {} }: Modal): JSX.Element => {
  const {push} = useRouter();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(selectUser);
  const username = useAppSelector(selectGuest);
  const url = useAppSelector(selectUrl);
  const modalShow = useAppSelector(selectModal);
  const {current_question, results} = useAppSelector(selectQuestions);
  const categories = useAppSelector(selectCategories);
  const chosenCategory = useAppSelector(selectChosenCategory);
  const chosenCategoryName: {name: string} = chosenCategory === 'mixed'
    ? {name: 'Mixed'}
    : categories
      .filter(category => category.id === +chosenCategory)
      .reduce(cat => cat);
  const {modal, modalmain, section, modaltitle, options, buttons} = styles;
  const showHideClassName = show ? `${modal} d-block` : `${modal} d-none`;

  return (
    <div className={showHideClassName}>
      <section
        className={modalmain}
        style={modalmainStyle}
      >
        <h2 className={modaltitle}>{title}</h2>
        <section className={section}>
          <div
            className={options}
            style={style}
          >
            {children}
          </div>
        </section>
        <div className={buttons}>
          {
            modalShow
            && modalShow === 'start'
              ? <Button text={"Play"} classname={'primary'} link={'#'} onClick={(event: { preventDefault: () => void; }) => {
                  event.preventDefault();
                  handleLoader(true, dispatch);
                  fetchQuestions(url).then(data => dispatch(setQuestions(data)));
                  handleCloseModal(dispatch);
                  dispatch(addCategoryPlayed({
                    user: user && user.name
                      ? user.name
                      : username,
                    categoriesPlayed: cleanCategoryName(chosenCategoryName.name)
                  }));
                  push("/play");
                }}
              />
              : modalShow && modalShow === 'playModal'
                ? <Button text={"Next"} classname={'primary'} onClick={() => {
                  if (results[current_question + 1]) {
                    dispatch(setCurrentQuestion(current_question + 1));
                    handleClose();
                  } else {
                    handleShowModal(dispatch, 'gameFinished');
                  }
                }} style={{margin: 0}} />
              : modalShow && modalShow === 'gameFinished'
                ? <>
                    <Button classname={'primary'} text={'Play Again'} onClick={() => {
                        handleLoader(true, dispatch);
                        dispatch(setCurrentQuestion(0));
                        fetchQuestions(url).then(data => dispatch(setQuestions(data)));
                        handleCloseModal(dispatch);
                      }}
                    />
                    <Button classname={'secondary'} text={'Home'} link={'/home'} />
                  </>
              : modalShow && modalShow === 'noQuestions'
                ? <Button classname={'primary'} text={'Home'} link={'/home'} />
                : <Button text={"Start"} classname={'primary'} onClick={() => handleShowModal(dispatch, 'start')} />
          }
          {
            modalShow
            && modalShow !== 'playModal'
            && modalShow !== 'gameFinished'
            && modalShow !== 'noQuestions'
            && <Button text={"Close"} classname={'secondary'} onClick={handleClose} />
          }
        </div>
      </section>
    </div>
  );
};

export default Modal;