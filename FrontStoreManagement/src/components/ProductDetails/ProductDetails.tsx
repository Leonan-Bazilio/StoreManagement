import React, { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import styles from "./ProductDetails.module.css";
import InputField from "../InputField/InputField";
import axios from "axios";
import Product from "../../types/Product";

interface ProductDetailsProps {
  product: Product;
  refreshProducts: () => void;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  refreshProducts,
  onClose,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [addStock, setAddStock] = useState<number | string>("");
  const [editingProduct, setEditingProduct] = useState<boolean>(false);
  const [productData, setProductData] = useState(product);
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ? e.target.files[0] : null);
  };

  const handleEditing = () => {
    setEditingProduct((prev) => !prev);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    handleEditing();

    try {
      await axios.put(`${baseUrl}/api/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Produto atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto");
    }
  };

  const handleAddStock = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/products/${product.id}`,
        {
          quantityToAdd: addStock,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setProductData(response.data);
      setAddStock("");
      refreshProducts();
      alert("Estoque atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      alert("Erro ao atualizar estoque");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.createDate}>
          {new Date(productData.createdAt).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <button className={styles.closeBtn} onClick={onClose}>
          X
        </button>
        {editingProduct ? (
          <form className={styles.form} onSubmit={handleUpdate}>
            <div className={styles.row}>
              <div className={styles.imageContainer}>
                <label htmlFor="fileInput" className={styles.imageLabel}>
                  <input
                    type="file"
                    id="fileInput"
                    className={styles.imageInput}
                    onChange={handleImageChange}
                  />
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Imagem Selecionada"
                      className={styles.previewImage}
                    />
                  ) : (
                    <img
                      className={styles.image}
                      src={`${baseUrl}/uploads/${product.imagePath}`}
                      alt={productData.name}
                    />
                  )}
                </label>
              </div>
              <div className={styles.textInputs}>
                <InputField
                  type="text"
                  nameAndId="name"
                  textLabel="Nome do Produto"
                  value={productData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
                <InputField
                  type="textarea"
                  nameAndId="description"
                  textLabel="Descrição do Produto"
                  value={productData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>
            </div>
            <div className={styles.row}>
              <InputField
                type="number"
                nameAndId="costPrice"
                textLabel="Preço de Custo"
                value={productData.costPrice}
                onChange={handleChange}
                className={styles.input}
              />
              <InputField
                type="number"
                nameAndId="sellingPrice"
                textLabel="Preço de Venda"
                value={productData.sellingPrice}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <InputField
                type="number"
                nameAndId="stockQuantity"
                textLabel="Quantidade em Estoque"
                value={productData.quantityInStock}
                onChange={handleChange}
              />
              <InputField
                type="number"
                nameAndId="intermediateWarningQuantity"
                textLabel="Estoque Mínimo"
                value={productData.lowStockLimit}
                onChange={handleChange}
              />
              <InputField
                type="number"
                nameAndId="alertQuantity"
                textLabel="Quantidade de Alerta"
                value={productData.criticalStockLimit}
                onChange={handleChange}
              />
            </div>
            <div className={styles.divBtnsEditing}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={handleEditing}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.btnEdit}>
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className={styles.row1}>
              <img
                className={styles.image}
                src={`${baseUrl}/uploads/${productData.imagePath}`}
                alt={productData.name}
              />
              <div className={styles.textContent}>
                <h2>{productData.name}</h2>
                <p>{productData.description}</p>
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.divField}>
                <p>Preço de custo: </p>
                <p>R$ {productData.costPrice},00</p>
              </div>
              <div className={styles.divField}>
                <p>Preço de venda </p>
                <p>R$ {productData.sellingPrice},00</p>
              </div>
            </div>
            <div className={styles.row3}>
              <div className={styles.stockSection}>
                <div className={styles.divField}>
                  <p>Quantidade em Estoque: </p>
                  <p> {productData.quantityInStock}</p>
                </div>
                <div className={styles.addStock}>
                  <InputField
                    type="number"
                    nameAndId="stockQuantity"
                    textLabel="Adicionar ao estoque"
                    value={addStock}
                    onChange={(
                      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddStock(Number(e.target.value));
                    }}
                    className={styles.inputStock}
                  />
                  <button className={styles.addButton} onClick={handleAddStock}>
                    Adicionar
                  </button>
                </div>
              </div>
              <div className={styles.divField}>
                <p>Estoque minimo recomendado:</p>
                <p>{productData.lowStockLimit}</p>
              </div>
              <div className={styles.divField}>
                <p>Estoque alerta: </p>
                <p>{productData.criticalStockLimit}</p>
              </div>
            </div>
            <div className={styles.divBtns}>
              <button className={styles.btnCancel} onClick={handleEditing}>
                Editar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
