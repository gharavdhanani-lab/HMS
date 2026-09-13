import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAppStore } from '../../store';
import { Calendar, FileText, Pill, CreditCard, Activity, ArrowRight, Video } from 'lucide-react';
import { Patient } from '../../types';

import { Link, useNavigate } from 'react-router-dom';

export function PatientDashboard() {
  const { user, appointments, doctors } = useAppStore();
  const patient = user as Patient;
  const navigate = useNavigate();

  const myAppointments = appointments.filter(a => a.patientId === patient.id);
  const upcomingAppointment = myAppointments.find(a => a.status === 'SCHEDULED' || a.status === 'WAITING');

  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'Unknown Doctor';
  const getDoctorDept = (id: string) => doctors.find(d => d.id === id)?.department || '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-blue-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Good morning, {patient.name}</h1>
          <p className="text-blue-100 mt-1">UHID: {patient.uhid} • {patient.age}Y, {patient.gender}</p>
        </div>
        <Button onClick={() => navigate('/patient/find-doctor')} className="mt-4 sm:mt-0 bg-white text-blue-600 hover:bg-blue-50 font-semibold border-0">
          Book Appointment
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: 'Book Consult', color: 'text-blue-600', bg: 'bg-blue-50', path: '/patient/find-doctor' },
          { icon: FileText, label: 'Lab Reports', color: 'text-purple-600', bg: 'bg-purple-50', path: '/patient/dashboard' },
          { icon: Pill, label: 'Medicines', color: 'text-teal-600', bg: 'bg-teal-50', path: '/patient/dashboard' },
          { icon: CreditCard, label: 'Pay Bills', color: 'text-orange-600', bg: 'bg-orange-50', path: '/patient/dashboard' },
        ].map((action, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer border-transparent shadow-sm" onClick={() => navigate(action.path)}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
              <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-3`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{action.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointment */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100">
            <CardTitle className="text-lg">Upcoming Appointment</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 h-8">View all <ArrowRight className="ml-1 h-4 w-4"/></Button>
          </CardHeader>
          <CardContent className="p-6">
            {upcomingAppointment ? (
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="bg-gray-50 rounded-xl p-4 text-center min-w-[100px] border border-gray-100">
                  <div className="text-sm text-gray-500 font-medium uppercase">{new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-3xl font-bold text-gray-900">{new Date(upcomingAppointment.date).getDate()}</div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">{upcomingAppointment.time}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{getDoctorName(upcomingAppointment.doctorId)}</h3>
                    {upcomingAppointment.type === 'VIDEO' && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Video className="w-3 h-3 mr-1"/> Teleconsult</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{getDoctorDept(upcomingAppointment.doctorId)}</p>
                  
                  {upcomingAppointment.status === 'WAITING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-yellow-800 font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        You are checked in. Token: <strong className="mx-1">{upcomingAppointment.token}</strong>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {upcomingAppointment.type === 'VIDEO' ? (
                      <Button className="bg-blue-600 hover:bg-blue-700">Join Call</Button>
                    ) : (
                      <Button variant="outline">View QR Code</Button>
                    )}
                    <Button variant="ghost" className="text-gray-500">Reschedule</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming appointments.</p>
                <Button onClick={() => navigate('/patient/find-doctor')}>Book Appointment</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-lg">Recent Vitals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Pressure</p>
                  <p className="text-lg font-bold text-gray-900">120/80 <span className="text-xs text-gray-400 font-normal">mmHg</span></p>
                </div>
                <Badge variant="success">Normal</Badge>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Heart Rate</p>
                  <p className="text-lg font-bold text-gray-900">72 <span className="text-xs text-gray-400 font-normal">bpm</span></p>
                </div>
                <Badge variant="success">Normal</Badge>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Weight</p>
                  <p className="text-lg font-bold text-gray-900">75.2 <span className="text-xs text-gray-400 font-normal">kg</span></p>
                </div>
                <Badge variant="outline">Stable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
