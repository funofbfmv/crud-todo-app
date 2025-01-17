import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie, deleteCookie } from 'cookies-next';
import { useStore } from '../store/store';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
import DOMPurify from 'dompurify'; 

const sanitize = (data) => DOMPurify.sanitize(data); // Функция очистки данных

const Tasks = () => {
  const navigate = useNavigate();
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const clearState = useStore((state) => state.clearState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = getCookie('token');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/todo/tasks/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const sanitizedTasks = response.data.map((task) => ({
          ...task,
          title: sanitize(task.title), // Очистка заголовков задач
        }));
        setTasks(sanitizedTasks);
      }
    } catch (error) {
      console.error('Ошибка загрузки задач:', error.response?.data || error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSaveTask = async () => {
    setLoading(true);
    try {
      const sanitizedTitle = sanitize(taskTitle); // Очистка данных перед отправкой
      const url = editingTask
        ? `http://localhost:8000/api/todo/tasks/${editingTask.id}/`
        : 'http://localhost:8000/api/todo/tasks/';
      const method = editingTask ? 'put' : 'post';

      await axios({
        method,
        url,
        data: {
          title: sanitizedTitle,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchTasks();
      setTaskTitle('');
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Задача успешно сохранена!');
    } catch (error) {
      console.error('Ошибка при сохранении задачи:', error.response?.data || error.message);
      toast.error('Ошибка при сохранении задачи!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/todo/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchTasks();
      toast.success('Задача успешно удалена!');
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error.response?.data || error.message);
      toast.error('Ошибка при удалении задачи!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task) => {
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:8000/api/todo/tasks/${task.id}/`,
        { status: !task.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTasks();
      toast.success('Статус задачи обновлен!');
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error.response?.data || error.message);
      toast.error('Ошибка при изменении статуса задачи!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearState();
    deleteCookie('token');
    navigate('/login');
  };

  const activeTasks = tasks.filter((task) => !task.status);
  const completedTasks = tasks.filter((task) => task.status);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
        Ваши Задачи
      </h1>

      {loading && (
        <div className="flex justify-center my-6">
          <ClipLoader color="#4A90E2" loading={loading} size={50} />
        </div>
      )}

      {!loading && (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Активные задачи</h2>
            {activeTasks.length > 0 ? (
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-green-50 to-green-100 hover:from-blue-100 hover:to-blue-200 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          className="text-lg font-medium"
                          dangerouslySetInnerHTML={{ __html: sanitize(task.title) }}
                        ></span>
                        <p className="text-sm text-white bg-green-600 rounded px-2 py-0">
                          Создано: {new Date(task.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
                        >
                          Завершить
                        </button>
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setTaskTitle(task.title);
                            setIsModalOpen(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Нет активных задач.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Завершенные задачи</h2>
            {completedTasks.length > 0 ? (
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span
                          className="text-lg font-medium"
                          dangerouslySetInnerHTML={{ __html: sanitize(task.title) }}
                        ></span>
                        <p className="text-sm text-white bg-gradient-to-r from-red-500 to-orange-500 rounded px-2 py-0">
                          Создано: {new Date(task.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(task)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
                      >
                        Вернуть
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Нет завершенных задач.</p>
            )}
          </section>
        </>
      )}

      <div className="mt-8 flex justify-center space-x-6">
        <button
          onClick={() => {
            setTaskTitle('');
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-6 py-3 rounded-full shadow-lg"
        >
          Добавить Задачу
        </button>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-full shadow-lg"
        >
          Выйти
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-semibold mb-4 text-center">Добавить Задачу</h2>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Введите название задачи"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-full"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveTask}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-6 py-2 rounded-full"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Tasks;
