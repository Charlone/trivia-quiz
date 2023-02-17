import Lottie from "lottie-react";
import wrong from "../lottie/wrong.json";
import correct from "../lottie/correct.json";
import Image from "next/image";
import crown from "../images/crown.png";
import cross from "../images/cross.png";
import styles from "../../styles/components/Outcome.module.scss";

interface Outcome {
    result: 'correct' | 'wrong';
}

const Win = (): JSX.Element => {
    return (
        <>
            <div className={styles.content}>
              <div className={styles.imageContainer}>
                {/*<Image className={styles.winicon} src={crown} alt={"crown"} width={40} />*/}
                <Lottie animationData={correct} loop={true} className={styles.winicon} />
              </div>
              <div className={styles.contentContainer}>
                <h5 className={styles.text}>Hooray your answer is correct! Well done!</h5>
              </div>
            </div>
        </>
    );
}

const Lose = (): JSX.Element => {
    return (
        <>
            <div className={styles.content}>
              <div className={styles.imageContainer}>
                {/*<Image className={styles.loseicon} src={cross} alt={"cross"} width={40} />*/}
                <Lottie animationData={wrong} loop={false} className={styles.loseicon} />
              </div>
              <div className={styles.contentContainer}>
                <h5 className={styles.text}>The answer you have chosen is incorrect, better luck next time</h5>
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