export default interface Product {
  id?: number;
  name: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  quantityInStock: number;
  lowStockLimit: number;
  criticalStockLimit: number;
  imagePath?: string;
  createdAt: Date | number | string;
}
