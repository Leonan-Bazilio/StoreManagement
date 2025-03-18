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
  const [dateAndTime, setDateAndTime] = useState("");

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
    const { name, value } = e.target;
    if (name == "discount") {
      setDiscount(parseFloat(value.replace(/[^\d.-]/g, "")) || 0);
    } else if (name == "dateAndTime") {
      setDateAndTime(value);
    }
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
  const isValidDate = () => {
    if (dateAndTime) {
      const selectedDate = new Date(dateAndTime);
      const now = new Date();
      if (selectedDate > now) {
        return false;
      }
    }
    return true;
  };

  const isValidDiscount = () => {
    console.log("aa", discount, "bb", subTotal);
    if (discount > subTotal) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidDate()) {
      return alert(
        `o campo Data esta preenchidos de forma incorreta(não pode ser uma data futura)`
      );
    }
    if (!isValidDiscount()) {
      return alert(
        `o campo Desconto esta preenchidos de forma incorreta(o valor não pode ser maior que o subtotal)`
      );
    }
    let items = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    let sale: any = {
      items,
      discount,
    };
    if (dateAndTime) {
      sale.saleDate = new Date(dateAndTime).toISOString();
    }
    console.log("aaaaaa", sale);
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
                <span>
                  Preço: {formatCurrency(product.sellingPrice.toString())}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.cart}>
        <div className={styles.cartTop}>
          <div className={styles.divDateAndTime}>
            <InputField
              textLabel="Data e Hora da Venda:"
              type="datetime-local"
              nameAndId="dateAndTime"
              value={dateAndTime}
              onChange={handleChange}
              className={styles.dateInput}
            />
          </div>
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
                <span>
                  Preço:{formatCurrency(item.product.sellingPrice.toString())}
                </span>
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
        </div>
        <div className={styles.cartBottom}>
          <div className={styles.divDiscount}>
            <h4>Subtotal: {formatCurrency(subTotal.toString())} </h4>
            <div>
              <InputField
                type="text"
                className={styles.discount}
                textLabel="Desconto"
                value={formatCurrency(discount.toString())}
                nameAndId={"discount"}
                divClassName={styles.divInputDiscount}
                onChange={handleChange}
              />
            </div>
            <h3>Total: {formatCurrency(total.toString())}</h3>
          </div>
          <div className={styles.divSubmitButton}>
            <button onClick={handleSubmit} className={styles.submitButton}>
              Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForm;
