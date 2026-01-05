import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DepartmentPage } from './pages/DepartmentPage';
import { Requests } from './pages/Requests';
import { AIAssistant } from './pages/AIAssistant';
import { Employees } from './pages/Employees';
import { ScheduleCalendar } from './pages/ScheduleCalendar';

// Placeholder for My Tasks - reusing Dashboard items for simplicity in this MVP
const MyTasks = () => {
  return <div className="p-4">My Tasks View - (See Department Pages for detailed boards)</div>;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/department/:id" element={<DepartmentPage />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/calendar" element={<ScheduleCalendar />} />
            <Route path="/my-tasks" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;