import React from "react";
import styles from "./Footer.module.css";



const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <h3>LOGO</h3>
          <p>© disponível para contratações</p>
        </div>
        <div className={styles.contacts}>
          <p>
            <a
              href="https://wa.me/31983536414"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </p>
          <p>
            <a
              href="https://www.linkedin.com/in/leonan-bazilio-662000281/"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
          <p>
            <a
              href="https://github.com/Leonan-Bazilio"
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
