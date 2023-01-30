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
    handleShowModal,
    handleUrlSession,
    resetToken
} from "../src/utils/Utils";
import Loader from "../src/components/Loader";
import styles from "../styles/pages/Play.module.scss";
import Outcome from "../src/components/Outcome";
import {incrementPoints} from "../src/features/points/PointsSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {selectGuest} from "../src/features/guest/GuestSlice";

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

    useEffect(() => {
        if (results.length > 0 && isLoading) {
            handleLoader(false, dispatch);
        }

        if ([3,4].includes(response_code)) {
            resetToken(dispatch);
            handleUrlSession(url, token, fallbackSessionToken, dispatch);
            fetchQuestions(url).then(data => dispatch(setQuestions(data)));
        }

        return () => handleLoader(false, dispatch);
    }, [isLoading, results]);

    return (
        <main className={styles.play}>
            {isLoading && <Loader text={"Loading"}/>}
            {modalShow && modalShow === 'playModal' && <Modal
                handleClose={() => handleCloseModal(dispatch)}
                show={"playModal"}
                title={chosen === results[current_question].correct_answer ? "Correct" : "Wrong"}
            >
                <Outcome result={chosen === results[current_question].correct_answer ? "correct" : "wrong"} />
            </Modal>}

            <Head>
                <title>Choose settings to play</title>
                <meta name="description" content="Choose your game settings to play"/>
            </Head>

            <Header />

            <section className={styles.playsection}>
                <div className={styles.gamegrid}>
                    <div className={styles.header}>
                        <h5 dangerouslySetInnerHTML={{ __html: results[current_question]?.question}} />
                    </div>

                    <div className={styles.questions}>
                        {
                            [...results[current_question].incorrect_answers, results[current_question].correct_answer]
                                .sort()
                                .map(answer => <QuestionButton
                                    key={answer}
                                    text={capitalise(answer)}
                                    selector={answer}
                                    id={answer}
                                    checked={answer === chosen}
                                    style={chosen === answer ? {border: '3px solid white', width: 'calc((100% - 96px) / 2)'} : {width: 'calc((100% - 96px) / 2)'}}
                                    onChange={() => setChosen(answer)}
                                />)
                        }
                    </div>
                    <div className={styles.submitcontainer}>
                        <Button classname={'primary'} text={"Submit"} onClick={() => {
                            if (results[current_question].correct_answer === chosen) {
                                let pointsToAdd = 0;

                                switch (results[current_question].difficulty) {
                                    case 'easy': pointsToAdd = 10; break;
                                    case 'medium': pointsToAdd = 15; break;
                                    case 'hard': pointsToAdd = 20; break;
                                    default: return;
                                }

                                dispatch(incrementPoints({user: user && user.name ? user.name : username, points: pointsToAdd}))
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