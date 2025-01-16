import axios from "axios";

const API_VERSION = "api/users/";
const API_URI = "http://localhost:8000/"; // URL API из переменных окружения
const API_STORAGE = `${API_URI}/storage`;

// Получаем токен из локального хранилища или контекста
const getToken = () => localStorage.getItem("access_token");

const apiPublicService = axios.create({
  baseURL: `${API_URI}${API_VERSION}/`, // Базовый URL для запросов
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Создаем экземпляр для защищенных запросов с токеном
const apiPrivateService = axios.create({
  baseURL: `${API_URI}${API_VERSION}/`, // Базовый URL для запросов
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Добавляем токен авторизации для защищенных запросов
apiPrivateService.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {
  API_VERSION,
  API_URI,
  apiPublicService,
  apiPrivateService,
  API_STORAGE,
};