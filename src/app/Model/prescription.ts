export interface Prescription {
  prescriptionId: string;       // Guid
  appointmentId: string;        // Guid
  appointment?: any;            // Or use Appointment interface if needed
  prescribedBy: string;         // Doctor's name
  notes: string;                // Prescription details
  createdAt: string;            // ISO date string
}
