import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { mockPatients, mockDoctors, mockAppointments, mockBeds } from './data/mock';

export async function seedDatabase() {
  try {
    // Check if data already exists
    let patientsSnapshot;
    try {
      patientsSnapshot = await getDocs(collection(db, 'patients'));
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'patients');
      return;
    }

    if (!patientsSnapshot.empty) {
      console.log('Database already seeded');
      return;
    }

    const batch = writeBatch(db);

    // Seed Patients
    mockPatients.forEach(patient => {
      const ref = doc(db, 'patients', patient.id);
      batch.set(ref, patient);
    });

    // Seed Doctors
    mockDoctors.forEach(doctor => {
      const ref = doc(db, 'doctors', doctor.id);
      batch.set(ref, doctor);
    });

    // Seed Appointments
    mockAppointments.forEach(appointment => {
      const ref = doc(db, 'appointments', appointment.id);
      batch.set(ref, appointment);
    });

    // Seed Beds
    mockBeds.forEach(bed => {
      const ref = doc(db, 'beds', bed.id);
      batch.set(ref, bed);
    });

    await batch.commit();
    console.log('Successfully seeded database');
  } catch (error) {
    console.error('Error seeding database:', error);
    handleFirestoreError(error, OperationType.WRITE, 'batch');
  }
}
