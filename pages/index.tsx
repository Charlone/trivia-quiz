import {useEffect} from "react";
import {useRouter} from 'next/router';
import Head from 'next/head';
import Button from "../src/components/Button";
import Loader from "../src/components/Loader";
import Footer from "../src/components/Footer";
import Lottie from "lottie-react";
import {ToastContainer} from "react-toastify";
import {useUser} from '@auth0/nextjs-auth0/client';
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import {setUser, selectUser} from "../src/features/user/UserSlice";
import {selectIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {setInitialUrl} from "../src/features/url/UrlSlice";
import {customToast, handleLoader, resetPlay} from "../src/utils/Utils";
import welcome from "../src/lottie/welcome.json";
import styles from '../styles/pages/Index.module.scss';

export default function Index() {
  const {push} = useRouter();
  const dispatch = useAppDispatch();
  const {user} = useUser();
  const stateUser = useAppSelector(selectUser);
  const {isLoading} = useAppSelector(selectIsLoading);
  const {main, section, container, homeSection, title, subTitle, buttonSection, welcomeAnimation} = styles;

  useEffect(() => {
    handleLoader(true, dispatch);

    if (user && user.name !== stateUser.user.name) {
      dispatch(setUser(user));
      dispatch(setInitialUrl());
      customToast("success", "Logged in, redirecting to game!!");
      resetPlay(dispatch);
    }

    if (user && stateUser.user.name === user.name) {
      handleLoader(false, dispatch, true, 500);
      setTimeout(() => push(`/home`), 1000);
    }

    handleLoader(false, dispatch, true, 4500);
  }, [user, stateUser.user.name]);

  return (
    <section className={section}>
      <Head>
        <title>Lets Trivia?</title>
        <meta name="description" content="Trivia game"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <ToastContainer />
      {
        user || isLoading ? <Loader text={"Loading"}/> : null
      }

      <div className={container}>
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
            <Lottie animationData={welcome} loop={false} className={welcomeAnimation} />
          </section>
        </main>
      </div>
      <Footer />
    </section>
  )
}
