import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { 
  LayoutDashboard, Users, Calendar, Activity, 
  Settings, LogOut, Bell, Search, Stethoscope, BriefcaseMedical
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';

export function DashboardLayout() {
  const { user, logout } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: `/${user.role.toLowerCase()}/dashboard`, icon: LayoutDashboard },
    ...(user.role === 'DOCTOR' ? [
      { name: 'Queue', path: '/doctor/queue', icon: Activity },
      { name: 'Patients', path: '/doctor/patients', icon: Users },
    ] : []),
    ...(user.role === 'PATIENT' ? [
      { name: 'Find Doctor', path: '/patient/find-doctor', icon: Stethoscope },
      { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
      { name: 'Records', path: '/patient/records', icon: BriefcaseMedical },
    ] : []),
    ...(user.role === 'ADMIN' ? [
      { name: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Patients', path: '/admin/patients', icon: Users },
      { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    ] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">Hospify</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                    location.pathname.startsWith(item.path)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    location.pathname.startsWith(item.path) ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                  )} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex-1 flex">
            <div className="w-full max-w-lg lg:max-w-xs relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search patients, doctors, etc."
                type="search"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase overflow-hidden">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user.name.charAt(0)}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
