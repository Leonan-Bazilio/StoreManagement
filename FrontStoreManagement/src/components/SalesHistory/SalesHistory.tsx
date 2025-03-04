import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SalesHistory.module.css";
import SaleDetails from "./SaleDetails/SaleDetails";
import Sale from "../../types/Sale";

const SalesHistoryComponent = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedSales, setExpandedSales] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedSalesDay, setExpandedSalesDay] = useState<
    Record<string, boolean>
  >({});
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
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
  }, []);

  const toggleSaleExpand = (saleId: number) => {
    setExpandedSales((prevState) => ({
      ...prevState,
      [saleId]: !prevState[saleId],
    }));
  };

  const toggleSalesDayExpand = (saleDay: string) => {
    setExpandedSalesDay((prevState) => ({
      ...prevState,
      [saleDay]: !prevState[saleDay],
    }));
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

  const groupedSales = filteredSales.reduce((acc, sale) => {
    const saleDate = new Date(sale.saleDate);
    const saleDay = saleDate.toLocaleDateString("pt-BR");

    if (!acc[saleDay]) {
      acc[saleDay] = [];
    }

    acc[saleDay].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  if (loading) return <div className={styles.loading}>Carregando dados...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Histórico de Vendas</h1>

      <div className={styles.filters}>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar Produto"
          className={styles.searchInput}
        />

        <div className={styles.dateFields}>
          <div className={styles.dateField}>
            <label htmlFor="startDate">Data Inicial:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.dateField}>
            <label htmlFor="endDate">Data Final:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
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
                <ul className={styles.saleItems}>
                  {groupedSales[saleDay].map((sale) => (
                    <li key={sale.saleId} className={styles.saleItemDetail}>
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
                          <ul className={styles.saleItems}>
                            {sale.items.map((item, index) => (
                              <li
                                key={index}
                                className={styles.saleItemDetailEach}
                              >
                                <div className={styles.itemLeft}>
                                  <img
                                    src={`${baseUrl}/uploads/${item.imagePath}`}
                                    alt={item.productNameAtSale}
                                    className={styles.itemImage}
                                  />
                                  <div>
                                    <p className={styles.itemName}>
                                      {item.productNameAtSale}
                                    </p>
                                    <p className={styles.itemDescription}>
                                      {item.productDescriptionAtSale}
                                    </p>
                                  </div>
                                </div>
                                <div className={styles.itemRight}>
                                  <p>
                                    {item.quantity} x R${" "}
                                    {item.sellingPriceAtSale.toFixed(2)}
                                  </p>
                                  <p className={styles.itemSubtotal}>
                                    R$ {item.subTotal?.toFixed(2)}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className={styles.saleFooter}>
                            <div className={styles.buttonsFooter}>
                              <button
                                onClick={() => setSelectedSale(sale)}
                                className={styles.updateBtn}
                              >
                                Atualizar
                              </button>
                              <button className={styles.deleteBtn}>
                                Deletar
                              </button>
                            </div>
                            <div className={styles.saleFooterPrice}>
                              <p>Desconto: {sale.discount.toFixed(2)}</p>
                              Total:{" "}
                              <strong>R$ {sale.totalPrice?.toFixed(2)}</strong>
                            </div>
                          </div>
                          {selectedSale && <SaleDetails sale={sale} />}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesHistoryComponent;
