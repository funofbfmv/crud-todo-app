// src/App.jsx
import { useState } from 'react';
import RouterComponent from './router/Router';  // Импортируем компонент маршрутизации
import './index.css';  // Подключаем стили

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* Здесь выводим маршруты */}
      <RouterComponent />
    </div>
  );
}

export default App;