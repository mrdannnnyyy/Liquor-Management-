import React from 'react';
import { Task, TaskStatus, TaskPriority, User } from '../types';
import { useApp } from '../store/AppContext';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  title: string;
  color: string;
}

export const TaskBoard = ({ tasks, title, color }: TaskBoardProps) => {
  const { updateTaskStatus, users } = useApp();

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done': return 'bg-monday-success text-white hover:bg-green-600';
      case 'In Progress': return 'bg-monday-warning text-white hover:bg-orange-500';
      default: return 'bg-gray-300 text-gray-700 hover:bg-gray-400';
    }
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch(p) {
        case 'High': return 'text-monday-danger';
        case 'Medium': return 'text-monday-warning';
        default: return 'text-gray-400';
    }
  };

  const handleStatusClick = (task: Task) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      'Todo': 'In Progress',
      'In Progress': 'Done',
      'Done': 'Todo'
    };
    updateTaskStatus(task.id, nextStatus[task.status]);
  };

  const getUserName = (id?: string) => users.find(u => u.id === id)?.name || 'Unassigned';

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className={`px-4 py-3 border-b border-gray-200 flex items-center justify-between`} style={{ borderLeft: `6px solid ${color}` }}>
        <h3 className="font-bold text-lg text-gray-800" style={{ color }}>{title}</h3>
        <span className="text-sm text-gray-500">{tasks.length} tasks</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 w-1/3">Task Name</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Priority</th>
              <th className="px-4 py-3 text-center">Due Date</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No tasks in this group</td></tr>
            ) : tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 group transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                  <div className={`w-1 h-8 rounded-r bg-${color} opacity-0 group-hover:opacity-100 absolute left-0`}></div>
                  {task.title}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                       {getUserName(task.assignedToId).charAt(0)}
                    </div>
                    {getUserName(task.assignedToId)}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleStatusClick(task)}
                    className={`px-3 py-1.5 w-32 rounded text-center text-xs font-bold transition-colors shadow-sm ${getStatusColor(task.status)}`}
                  >
                    {task.status.toUpperCase()}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                        <AlertCircle size={16} className={getPriorityColor(task.priority)} />
                        {task.priority}
                    </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                </td>
                 <td className="px-4 py-3 text-gray-400 truncate max-w-xs" title={task.instructions}>
                    {task.instructions || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
