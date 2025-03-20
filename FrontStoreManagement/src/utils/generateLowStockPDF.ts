import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Product from "../types/Product";

import formatCurrency from "./formatCurrency";

const generateLowStockPDF = (products: Product[]): void => {
  const doc = new jsPDF();
  doc.text("Relatório de Estoque Baixo", 14, 20);

  const createTable = (
    filteredProducts: Product[],
    text: string,
    startY: number
  ): number => {
    if (filteredProducts.length === 0) return startY;

    doc.text(text, 14, startY);

    const tableColumns = [
      "Produto",
      "Estoque",
      "Custo (UN)",
      "Recomendado",
      "Comprar",
      "Custo Total",
    ];
    const tableRows: (
      | string
      | number
      | { content: string; styles: { fontStyle: string } }
    )[][] = [];

    let totalCost = 0;

    filteredProducts.forEach((product) => {
      const recommended = Math.ceil(product.lowStockLimit * 1.5);
      const toBuy = Math.max(recommended - product.quantityInStock, 0);
      const costTotal = toBuy * product.costPrice;

      totalCost += costTotal;

      tableRows.push([
        product.name,
        product.quantityInStock,
        formatCurrency(product.costPrice.toString()),
        recommended,
        toBuy,
        formatCurrency(costTotal.toString()),
      ]);
    });

    tableRows.push([
      { content: "TOTAL", styles: { fontStyle: "bold" } },
      "",
      "",
      "",
      "",
      {
        content: formatCurrency(totalCost.toString()),
        styles: { fontStyle: "bold" },
      },
    ]);

    autoTable(doc, {
      head: [tableColumns],
      // @ts-ignore
      body: tableRows,
      startY: startY + 5,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 167, 69] },
      footStyles: { fontStyle: "bold", fillColor: [220, 220, 220] },
    });
    // @ts-ignore
    return (doc.lastAutoTable ? doc.lastAutoTable.finalY : startY) || startY;
  };

  const criticalProducts = products
    .filter(
      (p) =>
        p.criticalStockLimit !== undefined &&
        p.quantityInStock < p.criticalStockLimit
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const recommendedProducts = products
    .filter((p) => p.quantityInStock < p.lowStockLimit)
    .sort((a, b) => a.name.localeCompare(b.name));

  let nextY = 30;
  nextY = createTable(
    criticalProducts,
    "Produtos abaixo do nível crítico:",
    nextY
  );
  if (nextY)
    createTable(
      recommendedProducts,
      "Produtos abaixo do nível recomendado:",
      nextY + 10
    );

  doc.save("Relatorio_Estoque_Baixo.pdf");
};

export default generateLowStockPDF;
