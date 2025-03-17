import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./SalesForm.module.css";
import InputField from "../InputField/InputField";
import Product from "../../types/Product";
import formatCurrency from "../../utils/formatCurrency";

interface CartItem {
  product: Product;
  quantity: number;
}

const SalesForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  const baseUrl = import.meta.env.VITE_BASE_URL;

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
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    setDiscount(parseFloat(value.replace(/[^\d.-]/g, "")) || 0);
  };

  const subTotal = cart.reduce((acc, item) => {
    return acc + item.quantity * item.product.sellingPrice;
  }, 0);

  const total = discount ? subTotal - discount : subTotal;

  const filteredProducts = products.filter((product) => {
    const productInCart = cart.some((item) => item.product.id === product.id);
    const productMatch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return !productInCart && productMatch;
  });

  const handleProductSelect = (product: Product) => {
    setCart([...cart, { product, quantity: 1 }]);
  };

  const handleQuantityChange = (id: number, value: number) => {
    if (value >= 1) {
      setCart(
        cart.map((item) =>
          item.product.id === id ? { ...item, quantity: value } : item
        )
      );
    }
  };

  const increaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.product.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let items = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    let sale = {
      items,
      discount,
    };
    try {
      await axios.post(`${baseUrl}/api/sales`, sale);
      alert("Venda registrada com sucesso!");
      setCart([]);
    } catch (error) {
      console.error(error);
    }
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
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setSearchQuery(e.target.value)
          }
          className={styles.searchInput}
        />
        <div className={styles.selectOptions}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={styles.selectOption}
              onClick={() => handleProductSelect(product)}
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
      <div className={styles.line}></div>
      <div className={styles.cart}>
        <div className={styles.selectHeader}>Carrinho de compras</div>
        {cart.map((item) => (
          <div key={item.product.id} className={styles.cartItem}>
            <img
              src={`${baseUrl}/uploads/${item.product.imagePath}`}
              alt={item.product.name}
              className={styles.cartProductImage}
            />
            <div className={styles.cartProductInfo}>
              <span>{item.product.name}</span>
              <p>{item.product.description}</p>
              <span>Preço: R$ {item.product.sellingPrice}</span>
            </div>

            <div className={styles.quantityControls}>
              <button
                onClick={() => decreaseQuantity(item.product.id)}
                className={styles.quantityButton}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleQuantityChange(
                    item.product.id,
                    parseInt(e.target.value)
                  )
                }
                className={styles.quantityInput}
              />
              <button
                onClick={() => increaseQuantity(item.product.id)}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.product.id)}
              className={styles.removeButton}
            >
              Remover
            </button>
          </div>
        ))}
        <div className={styles.divDiscount}>
          <h4>subtotal: R$ {subTotal} </h4>
          <div>
            <InputField
              type="text"
              className={styles.discount}
              textLabel="desconto"
              value={formatCurrency(discount.toString())}
              nameAndId={"discount"}
              onChange={handleChange}
            />
          </div>
          <h3>Total: R$ {total}</h3>
        </div>
        <div className={styles.divSubmitButton}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesForm;
