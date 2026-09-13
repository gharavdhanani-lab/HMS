export type Role = "PATIENT" | "DOCTOR" | "ADMIN" | "NURSE" | "RECEPTIONIST" | "LAB" | "PHARMACY" | "ACCOUNTANT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Patient extends User {
  role: "PATIENT";
  uhid: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
}

export interface Doctor extends User {
  role: "DOCTOR";
  department: string;
  specialization: string;
  experience: number;
  rating: number;
  fee: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date
  time: string; // HH:mm
  status: "SCHEDULED" | "WAITING" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED";
  type: "IN_PERSON" | "VIDEO";
  token?: string;
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  type: "GENERAL" | "ICU" | "PRIVATE";
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  patientId?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}
