import {useEffect} from "react";
import {useRouter} from "next/router";
import {useUser} from '@auth0/nextjs-auth0/client';
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Loader from "../src/components/Loader";
import Lottie from "lottie-react";
import {useAppDispatch, useAppSelector} from "../src/app/hooks";
import {selectGuest} from "../src/features/guest/GuestSlice";
import {selectStats} from "../src/features/stats/statsSlice";
import {selectUser} from "../src/features/user/UserSlice";
import {selectIsLoading} from "../src/features/isLoading/IsLoadingSlice";
import {fetchMaxCount, handleUserSessionExpired, uniqueValues} from "../src/utils/Utils";
import dancingBook from "../src/lottie/dancing-book.json";
import userStockImage from "../src/images/user.png";
import styles from "../styles/pages/Profile.module.scss";

export default function Profile() {
  const {push} = useRouter();
  const dispatch = useAppDispatch();
  const userService = useUser();
  const {user} = useAppSelector(selectUser);
  const username = useAppSelector(selectGuest);
  const {isLoading} = useAppSelector(selectIsLoading);
  const {current_points, categories, questions} = useAppSelector(selectStats);
  const {profile, profileContainer, content, data, picture, imageContainer, detailsContainer, gameData, table, book, animationContainer, stats, tableStats, info} = styles;
  const questionStats = user && user.name
    ? questions.find(questionStats => questionStats.user === user.name)
    : questions.find(questionStats => questionStats.user === username);
  const points = user && user.name
    ? current_points.find(userPointsObject => userPointsObject.user === user.name)?.points
    : current_points.find(userPointsObject => userPointsObject.user === username)?.points;
  const categoryStats = user && user.name
    ? categories.find(categoryObject => categoryObject.user === user.name)
    : categories.find(categoryObject => categoryObject.user === username)

  useEffect(() => {
    setTimeout(() => handleUserSessionExpired(dispatch, userService.user?.name, user.name, push), 1000);
  }, []);

  if (isLoading) return <Loader text={"Loading"} />;

  return (
    <main className={profile}>
      <Header />
      <div className={profileContainer}>
        <div className={content}>
          <div className={data}>
            <div className={imageContainer}>
              <img
                className={picture}
                src={user && user.picture ? user.picture : userStockImage.src}
                alt={user && user.name ? user.name : username}
              />
            </div>

            <div className={detailsContainer}>
              <h2>{user && user.name ? user.name : username}</h2>
              <p>{user && user.email ? user.email : ''}</p>
            </div>
          </div>

          <div className={gameData}>
            <div className={stats}>
              <p>Categories played: {
                categoryStats
                && categoryStats.categoriesPlayed.length === 0
                  ? 'None'
                  : uniqueValues(categoryStats && categoryStats.categoriesPlayed)
              }</p>
              <p>Most chosen category: {fetchMaxCount(categoryStats && categoryStats.categoriesPlayed).name || 'None'}</p>
              <p>Total number of questions answered: {questionStats && questionStats.correct + questionStats.wrong}</p>
              <p>Total correct answered questions: {questionStats && questionStats.correct}</p>
              <p>Total incorrect answered questions: {questionStats && questionStats.wrong}</p>
              <p>Total points: {points}</p>
            </div>

            <div className={tableStats}>
              <table className={table}>
                <thead>
                <tr>
                  <td></td>
                  <td>Easy</td>
                  <td>Medium</td>
                  <td>Hard</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Questions</td>
                  <td>{questionStats && questionStats.easy}</td>
                  <td>{questionStats && questionStats.medium}</td>
                  <td>{questionStats && questionStats.hard}</td>
                </tr>
                </tbody>
              </table>

              <p className={info}>Points earned per difficulty:</p>
              <ul className={info}>
                <li>Easy: 5</li>
                <li>Medium: 10</li>
                <li>Hard: 20</li>
              </ul>
            </div>
          </div>

          <div className={animationContainer}>
            <Lottie className={book} animationData={dancingBook} loop={true} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}