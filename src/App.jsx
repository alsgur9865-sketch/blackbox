import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import Analyzing from './pages/Analyzing';
import Report from './pages/Report';
import Reports from './pages/Reports';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/analyzing" element={<Analyzing />} />
      <Route path="/report/:id" element={<Report />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
