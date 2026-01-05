import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Role, User, Shift } from '../types';
import { UserPlus, CalendarPlus, Briefcase, Mail, Check, X, Clock, Calendar, Pencil, Settings } from 'lucide-react';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF'];

export const Employees = () => {
  const { users, departments, addUser, updateUser, addShifts } = useApp();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserForSchedule, setSelectedUserForSchedule] = useState<User | null>(null);
  
  // User Form State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>(Role.EMPLOYEE);
  const [newDept, setNewDept] = useState(departments[0].id);
  const [newSecondaryDepts, setNewSecondaryDepts] = useState<string[]>([]);
  const [newColor, setNewColor] = useState(COLORS[0]);

  // Schedule Builder State
  const [weekStartDate, setWeekStartDate] = useState(() => {
    // Default to next Monday
    const d = new Date();
    d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
    return d.toISOString().split('T')[0];
  });
  
  // 7 days of shifts: index 0 = selected start date
  const [scheduleDraft, setScheduleDraft] = useState(Array(7).fill({ start: '', end: '' }));

  const openAddUser = () => {
      setEditingUserId(null);
      setNewName('');
      setNewEmail('');
      setNewRole(Role.EMPLOYEE);
      setNewDept(departments[0].id);
      setNewSecondaryDepts([]);
      setNewColor(COLORS[0]);
      setShowUserModal(true);
  };

  const openEditUser = (user: User) => {
      setEditingUserId(user.id);
      setNewName(user.name);
      setNewEmail(user.email || '');
      setNewRole(user.role);
      setNewDept(user.departmentId);
      setNewSecondaryDepts(user.secondaryDepartmentIds || []);
      setNewColor(user.color || COLORS[0]);
      setShowUserModal(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
      id: editingUserId || `u_${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      departmentId: newDept,
      secondaryDepartmentIds: newSecondaryDepts,
      color: newColor,
      phone: ''
    };

    if (editingUserId) {
        updateUser(userData);
    } else {
        addUser(userData);
    }
    setShowUserModal(false);
  };

  const toggleSecondaryDept = (id: string) => {
    if (newSecondaryDepts.includes(id)) {
        setNewSecondaryDepts(prev => prev.filter(d => d !== id));
    } else {
        setNewSecondaryDepts(prev => [...prev, id]);
    }
  };

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const date1 = new Date(0, 0, 0, h1, m1);
    const date2 = new Date(0, 0, 0, h2, m2);
    let diff = (date2.getTime() - date1.getTime()) / 1000 / 60 / 60;
    if (diff < 0) diff += 24; // Handle overnight shifts
    return Math.round(diff * 10) / 10;
  };

  const handleScheduleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForSchedule) return;

    const shiftsToSave: Shift[] = [];
    const baseDate = new Date(weekStartDate);

    scheduleDraft.forEach((day, idx) => {
        if (day.start && day.end) {
            const current = new Date(baseDate);
            current.setDate(baseDate.getDate() + idx); // UTC issue handling omitted for MVP simplicity
            const yyyy = current.getFullYear();
            const mm = String(current.getMonth() + 1).padStart(2, '0');
            const dd = String(current.getDate()).padStart(2, '0');
            
            shiftsToSave.push({
                id: `shift_${Date.now()}_${idx}`,
                userId: selectedUserForSchedule.id,
                date: `${yyyy}-${mm}-${dd}`,
                startTime: day.start,
                endTime: day.end
            });
        }
    });

    addShifts(shiftsToSave);
    alert(`Added ${shiftsToSave.length} shifts for ${selectedUserForSchedule.name}`);
    setSelectedUserForSchedule(null);
    setScheduleDraft(Array(7).fill({ start: '', end: '' }));
  };

  const updateDraft = (index: number, field: 'start' | 'end', value: string) => {
    const newDraft = [...scheduleDraft];
    newDraft[index] = { ...newDraft[index], [field]: value };
    setScheduleDraft(newDraft);
  };

  const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || id;

  const totalWeeklyHours = scheduleDraft.reduce((acc, curr) => acc + calculateHours(curr.start, curr.end), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Schedule</h1>
          <p className="text-gray-500">Manage employees, assign departments, and weekly shifts.</p>
        </div>
        <button 
          onClick={openAddUser}
          className="flex items-center gap-2 bg-monday-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* User Form Modal (Add/Edit) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-2xl relative animate-fade-in">
                <button onClick={() => setShowUserModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                <h3 className="font-bold text-lg mb-4 text-gray-800">{editingUserId ? 'Edit Employee Profile' : 'New Employee Profile'}</h3>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                        <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-monday-primary" placeholder="John Doe" />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                        <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="john@store.com" />
                        </div>
                        <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
                        <select value={newRole} onChange={e => setNewRole(e.target.value as Role)} className="w-full border p-2 rounded text-sm">
                            <option value={Role.EMPLOYEE}>Employee</option>
                            <option value={Role.MANAGER}>Manager</option>
                            <option value={Role.OWNER}>Owner</option>
                        </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">Primary Department</label>
                            <select value={newDept} onChange={e => setNewDept(e.target.value)} className="w-full border p-2 rounded text-sm mb-4">
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>

                            <label className="block text-xs font-semibold text-gray-500 mb-2">Secondary Departments</label>
                            <div className="flex flex-wrap gap-2">
                                {departments.filter(d => d.id !== newDept).map(d => (
                                    <button
                                        type="button" 
                                        key={d.id}
                                        onClick={() => toggleSecondaryDept(d.id)}
                                        className={`text-xs px-2 py-1 rounded border ${newSecondaryDepts.includes(d.id) ? 'bg-monday-primary text-white border-monday-primary' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                                    >
                                        {d.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-2">Profile Color (for Calendar)</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button
                                        type="button"
                                        key={c}
                                        onClick={() => setNewColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newColor === c ? 'border-gray-800' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 gap-3">
                         <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="bg-monday-success text-white px-6 py-2 rounded text-sm font-bold hover:bg-green-600">
                            {editingUserId ? 'Save Changes' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Weekly Schedule Builder Modal */}
      {selectedUserForSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Weekly Schedule</h3>
                    <p className="text-sm text-gray-500">Planning for <span className="font-semibold text-monday-primary">{selectedUserForSchedule.name}</span></p>
                </div>
                <button onClick={() => setSelectedUserForSchedule(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleScheduleSave} className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Calendar size={20} className="text-blue-600" />
                    <div>
                        <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide">Week Starting</label>
                        <input 
                            type="date" 
                            required 
                            value={weekStartDate} 
                            onChange={e => setWeekStartDate(e.target.value)} 
                            className="bg-white border border-blue-200 rounded px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase">Total Hours</div>
                        <div className="text-2xl font-bold text-gray-900">{totalWeeklyHours}h</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {scheduleDraft.map((day, idx) => {
                        const date = new Date(weekStartDate);
                        date.setDate(date.getDate() + idx);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const hours = calculateHours(day.start, day.end);

                        return (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="w-32">
                                    <div className="font-medium text-gray-900">{dayName}</div>
                                    <div className="text-xs text-gray-500">{dateStr}</div>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] text-gray-400 uppercase mb-1">Start Time</label>
                                        <input 
                                            type="time" 
                                            value={day.start} 
                                            onChange={e => updateDraft(idx, 'start', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-400 uppercase mb-1">End Time</label>
                                        <input 
                                            type="time" 
                                            value={day.end} 
                                            onChange={e => updateDraft(idx, 'end', e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="w-16 text-right font-mono font-medium text-gray-600">
                                    {hours > 0 ? `${hours}h` : '-'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </form>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedUserForSchedule(null)} className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-white">Cancel</button>
                <button onClick={handleScheduleSave} className="px-6 py-2 bg-monday-primary text-white rounded font-bold hover:bg-blue-600 shadow-sm">Save Weekly Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Employee List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
            <div key={u.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group relative">
                <div className="h-2" style={{ backgroundColor: u.color || '#ccc' }} />
                {/* Edit Button */}
                <button 
                    onClick={() => openEditUser(u)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Edit Profile & Departments"
                >
                    <Pencil size={16} />
                </button>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm"
                            style={{ backgroundColor: u.color || '#ccc' }}
                        >
                            {u.name.charAt(0)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide mr-8
                        ${u.role === Role.OWNER ? 'bg-purple-100 text-purple-700' : 
                            u.role === Role.MANAGER ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{u.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                        <Mail size={12} /> {u.email}
                    </p>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Briefcase size={14} className="text-gray-400" />
                            <span className="font-medium">{getDepartmentName(u.departmentId)}</span>
                            <span className="text-xs text-gray-400">(Primary)</span>
                        </div>
                        {u.secondaryDepartmentIds && u.secondaryDepartmentIds.length > 0 && (
                            <div className="pl-6 flex flex-wrap gap-1">
                                {u.secondaryDepartmentIds.map(sid => (
                                    <span key={sid} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                        {getDepartmentName(sid)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setSelectedUserForSchedule(u)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg border border-gray-200 font-medium text-sm transition-colors group-hover:border-monday-primary group-hover:text-monday-primary"
                    >
                        <CalendarPlus size={16} />
                        Manage Schedule
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};