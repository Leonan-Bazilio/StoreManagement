import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SalesHistory.module.css";
import SaleDetails from "./SaleDetails/SaleDetails";
import Sale from "../../types/Sale";
import InputField from "../InputField/InputField";
import { IoIosArrowDown } from "react-icons/io";
import formatCurrency from "../../utils/formatCurrency";

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
  const handleClose = (): void => {
    setSelectedSale(null);
  };
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

  if (error)
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Histórico de Vendas</h1>

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
                  <ul className={styles.saleItems}>
                    {groupedSales[saleDay].map((sale) => (
                      <li key={sale.saleId} className={styles.saleItemDetail}>
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
                            {expandedSales[sale.saleId] ? "Fechar" : "Detalhes"}
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
                                      {item.quantity} x{" "}
                                      {formatCurrency(
                                        item.sellingPriceAtSale.toString()
                                      )}
                                    </p>
                                    <p className={styles.itemSubtotal}>
                                      {item.subTotal
                                        ? formatCurrency(
                                            item.subTotal.toString()
                                          )
                                        : "R$ 0,00"}
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
                                <p>
                                  Desconto:{" "}
                                  {formatCurrency(sale.discount.toString())}
                                </p>
                                Total:{" "}
                                <strong>
                                  {sale.totalPrice
                                    ? formatCurrency(
                                        sale.totalPrice?.toString()
                                      )
                                    : "R$ 0,00"}
                                </strong>
                              </div>
                            </div>
                            {selectedSale && (
                              <SaleDetails sale={sale} onClose={handleClose} />
                            )}
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
      )}
    </div>
  );
};

export default SalesHistoryComponent;
