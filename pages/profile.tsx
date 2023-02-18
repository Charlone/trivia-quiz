import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Lottie from "lottie-react";
import dancingBook from "../src/lottie/dancing-book.json";
import styles from "../styles/pages/Profile.module.scss";

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const {push} = useRouter();
  const {profile, profileContainer, content, data, picture, imageContainer, detailsContainer, gameData, table, book, animationContainer} = styles;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    push('/home');
  }

  return (
    user && (
      <main className={profile}>
        <Header />
        <div className={profileContainer}>
          <div className={content}>
            <div className={data}>
              <div className={imageContainer}>
                <img className={picture} src={user.picture ? user.picture : ''} alt={user.name ? user.name : ''} />
              </div>

              <div className={detailsContainer}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <div className={gameData}>
              <p>Categories played:</p>
              <p>Most chosen category: </p>
              <p>Total number of questions answered: 0</p>
              <p>Total correct answered questions: 0</p>
              <p>Total incorrect answered questions: 0</p>
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
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Points</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div className={animationContainer}>
              <Lottie className={book} animationData={dancingBook} loop={true} />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  );
}