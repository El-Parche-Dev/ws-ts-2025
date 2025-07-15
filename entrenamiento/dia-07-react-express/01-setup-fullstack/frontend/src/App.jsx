import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🎯 Test comunicación con backend
    const testConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/api/test');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBackendMessage(data.message);

        console.log('✅ Conexión exitosa:', data);
      } catch (error) {
        console.error('❌ Error de conexión:', error);
        setError(error.message);
        setBackendMessage('Error conectando con backend');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Full-Stack Setup Test</h1>

        <div className="connection-test">
          <h2>🔗 Test de Conexión Backend:</h2>

          {loading && (
            <div className="loading">
              <p>🔄 Conectando con servidor...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>❌ Error: {error}</p>
              <p>🔧 Verifica que el backend esté ejecutándose en puerto 3001</p>
            </div>
          )}

          {!loading && !error && (
            <div className="success">
              <p>✅ {backendMessage}</p>
              <p>🚀 Frontend y Backend comunicándose correctamente</p>
            </div>
          )}
        </div>

        <div className="next-steps">
          <h3>📋 Estado del Setup:</h3>
          <ul>
            <li>✅ React ejecutándose en puerto 5173</li>
            <li>✅ Express ejecutándose en puerto 3001</li>
            <li>✅ CORS configurado</li>
            <li>✅ JSON communication establecida</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
