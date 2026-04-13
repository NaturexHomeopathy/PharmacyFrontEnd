import { AppointmentStatus } from "../Enum/appointment-status";

export interface Appointment {
  appointmentId: number;
  bookerId: string;
  bookerName: string;
  bookerContactNumber: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: AppointmentStatus;
  createdAt: string;
  updatedAt?: string | null;
  appointmentAddress: string;
  appointmentReason?: string;
}