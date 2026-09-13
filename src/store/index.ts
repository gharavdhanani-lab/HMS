import { create } from 'zustand';
import { User, Patient, Doctor, Appointment, Bed } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface AppState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  beds: Bed[];
  
  initFirebaseListeners: () => void;
}

export const useAppStore = create<AppState>((set) => {
  let unsubPatients: () => void;
  let unsubDoctors: () => void;
  let unsubAppointments: () => void;
  let unsubBeds: () => void;

  return {
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    
    patients: [],
    doctors: [],
    appointments: [],
    beds: [],
    
    initFirebaseListeners: () => {
      // Clean up previous listeners if they exist
      if (unsubPatients) unsubPatients();
      if (unsubDoctors) unsubDoctors();
      if (unsubAppointments) unsubAppointments();
      if (unsubBeds) unsubBeds();

      unsubPatients = onSnapshot(collection(db, 'patients'), (snapshot) => {
        const patients = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Patient));
        set({ patients });
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'patients');
      });

      unsubDoctors = onSnapshot(collection(db, 'doctors'), (snapshot) => {
        const doctors = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Doctor));
        set({ doctors });
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'doctors');
      });

      unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Appointment));
        set({ appointments });
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      });

      unsubBeds = onSnapshot(collection(db, 'beds'), (snapshot) => {
        const beds = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bed));
        set({ beds });
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'beds');
      });
    }
  };
});

