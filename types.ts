export enum Role {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  departmentId: string; // Primary department
  secondaryDepartmentIds?: string[]; // Multiple departments
  email?: string;
  phone?: string;
  avatar?: string;
  color?: string; // For calendar visualization
}

export type DepartmentType = 'Retail' | 'Backend';

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
  sop: string; // Rich text or markdown
}

export type TaskFrequency = 'Daily' | 'Weekly' | 'Monthly';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  departmentId: string;
  assignedToId?: string;
  priority: TaskPriority;
  frequency: TaskFrequency;
  dueDate: string; // ISO Date string
  status: TaskStatus;
  notes?: string;
  instructions?: string;
  isRecurring: boolean;
  generatedDate: string; // To track recurring generation
  completedAt?: string;
}

export interface TaskTemplate {
  title: string;
  frequency: TaskFrequency;
  departmentId: string;
  notes?: string;
}

export type TimeOffType = 'Vacation' | 'Sick' | 'Personal';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TimeOffRequest {
  id: string;
  userId: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
}

export interface ReorderRequest {
  id: string;
  userId: string;
  productName: string;
  category: string;
  quantity: number;
  reason: string;
  priority: TaskPriority;
  status: 'Pending' | 'Ordered' | 'Restocked';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Shift {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}