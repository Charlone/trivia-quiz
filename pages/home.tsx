import {useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Modal from "../src/components/Modal";
import Prestart from "../src/components/Prestart";
import {useUser} from '@auth0/nextjs-auth0/client';
import useSession from "../src/features/session/useSession";
import {Category} from "../src/features/category/Category";
import {Difficulty} from "../src/features/difficulty/Difficulty";
import {Type} from "../src/features/type/Type";
import {selectModal} from "../src/features/modalSelection/ModalSelectionSlice";
import {selectCategories, selectCategoryOverallCount} from "../src/features/category/CategorySlice";
import {setUpCategories, handleCloseModal, handleShowModal, setUpCategoryCount} from "../src/utils/Utils";
import styles from "../styles/Home.module.scss";

export default function Home(this: any) {
    const { user } = useUser();
    const {token, response_code, response_message} = useSession();
    const modalShow = useAppSelector(selectModal);
    const categories = useAppSelector(selectCategories);
    const overall = useAppSelector(selectCategoryOverallCount);
    const dispatch = useAppDispatch();
    const {home, main, props, image, startbutton} = styles;
    // console.log(token, response_code, response_message);

    useEffect(() => {
        setUpCategories(categories, dispatch);

        setUpCategoryCount(overall, dispatch);

        return () => {}
    }, [categories, overall]);

    return (
        <main className={home}>
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
                    <Image className={startbutton} src={require("../src/images/quiz-button.png")} alt={"start quiz"} priority={true} width={150} height={150} />
                </Link>
            </section>

            <Footer />
        </main>
    );
}
