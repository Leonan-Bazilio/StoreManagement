import jsPDF from "jspdf";
import "jspdf-autotable";

const formatCurrency = (value) => `R$ ${value.toFixed(2).replace(".", ",")}`;

const generateLowStockPDF = (products) => {
  const doc = new jsPDF();
  doc.text("Relatório de Estoque Baixo", 14, 20);

  const createTable = (filteredProducts, text, startY) => {
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
    const tableRows = [];

    let totalCost = 0;

    filteredProducts.forEach((product) => {
      const recommended = Math.ceil(product.lowStockLimit * 1.5);
      const toBuy = Math.max(recommended - product.quantityInStock, 0);
      const costTotal = toBuy * product.costPrice;

      totalCost += costTotal;

      tableRows.push([
        product.name,
        product.quantityInStock,
        formatCurrency(product.costPrice),
        recommended,
        toBuy,
        formatCurrency(costTotal),
      ]);
    });

    tableRows.push([
      { content: "TOTAL", styles: { fontStyle: "bold" } },
      "",
      "",
      "",
      "",
      { content: formatCurrency(totalCost), styles: { fontStyle: "bold" } },
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: startY + 5,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 167, 69] },
      footStyles: { fontStyle: "bold", fillColor: [220, 220, 220] },
    });

    return doc.autoTable.previous ? doc.autoTable.previous.finalY : startY;
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
  nextY = createTable(criticalProducts, "Produtos abaixo do nível crítico:", nextY);
  if (nextY) createTable(recommendedProducts, "Produtos abaixo do nível recomendado:", nextY + 10);

  doc.save("Relatorio_Estoque_Baixo.pdf");
};

export default generateLowStockPDF;

/*import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Sale from "../types/Sale";

const generatePDF = (sales: Sale[]) => {
  const doc = new jsPDF();

  const productSummary: Record<
    string,
    {
      quantity: number;
      total: number;
      profit: number;
      cost: number;
      selling: number;
    }
  > = {};
  const dailySummary: Record<
    string,
    { quantity: number; total: number; discount: number; profit: number }
  > = {};

  let totalDiscounts = 0;

  sales.forEach((sale) => {
    const saleDate = sale.saleDate.split("T")[0];
    if (!dailySummary[saleDate]) {
      dailySummary[saleDate] = {
        quantity: 0,
        total: 0,
        discount: 0,
        profit: 0,
      };
    }

    sale.items.forEach((item) => {
      if (!productSummary[item.productNameAtSale]) {
        productSummary[item.productNameAtSale] = {
          quantity: 0,
          total: 0,
          profit: 0,
          cost: item.costPriceAtSale,
          selling: item.sellingPriceAtSale,
        };
      }
      productSummary[item.productNameAtSale].quantity += item.quantity;
      productSummary[item.productNameAtSale].total += item.subTotal!;
      productSummary[item.productNameAtSale].profit +=
        (item.sellingPriceAtSale - item.costPriceAtSale) * item.quantity;

      dailySummary[saleDate].quantity += item.quantity;
      dailySummary[saleDate].total += item.subTotal!;
    });

    dailySummary[saleDate].discount += sale.discount;
    dailySummary[saleDate].profit +=
      sale.totalPrice! -
      sale.discount -
      sale.items.reduce(
        (sum, item) => sum + item.costPriceAtSale * item.quantity,
        0
      );

    totalDiscounts += sale.discount; // Agora os descontos são somados corretamente
  });

  let totalProducts = 0;
  let totalValue = 0;
  let totalProfit = 0;

  const productRows = Object.entries(productSummary).map(([name, data]) => {
    totalProducts += data.quantity;
    totalValue += data.total;
    totalProfit += data.profit;
    return [
      name,
      data.cost.toFixed(2),
      data.selling.toFixed(2),
      data.quantity,
      data.total.toFixed(2),
      data.profit.toFixed(2),
    ];
  });

  productRows.push([
    "TOTAL",
    "",
    "",
    "",
    totalValue.toFixed(2),
    totalProfit.toFixed(2),
  ]);
  productRows.push([
    "",
    "",
    "",
    "",
    totalDiscounts.toFixed(2),
    (totalProfit - totalDiscounts).toFixed(2),
  ]);

  doc.text("Resumo de Vendas por Produto", 14, 10);
  autoTable(doc, {
    startY: 15,
    head: [
      [
        "Produto",
        "Custo Unit.",
        "Venda Unit.",
        "Qtd. Vendida",
        "Valor Total",
        "Lucro Total",
      ],
    ],
    body: productRows,
    styles: { fontSize: 10 },
    didParseCell: function (data) {
      if (data.row.index >= productRows.length - 2) {
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  let totalDailyProducts = 0;
  let totalDailyRevenue = 0;
  let totalDailyDiscounts = 0;
  let totalDailyProfit = 0;

  const dailyRows = Object.entries(dailySummary).map(([date, data]) => {
    totalDailyProducts += data.quantity;
    totalDailyRevenue += data.total;
    totalDailyDiscounts += data.discount;
    totalDailyProfit += data.profit;
    return [
      date,
      data.quantity,
      data.total.toFixed(2),
      data.discount.toFixed(2),
      data.profit.toFixed(2),
    ];
  });

  doc.addPage();
  doc.text("Resumo de Vendas por Dia", 14, 10);
  autoTable(doc, {
    startY: 15,
    head: [["Data", "Qtd. Total", "Preço Total", "Descontos", "Lucro Total"]],
    body: dailyRows,
    styles: { fontSize: 10 },
  });

  doc.save("relatorio_vendas.pdf");
};

export default generatePDF;
 */