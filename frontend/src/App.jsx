import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EggStock from './pages/EggStock';
import FeedStock from './pages/FeedStock';
import BirdStock from './pages/BirdStock';

const Reports = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Reports</h2>
    <p className="text-gray-500">Coming in Phase 6</p>
  </div>
);

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="eggs" element={<EggStock />} />
        <Route path="feed" element={<FeedStock />} />
        <Route path="birds" element={<BirdStock />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
