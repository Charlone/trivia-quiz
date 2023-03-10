import styles from '../../styles/components/Footer.module.scss';

const Footer = (): JSX.Element => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://charlone-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Developed by Charlone Agius - Portfolio App
      </a>
    </footer>
  );
}

export default Footer;