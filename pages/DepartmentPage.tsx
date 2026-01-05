import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { TaskBoard } from '../components/TaskBoard';
import { BookOpen, Plus } from 'lucide-react';

export const DepartmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { departments, tasks, addTask } = useApp();
  const [isSopOpen, setIsSopOpen] = useState(false);

  const dept = departments.find(d => d.id === id);
  if (!dept) return <div>Department not found</div>;

  const deptTasks = tasks.filter(t => t.departmentId === id);
  
  const dailyTasks = deptTasks.filter(t => t.frequency === 'Daily' && t.status !== 'Done');
  const weeklyTasks = deptTasks.filter(t => t.frequency === 'Weekly' && t.status !== 'Done');
  const monthlyTasks = deptTasks.filter(t => t.frequency === 'Monthly' && t.status !== 'Done');
  const completedTasks = deptTasks.filter(t => t.status === 'Done');

  const handleQuickAdd = () => {
    addTask({
        id: `manual_${Date.now()}`,
        title: 'New Task',
        departmentId: dept.id,
        status: 'Todo',
        priority: 'Medium',
        frequency: 'Daily',
        dueDate: new Date().toISOString(),
        isRecurring: false,
        generatedDate: new Date().toDateString()
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${dept.type === 'Retail' ? 'bg-monday-success' : 'bg-monday-warning'}`}></span>
                {dept.name} Department
            </h1>
            <p className="text-gray-500 text-sm mt-1">{dept.type} Operations Board</p>
         </div>
         <div className="flex gap-2">
            <button 
                onClick={() => setIsSopOpen(!isSopOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
                <BookOpen size={16} />
                {isSopOpen ? 'Hide SOP' : 'View SOP'}
            </button>
            <button 
                onClick={handleQuickAdd}
                className="flex items-center gap-2 px-4 py-2 bg-monday-primary text-white rounded hover:bg-blue-600 font-medium text-sm transition-colors shadow-sm"
            >
                <Plus size={16} />
                Add Task
            </button>
         </div>
       </div>

       {isSopOpen && (
         <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-inner prose prose-sm max-w-none text-gray-800">
             <h3 className="text-blue-800 font-bold uppercase text-xs mb-2 tracking-wider">Standard Operating Procedures</h3>
             <pre className="whitespace-pre-wrap font-sans">{dept.sop}</pre>
         </div>
       )}

       <div className="space-y-8">
          <TaskBoard tasks={dailyTasks} title="Daily Tasks" color="#0073ea" />
          <TaskBoard tasks={weeklyTasks} title="Weekly Tasks" color="#595ad4" />
          <TaskBoard tasks={monthlyTasks} title="Monthly Tasks" color="#a35cd2" />
          {completedTasks.length > 0 && (
             <TaskBoard tasks={completedTasks} title="Completed Today" color="#00ca72" />
          )}
       </div>
    </div>
  );
};
