export interface Feedback {
  feedbackId: string;                // Guid
  userId?: string | null;
  user?: any;                        // or User interface
  appintmentId?: string | null;      // Note: backend has a spelling 'AppintmentId'
  appointment?: any;                 // or Appointment interface
  rating?: number | null;            // nullable int
  comments?: string | null;          // nullable string
  createdAt?: string | null;         // nullable DateTime -> ISO string
}
