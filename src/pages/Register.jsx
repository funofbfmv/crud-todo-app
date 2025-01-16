import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPublicService } from '../api/api';
import { toast, ToastContainer } from 'react-toastify';  // Добавляем импорты для Toastr
import 'react-toastify/dist/ReactToastify.css';  // Подключаем стили для Toastr

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Для отображения успешной регистрации
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await apiPublicService.post('register/', {
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      setSuccess(true); // Успешная регистрация
      toast.success('Регистрация прошла успешно!'); // Уведомление об успешной регистрации
      setTimeout(() => navigate('/login'), 2000); // Перенаправление на страницу логина через 2 секунды
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте ещё раз.');
      toast.error('Ошибка при регистрации. Попробуйте ещё раз.'); // Уведомление об ошибке
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
          Регистрация
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            Регистрация прошла успешно! Перенаправление...
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-6">
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
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Введите email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
              Имя
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Введите ваше имя"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
              Фамилия
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Введите вашу фамилию"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            Зарегистрироваться
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Уже есть аккаунт?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Войти
          </span>
        </p>
      </div>
      <ToastContainer /> {/* Контейнер для Toastr уведомлений */}
    </div>
  );
};

export default Register;
