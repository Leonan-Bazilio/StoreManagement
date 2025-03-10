import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import styles from "./ProfitOverview.module.css";
import exportSalesPDF from "../../utils/exportSalesPDF";
import Sale from "../../types/Sale";

const ProfitOverview: React.FC = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [expandedSales, setExpandedSales] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedSalesDay, setExpandedSalesDay] = useState<
    Record<string, boolean>
  >({});
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/sales/prices`);
        setSalesData(response.data);
        setError("");
      } catch (err) {
        setError("Erro ao buscar dados de vendas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [baseUrl]);

  const calculateProfit = (sale: Sale): number => {
    return sale.items.reduce(
      (acc, item) =>
        acc + item.quantity * (item.sellingPriceAtSale - item.costPriceAtSale),
      0
    );
  };

  const calculateProfitDay = (salesDay: Sale[]): number => {
    return salesDay.reduce((acc, sale) => acc + calculateProfit(sale), 0);
  };

  const filteredSales = salesData.filter((sale) => {
    const saleDate = new Date(sale.saleDate);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    const matchesDateRange =
      (!startDate || saleDate >= start) && (!endDate || saleDate <= end);

    const matchesSearchQuery = sale.items.some((item) =>
      item.productNameAtSale.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesDateRange && matchesSearchQuery;
  });

  const toggleSaleExpand = (saleId: number) => {
    setExpandedSales((prevState) => ({
      ...prevState,
      [saleId]: !prevState[saleId],
    }));
  };

  const totalProfit = filteredSales.reduce(
    (acc, sale) => acc + calculateProfit(sale),
    0
  );

  const groupedSales = filteredSales.reduce((acc, sale) => {
    const saleDate = new Date(sale.saleDate);
    const saleDay = saleDate.toLocaleDateString("pt-BR");

    if (!acc[saleDay]) {
      acc[saleDay] = [];
    }

    acc[saleDay].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  const toggleSalesDayExpand = (saleDay: string) => {
    setExpandedSalesDay((prevState) => ({
      ...prevState,
      [saleDay]: !prevState[saleDay],
    }));
  };

  if (loading) return <div className={styles.loading}>Carregando dados...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Relatorio de vendas</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar Produto"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className={styles.searchInput}
        />
        <div className={styles.dateFields}>
          <div className={styles.dateField}>
            <label htmlFor="startDate">Data Inicial:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
              className={styles.dateInput}
            />
          </div>
          <div className={styles.dateField}>
            <label htmlFor="endDate">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
      <div className={styles.summary}>
        <p>
          Lucro Total Filtrado: <strong>R$ {totalProfit.toFixed(2)}</strong>
        </p>
      </div>
      <ul className={styles.salesList}>
        {Object.keys(groupedSales).map((saleDay) => (
          <li key={saleDay} className={styles.saleItem}>
            <div className={styles.saleHeader}>
              <span className={styles.saleDate}>{saleDay}</span>

              <button
                className={styles.expandButton}
                onClick={() => toggleSalesDayExpand(saleDay)}
              >
                {expandedSalesDay[saleDay] ? "▲ Fechar" : "▼ Detalhes"}
              </button>
            </div>
            {expandedSalesDay[saleDay] && (
              <div className={styles.saleDetails}>
                <div className={styles.saleItems}>
                  {groupedSales[saleDay].map((sale) => (
                    <div key={sale.saleId} className={styles.saleItemDetail}>
                      <div className={styles.saleHeader}>
                        <span className={styles.saleTime}>
                          {new Date(sale.saleDate).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className={styles.saleTotal}>
                          Total:{" "}
                          <strong>R$ {sale.totalPrice?.toFixed(2)}</strong>
                        </span>
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleSaleExpand(sale.saleId)}
                        >
                          {expandedSales[sale.saleId]
                            ? "▲ Fechar"
                            : "▼ Detalhes"}
                        </button>
                      </div>

                      {expandedSales[sale.saleId] && (
                        <div className={styles.saleDetails}>
                          <div className={styles.saleItems}>
                            {sale.items.map((item, index) => (
                              <div
                                key={index}
                                className={styles.saleItemDetailEach}
                              >
                                <span className={styles.itemName}>
                                  {item.productNameAtSale} (Qtd: {item.quantity}
                                  )
                                </span>
                                <span className={styles.itemCost}>
                                  Custo: R$ {item.costPriceAtSale.toFixed(2)}
                                </span>
                                <span className={styles.itemSelling}>
                                  Venda: R$ {item.sellingPriceAtSale.toFixed(2)}
                                </span>
                                <span className={styles.itemProfit}>
                                  Lucro: R${" "}
                                  {(
                                    item.quantity *
                                    (item.sellingPriceAtSale -
                                      item.costPriceAtSale)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className={styles.subtotal}>
                            Lucro da venda: R${" "}
                            {calculateProfit(sale).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className={styles.subtotal}>
                  lucro do dia: R$ {calculateProfitDay(groupedSales[saleDay])}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => exportSalesPDF(filteredSales)}
        className={styles.exportButton}
      >
        Exportar PDF
      </button>
    </div>
  );
};

export default ProfitOverview;
