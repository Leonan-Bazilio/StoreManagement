import React, { useState } from "react";
import styles from "./SaleDetails.module.css";
import EditSale from "./EditSale/EditSale";
import axios from "axios";
import Sale from "../../../types/Sale";

interface SaleDetailsProps {
  sale: Sale;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ sale }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [saleData, setSaleData] = useState<Sale>(sale);
  const [discount, setDiscount] = useState<number>(sale.discount);
  const [addingProduct, setAddingProduct] = useState<boolean>(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = saleData.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const updatedSale = {
      items,
      discount,
    };

    console.log(updatedSale);
    try {
      await axios.put(`${baseUrl}/api/sales/${sale.saleId}`, updatedSale, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Venda atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a venda:", error);
    }
  };

  const subTotal = saleData.items.reduce((acc, item) => {
    return acc + item.quantity * item.sellingPriceAtSale;
  }, 0);

  const handleQuantityChange = (id: number, value: number): void => {
    if (value >= 1) {
      setSaleData({
        ...saleData,
        items: saleData.items.map((item) =>
          item.productId === id ? { ...item, quantity: value } : item
        ),
      });
    }
  };

  const increaseQuantity = (id: number): void => {
    setSaleData({
      ...saleData,
      items: saleData.items.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    });
  };

  const decreaseQuantity = (id: number): void => {
    setSaleData({
      ...saleData,
      items: saleData.items.map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    });
  };

  const removeFromSale = (id: number): void => {
    setSaleData({
      ...saleData,
      items: saleData.items.filter((item) => item.productId !== id),
    });
  };

  return (
    <div className={styles.container}>
      <ul className={styles.containerItems}>
        {saleData.items.map((item) => (
          <div key={item.productId} className={styles.cartItem}>
            <img
              src={`${baseUrl}/uploads/${item.imagePath}`}
              alt={item.productNameAtSale}
              className={styles.cartProductImage}
            />
            <div className={styles.cartProductInfo}>
              <span>{item.productNameAtSale}</span>
              <p>{item.productDescriptionAtSale}</p>
              <span>Preço: R$ {item.sellingPriceAtSale}</span>
            </div>

            <div className={styles.quantityControls}>
              <button
                onClick={() => decreaseQuantity(item.productId)}
                className={styles.quantityButton}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.productId, parseInt(e.target.value))
                }
                className={styles.quantityInput}
              />
              <button
                onClick={() => increaseQuantity(item.productId)}
                className={styles.quantityButton}
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromSale(item.productId)}
              className={styles.removeButton}
            >
              Remover
            </button>
          </div>
        ))}

        <div className={styles.addSale}>
          <button onClick={() => setAddingProduct(true)}>+</button>
        </div>

        <div
          className={
            addingProduct ? styles.addingProductContainer : styles.hide
          }
        >
          <EditSale
            cart={{ items: saleData.items }}
            setCart={setSaleData}
            setAddingProduct={setAddingProduct}
          />
        </div>

        <div className={styles.divDiscount}>
          <h4>Subtotal: R$ {subTotal}</h4>
          <input
            type="number"
            className={styles.discount}
            placeholder="Desconto"
            value={discount}
            onChange={(e) => setDiscount(parseInt(e.target.value))}
          />
          <h3>Total: R$ {subTotal - discount}</h3>
        </div>

        <button className={styles.submitButton} onClick={handleUpdate}>
          Salvar
        </button>
      </ul>
    </div>
  );
};

export default SaleDetails;
