const formatCurrency = (value: string) => {
  const numericValue = value.replace(/[^\d]/g, "");

  const formattedValue = parseInt(numericValue, 10) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(formattedValue);
};

export default formatCurrency;
