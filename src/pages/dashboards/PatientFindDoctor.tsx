import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Stethoscope, Video, User } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export function PatientFindDoctor() {
  const { doctors, user } = useAppStore();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [booking, setBooking] = useState(false);

  // Generate some slots for demo
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) return;
    
    setBooking(true);
    try {
      const docData = doctors.find(d => d.id === selectedDoctor);
      const randomToken = `A-${Math.floor(Math.random() * 900) + 100}`;
      
      await addDoc(collection(db, 'appointments'), {
        patientId: user.id,
        doctorId: selectedDoctor,
        department: docData?.department || 'General',
        date: selectedDate,
        time: selectedTime,
        status: 'SCHEDULED',
        type: 'IN_PERSON',
        token: randomToken
      });
      
      navigate('/patient/dashboard');
    } catch (e) {
      console.error(e);
      alert('Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find a Doctor</h1>
        <p className="text-sm text-gray-500 mt-1">Search and book appointments with our specialists.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor List */}
        <div className="md:col-span-2 space-y-4">
          {doctors.map(doctor => (
            <Card key={doctor.id} className={`cursor-pointer transition-all ${selectedDoctor === doctor.id ? 'ring-2 ring-blue-500 border-transparent' : 'hover:border-blue-200'}`} onClick={() => setSelectedDoctor(doctor.id)}>
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl uppercase">
                  {doctor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.department} • {doctor.specialization}</p>
                    </div>
                    <Badge variant="success">Available</Badge>
                  </div>
                  <div className="mt-4 flex space-x-4 text-sm text-gray-600">
                    <span className="flex items-center"><User className="h-4 w-4 mr-1 text-gray-400"/> {doctor.experience} yrs exp</span>
                    <span className="flex items-center"><Stethoscope className="h-4 w-4 mr-1 text-gray-400"/> ₹{doctor.fee}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Panel */}
        <div className="md:col-span-1">
          {selectedDoctor ? (
            <Card className="sticky top-6">
              <CardHeader className="bg-gray-50 border-b pb-4">
                <CardTitle className="text-lg">Book Appointment</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full border-gray-300 rounded-md text-sm p-2 border focus:ring-blue-500 focus:border-blue-500" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Select Time</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-sm text-center rounded-md border transition-colors ${selectedTime === time ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full mt-4" 
                  disabled={!selectedDate || !selectedTime || booking}
                  onClick={handleBook}
                >
                  {booking ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center text-blue-800">
              <Stethoscope className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Select a doctor to view their availability and book an appointment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
