import { HealthProductImage } from "./health-product-image";
import { ProductReview } from "./product-review";

export interface HealthProduct {
  healthProductId: string;
  productName: string;
  productDescription?: string;
  brand?: string;
  categoryId: string;
  healthProductPrice: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;

  // 🔥 New
  images?: HealthProductImage[];
   // 🔥 Reviews
  reviews?: ProductReview[];

  // ⭐ Calculated Fields
  averageRating?: number;
  reviewCount?: number;
}