import React from "react";
import { FaWhatsapp, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa"; // Importando os ícones
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contacts}>
        <p>
          <a
            href="https://wa.me/31983536414"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} style={{ marginRight: "8px" }} /> WhatsApp
          </a>
        </p>
        <p>
          <a
            href="https://www.linkedin.com/in/leonan-bazilio-662000281/"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={20} style={{ marginRight: "8px" }} /> LinkedIn
          </a>
        </p>
        <p>
          <a
            href="https://github.com/Leonan-Bazilio"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={20} style={{ marginRight: "8px" }} /> GitHub
          </a>
        </p>
        <p>
          <a href="mailto:leonanbaziliodev@gmail.com" className={styles.link}>
            <FaEnvelope size={20} style={{ marginRight: "8px" }} /> Email
          </a>
        </p>
      </div>
      <div className={styles.brand}>
        <h3>LOGO</h3>
      </div>
    </footer>
  );
};

export default Footer;
