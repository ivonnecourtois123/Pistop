import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import ServicioPage from './pages/ServicioPage.jsx';
import HypPage from './pages/HypPage.jsx';
import ConfigPage from './pages/ConfigPage.jsx';
import InmovilizadosPage from './pages/InmovilizadosPage.jsx';
import SegurosPage from './pages/SegurosPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ServicioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hyp"
        element={
          <ProtectedRoute>
            <HypPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/config"
        element={
          <ProtectedRoute>
            <ConfigPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inmovilizados"
        element={
          <ProtectedRoute>
            <InmovilizadosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguros"
        element={
          <ProtectedRoute>
            <SegurosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
