// Filename: frontend/src/app/shared/models/visit.model.ts
export interface Visit {
  _id?: string;
  patientId: string;
  visitDate: string;
  visitType: string; // Allow any string input
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
