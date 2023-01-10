import styles from "../../styles/components/Loader.module.scss";

interface Loader {
    text: string;
}

export default function Loader({text}: Loader): JSX.Element {
    const {section, loader} = styles;

    return (
        <section className={section}>
            <span>{text}</span>
            <span className={loader}></span>
        </section>
    )
}
