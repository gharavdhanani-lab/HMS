import { Patient, Doctor, Appointment, Bed } from "../types";

export const mockPatients: Patient[] = [
  { id: "p1", name: "Rahul Patel", email: "rahul@example.com", role: "PATIENT", uhid: "HSP-2026-00101", age: 45, gender: "Male", bloodGroup: "O+", phone: "+91 9876543210" },
  { id: "p2", name: "Priya Sharma", email: "priya@example.com", role: "PATIENT", uhid: "HSP-2026-00102", age: 32, gender: "Female", bloodGroup: "A+", phone: "+91 9876543211" },
];

export const mockDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Amit Shah", email: "amit@hospify.com", role: "DOCTOR", department: "Cardiology", specialization: "Interventional Cardiologist", experience: 15, rating: 4.9, fee: 1500, avatar: "https://images.unsplash.com/photo-1612349317150-e410f624c427?w=150&h=150&fit=crop" },
  { id: "d2", name: "Dr. Neha Patel", email: "neha@hospify.com", role: "DOCTOR", department: "Pediatrics", specialization: "Child Specialist", experience: 10, rating: 4.8, fee: 1000, avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop" },
  { id: "d3", name: "Dr. Raj Mehta", email: "raj@hospify.com", role: "DOCTOR", department: "Orthopedics", specialization: "Joint Replacement", experience: 20, rating: 4.7, fee: 2000, avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop" },
];

export const mockAppointments: Appointment[] = [
  { id: "a1", patientId: "p1", doctorId: "d1", date: new Date().toISOString().split('T')[0], time: "10:00", status: "WAITING", type: "IN_PERSON", token: "A-101" },
  { id: "a2", patientId: "p2", doctorId: "d2", date: new Date().toISOString().split('T')[0], time: "11:30", status: "SCHEDULED", type: "VIDEO", token: "P-204" },
];

export const mockBeds: Bed[] = [
  { id: "b1", number: "GEN-01", ward: "General Ward", type: "GENERAL", status: "AVAILABLE" },
  { id: "b2", number: "GEN-02", ward: "General Ward", type: "GENERAL", status: "OCCUPIED", patientId: "p1" },
  { id: "b3", number: "ICU-01", ward: "ICU", type: "ICU", status: "AVAILABLE" },
  { id: "b4", number: "PRV-101", ward: "Private Floor 1", type: "PRIVATE", status: "MAINTENANCE" },
];
