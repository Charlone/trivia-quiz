import {useEffect, useState} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import {useUser} from "@auth0/nextjs-auth0/client";
import Header from "../src/components/Header";
import Modal from "../src/components/Modal";
import Button, {QuestionButton} from "../src/components/Button";
import Loader from "../src/components/Loader";
import Outcome from "../src/components/Outcome";
import Footer from "../src/components/Footer";
import Lottie from "lottie-react";
import {ToastContainer} from 'react-toastify';
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import {selectQuestions, setQuestions} from "../src/features/questions/QuestionsSlice";
import {selectIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {selectUrl} from "../src/features/url/UrlSlice";
import {selectSession, selectSessionFallback} from "../src/features/session/SessionSlice";
import {selectModal} from "../src/features/modalSelection/ModalSelectionSlice";
import {selectStats} from "../src/features/stats/statsSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {selectGuest} from "../src/features/guest/GuestSlice";
import {fetchQuestions} from "../src/features/questions/QuestionsAPI";
import {
  capitalise,
  customToast,
  handleCloseModal,
  handleLoader,
  handlePointsIncrement,
  handleShowModal,
  handleStatsIncrement,
  handleUrlSession,
  handleUserSessionExpired,
  resetToken,
  debounce
} from "../src/utils/Utils";
import styles from "../styles/pages/Play.module.scss";
import completed from "../src/lottie/completed.json";

export default function Play() {
  const dispatch = useAppDispatch();
  const {push} = useRouter();
  const userService = useUser();
  const {user} = useAppSelector(selectUser);
  const username = useAppSelector(selectGuest);
  const {current_question, results, response_code} = useAppSelector(selectQuestions);
  const {isLoading} = useAppSelector(selectIsLoading);
  const url = useAppSelector(selectUrl);
  const {token} = useAppSelector(selectSession);
  const fallbackSessionToken = useAppSelector(selectSessionFallback);
  const modalShow = useAppSelector(selectModal);
  const [chosen, setChosen] = useState<string>('');
  const {current_points, questions} = useAppSelector(selectStats);
  const [iteration, setIteration] = useState<number>(0);
  const [widthOfWindow, setWidthOfWindow] = useState<string>("");
  const {play, complete, playsection, gamegrid, header, questionstyle, submitcontainer} = styles;
  const gameScore = user.name
    ? current_points.find(userPointsObject => userPointsObject.user === user.name)?.points
    : current_points.find(userPointsObject => userPointsObject.user === username)?.points;

  const handleWindowSize = () => {
    window.innerWidth > 540 ? setWidthOfWindow('calc((100% - 96px) / 2)') : setWidthOfWindow('100%');
  }

  useEffect(() => {
    handleWindowSize();

    debounce(() => handleUserSessionExpired(dispatch, userService.user?.name, user.name, push), 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSize);

    return () => window.removeEventListener('resize load', handleWindowSize);
  }, [window.innerWidth]);

  useEffect(() => {
    setChosen("");
  }, [current_question])

  useEffect(() => {
    if (results.length > 0 && isLoading && ![3,4].includes(response_code)) {
      handleLoader(false, dispatch, true, 800);
    }

    if (response_code === 1) {
      handleShowModal(dispatch, 'noQuestions');
    }

    if ([3,4].includes(response_code)) {
      if (!isLoading) {
        handleLoader(true, dispatch);
      }

      if (response_code === 3) {
        resetToken(dispatch);
        handleUrlSession(url, token, fallbackSessionToken, dispatch);
        fetchQuestions(url).then(data => dispatch(setQuestions(data)));
      }

      if (response_code === 4 && iteration < 3) {
        setIteration(iteration + 1);
        resetToken(dispatch, token);
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

  return (
    <main className={play}>
      <Head>
        <title>Trivia in progress - Good Luck</title>
        <meta name="description" content="Game is in progress, good luck"/>
      </Head>
      <ToastContainer />
      {isLoading && <Loader text={"Loading"}/>}
      {
        modalShow
        && modalShow === 'playModal'
        && <Modal
          handleClose={() => handleCloseModal(dispatch)}
          show={"playModal"}
          style={{width: "100%"}}
          title={chosen === results[current_question].correct_answer ? "Correct" : "Wrong"}
          modalmainStyle={window.innerWidth > 540 ? {height: "unset"} : {height: "unset", top: '20%'}}
      >
          <Outcome result={chosen === results[current_question].correct_answer ? "correct" : "wrong"} />
      </Modal>}

      {
        !results[current_question + 1] && modalShow === 'gameFinished'
        && <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Completed round!"} style={{flexDirection: "column"}} modalmainStyle={window.innerWidth > 540 ? {height: "unset"} : {height: "unset", top: '10%'}}>
            <h5>You have played all questions in this round</h5>
            <p>Game score: {gameScore}</p>
          <Lottie className={complete} animationData={completed} loop={false} />
        </Modal>
      }

      {
        response_code === 4
        && iteration > 2
        || response_code === 1
          ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"No Questions Available"} style={{flexDirection: "column", textAlign: "left"}} modalmainStyle={{height: "unset"}}>
            <p>Oppsss... looks like there are no questions available for your selection!</p>
            <p>Please change question criteria from the home menu and try again.</p>
          </Modal>
          : null
      }

      <Header />

      <section className={playsection}>
        <div className={gamegrid}>
          <div className={header}>
            <h5 dangerouslySetInnerHTML={{__html: results[current_question]?.question}} />
          </div>

          <div className={questionstyle} style={window.innerWidth < 540 ? {flexDirection: "column"} : undefined}>
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
          <div className={submitcontainer}>
            <Button classname={'primary'} text={"Submit"} onClick={() => {
              if (![...results[current_question].incorrect_answers, results[current_question].correct_answer].includes(chosen)) {
                customToast('error', 'You must select at least one option!');

                return;
              }

              if (results[current_question].correct_answer === chosen) {
                handlePointsIncrement(
                  dispatch,
                  results,
                  current_question,
                  user && user.name ? user.name : username
                );
              }

              handleStatsIncrement(
                dispatch,
                user && user.name ? user.name : username,
                results,
                current_question,
                chosen,
                user && user.name
                  ? questions.find(questionStats => questionStats.user === user.name)
                  : questions.find(questionStats => questionStats.user === username)
              );

              handleShowModal(dispatch, 'playModal');
            }} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}