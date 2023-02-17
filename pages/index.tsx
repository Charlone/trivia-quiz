import Head from 'next/head';
import Button from "../src/components/Button";
import Loader from "../src/components/Loader";
import Footer from "../src/components/Footer";
import Lottie from "lottie-react";
import {useUser} from '@auth0/nextjs-auth0/client';
import {useRouter} from 'next/router';
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import {setUser} from "../src/features/user/UserSlice";
import {selectIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {handleLoader} from "../src/utils/Utils";
import welcome from "../src/lottie/welcome.json";
import styles from '../styles/pages/Index.module.scss';

export default function Index() {
    const {user} = useUser();
    const {push} = useRouter();
    const dispatch = useAppDispatch();
    const {isLoading} = useAppSelector(selectIsLoading);
    const {main, section, container, homeSection, title, subTitle, buttonSection} = styles;
    
    useEffect(() => {
        handleLoader(true, dispatch);

        if (user) {
            dispatch(setUser(user));
            setTimeout(() => push(`/home`), 500);
        }

        handleLoader(false, dispatch, true, 4500);
    }, [user]);

    return (
        <section className={section}>
            {
                user || isLoading ? <Loader text={"Loading"}/> : null
            }

            <div className={container}>
                <Head>
                    <title>Lets Trivia?</title>
                    <meta name="description" content="Trivia game"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <main className={main}>
                    <section className={homeSection}>
                        <h3 className={subTitle}>Lets</h3>
                        <h1 className={title}>Trivia?</h1>
                        <div className={buttonSection}>
                            <Button
                                link={'/api/auth/login'}
                                classname={'primary'}
                                text={'Login to Play'}
                            />
                            <Button
                                link={'/home'}
                                classname={'secondary'}
                                text={'Play as Guest'}
                            />
                        </div>
                        <Lottie animationData={welcome} loop={false} className={styles.welcome} />
                    </section>
                </main>
            </div>
            <Footer />
        </section>
    )
}
