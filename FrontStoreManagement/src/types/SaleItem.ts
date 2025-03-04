export default interface SaleItem {
  saleItemId: number;
  productId: number;
  quantity: number;
  costPriceAtSale: number;
  sellingPriceAtSale: number;
  productNameAtSale: string;
  productDescriptionAtSale: string;
  imagePath: string;
  subTotal: number;
}
