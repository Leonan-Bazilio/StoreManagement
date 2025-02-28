import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ShowProducts.module.css";
import InputField from "../InputField/InputField";
import ProductDetails from "../ProductDetails/ProductDetails";
import Product from "../../types/Product";

const ShowAllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const truncateDescription = (
    description: string,
    maxLength: number
  ): string => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleClose = (): void => {
    setSelectedProduct(null);
  };
  const fetchProducts = async (): Promise<void> => {
    setFetching(true);
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setFetching(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Produtos Cadastrados</h1>
      <InputField
        type="text"
        textLabel="Pesquisar por nome do produto..."
        nameAndId={"searchProduct"}
        value={searchTerm}
        onChange={handleSearch}
        divClassName={styles.searchInput}
      />
      {fetching ? (
        <p className={styles.loading}>Carregando produtos...</p>
      ) : filteredProducts.length === 0 ? (
        <h1 className={styles.emptyList}>Não tem nenhum</h1>
      ) : (
        <div className={styles.productList}>
          {filteredProducts.map((prod) => (
            <div
              className={styles.productCard}
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
            >
              <img
                src={`${baseUrl}/uploads/${prod.imagePath}`}
                alt={prod.name}
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{prod.name}</h3>
                <p className={styles.productDescription}>
                  {truncateDescription(prod.description, 40)}
                </p>
                <p className={styles.productPrice}>
                  <strong>Preço:</strong> R$ {prod.sellingPrice.toFixed(2)}
                </p>
                <p className={styles.productStock}>
                  <strong>Estoque:</strong> {prod.quantityInStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleClose}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

export default ShowAllProducts;
