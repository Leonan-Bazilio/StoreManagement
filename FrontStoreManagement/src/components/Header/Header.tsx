import React, { useContext } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { IoIosArrowDown } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";

interface DropdownItem {
  title: string;
  links: { to: string; text: string }[];
}

const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  const dropdownItems: DropdownItem[] = [
    {
      title: "Produto",
      links: [
        { to: "/add-product", text: "Cadastrar Produto" },
        { to: "/show-product", text: "Mostrar Produto" },
      ],
    },
    {
      title: "Vendas",
      links: [
        { to: "/manage-sales", text: "Efetuar Venda" },
        { to: "/sales-history", text: "Histórico de Vendas" },
      ],
    },
    {
      title: "Gestão",
      links: [
        { to: "/low-stock", text: "Baixo Estoque" },
        { to: "/profit-overview", text: "Gastos e Lucros" },
      ],
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h3>Mercearia Cardoso</h3>
      </div>
      <nav className={styles.nav}>
        {dropdownItems.map((item) => (
          <div className={styles.dropdown} key={item.title}>
            <div className={styles.dropdownTitle}>
              <h4>{item.title}</h4>
              <IoIosArrowDown className={styles.arrow} />
            </div>
            <div className={styles.dropdownContent}>
              {item.links.map((link) => (
                <Link to={link.to} className={styles.link} key={link.to}>
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button onClick={toggleTheme} className={styles.themeToggle}>
        <div className={styles.themeSwitch}>
          <MdLightMode
            className={`${styles.icon} ${
              theme === "light" ? styles.active : ""
            } ${styles.iconSun}`}
          />
          <MdDarkMode
            className={`${styles.icon} ${
              theme === "dark" ? styles.active : ""
            } ${styles.iconMoon}`}
          />
        </div>
      </button>
    </header>
  );
};

export default Header;
