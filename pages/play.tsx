import {useEffect, useState} from "react";
import Head from "next/head";
import Header from "../src/components/Header";
import Modal from "../src/components/Modal";
import Button, {QuestionButton} from "../src/components/Button";
import Footer from "../src/components/Footer";
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import {selectQuestions, setQuestions} from "../src/features/questions/QuestionsSlice";
import {selectIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {selectUrl} from "../src/features/url/UrlSlice";
import {selectSession, selectSessionFallback} from "../src/features/session/SessionSlice";
import {selectModal} from "../src/features/modalSelection/ModalSelectionSlice";
import {fetchQuestions} from "../src/features/questions/QuestionsAPI";
import {
  capitalise,
  handleCloseModal,
  handleLoader,
  handlePointsIncrement,
  handleShowModal,
  handleUrlSession,
  resetToken
} from "../src/utils/Utils";
import Loader from "../src/components/Loader";
import styles from "../styles/pages/Play.module.scss";
import Outcome from "../src/components/Outcome";
import {selectPoints} from "../src/features/points/PointsSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {selectGuest} from "../src/features/guest/GuestSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Play() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectUser);
  const username = useAppSelector(selectGuest);
  const { current_question, results, response_code } = useAppSelector(selectQuestions);
  const {isLoading} = useAppSelector(selectIsLoading);
  const url = useAppSelector(selectUrl);
  const {token} = useAppSelector(selectSession);
  const fallbackSessionToken = useAppSelector(selectSessionFallback);
  const modalShow = useAppSelector(selectModal);
  const [chosen, setChosen] = useState<string>('');
  const {current_points} = useAppSelector(selectPoints);
  const [iteration, setIteration] = useState<number>(0);
  const [widthOfWindow, setWidthOfWindow] = useState<string>('');

  useEffect(() => {
    window.addEventListener('resize', handleWindowSize);

    return () => window.removeEventListener('resize load', handleWindowSize);
  }, [window.innerWidth]);

  useEffect(() => {
    if (results.length > 0 && isLoading && ![3,4].includes(response_code)) {
      setTimeout(() => handleLoader(false, dispatch), 800);
    }

    if ([3,4].includes(response_code)) {
      if (!isLoading) {
        handleLoader(true, dispatch);
      }

      if (response_code === 3 || response_code === 4 && iteration < 3) {
        setIteration(iteration + 1);
        resetToken(dispatch);
        handleUrlSession(url, token, fallbackSessionToken, dispatch);
        fetchQuestions(url).then(data => dispatch(setQuestions(data)));
      } else {
        handleShowModal(dispatch, 'noQuestions');
      }
    } else {
      if (iteration > 2) {
        setIteration(0);
      }
    }
  }, [isLoading, results, response_code]);

  if (response_code === 3) {
    return;
  }

  const handleWindowSize = () => {
    window.innerWidth > 540 ? setWidthOfWindow('calc((100% - 96px) / 2)') : setWidthOfWindow('100%');
  }

  return (
    <main className={styles.play}>
      <ToastContainer />
      {isLoading && <Loader text={"Loading"}/>}
      {
        modalShow
        && modalShow === 'playModal'
        && <Modal
          handleClose={() => handleCloseModal(dispatch)}
          show={"playModal"}
          title={chosen === results[current_question].correct_answer ? "Correct" : "Wrong"}
          modalmainStyle={window.innerWidth > 540 ? {height: "unset"} : {height: "unset", top: '20%'}}
      >
          <Outcome result={chosen === results[current_question].correct_answer ? "correct" : "wrong"} />
      </Modal>}

      {
        !results[current_question + 1] && modalShow === 'gameFinished'
        && <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Completed round!"} style={{flexDirection: "column"}} modalmainStyle={window.innerWidth > 540 ? {height: "unset"} : {height: "unset", top: '20%'}}>
            <h5>You have played all questions in this round</h5>
            <p>Game score: {
              user.name
                ? current_points.find(userPointsObject => userPointsObject.user === user.name)?.points
                : current_points.find(userPointsObject => userPointsObject.user === username)?.points
            }</p>
        </Modal>
      }

      {
        response_code === 4
        && iteration > 2
        && <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"No Questions Available"} style={{flexDirection: "column", textAlign: "left"}}>
        <p>Oppsss... looks like there are no questions available for your selection!</p>
        <p>Please change question criteria from the home menu and try again.</p>
        </Modal>
      }

      <Head>
        <title>Choose settings to play</title>
        <meta name="description" content="Choose your game settings to play"/>
      </Head>

      <Header />

      <section className={styles.playsection}>
        <div className={styles.gamegrid}>
          <div className={styles.header}>
            <h5 dangerouslySetInnerHTML={{ __html: results[current_question]?.question }} />
          </div>

          <div className={styles.questions} style={window.innerWidth < 540 ? {flexDirection: "column"} : undefined}>
            {
              results
              && results[current_question]
              && results[current_question].incorrect_answers
              && results[current_question].correct_answer
              && [...results[current_question].incorrect_answers, results[current_question].correct_answer]
                .sort()
                .map(answer => <QuestionButton
                  key={answer}
                  text={capitalise(answer)}
                  selector={answer}
                  id={answer}
                  checked={answer === chosen}
                  style={chosen === answer ? {border: '3px solid white', width: widthOfWindow} : {width: widthOfWindow}}
                  onChange={() => setChosen(answer)}
                />)
            }
          </div>
          <div className={styles.submitcontainer}>
            <Button classname={'primary'} text={"Submit"} onClick={() => {
              if (![...results[current_question].incorrect_answers, results[current_question].correct_answer].includes(chosen)) {
                toast.error('You must select at least one option!', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });

                return;
              }

              if (results[current_question].correct_answer === chosen) {
                handlePointsIncrement(
                  dispatch,
                  results,
                  current_question,
                  user && user.name ? user.name : username
                )
              }

              handleShowModal(dispatch, 'playModal')
            }} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}