import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeProfile from './components/EmployeeProfile';
import AdminDashboard from './components/AdminDashboard';
import EmployeePage from './components/QRGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile" element={<EmployeeProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
}

export default App;

