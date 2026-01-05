import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Task, User, Department, TimeOffRequest, ReorderRequest, Shift,
  TaskStatus, Role 
} from '../types';
import { TASK_TEMPLATES, DEPARTMENTS, USERS } from '../constants';
import { sendNotification } from '../services/notificationService';

interface AppContextType {
  user: User; // Current logged in user
  setUser: (u: User) => void;
  users: User[]; // All users
  addUser: (u: User) => void;
  updateUser: (u: User) => void;
  
  tasks: Task[];
  departments: Department[];
  timeOffRequests: TimeOffRequest[];
  reorderRequests: ReorderRequest[];
  shifts: Shift[];
  
  addTask: (t: Task) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  
  addTimeOffRequest: (r: TimeOffRequest) => void;
  updateTimeOffStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  
  addReorderRequest: (r: ReorderRequest) => void;
  updateReorderStatus: (id: string, status: 'Pending' | 'Ordered' | 'Restocked') => void;

  addShift: (s: Shift) => void;
  addShifts: (shifts: Shift[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with seed data
  const [user, setUser] = useState<User>(USERS[0]);
  const [users, setUsers] = useState<User[]>(USERS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [reorderRequests, setReorderRequests] = useState<ReorderRequest[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  
  // Automation: Recurring Task Generation
  useEffect(() => {
    const lastRunDate = localStorage.getItem('LAST_TASK_GEN');
    const today = new Date().toDateString();
    
    // If not run today, run logic (Simulates the 11:00 AM cloud scheduler)
    if (lastRunDate !== today) {
      console.log('Running Recurring Task Generator...');
      const newTasks: Task[] = [];
      const now = new Date();
      const isMonday = now.getDay() === 1;
      const isFirstOfMonth = now.getDate() === 1;

      TASK_TEMPLATES.forEach(template => {
        let shouldCreate = false;
        if (template.frequency === 'Daily') shouldCreate = true;
        if (template.frequency === 'Weekly' && isMonday) shouldCreate = true;
        if (template.frequency === 'Monthly' && isFirstOfMonth) shouldCreate = true;

        if (shouldCreate) {
          newTasks.push({
            id: `task_${Date.now()}_${Math.random()}`,
            title: template.title,
            departmentId: template.departmentId,
            status: 'Todo',
            priority: 'Medium',
            frequency: template.frequency,
            dueDate: new Date(now.setHours(20, 0, 0, 0)).toISOString(), // Due by 8PM
            isRecurring: true,
            generatedDate: today,
            instructions: template.notes
          });
        }
      });

      if (newTasks.length > 0) {
        setTasks(prev => [...prev, ...newTasks]);
        sendNotification({
          to: 'manager@store.com',
          subject: 'Daily Tasks Generated',
          body: `${newTasks.length} tasks created for today.`,
          type: 'email'
        });
      }
      
      localStorage.setItem('LAST_TASK_GEN', today);
    }
  }, []);

  const addTask = (t: Task) => setTasks(prev => [...prev, t]);

  const addUser = (u: User) => setUsers(prev => [...prev, u]);

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status };
        if (status === 'Done') {
          updated.completedAt = new Date().toISOString();
        }
        return updated;
      }
      return t;
    }));
  };

  const addTimeOffRequest = (r: TimeOffRequest) => {
    setTimeOffRequests(prev => [...prev, r]);
    sendNotification({
      to: 'manager@store.com', 
      subject: 'New Time Off Request', 
      body: `${user.name} requested time off.`, 
      type: 'email'
    });
  };

  const updateTimeOffStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setTimeOffRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    // Find request to notify user
    const req = timeOffRequests.find(r => r.id === id);
    if(req) {
       const requester = users.find(u => u.id === req.userId);
       if(requester && requester.email) {
          sendNotification({
            to: requester.email,
            subject: `Time Off ${status}`,
            body: `Your request has been ${status}.`,
            type: 'both'
          });
       }
    }
  };

  const addReorderRequest = (r: ReorderRequest) => {
    setReorderRequests(prev => [...prev, r]);
    if (r.priority === 'High') {
      sendNotification({
        to: 'owner@store.com',
        subject: 'URGENT: Reorder Request',
        body: `Urgent reorder needed for ${r.productName}`,
        type: 'sms'
      });
    }
  };

  const updateReorderStatus = (id: string, status: 'Pending' | 'Ordered' | 'Restocked') => {
    setReorderRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addShift = (s: Shift) => {
    setShifts(prev => [...prev, s]);
  };
  
  const addShifts = (newShifts: Shift[]) => {
    setShifts(prev => {
        // Filter out existing shifts for the same user/date to prevent duplicates if overwriting
        const filtered = prev.filter(p => !newShifts.some(n => n.userId === p.userId && n.date === p.date));
        return [...filtered, ...newShifts];
    });
  };

  return (
    <AppContext.Provider value={{
      user, setUser, users, addUser, updateUser,
      tasks, departments: DEPARTMENTS, 
      timeOffRequests, reorderRequests, shifts,
      addTask, updateTaskStatus,
      addTimeOffRequest, updateTimeOffStatus,
      addReorderRequest, updateReorderStatus,
      addShift, addShifts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};