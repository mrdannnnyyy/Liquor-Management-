import React from 'react';
import { useApp } from '../store/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard = () => {
  const { tasks, departments, user } = useApp();

  // Stats Logic
  const completed = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const todo = tasks.filter(t => t.status === 'Todo').length;
  const overdue = tasks.filter(t => t.status !== 'Done' && new Date(t.dueDate) < new Date()).length;

  const statusData = [
    { name: 'Done', value: completed, color: '#00ca72' },
    { name: 'In Progress', value: inProgress, color: '#fdab3d' },
    { name: 'Todo', value: todo, color: '#c4c4c4' },
  ];

  // Completion by Department
  const deptData = departments.slice(0, 6).map(d => {
    const deptTasks = tasks.filter(t => t.departmentId === d.id);
    const done = deptTasks.filter(t => t.status === 'Done').length;
    return {
      name: d.name.split(' ')[0], // Short name
      total: deptTasks.length,
      completed: done
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}</h2>
           <p className="text-gray-500">Here's what's happening at the store today.</p>
        </div>
        <div className="text-right">
           <p className="text-sm font-bold text-gray-400">TODAY</p>
           <p className="text-xl font-mono text-monday-dark">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', val: tasks.length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Completed', val: completed, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Overdue', val: overdue, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Pending Requests', val: '2', color: 'bg-purple-50 border-purple-200 text-purple-700' }, // Mocked
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color}`}>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="font-bold text-gray-700 mb-4">Task Status</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {statusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-4 text-xs font-medium text-gray-500">
              {statusData.map(d => (
                 <div key={d.name} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></span>
                    {d.name}
                 </div>
              ))}
           </div>
        </div>

        {/* Dept Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="font-bold text-gray-700 mb-4">Completion by Department</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                   <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip cursor={{fill: '#f5f6f8'}} />
                   <Bar dataKey="total" fill="#e5e7eb" radius={[4,4,0,0]} stackId="a" />
                   <Bar dataKey="completed" fill="#0073ea" radius={[4,4,0,0]} stackId="b" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};
