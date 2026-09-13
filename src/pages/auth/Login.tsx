import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Activity } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Patient, Doctor } from '../../types';

export function Login() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Look up user in patients
      const patientQuery = query(collection(db, 'patients'), where('email', '==', email));
      const patientSnapshot = await getDocs(patientQuery);
      
      if (!patientSnapshot.empty) {
        const patientData = patientSnapshot.docs[0].data() as Patient;
        patientData.id = patientSnapshot.docs[0].id;
        login(patientData);
        navigate('/patient/dashboard');
        return;
      }
      
      // Look up user in doctors
      const doctorQuery = query(collection(db, 'doctors'), where('email', '==', email));
      const doctorSnapshot = await getDocs(doctorQuery);
      
      if (!doctorSnapshot.empty) {
        const doctorData = doctorSnapshot.docs[0].data() as Doctor;
        doctorData.id = doctorSnapshot.docs[0].id;
        login(doctorData);
        navigate('/doctor/dashboard');
        return;
      }
      
      // Check admin
      if (email === 'admin@hospify.com') {
        login({ id: userCredential.user.uid, name: 'Admin Manager', email, role: 'ADMIN' });
        navigate('/admin/dashboard');
        return;
      }
      
      setError('User profile not found in database.');
      
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Note: Mock users require registration first.');
      try {
        handleFirestoreError(err, OperationType.GET, 'login');
      } catch (e) {
        // Ignore thrown error from handler
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Activity className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Hospify
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-1" 
                />
              </div>
              <Button 
                type="submit"
                className="w-full h-12 text-lg bg-blue-600 text-white hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="pt-4 text-center border-t mt-4">
                <p className="text-sm text-gray-600 mb-2">New patient?</p>
                <Link to="/register">
                  <Button 
                    variant="outline" 
                    className="w-full text-blue-600 hover:text-blue-700"
                    type="button"
                  >
                    Create an account
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
