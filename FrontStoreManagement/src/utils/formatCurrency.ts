const formatCurrency = (value: string) => {
  const isNegative = value.includes("-");
  const numericValue = value.replace(/[^\d]/g, "");
  const formattedValue = parseInt(numericValue, 10) / 100;

  let formattedCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(formattedValue);

  return isNegative
    ? `R$ -${formattedCurrency.replace("R$", "").trim()}`
    : formattedCurrency;
};

export default formatCurrency;
