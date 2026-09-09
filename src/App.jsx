import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import Analyzing from './pages/Analyzing';
import Report from './pages/Report';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { getToken } from './utils/auth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!getToken()) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
      <Route path="/analyzing" element={<ProtectedRoute><Analyzing /></ProtectedRoute>} />
      <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
