export interface Order {
  orderId: string;        // Guid
  userId: string;         // Guid
  user?: any;             // Or use User interface if you want strong typing
  totalAmount: number;
  createdAt: string;      // ISO date string
}
