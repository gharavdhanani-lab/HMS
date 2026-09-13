import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Users, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">Hospify</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Departments</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Doctors</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Services</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Log In</Button>
              </Link>
              <Link to="/login">
                <Button variant="danger">Emergency</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-50 pt-20 pb-28 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Smarter Hospital Management.<br className="hidden md:block"/> 
            <span className="text-blue-600">Better Patient Care.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            Manage patients, doctors, appointments, medical records, billing, pharmacy, and hospital operations from one centralized platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">Patient Portal <ArrowRight className="ml-2 h-5 w-5"/></Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white">Staff Login</Button>
            </Link>
          </div>
        </div>
        
        {/* Background Decorative Pattern */}
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-blue-50/50 rounded-l-[100px] hidden lg:block" />
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Clock, stat: '24/7', label: 'Patient Support' },
              { icon: Users, stat: '50+', label: 'Specialist Doctors' },
              { icon: Activity, stat: '10+', label: 'Departments' },
              { icon: Shield, stat: '99%', label: 'Record Accuracy' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{item.stat}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
