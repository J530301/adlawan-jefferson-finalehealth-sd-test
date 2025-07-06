// Filename: frontend/src/app/shared/models/patient.model.ts
export interface Patient {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  address: string;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt?: string;
  updatedAt?: string;
  totalVisits?: number;
}
