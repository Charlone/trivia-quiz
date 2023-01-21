import {useEffect} from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Modal from "../src/components/Modal";
import Prestart from "../src/components/Prestart";
import {Category} from "../src/features/category/Category";
import {Difficulty} from "../src/features/difficulty/Difficulty";
import {Type} from "../src/features/type/Type";
import {selectModal} from "../src/features/modalSelection/ModalSelectionSlice";
import {selectCategories, selectCategoryOverallCount} from "../src/features/category/CategorySlice";
import {selectSession, selectSessionFallback} from "../src/features/session/SessionSlice";
import {selectUrl} from "../src/features/url/UrlSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {
    setUpCategories,
    handleCloseModal,
    handleShowModal,
    setUpCategoryCount,
    generateToken,
    handleUrlSession
} from "../src/utils/Utils";
import styles from "../styles/pages/Home.module.scss";

export default function Home() {
    const { user } = useAppSelector(selectUser);
    const {token, response_code, response_message} = useAppSelector(selectSession);
    const fallbackSessionToken = useAppSelector(selectSessionFallback);
    const url = useAppSelector(selectUrl);
    const modalShow = useAppSelector(selectModal);
    const categories = useAppSelector(selectCategories);
    const overall = useAppSelector(selectCategoryOverallCount);
    const dispatch = useAppDispatch();
    const {home, main, props, image, startbutton} = styles;

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

    useEffect(() => {
        setUpCategoryCount(overall, dispatch);

        return () => {}
    }, [overall]);

    return (
        <main className={home}>
            <Head>
                <title>Choose settings to play</title>
                <meta name="description" content="Choose your game settings to play"/>
            </Head>
            <Header />
            <section className={main}>
                <div className={props}>
                    <Image priority={true} className={image} src={require("../src/images/wheel.png")} alt={"confused icon"} />
                    <Image priority={true} className={image} src={require("../src/images/quiz-tv.png")} alt={"Quiz TV"} />
                    <Image priority={true} className={image} src={require("../src/images/multiple-question.png")} alt={"multiple question choosing"} />
                </div>
                {
                    modalShow
                    && modalShow === 'category'
                        ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Categories"} style={{flexDirection: "column"}}><Category /></Modal>
                        : modalShow === 'difficulty'
                            ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Difficulty Level"} style={{flexDirection: "column"}}><Difficulty /></Modal>
                            : modalShow === 'type'
                                ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Question Type"} style={{width: "100%"}}><Type /></Modal>
                                : modalShow === 'start'
                                    ? <Modal handleClose={() => handleCloseModal(dispatch)} show={modalShow} title={"Play with the below settings?"} style={{width: "100%"}}><Prestart /></Modal>
                                : null
                }
                <Link href={'#'} onClick={(event) => {
                    event.preventDefault();
                    handleShowModal(dispatch, "start");
                }}>
                    <Image className={startbutton} src={require("../src/images/quiz-button.png")} alt={"start quiz"} priority={true} width={100} height={100} />
                </Link>
            </section>

            <Footer />
        </main>
    );
}
