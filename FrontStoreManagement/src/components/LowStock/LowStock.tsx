import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./LowStock.module.css";
import generateLowStockPDF from "../../utils/generateLowStockPDF.js";
import Product from "../../types/Product.js";

const LowStock: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${baseUrl}/api/products`);
        const lowStock = response.data.filter(
          (product) => product.quantityInStock < product.lowStockLimit
        );
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Erro ao buscar produtos com baixo estoque:", error);
      }
    };

    fetchLowStockProducts();
  }, [baseUrl]);

  return (
    <div className={styles.lowStock}>
      <h2 className={styles.title}>Produtos com Estoque Baixo</h2>
      {lowStockProducts.length > 0 ? (
        <ul className={styles.list}>
          {lowStockProducts.map((product) => (
            <li className={styles.item} key={product.id}>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.quantity}>
                Estoque: {product.quantityInStock}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>
          Todos os produtos estão com estoque adequado.
        </p>
      )}
      <button
        onClick={() => generateLowStockPDF(lowStockProducts)}
        className={styles.exportButton}
      >
        Exportar PDF
      </button>
    </div>
  );
};

export default LowStock;
