import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Sale from "../types/Sale";
import autoTable from "jspdf-autotable";

const exportSalesPDF = (filteredSales: Sale[]): void => {
  const doc = new jsPDF();
  doc.text("Relatório Consolidado de Vendas", 14, 20);

  const consolidatedTableColumn = [
    "Produto",
    "Qtd. Total",
    "Custo Total",
    "Venda Total",
    "Lucro Total",
  ];

  const consolidatedTableRows: any[] = [];
  const productSummary: {
    [key: string]: {
      quantity: number;
      costTotal: number;
      sellingTotal: number;
      profitTotal: number;
    };
  } = {};

  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const {
        productNameAtSale: name,
        costPriceAtSale: costPrice,
        sellingPriceAtSale: sellingPrice,
        quantity,
      } = item;

      if (!productSummary[name]) {
        productSummary[name] = {
          quantity: 0,
          costTotal: 0,
          sellingTotal: 0,
          profitTotal: 0,
        };
      }

      productSummary[name].quantity += quantity;
      productSummary[name].costTotal += quantity * costPrice;
      productSummary[name].sellingTotal += quantity * sellingPrice;
      productSummary[name].profitTotal += quantity * (sellingPrice - costPrice);
    });
  });

  let totalQuantity = 0;
  let totalCost = 0;
  let totalSelling = 0;
  let totalProfit = 0;

  const sortedProducts = Object.keys(productSummary).sort();

  sortedProducts.forEach((productName) => {
    const { quantity, costTotal, sellingTotal, profitTotal } =
      productSummary[productName];

    consolidatedTableRows.push({
      Produto: { content: productName, styles: { fontStyle: "normal" } },
      "Qtd. Total": { content: quantity, styles: { fontStyle: "normal" } },
      "Custo Total": {
        content: costTotal.toFixed(2),
        styles: { fontStyle: "normal" },
      },
      "Venda Total": {
        content: sellingTotal.toFixed(2),
        styles: { fontStyle: "normal" },
      },
      "Lucro Total": {
        content: profitTotal.toFixed(2),
        styles: { fontStyle: "normal" },
      },
    });

    totalQuantity += quantity;
    totalCost += costTotal;
    totalSelling += sellingTotal;
    totalProfit += profitTotal;
  });

  consolidatedTableRows.push({
    Produto: { content: "TOTAL", styles: { fontStyle: "bold" } },
    "Qtd. Total": { content: totalQuantity, styles: { fontStyle: "bold" } },
    "Custo Total": {
      content: totalCost.toFixed(2),
      styles: { fontStyle: "bold" },
    },
    "Venda Total": {
      content: totalSelling.toFixed(2),
      styles: { fontStyle: "bold" },
    },
    "Lucro Total": {
      content: totalProfit.toFixed(2),
      styles: { fontStyle: "bold" },
    },
  });

  autoTable(doc, {
    head: [consolidatedTableColumn],
    body: consolidatedTableRows,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [40, 167, 69] },
    footStyles: { fontStyle: "bold", fillColor: [220, 220, 220] },
  });

  const salesByDay: { [key: string]: Sale[] } = {};

  filteredSales.forEach((sale) => {
    const saleDate = new Date(sale.saleDate).toLocaleDateString("pt-BR");
    if (!salesByDay[saleDate]) {
      salesByDay[saleDate] = [];
    }
    salesByDay[saleDate].push(sale);
  });

  Object.keys(salesByDay).forEach((saleDay) => {
    doc.text(saleDay, 14, 30);

    const dailySummaryTableColumn = [
      "Produto",
      "Qtd. Total",
      "Custo Total",
      "Venda Total",
      "Lucro Total",
    ];
    const dailySummaryTableRows: any[] = [];
    const dailySummary: {
      [key: string]: {
        quantity: number;
        costTotal: number;
        sellingTotal: number;
        profitTotal: number;
      };
    } = {};

    let dayTotalQuantity = 0;
    let dayTotalCost = 0;
    let dayTotalSelling = 0;
    let dayTotalProfit = 0;

    salesByDay[saleDay].forEach((sale) => {
      sale.items.forEach((item) => {
        const {
          productNameAtSale: name,
          costPriceAtSale: costPrice,
          sellingPriceAtSale: sellingPrice,
        } = item;
        const quantity = item.quantity;

        if (!dailySummary[name]) {
          dailySummary[name] = {
            quantity: 0,
            costTotal: 0,
            sellingTotal: 0,
            profitTotal: 0,
          };
        }

        dailySummary[name].quantity += quantity;
        dailySummary[name].costTotal += quantity * costPrice;
        dailySummary[name].sellingTotal += quantity * sellingPrice;
        dailySummary[name].profitTotal += quantity * (sellingPrice - costPrice);
      });
    });

    const sortedDailyProducts = Object.keys(dailySummary).sort();

    sortedDailyProducts.forEach((productName) => {
      const { quantity, costTotal, sellingTotal, profitTotal } =
        dailySummary[productName];

      dailySummaryTableRows.push({
        Produto: { content: productName, styles: { fontStyle: "normal" } },
        "Qtd. Total": { content: quantity, styles: { fontStyle: "normal" } },
        "Custo Total": {
          content: costTotal.toFixed(2),
          styles: { fontStyle: "normal" },
        },
        "Venda Total": {
          content: sellingTotal.toFixed(2),
          styles: { fontStyle: "normal" },
        },
        "Lucro Total": {
          content: profitTotal.toFixed(2),
          styles: { fontStyle: "normal" },
        },
      });

      dayTotalQuantity += quantity;
      dayTotalCost += costTotal;
      dayTotalSelling += sellingTotal;
      dayTotalProfit += profitTotal;
    });

    dailySummaryTableRows.push({
      Produto: { content: "TOTAL", styles: { fontStyle: "bold" } },
      "Qtd. Total": {
        content: dayTotalQuantity,
        styles: { fontStyle: "bold" },
      },
      "Custo Total": {
        content: dayTotalCost.toFixed(2),
        styles: { fontStyle: "bold" },
      },
      "Venda Total": {
        content: dayTotalSelling.toFixed(2),
        styles: { fontStyle: "bold" },
      },
      "Lucro Total": {
        content: dayTotalProfit.toFixed(2),
        styles: { fontStyle: "bold" },
      },
    });

    autoTable(doc, {
      head: [dailySummaryTableColumn],
      body: dailySummaryTableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 167, 69] },
      footStyles: { fontStyle: "bold", fillColor: [220, 220, 220] },
    });

    salesByDay[saleDay].forEach((sale) => {
      const saleTime = new Date(sale.saleDate).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const salesTableColumn = [
        saleTime,
        "Custo (UN)",
        "Venda",
        "Qtd.",
        "Custo Total",
        "Venda Total",
        "Lucro Total",
      ];
      const salesTableRows: any[] = [];

      let saleTotalQuantity = 0;
      let saleTotalCost = 0;
      let saleTotalSelling = 0;
      let saleTotalProfit = 0;

      sale.items.forEach((item) => {
        const {
          productNameAtSale: name,
          costPriceAtSale: costPrice,
          sellingPriceAtSale: sellingPrice,
        } = item;
        const quantity = item.quantity;
        const costTotal = quantity * costPrice;
        const sellingTotal = quantity * sellingPrice;
        const profitTotal = sellingTotal - costTotal;

        salesTableRows.push({
          Produto: { content: name, styles: { fontStyle: "normal" } },
          "Custo (UN)": {
            content: costPrice.toFixed(2),
            styles: { fontStyle: "normal" },
          },
          Venda: {
            content: sellingPrice.toFixed(2),
            styles: { fontStyle: "normal" },
          },
          "Qtd.": { content: quantity, styles: { fontStyle: "normal" } },
          "Custo Total": {
            content: costTotal.toFixed(2),
            styles: { fontStyle: "normal" },
          },
          "Venda Total": {
            content: sellingTotal.toFixed(2),
            styles: { fontStyle: "normal" },
          },
          "Lucro Total": {
            content: profitTotal.toFixed(2),
            styles: { fontStyle: "normal" },
          },
        });

        saleTotalQuantity += quantity;
        saleTotalCost += costTotal;
        saleTotalSelling += sellingTotal;
        saleTotalProfit += profitTotal;
      });

      salesTableRows.push({
        Produto: { content: "TOTAL", styles: { fontStyle: "bold" } },
        "Custo (UN)": { content: "", styles: { fontStyle: "bold" } },
        Venda: { content: "", styles: { fontStyle: "bold" } },
        "Qtd.": { content: saleTotalQuantity, styles: { fontStyle: "bold" } },
        "Custo Total": {
          content: saleTotalCost.toFixed(2),
          styles: { fontStyle: "bold" },
        },
        "Venda Total": {
          content: saleTotalSelling.toFixed(2),
          styles: { fontStyle: "bold" },
        },
        "Lucro Total": {
          content: saleTotalProfit.toFixed(2),
          styles: { fontStyle: "bold" },
        },
      });

      autoTable(doc, {
        head: [salesTableColumn],
        body: salesTableRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [100, 100, 255] },
      });
    });
  });

  doc.save("Relatorio_Consolidado_Vendas.pdf");
};

export default exportSalesPDF;
