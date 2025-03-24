import React, { ChangeEvent, useState } from "react";
import styles from "./SaleDetails.module.css";
import EditSale from "./EditSale/EditSale";
import axios from "axios";
import Sale from "../../../types/Sale";
import formatCurrency from "../../../utils/formatCurrency";
import InputField from "../../InputField/InputField";
import { FaTimes } from "react-icons/fa";

interface SaleDetailsProps {
  sale: Sale;
  onClose: () => void;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ sale, onClose }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [saleData, setSaleData] = useState<Sale>(sale);
  const [discount, setDiscount] = useState<number>(sale.discount);
  const [addingProduct, setAddingProduct] = useState<boolean>(false);

  const handleCloseAddingProduct = () => {
    setAddingProduct(false);
  };
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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    setDiscount(parseFloat(value.replace(/[^\d.-]/g, "")) || 0);
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
      <div className={styles.containerItems}>
        <ul className={styles.containerList}>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes className={styles.icon} />
          </button>
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
                <span>
                  Preço: {formatCurrency(item.sellingPriceAtSale.toString())}
                </span>
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
                    handleQuantityChange(
                      item.productId,
                      parseInt(e.target.value)
                    )
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

          <div
            onClick={() => setAddingProduct(true)}
            className={styles.addSale}
          >
            <button>+</button>
          </div>

          <div
            className={
              addingProduct ? styles.addingProductContainer : styles.hide
            }
          >
            <EditSale
              cart={{ items: saleData.items }}
              setCart={setSaleData}
              onClose={handleCloseAddingProduct}
            />
          </div>

          <div className={styles.divDiscount}>
            <h4>Subtotal: {formatCurrency(subTotal.toString())}</h4>
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
            <h3>Total: {formatCurrency((subTotal - discount).toString())}</h3>
          </div>

          <button className={styles.submitButton} onClick={handleUpdate}>
            Salvar
          </button>
        </ul>
      </div>
    </div>
  );
};

export default SaleDetails;
