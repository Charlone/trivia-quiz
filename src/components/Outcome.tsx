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
                <Image className={styles.winicon} src={crown} alt={"crown"} width={40} />
                <h5>Hooray your answer is correct! Well done!</h5>
            </div>
        </>
    );
}

const Lose = (): JSX.Element => {
    return (
        <>
            <div className={styles.content}>
                <Image className={styles.loseicon} src={cross} alt={"cross"} width={40} />
                <h5>The answer you have chosen is incorrect, better luck next time</h5>
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