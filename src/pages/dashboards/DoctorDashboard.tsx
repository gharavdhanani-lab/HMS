import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAppStore } from '../../store';
import { Users, Clock, CheckCircle2, ChevronRight, Activity, FileText } from 'lucide-react';
import { Doctor, Appointment, Patient } from '../../types';

export function DoctorDashboard() {
  const { user, appointments, patients } = useAppStore();
  const doctor = user as Doctor;
  const navigate = useNavigate();

  const todayAppointments = appointments.filter(a => a.doctorId === doctor.id);
  const waitingQueue = todayAppointments.filter(a => a.status === 'WAITING');
  
  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);

  const getPatient = (id: string) => patients.find(p => p.id === id);

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (e) {
      console.error("Error updating appointment", e);
    }
  };

  const startConsultation = async (apt: Appointment) => {
    await updateAppointmentStatus(apt.id, 'IN_CONSULTATION');
    setActiveConsultation({ ...apt, status: 'IN_CONSULTATION' });
  };

  const endConsultation = async () => {
    if (activeConsultation) {
      await updateAppointmentStatus(activeConsultation.id, 'COMPLETED');
      setActiveConsultation(null);
    }
  };

  if (activeConsultation) {
    const pt = getPatient(activeConsultation.patientId);
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col sm:flex-row gap-4">
        {/* Left: Patient Profile & History */}
        <div className="w-full sm:w-1/3 flex flex-col gap-4">
          <Card className="flex-1 overflow-y-auto">
            <CardHeader className="pb-3 border-b">
              <CardTitle>Patient Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
                  {pt?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{pt?.name}</h3>
                  <p className="text-sm text-gray-500">UHID: {pt?.uhid}</p>
                  <p className="text-sm text-gray-500">{pt?.age}Y, {pt?.gender}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Vitals</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded border">BP: 120/80</div>
                    <div className="bg-gray-50 p-2 rounded border">HR: 72 bpm</div>
                    <div className="bg-gray-50 p-2 rounded border">Temp: 98.6°F</div>
                    <div className="bg-gray-50 p-2 rounded border">Wt: 75 kg</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Known Allergies</h4>
                  <Badge variant="danger">Penicillin</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Clinical Notes & Actions */}
        <div className="w-full sm:w-2/3 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b flex flex-row justify-between items-center">
              <CardTitle>Consultation Workspace</CardTitle>
              <Badge variant="warning" className="animate-pulse">Active Session</Badge>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                <input type="text" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" placeholder="E.g., Mild chest pain since 2 days" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Clinical Notes</label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600"><Activity className="w-3 h-3 mr-1"/> AI Assist</Button>
                </div>
                <textarea className="w-full flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border resize-none" placeholder="Enter detailed clinical notes here..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                <input type="text" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border" placeholder="Primary diagnosis" />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1"><FileText className="w-4 h-4 mr-2"/> e-Prescription</Button>
                <Button variant="outline" className="flex-1"><Activity className="w-4 h-4 mr-2"/> Lab Order</Button>
              </div>
            </CardContent>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <Button onClick={endConsultation} className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="w-4 h-4 mr-2"/> End Consultation</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Dashboard</h1>
          <p className="text-sm text-gray-500">{doctor.department} • {todayAppointments.length} appointments today</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Today</p>
              <h3 className="text-2xl font-bold text-gray-900">{todayAppointments.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg mr-4 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Waiting</p>
              <h3 className="text-2xl font-bold text-gray-900">{waitingQueue.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{todayAppointments.filter(a => a.status === 'COMPLETED').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Active Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {waitingQueue.length > 0 ? waitingQueue.map((apt) => {
              const pt = getPatient(apt.patientId);
              return (
                <div key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {pt?.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{pt?.name}</h4>
                      <p className="text-sm text-gray-500">Token: <span className="font-semibold text-gray-900">{apt.token}</span> • {apt.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Waiting</Badge>
                    <Button onClick={() => startConsultation(apt)}>
                      Call Next <ChevronRight className="w-4 h-4 ml-1"/>
                    </Button>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-gray-500">
                No patients waiting in queue.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
