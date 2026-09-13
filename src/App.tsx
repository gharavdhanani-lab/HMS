import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PatientDashboard } from './pages/dashboards/PatientDashboard';
import { PatientFindDoctor } from './pages/dashboards/PatientFindDoctor';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { DoctorConsultation } from './pages/dashboards/DoctorConsultation';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { useAppStore } from './store';
import { seedDatabase } from './seed';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const user = useAppStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their specific dashboard if they try to access wrong role
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const initFirebaseListeners = useAppStore(state => state.initFirebaseListeners);
  const [isReady, setIsReady] = useState(false);

  // Seed the database on first load for demo purposes and start listeners
  useEffect(() => {
    seedDatabase().then(() => {
      initFirebaseListeners();
      setIsReady(true);
    }).catch((error) => {
      console.error("Database initialization error:", error);
      setIsReady(true); // Still load app even if seeding fails
    });
  }, [initFirebaseListeners]);

  if (!isReady) {
    return <div className="flex h-screen items-center justify-center">Loading Hospital System...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Dashboard Routes wrapped in Layout */}
      <Route element={<DashboardLayout />}>
        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/find-doctor" element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientFindDoctor />
          </ProtectedRoute>
        } />
        
        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/consultation/:appointmentId" element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorConsultation />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback for undefined dashboard routes within layout */}
        <Route path="/:role/*" element={<div className="p-8 text-center text-gray-500">Feature coming soon.</div>} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
