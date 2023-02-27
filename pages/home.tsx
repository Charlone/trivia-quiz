import {useEffect, useState} from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/router";
import {useUser} from '@auth0/nextjs-auth0/client';
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Modal from "../src/components/Modal";
import Prestart from "../src/components/Prestart";
import Loader from "../src/components/Loader";
import {ToastContainer} from "react-toastify";
import {Category} from "../src/features/category/Category";
import {Difficulty} from "../src/features/difficulty/Difficulty";
import {Type} from "../src/features/type/Type";
import {selectModal} from "../src/features/modalSelection/ModalSelectionSlice";
import {selectCategories} from "../src/features/category/CategorySlice";
import {selectSession, selectSessionFallback} from "../src/features/session/SessionSlice";
import {selectUrl} from "../src/features/url/UrlSlice";
import {selectIsLoading, setIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {selectQuestions, setCurrentQuestion} from "../src/features/questions/QuestionsSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {
  setUpCategories,
  handleCloseModal,
  handleShowModal,
  generateToken,
  handleUrlSession,
  handleUserSessionExpired,
  debounce
} from "../src/utils/Utils";
import styles from "../styles/pages/Home.module.scss";

export default function Home() {
  const {push} = useRouter();
  const userService = useUser();
  const {user} = useAppSelector(selectUser);
  const {token, response_code} = useAppSelector(selectSession);
  const fallbackSessionToken = useAppSelector(selectSessionFallback);
  const url = useAppSelector(selectUrl);
  const modalShow = useAppSelector(selectModal);
  const categories = useAppSelector(selectCategories);
  const {isLoading} = useAppSelector(selectIsLoading);
  const {current_question} = useAppSelector(selectQuestions);
  const dispatch = useAppDispatch();
  const [width, setWidth] = useState(window.innerWidth);
  const {home, main, props, image, startbutton} = styles;

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading({isLoading: false}));
    }

    debounce(() => handleUserSessionExpired(dispatch, userService.user?.name, user.name, push), 1000);

    current_question > 0 && dispatch(setCurrentQuestion(0));
  },[]);

  useEffect(() => {
    window.addEventListener('resize', handleWidth);

    return () => window.removeEventListener('resize', handleWidth);
  }, [window.innerWidth]);

  useEffect(() => {
    generateToken(token, response_code, dispatch);

    if (token !== fallbackSessionToken) {
      handleUrlSession(url, token, fallbackSessionToken, dispatch);
    }

    return () => {}
  }, [token, response_code]);

  useEffect(() => {
    setUpCategories(categories, dispatch);

    return () => {}
  }, [categories]);

  const handleWidth = () => {
    setWidth(window.innerWidth);
  }

  return (
    <main className={home}>
      <Head>
        <title>Choose settings to play</title>
        <meta name="description" content="Choose your game settings to play"/>
      </Head>

      {
        isLoading
        && <Loader text={"Loading"} />
      }

      <ToastContainer />
      <Header />

      <section className={main}>
        <div className={props}>
          <Image className={image} src={require("../src/images/wheel.png")} alt={"confused icon"} />
          <Image className={image} src={require("../src/images/quiz-tv.png")} alt={"Quiz TV"} />
          <Image className={image} src={require("../src/images/multiple-question.png")} alt={"multiple question choosing"} />
        </div>
        {
          modalShow
          && modalShow === 'category'
            ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Categories"} style={{flexDirection: "column"}}><Category /></Modal>
            : modalShow === 'difficulty'
              ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Difficulty Level"} style={{flexDirection: "column"}} modalmainStyle={width > 540 ? {height: "unset"} : {height: "unset", top: '20%'}}><Difficulty /></Modal>
              : modalShow === 'type'
                ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Question Type"} style={width > 540 ? {width: "100%", flexDirection: "row"} : {width: "100%", flexDirection: "column"}} modalmainStyle={{height: "unset"}}><Type /></Modal>
                : modalShow === 'start'
                  ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Play with the below settings?"} style={{width: "100%"}}><Prestart /></Modal>
                  : null
        }
        <Link href={'#'} onClick={(event) => {
          event.preventDefault();
          handleShowModal(dispatch, "start");
        }}>
          <Image
            className={startbutton}
            src={require("../src/images/quiz-button.png")}
            alt={"start quiz"}
            width={100}
            height={100}
          />
        </Link>
      </section>

      <Footer />
    </main>
  );
}
