import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardList, Package, 
  MessageSquareText, Menu, X, CalendarDays, ChevronDown, ChevronRight, Store
} from 'lucide-react';
import { DEPARTMENTS } from '../constants';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, users } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDeptsOpen, setIsDeptsOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Schedule', path: '/calendar', icon: <CalendarDays size={20} /> },
    { label: 'Team', path: '/employees', icon: <Users size={20} /> },
    { label: 'My Tasks', path: '/my-tasks', icon: <ClipboardList size={20} /> },
    { label: 'Requests', path: '/requests', icon: <Package size={20} /> },
    { label: 'Manager AI', path: '/assistant', icon: <MessageSquareText size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-monday-dark text-white transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-tight">LiquorStore OS</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'bg-monday-primary text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
            
            {/* Departments Collapsible */}
            <li>
                <button 
                    onClick={() => setIsDeptsOpen(!isDeptsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors mt-2"
                >
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <Store size={20} />
                        Departments
                    </div>
                    {isDeptsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isDeptsOpen && (
                    <ul className="mt-1 ml-4 space-y-1 border-l border-gray-700 pl-2">
                        {DEPARTMENTS.map(dept => (
                        <li key={dept.id}>
                            <Link
                            to={`/department/${dept.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                location.pathname === `/department/${dept.id}` ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
                            }`}
                            >
                            <span className={`w-2 h-2 rounded-full ${dept.type === 'Retail' ? 'bg-monday-success' : 'bg-monday-warning'}`} />
                            {dept.name}
                            </Link>
                        </li>
                        ))}
                    </ul>
                )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: user.color || '#0073ea' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
            </div>
          </div>
          <div className="mt-2">
             <select 
               className="w-full bg-gray-800 text-xs text-gray-300 p-1 rounded border border-gray-600"
               value={user.id}
               onChange={(e) => {
                 const u = users.find(x => x.id === e.target.value);
                 if (u) setUser(u);
               }}
             >
               {users.map(u => <option key={u.id} value={u.id}>Switch to: {u.name}</option>)}
             </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800">LiquorStore OS</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};