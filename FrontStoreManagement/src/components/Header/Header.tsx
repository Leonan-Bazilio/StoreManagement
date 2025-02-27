import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

interface DropdownItem {
  title: string;
  links: { to: string; text: string }[];
}

const Header: React.FC = () => {
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
      <div className={styles.logo}>LEO</div>
      <nav className={styles.nav}>
        {dropdownItems.map((item) => (
          <div className={styles.dropdown} key={item.title}>
            <div className={styles.dropdownTitle}>{item.title}</div>
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
    </header>
  );
};

export default Header;
