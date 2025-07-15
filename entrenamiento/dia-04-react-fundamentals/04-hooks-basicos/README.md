# 🪝 Hooks Básicos | 30 minutos

## 🎯 OBJETIVO: Dominar useEffect y ciclo de vida de componentes

**TIMEBOXING**: 30 minutos exactos  
**RESULTADO**: useEffect funcionando con APIs y side effects

---

## ⏰ Cronograma Sección 4

| Tarea                      | Tiempo | Estado |
| -------------------------- | ------ | ------ |
| **useEffect básico**       | 10 min | ⏳     |
| **useEffect con API**      | 12 min | ⏳     |
| **Cleanup y dependencies** | 5 min  | ⏳     |
| **Validación**             | 3 min  | ⏳     |

---

## 🚀 FASE CORE (18 min) - useEffect Esencial

### ⏱️ Paso 1: useEffect Básico (10 min)

**Crear**: `src/components/Timer.jsx`

```jsx
// 🎯 useEffect básico - Hook fundamental para side effects
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // useEffect para manejar el timer
  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      // Crear interval cuando está corriendo
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    // Cleanup function - se ejecuta cuando el componente se desmonta
    // o cuando las dependencias cambian
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]); // Dependencia: se ejecuta cuando isRunning cambia

  // useEffect para mostrar en título del navegador
  useEffect(() => {
    document.title = `Timer: ${seconds}s`;

    // Cleanup para restaurar título original
    return () => {
      document.title = 'React App';
    };
  }, [seconds]); // Se ejecuta cada vez que seconds cambia

  // Formatear tiempo
  const formatTime = totalSeconds => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="timer">
      <h3>⏱️ Timer con useEffect</h3>

      <div className="timer-display">
        <span className="time-value">{formatTime(seconds)}</span>
        <div className="timer-status">
          {isRunning ? '🟢 Corriendo' : '🔴 Detenido'}
        </div>
      </div>

      <div className="timer-controls">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="btn primary">
          ▶️ Iniciar
        </button>

        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="btn warning">
          ⏸️ Pausar
        </button>

        <button
          onClick={handleReset}
          className="btn secondary">
          🔄 Reset
        </button>
      </div>

      <div className="timer-info">
        <p>Total de segundos: {seconds}</p>
        <p>Estado: {isRunning ? 'Activo' : 'Inactivo'}</p>
      </div>
    </div>
  );
}

export default Timer;
```

### 🌐 Paso 2: useEffect con API (12 min)

**Crear**: `src/components/WeatherApp.jsx`

```jsx
// 🎯 useEffect con API calls - Patrón clave para WorldSkills
import { useState, useEffect } from 'react';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Bogotá');

  // Simular API call (en app real sería fetch a OpenWeatherMap)
  const fetchWeather = async cityName => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos simulados
      const weatherData = {
        Bogotá: { temp: 18, description: 'Nublado', humidity: 75, icon: '☁️' },
        Medellín: {
          temp: 24,
          description: 'Soleado',
          humidity: 60,
          icon: '☀️',
        },
        Cali: { temp: 28, description: 'Caluroso', humidity: 80, icon: '🌡️' },
        Barranquilla: {
          temp: 32,
          description: 'Muy caluroso',
          humidity: 85,
          icon: '🔥',
        },
      };

      const data = weatherData[cityName] || {
        temp: 20,
        description: 'Desconocido',
        humidity: 50,
        icon: '❓',
      };

      setWeather(data);
    } catch (err) {
      setError('Error al cargar el clima');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar datos iniciales
  useEffect(() => {
    fetchWeather(city);
  }, []); // Array vacío = se ejecuta solo una vez al montar

  // useEffect para cargar cuando cambia la ciudad
  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]); // Se ejecuta cuando city cambia

  const handleCityChange = e => {
    setCity(e.target.value);
  };

  const handleRefresh = () => {
    fetchWeather(city);
  };

  return (
    <div className="weather-app">
      <h3>🌤️ Clima con useEffect</h3>

      {/* Selector de ciudad */}
      <div className="city-selector">
        <label htmlFor="city">Ciudad:</label>
        <select
          id="city"
          value={city}
          onChange={handleCityChange}
          className="input">
          <option value="Bogotá">Bogotá</option>
          <option value="Medellín">Medellín</option>
          <option value="Cali">Cali</option>
          <option value="Barranquilla">Barranquilla</option>
        </select>

        <button
          onClick={handleRefresh}
          className="btn secondary"
          disabled={loading}>
          🔄 Actualizar
        </button>
      </div>

      {/* Estados de carga, error y datos */}
      <div className="weather-content">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando clima...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <button
              onClick={handleRefresh}
              className="btn primary">
              Reintentar
            </button>
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-data">
            <div className="weather-icon">{weather.icon}</div>
            <div className="weather-details">
              <h4>{city}</h4>
              <p className="temperature">{weather.temp}°C</p>
              <p className="description">{weather.description}</p>
              <p className="humidity">Humedad: {weather.humidity}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
```

---

## ⚡ FASE ENHANCED (10 min) - Patrones Avanzados

