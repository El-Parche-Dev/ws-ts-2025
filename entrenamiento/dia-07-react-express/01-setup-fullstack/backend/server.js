// 🎯 Día 7: Backend Express Setup
// WorldSkills 2025 - Full-Stack Integration

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// 🔧 Middleware Setup
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 🎯 Core Endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Test endpoint para verificar comunicación
app.get('/api/test', (req, res) => {
  try {
    const response = {
      message: '✅ ¡Backend conectado exitosamente!',
      timestamp: new Date().toISOString(),
      frontend_url: 'http://localhost:5173',
      backend_url: `http://localhost:${PORT}`,
      cors_enabled: true,
      status: 'connected',
    };

    console.log('✅ Test endpoint accessed successfully');
    res.json(response);
  } catch (error) {
    console.error('❌ Error in test endpoint:', error);
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message,
    });
  }
});

// Info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    project: 'Día 7 - React + Express Integration',
    description: 'Setup básico Full-Stack para WorldSkills 2025',
    technologies: ['React 18', 'Express.js', 'CORS', 'Vite'],
    endpoints: ['GET /api/health', 'GET /api/test', 'GET /api/info'],
  });
});

// 🚨 Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong!',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: ['GET /api/health', 'GET /api/test', 'GET /api/info'],
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log('🎯========================================');
  console.log('🚀 Backend Express Server INICIADO');
  console.log('🎯========================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📋 Info: http://localhost:${PORT}/api/info`);
  console.log('🎯========================================');
  console.log('✅ Listo para recibir requests desde React');
  console.log('🔄 Endpoints disponibles y funcionando');
  console.log('🎯========================================');
});

module.exports = app;
