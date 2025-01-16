import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCookie } from 'cookies-next';
import { apiPublicService } from '../api/api';
import { useStore } from '../store/store';
import { toast, ToastContainer } from 'react-toastify';  // Импортируем Toastr
import 'react-toastify/dist/ReactToastify.css';  // Подключаем стили для Toastr

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setToken = useStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiPublicService.post('login/', { username, password });
      const { access } = response.data;

      if (access) {
        setCookie('token', access, { maxAge: 60 * 60 * 24 });
        setToken(access);
        toast.success('Успешный вход в аккаунт!');  // Уведомление при успешном входе
        navigate('/tasks');
      } else {
        setError('Invalid server response');
        toast.error('Неверный ответ от сервера');  // Уведомление об ошибке
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Неверные учетные данные');
      toast.error('Неверные учетные данные');  // Уведомление при неверных данных
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">Войти в аккаунт</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              placeholder="Введите имя пользователя"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Войти
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
      <ToastContainer /> {/* Добавляем контейнер для Toastr */}
    </div>
  );
};

export default Login;