### 🔄 Paso 3: Hook Personalizado (5 min)

**Crear**: `src/hooks/useLocalStorage.js`

```jsx
// 🎯 Custom Hook - Patrón avanzado para reutilización
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Función para obtener valor inicial
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Estado con valor inicial desde localStorage
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Función para actualizar valor
  const setValue = value => {
    try {
      // Permitir función como en useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Guardar en estado
      setStoredValue(valueToStore);

      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
```

**Usar el hook en un componente**:

**Crear**: `src/components/PreferencesApp.jsx`

```jsx
// 🎯 Usando custom hook para persistencia
import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

function PreferencesApp() {
  // Usar custom hook para persistir preferencias
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'es');
  const [notifications, setNotifications] = useLocalStorage(
    'notifications',
    true
  );

  return (
    <div className={`preferences-app theme-${theme}`}>
      <h3>⚙️ Preferencias con LocalStorage</h3>

      <div className="preferences-form">
        {/* Tema */}
        <div className="preference-item">
          <label>Tema:</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            className="input">
            <option value="light">🌞 Claro</option>
            <option value="dark">🌙 Oscuro</option>
          </select>
        </div>

        {/* Idioma */}
        <div className="preference-item">
          <label>Idioma:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input">
            <option value="es">🇨🇴 Español</option>
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </div>

        {/* Notificaciones */}
        <div className="preference-item">
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
            />
            🔔 Notificaciones activas
          </label>
        </div>
      </div>

      {/* Mostrar valores actuales */}
      <div className="current-preferences">
        <h4>Configuración actual:</h4>
        <ul>
          <li>Tema: {theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}</li>
          <li>Idioma: {language}</li>
          <li>
            Notificaciones: {notifications ? '✅ Activadas' : '❌ Desactivadas'}
          </li>
        </ul>
        <p>
          <small>💾 Guardado automáticamente en localStorage</small>
        </p>
      </div>
    </div>
  );
}

export default PreferencesApp;
```

### 🎨 Estilos para Hooks

**Agregar a** `src/index.css`:

```css
/* Timer styles */
.timer {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
}

.timer-display {
  margin: 2rem 0;
}

.time-value {
  font-size: 3rem;
  font-weight: bold;
  color: #4caf50;
  font-family: 'Courier New', monospace;
}

.timer-status {
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.timer-info {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

/* Weather app styles */
.weather-app {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.city-selector {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.city-selector label {
  font-weight: 600;
}

.city-selector select {
  min-width: 150px;
}

.weather-content {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  color: #f44336;
}

.weather-data {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
}

.weather-icon {
  font-size: 4rem;
}

.weather-details h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.humidity {
  color: #999;
}

/* Preferences app styles */
.preferences-app {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.preferences-app.theme-dark {
  background: #333;
  color: white;
}

.preferences-app.theme-dark .input {
  background: #555;
  color: white;
  border-color: #666;
}

.preferences-form {
  margin-bottom: 2rem;
}

.preference-item {
  margin-bottom: 1.5rem;
}

.preference-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.preference-item input[type='checkbox'] {
  margin-right: 0.5rem;
}

.current-preferences {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.preferences-app.theme-dark .current-preferences {
  background: #444;
}

.current-preferences ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}

.current-preferences li {
  padding: 0.3rem 0;
}
```

---

## ✨ FASE POLISH (2 min) - Integración

### 🔄 Actualizar App Principal

**Modificar** `src/App.jsx`:

```jsx
import Timer from './components/Timer';
import WeatherApp from './components/WeatherApp';
import PreferencesApp from './components/PreferencesApp';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>🪝 React Hooks Demo</h1>
        <p>WorldSkills 2025 - useEffect & Custom Hooks</p>
      </header>

      <main className="app-main">
        <div className="hooks-grid">
          <Timer />
          <WeatherApp />
          <PreferencesApp />
        </div>
      </main>
    </div>
  );
}

export default App;
```

---

## ✅ Checklist de Validación

**Verificar**:

- [ ] ✅ useEffect ejecutándose correctamente
- [ ] ✅ Cleanup functions funcionando
- [ ] ✅ Dependencies array configurado
- [ ] ✅ API calls simulados operativos
- [ ] ✅ Custom hook reutilizable
- [ ] ✅ LocalStorage persistiendo datos

---

## 🎯 Competencias Desarrolladas

1. ✅ **useEffect Hook** - Side effects y ciclo de vida
2. ✅ **API Integration** - Fetch data patterns
3. ✅ **Cleanup Functions** - Memory leak prevention
4. ✅ **Custom Hooks** - Lógica reutilizable
5. ✅ **LocalStorage** - Data persistence
6. ✅ **Loading States** - UX patterns

---

## ⏭️ Próximo Paso

**Sección 5**: Mini-Proyecto (20 min)

- App completa integrando todo
- CRUD operations
- Multiple components

---

**⏰ TIEMPO LÍMITE: 30 MINUTOS**  
**🎯 ¡USEEFFECT ES CLAVE PARA WORLDSKILLS!**
