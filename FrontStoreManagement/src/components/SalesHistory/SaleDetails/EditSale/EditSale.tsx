import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditSale.module.css";
import InputField from "../../../InputField/InputField";
import Product from "../../../../types/Product";
import SaleItem from "../../../../types/SaleItem";
import Sale from "../../../../types/Sale";

interface EditSaleProps {
  cart: { items: SaleItem[] };
  setCart: React.Dispatch<React.SetStateAction<Sale>>;
  setAddingProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSale: React.FC<EditSaleProps> = ({
  cart,
  setCart,
  setAddingProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Efetua a requisição para pegar os produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [baseUrl]);

  const filteredProducts = products.filter((product) => {
    const productInCart = cart.items.some(
      (item) => item.productId === product.id
    );
    const productMatch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return !productInCart && productMatch;
  });

  // Lida com a seleção de um produto e adiciona ao carrinho
  const handleProductSelect = (product: Product) => {
    const newItem = {
      productId: product.id,
      quantity: 1,
      productNameAtSale: product.name,
      productDescriptionAtSale: product.description,
      costPriceAtSale: product.costPrice,
      sellingPriceAtSale: product.sellingPrice,
      imagePath: product.imagePath,
    };
    setCart((prevSaleData) => {
      return {
        ...prevSaleData,
        items: [...prevSaleData.items, newItem],
      };
    });
  };
  return (
    <div className={styles.salesForm}>
      <div className={styles.customSelect}>
        <div className={styles.selectHeader}>Selecione os produtos</div>
        <InputField
          nameAndId={"searchTerm"}
          type="text"
          textLabel="Pesquisar produto..."
          value={searchQuery}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.selectOptions}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={styles.selectOption}
              onClick={() => {
                handleProductSelect(product);
                setAddingProduct(false);
              }}
            >
              <img
                src={`${baseUrl}/uploads/${product.imagePath}`}
                alt={product.name}
                className={styles.productImage}
              />
              <div className={styles.productInfo}>
                <span>{product.name}</span>
                <p>{product.description}</p>
                <span>Preço: R$ {product.sellingPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditSale;
