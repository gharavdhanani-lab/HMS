import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Activity, FileText, CheckCircle2, ChevronLeft, Plus, Trash2 } from 'lucide-react';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Patient, Appointment } from '../../types';

export function DoctorConsultation() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { appointments, patients, user } = useAppStore();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [complaint, setComplaint] = useState('');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  // Prescription state
  const [showPrescription, setShowPrescription] = useState(false);
  const [medicines, setMedicines] = useState([{ name: '', dose: '', frequency: '1-0-1', duration: '5 Days' }]);

  useEffect(() => {
    if (appointmentId && appointments.length > 0 && patients.length > 0) {
      const apt = appointments.find(a => a.id === appointmentId);
      if (apt) {
        setAppointment(apt);
        const pt = patients.find(p => p.id === apt.patientId);
        if (pt) setPatient(pt);
      }
    }
  }, [appointmentId, appointments, patients]);

  if (!appointment || !patient) {
    return <div className="p-8 text-center text-gray-500">Loading consultation...</div>;
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dose: '', frequency: '1-0-1', duration: '5 Days' }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedicines(newMeds);
  };

  const handleEndConsultation = async () => {
    try {
      // Create prescription record if filled out
      if (showPrescription && medicines[0].name.trim() !== '') {
        await addDoc(collection(db, 'prescriptions'), {
          appointmentId: appointment.id,
          patientId: patient.id,
          doctorId: user?.id,
          date: new Date().toISOString(),
          medicines,
          notes,
          diagnosis
        });
      }

      // Update appointment status
      await updateDoc(doc(db, 'appointments', appointment.id), { 
        status: 'COMPLETED',
        diagnosis: diagnosis || 'General checkup'
      });

      navigate('/doctor/dashboard');
    } catch (error) {
      console.error("Error ending consultation:", error);
      alert("Failed to end consultation.");
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/doctor/dashboard')} className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Consultation: {patient.name}</h1>
          <Badge variant="warning" className="animate-pulse">Active Session (Token {appointment.token})</Badge>
        </div>
        <Button onClick={handleEndConsultation} className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="w-4 h-4 mr-2"/> Complete Consultation
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Patient Profile & History */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{patient.name}</h3>
                  <p className="text-sm text-gray-500">UHID: {patient.uhid}</p>
                  <p className="text-sm text-gray-500">{patient.age}Y, {patient.gender}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Vitals</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">BP: 120/80</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">HR: 72 bpm</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Temp: 98.6°F</div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200">Wt: {patient.gender === 'Male' ? '75' : '62'} kg</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Known Allergies</h4>
                  {patient.id === 'pt1' ? (
                    <Badge variant="danger">Penicillin</Badge>
                  ) : (
                    <span className="text-sm text-gray-500">None reported</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold">Past Visits</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm text-gray-500">
              No recent visits found in the last 6 months.
            </CardContent>
          </Card>
        </div>

        {/* Right: Clinical Notes & Actions */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="complaint">Chief Complaint</Label>
                  <Input 
                    id="complaint" 
                    value={complaint} 
                    onChange={e => setComplaint(e.target.value)} 
                    placeholder="E.g., Mild chest pain since 2 days" 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input 
                    id="diagnosis" 
                    value={diagnosis} 
                    onChange={e => setDiagnosis(e.target.value)} 
                    placeholder="Primary diagnosis" 
                    className="mt-1" 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-end mb-1">
                    <Label htmlFor="notes">Clinical Notes</Label>
                  </div>
                  <textarea 
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border resize-none" 
                    placeholder="Enter detailed clinical notes here..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="pb-3 border-b bg-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-600"/> e-Prescription</CardTitle>
                {!showPrescription && (
                  <Button variant="outline" size="sm" onClick={() => setShowPrescription(true)}>
                    Create
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                {showPrescription ? (
                  <div className="p-4 space-y-4">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="p-3 border border-gray-200 rounded-md bg-white space-y-3 relative">
                        <Button 
                          variant="ghost" 
                          className="absolute top-1 right-1 h-6 w-6 p-1 text-red-500" 
                          onClick={() => removeMedicine(idx)}
                          disabled={medicines.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div>
                          <Label className="text-xs text-gray-500">Medicine Name</Label>
                          <Input 
                            value={med.name} 
                            onChange={e => updateMedicine(idx, 'name', e.target.value)} 
                            placeholder="e.g. Paracetamol 500mg" 
                            className="h-8 text-sm mt-1" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500">Frequency</Label>
                            <select 
                              value={med.frequency}
                              onChange={e => updateMedicine(idx, 'frequency', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                            >
                              <option>1-0-1 (Twice)</option>
                              <option>1-1-1 (Thrice)</option>
                              <option>1-0-0 (Morning)</option>
                              <option>0-0-1 (Night)</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Duration</Label>
                            <select 
                              value={med.duration}
                              onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 border px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                            >
                              <option>3 Days</option>
                              <option>5 Days</option>
                              <option>1 Week</option>
                              <option>1 Month</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-blue-600 border-dashed" onClick={addMedicine}>
                      <Plus className="h-4 w-4 mr-1" /> Add Medicine
                    </Button>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-6 text-gray-400">
                    <div>
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">No prescription generated.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center">
             <Activity className="h-5 w-5 text-blue-600 mr-3" />
             <p className="text-sm text-blue-800">
               <strong>AI Assistant:</strong> Based on the symptoms and diagnosis, would you like to automatically order a complete blood count (CBC)?
             </p>
             <Button variant="outline" size="sm" className="ml-auto bg-white">Add Lab Order</Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
