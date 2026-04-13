export interface Disease {
  id: string;          // Guid from backend
  diseaseName: string;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  isActive: boolean;
  DiseaseUrl?: string;
}
