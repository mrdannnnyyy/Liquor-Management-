import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { DEPARTMENTS } from '../constants';
import { ReorderRequest, TimeOffRequest } from '../types';

export const Requests = () => {
  const { user, addTimeOffRequest, addReorderRequest, timeOffRequests, reorderRequests, updateTimeOffStatus, updateReorderStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'timeoff' | 'reorder'>('timeoff');

  // Form States
  const [toType, setToType] = useState('Vacation');
  const [toStart, setToStart] = useState('');
  const [toEnd, setToEnd] = useState('');
  
  const [roProd, setRoProd] = useState('');
  const [roCat, setRoCat] = useState('Craft Beer');
  const [roQty, setRoQty] = useState(1);

  const handleTimeOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTimeOffRequest({
        id: `tr_${Date.now()}`,
        userId: user.id,
        type: toType as any,
        startDate: toStart,
        endDate: toEnd,
        reason: 'Requested via Web App',
        status: 'Pending',
        createdAt: new Date().toISOString()
    });
    alert("Request Submitted");
  };

  const handleReorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReorderRequest({
        id: `rr_${Date.now()}`,
        userId: user.id,
        productName: roProd,
        category: roCat,
        quantity: Number(roQty),
        reason: 'Stock low',
        priority: 'Medium',
        status: 'Pending',
        createdAt: new Date().toISOString()
    });
    alert("Reorder Submitted");
    setRoProd('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Requests Center</h1>
      
      <div className="flex border-b mb-6">
        <button 
          className={`px-6 py-3 font-medium ${activeTab === 'timeoff' ? 'border-b-2 border-monday-primary text-monday-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('timeoff')}
        >
          Time Off
        </button>
        <button 
          className={`px-6 py-3 font-medium ${activeTab === 'reorder' ? 'border-b-2 border-monday-primary text-monday-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('reorder')}
        >
          Product Reorders
        </button>
      </div>

      {activeTab === 'timeoff' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="font-bold mb-4">New Request</h3>
                <form onSubmit={handleTimeOffSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Type</label>
                        <select className="w-full border p-2 rounded" value={toType} onChange={e => setToType(e.target.value)}>
                            <option>Vacation</option><option>Sick</option><option>Personal</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-gray-600 mb-1">Start</label><input required type="date" className="w-full border p-2 rounded" onChange={e => setToStart(e.target.value)} /></div>
                        <div><label className="block text-sm text-gray-600 mb-1">End</label><input required type="date" className="w-full border p-2 rounded" onChange={e => setToEnd(e.target.value)} /></div>
                    </div>
                    <button type="submit" className="w-full bg-monday-primary text-white py-2 rounded hover:bg-blue-600">Submit Request</button>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="font-bold mb-4">Request Log</h3>
                <div className="space-y-3">
                    {timeOffRequests.map(req => (
                        <div key={req.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm">{req.type} <span className="text-gray-400 text-xs">{new Date(req.startDate).toLocaleDateString()}</span></p>
                                <p className="text-xs text-gray-500">Status: {req.status}</p>
                            </div>
                            {user.role !== 'Employee' && req.status === 'Pending' && (
                                <div className="flex gap-2">
                                    <button onClick={() => updateTimeOffStatus(req.id, 'Approved')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Approve</button>
                                    <button onClick={() => updateTimeOffStatus(req.id, 'Rejected')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Reject</button>
                                </div>
                            )}
                             {user.role === 'Employee' && (
                                <span className={`text-xs px-2 py-1 rounded ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{req.status}</span>
                            )}
                        </div>
                    ))}
                    {timeOffRequests.length === 0 && <p className="text-gray-400 text-sm">No requests found.</p>}
                </div>
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="font-bold mb-4">Request Reorder</h3>
                <form onSubmit={handleReorderSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                        <input required className="w-full border p-2 rounded" value={roProd} onChange={e => setRoProd(e.target.value)} placeholder="e.g., Bud Light 30pk" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm text-gray-600 mb-1">Category</label>
                             <select className="w-full border p-2 rounded" value={roCat} onChange={e => setRoCat(e.target.value)}>
                                {DEPARTMENTS.filter(d => d.type === 'Retail').map(d => <option key={d.id}>{d.name}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm text-gray-600 mb-1">Qty</label>
                             <input type="number" className="w-full border p-2 rounded" value={roQty} onChange={e => setRoQty(Number(e.target.value))} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-monday-primary text-white py-2 rounded hover:bg-blue-600">Submit Reorder</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="font-bold mb-4">Order Status</h3>
                <div className="space-y-3">
                    {reorderRequests.map(req => (
                        <div key={req.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                            <div>
                                <p className="font-medium text-sm">{req.productName} (x{req.quantity})</p>
                                <p className="text-xs text-gray-500">For: {req.category}</p>
                            </div>
                            {user.role !== 'Employee' ? (
                                <select 
                                    value={req.status} 
                                    onChange={(e) => updateReorderStatus(req.id, e.target.value as any)}
                                    className="text-xs border rounded p-1"
                                >
                                    <option>Pending</option>
                                    <option>Ordered</option>
                                    <option>Restocked</option>
                                </select>
                            ) : (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">{req.status}</span>
                            )}
                        </div>
                    ))}
                    {reorderRequests.length === 0 && <p className="text-gray-400 text-sm">No active reorders.</p>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
