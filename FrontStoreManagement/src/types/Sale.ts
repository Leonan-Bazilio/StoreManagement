import SaleItem from "./SaleItem";

export default interface Sale {
  saleId: number;
  items: SaleItem[];
  discount: number;
  saleDate: Date;
  totalPrice?: number;
}
