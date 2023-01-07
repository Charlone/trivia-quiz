import styles from '../../styles/components/Footer.module.scss';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <a
                href="https://charlone-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Developed by Charlone Agius
            </a>
        </footer>
    );
}

export default Footer;