import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAppStore } from '../../store';
import { Users, AlertTriangle, BedDouble, Activity, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function AdminDashboard() {
  const { patients, doctors, beds, appointments } = useAppStore();

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-sm text-gray-500">Live overview of hospital operations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>{format(new Date(), 'EEEE, MMM dd, yyyy')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Patients</p>
                <h3 className="text-3xl font-bold text-gray-900">{patients.length * 1240}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12.4%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Doctors On Duty</p>
                <h3 className="text-3xl font-bold text-gray-900">{doctors.length}</h3>
              </div>
              <div className="p-2 bg-teal-50 rounded-lg">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">All active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Available Beds</p>
                <h3 className="text-3xl font-bold text-gray-900">{availableBeds} / {beds.length}</h3>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <BedDouble className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600 font-medium">{occupiedBeds} Occupied</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Emergency Alerts</p>
                <h3 className="text-3xl font-bold text-red-700">2</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              Requires immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-lg">Real-Time Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Critical Vitals Alert</p>
                  <p className="text-sm text-gray-500">Patient: Rahul Patel (ICU-01) - SpO2 dropping.</p>
                  <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
                </div>
              </div>
              <div className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Low Stock Warning</p>
                  <p className="text-sm text-gray-500">Paracetamol 500mg below reorder level.</p>
                  <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bed Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bed Allocation Map</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"/>Available</Badge>
              <Badge variant="outline" className="bg-white"><div className="w-2 h-2 rounded-full bg-red-500 mr-2"/>Occupied</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {beds.map(bed => (
                <div 
                  key={bed.id} 
                  className={`p-4 rounded-lg border flex flex-col items-center text-center transition-all ${
                    bed.status === 'AVAILABLE' 
                      ? 'border-green-200 bg-green-50/30' 
                      : bed.status === 'OCCUPIED'
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-yellow-200 bg-yellow-50/30'
                  }`}
                >
                  <BedDouble className={`h-8 w-8 mb-2 ${
                    bed.status === 'AVAILABLE' ? 'text-green-600' : bed.status === 'OCCUPIED' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <span className="font-bold text-gray-900">{bed.number}</span>
                  <span className="text-xs text-gray-500 font-medium">{bed.ward}</span>
                  <span className={`text-[10px] font-bold uppercase mt-1 ${
                    bed.status === 'AVAILABLE' ? 'text-green-600' : bed.status === 'OCCUPIED' ? 'text-red-600' : 'text-yellow-600'
                  }`}>{bed.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
