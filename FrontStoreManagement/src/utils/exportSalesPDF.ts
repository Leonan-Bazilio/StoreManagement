import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Sale from "../types/Sale";

const exportSalesPDF = (sales: Sale[]) => {
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
    // @ts-ignore
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
      dailySummary[saleDate].profit +=
        (item.sellingPriceAtSale - item.costPriceAtSale) * item.quantity;
    });

    dailySummary[saleDate].discount += sale.discount;
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
    totalDailyProfit += data.profit - data.discount;
    return [
      date,
      data.quantity,
      data.total.toFixed(2),
      data.discount.toFixed(2),
      (data.profit - data.discount).toFixed(2),
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

export default exportSalesPDF;
