
// (I will generate enums too below)

import { PaymentMethod } from "../Enum/payment-method";
import { TransactionStatus } from "../Enum/transaction-status";

export interface Transaction {
  transactionId: string;          // Guid
  userId: string;                 // Guid
  user?: any;                     // Or use the User interface if needed
  appointmentId?: string | null;  // Nullable Guid
  appointment?: any;              // Or use Appointment interface
  amount: number;
  paymentMethod: PaymentMethod;
  transactionStatus: TransactionStatus;
  referenceNumber?: string | null;
  createdAt: string;              // ISO date string
}
