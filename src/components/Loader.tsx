import styles from "../../styles/components/Loader.module.scss";

export default function Loader() {
    const {section, loader} = styles;

    return (
        <section className={section}>
            <span>Loading</span>
            <span className={loader}></span>
        </section>
    )
}
