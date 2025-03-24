import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import styles from "./ProfitOverview.module.css";
import exportSalesPDF from "../../utils/exportSalesPDF";
import Sale from "../../types/Sale";
import InputField from "../InputField/InputField";
import { IoIosArrowDown } from "react-icons/io";
import formatCurrency from "../../utils/formatCurrency";

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
  if (error)
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Relatorio de vendas</h1>
      <div className={styles.filters}>
        <InputField
          type="text"
          nameAndId="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          textLabel="Pesquisar Produto"
          className={styles.searchInput}
        />

        <div className={styles.dateFields}>
          <div className={styles.dateField}>
            <InputField
              type="date"
              nameAndId="startDate"
              value={startDate}
              textLabel="Data Inicial:"
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.dateField}>
            <InputField
              type="date"
              nameAndId="endDate"
              value={endDate}
              textLabel="Data Final:"
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className={styles.loading}>Carregando dados...</div>
      ) : Object.keys(groupedSales).length === 0 ? (
        <div className={styles.notFound}>
          Nenhuma venda encontrada nessee periodo
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <p>
              Lucro Total Filtrado:{" "}
              <strong>{formatCurrency(totalProfit.toString())}</strong>
            </p>
          </div>
          <ul className={styles.salesList}>
            {Object.keys(groupedSales).map((saleDay) => (
              <li key={saleDay} className={styles.saleItem}>
                <div className={styles.saleHeader}>
                  <span className={styles.saleDate}>{saleDay}</span>

                  <button
                    className={`${styles.expandButton} ${
                      expandedSalesDay[saleDay]
                        ? styles.toDetails
                        : styles.toClose
                    }`}
                    onClick={() => toggleSalesDayExpand(saleDay)}
                  >
                    <IoIosArrowDown className={styles.arrow} />
                    {expandedSalesDay[saleDay] ? "Fechar" : "Detalhes"}
                  </button>
                </div>
                {expandedSalesDay[saleDay] && (
                  <div className={styles.saleDetails}>
                    <div className={styles.saleItems}>
                      {groupedSales[saleDay].map((sale) => (
                        <div
                          key={sale.saleId}
                          className={styles.saleItemDetail}
                        >
                          <div className={styles.saleHeader}>
                            <span className={styles.saleTime}>
                              {new Date(sale.saleDate).toLocaleTimeString(
                                "pt-BR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span className={styles.saleTotal}>
                              Total:{" "}
                              <strong>
                                {formatCurrency(sale.totalPrice!.toString())}
                              </strong>
                            </span>
                            <button
                              className={`${styles.expandButton} ${
                                expandedSales[sale.saleId]
                                  ? styles.toDetails
                                  : styles.toClose
                              }`}
                              onClick={() => toggleSaleExpand(sale.saleId)}
                            >
                              <IoIosArrowDown className={styles.arrow} />
                              {expandedSales[sale.saleId]
                                ? "Fechar"
                                : "Detalhes"}
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
                                      {item.productNameAtSale} (Qtd:{" "}
                                      {item.quantity})
                                    </span>
                                    <span className={styles.itemCost}>
                                      Custo:{" "}
                                      {formatCurrency(
                                        item.costPriceAtSale.toString()
                                      )}
                                    </span>
                                    <span className={styles.itemSelling}>
                                      Venda:{" "}
                                      {formatCurrency(
                                        item.sellingPriceAtSale.toString()
                                      )}
                                    </span>
                                    <span className={styles.itemProfit}>
                                      Lucro:{" "}
                                      {formatCurrency(
                                        (
                                          item.quantity *
                                          (item.sellingPriceAtSale -
                                            item.costPriceAtSale)
                                        ).toString()
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className={styles.subtotal}>
                                Lucro da venda:{" "}
                                {formatCurrency(
                                  calculateProfit(sale).toString()
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className={styles.subtotal}>
                      lucro do dia:{" "}
                      {formatCurrency(
                        calculateProfitDay(groupedSales[saleDay]).toString()
                      )}
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
        </>
      )}
    </div>
  );
};

export default ProfitOverview;
