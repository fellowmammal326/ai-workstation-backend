import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import WorkstationPage from './pages/WorkstationPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <p className="text-lg text-text-primary">Loading Workstation...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
      <Route path="/*" element={isAuthenticated ? <WorkstationPage /> : <Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
