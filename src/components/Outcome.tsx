import Lottie from "lottie-react";
import wrong from "../lottie/wrong.json";
import correct from "../lottie/correct.json";
import styles from "../../styles/components/Outcome.module.scss";

interface Outcome {
  result: 'correct' | 'wrong';
}

const Win = (): JSX.Element => {
  const {content, imageContainer, winicon, contentContainer, text} = styles;

    return (
      <>
        <div className={content}>
          <div className={imageContainer}>
            <Lottie
              animationData={correct}
              loop={true}
              className={winicon}
            />
          </div>
          <div className={contentContainer}>
            <h5 className={text}>Hooray your answer is correct! Well done!</h5>
          </div>
        </div>
      </>
    );
}

const Lose = (): JSX.Element => {
  const {content, imageContainer, loseicon, contentContainer, text} = styles;

  return (
    <>
      <div className={content}>
        <div className={imageContainer}>
          <Lottie
            animationData={wrong}
            loop={false}
            className={loseicon}
          />
        </div>
        <div className={contentContainer}>
          <h5 className={text}>The answer you have chosen is incorrect, better luck next time</h5>
        </div>
      </div>
    </>
  );
}

const Outcome = ({result}: Outcome): JSX.Element => {
  return (
    <section className={styles.outcome}>
      {
        result === 'correct'
          ? <Win />
          : <Lose />
      }
    </section>
  );
}

export default Outcome;