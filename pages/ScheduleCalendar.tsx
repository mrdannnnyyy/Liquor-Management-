import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

export const ScheduleCalendar = () => {
  const { shifts, users } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const formatTime12h = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Create grid slots
  const slots = [];
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    slots.push(null);
  }
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    slots.push(i);
  }

  const getShiftsForDay = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return shifts.filter(s => s.date === dateStr);
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft /></button>
          <span className="font-bold w-32 text-center text-gray-800">{monthName} {year}</span>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronRight /></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Cells */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {slots.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="bg-gray-50 border-b border-r border-gray-100" />;
            
            const dayShifts = getShiftsForDay(day);
            const isToday = new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();

            return (
              <div key={day} className={`border-b border-r border-gray-100 p-2 min-h-[100px] relative transition-colors hover:bg-gray-50 ${isToday ? 'bg-blue-50/50' : 'bg-white'}`}>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1 ${isToday ? 'bg-monday-primary text-white' : 'text-gray-700'}`}>{day}</span>
                <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayShifts.map(shift => {
                    const user = getUser(shift.userId);
                    const userColor = user?.color || '#ccc';
                    return (
                        <div 
                            key={shift.id} 
                            className="text-xs px-1.5 py-1 rounded border-l-4 shadow-sm bg-white"
                            style={{ borderLeftColor: userColor }}
                        >
                        <div className="font-bold text-gray-800 truncate leading-tight">{user?.name || 'Unknown'}</div>
                        <div className="text-gray-500 text-[10px] leading-tight mt-0.5">
                            {formatTime12h(shift.startTime)} - {formatTime12h(shift.endTime)}
                        </div>
                        </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Legend/Hint */}
      <div className="lg:hidden mt-4 text-center text-xs text-gray-500">
        Tip: Scroll vertically if days are tall.
      </div>
    </div>
  );
};