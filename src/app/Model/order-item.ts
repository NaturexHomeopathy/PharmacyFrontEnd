export interface OrderItem {
  orderItemId: string;        // Guid
  orderId: string;            // Guid
  order?: any;                // Or use Order interface if available
  healthProductId: string;    // Guid
  healthProduct?: any;        // Or use HealthProduct interface
  quantity: number;
  priceAtPurchase: number;
}
