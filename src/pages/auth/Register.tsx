import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Activity } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Patient } from '../../types';

export function Register() {
  const navigate = useNavigate();
  const login = useAppStore(state => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    hasAbha: 'No',
    abhaNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateUHID = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `HSP-${year}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const uhid = generateUHID();
      
      const newPatient: Omit<Patient, 'id'> = {
        name: formData.name,
        email: formData.email,
        role: 'PATIENT',
        uhid: uhid,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
      };

      // Add to Firestore using the Auth UID as the document ID
      await setDoc(doc(db, 'patients', userCredential.user.uid), newPatient);
      
      const createdPatient = { ...newPatient, id: userCredential.user.uid } as Patient;
      
      // Auto-login after registration
      login(createdPatient);
      navigate('/patient/dashboard');
      
    } catch (err: any) {
      console.error("Error registering patient:", err);
      setError(err.message || "Registration failed. Please try again.");
      try {
        handleFirestoreError(err, OperationType.CREATE, 'patients');
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center">
        <Activity className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Patient Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your Hospify account to book appointments and view records
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" required value={formData.name} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1" minLength={6} />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input id="dob" type="date" name="dob" required value={formData.dob} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" name="age" required value={formData.age} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select id="gender" name="gender" required value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <Input id="phone" type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Address Details</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" name="address" required value={formData.address} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required value={formData.city} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" required value={formData.state} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" name="pincode" required value={formData.pincode} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Digital Health */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Digital Health Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="hasAbha">ABHA Available?</Label>
                    <select id="hasAbha" name="hasAbha" value={formData.hasAbha} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  {formData.hasAbha === 'Yes' && (
                    <div>
                      <Label htmlFor="abhaNumber">ABHA Number</Label>
                      <Input id="abhaNumber" name="abhaNumber" value={formData.abhaNumber} onChange={handleChange} className="mt-1" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Already have an account? Log in
                </Link>
                <Button type="submit" disabled={loading} className="w-48">
                  {loading ? 'Registering...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
