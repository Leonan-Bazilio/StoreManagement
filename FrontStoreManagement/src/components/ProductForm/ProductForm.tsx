import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styles from "./ProductForm.module.css";
import InputField from "../InputField/InputField";
import Product from "../../types/Product";
import formatCurrency from "../../utils/formatCurrency";

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<
    Omit<Product, "id" | "imagePath" | "createdAt">
  >({
    name: "",
    description: "",
    costPrice: 0,
    sellingPrice: 0,
    quantityInStock: 0,
    lowStockLimit: 0,
    criticalStockLimit: 0,
  });

  const [image, setImage] = useState<File | null>(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "costPrice" || name === "sellingPrice") {
      setProduct({
        ...product,
        [name]: parseFloat(value.replace(/[^\d.-]/g, "")) || 0,
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );
    formData.append("image", image as Blob);

    try {
      await axios.post(`${baseUrl}/api/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Produto cadastrado com sucesso");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao cadastrar produto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Adicionar Produto</h2>
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
              <span>Selecione uma imagem</span>
            )}
          </label>
        </div>
        <div className={styles.textInputs}>
          <InputField
            type="text"
            nameAndId="name"
            textLabel="Nome do Produto"
            value={product.name}
            onChange={handleChange}
            className={styles.input}
          />
          <InputField
            type="textarea"
            nameAndId="description"
            textLabel="Descrição do Produto"
            value={product.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>
      </div>
      <div className={styles.row}>
        <InputField
          type="text"
          nameAndId="costPrice"
          textLabel="Preço de Custo"
          value={formatCurrency(product.costPrice.toString())}
          onChange={handleChange}
          className={styles.input}
        />
        <InputField
          type="text"
          nameAndId="sellingPrice"
          textLabel="Preço de Venda"
          value={formatCurrency(product.sellingPrice.toString())}
          onChange={handleChange}
        />
      </div>
      <div className={styles.row}>
        <InputField
          type="number"
          nameAndId="quantityInStock"
          textLabel="Quantidade em Estoque"
          value={product.quantityInStock}
          onChange={handleChange}
        />
        <InputField
          type="number"
          nameAndId="lowStockLimit"
          textLabel="Estoque Mínimo Recomendado"
          value={product.lowStockLimit}
          onChange={handleChange}
        />
        <InputField
          type="number"
          nameAndId="criticalStockLimit"
          textLabel="Quantidade de Alerta"
          value={product.criticalStockLimit}
          onChange={handleChange}
        />
      </div>
      <div className={styles.divBtn}>
        <button type="submit" className={styles.submitButton}>
          Cadastrar Produto
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
