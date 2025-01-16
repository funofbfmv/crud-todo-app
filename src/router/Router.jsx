import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import { useStore } from '../store/store';

const ProtectedRoute = ({ children }) => {
  const token = useStore((state) => state.token);

  // Если токена нет в Zustand, проверяем localStorage
  const storedToken = localStorage.getItem('token');
  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  // Если токен есть в localStorage, синхронизируем с Zustand
  if (storedToken && !token) {
    useStore.getState().setToken(storedToken);
  }

  return children;
};

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
