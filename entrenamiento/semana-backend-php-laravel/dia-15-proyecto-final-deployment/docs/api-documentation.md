# 📖 API Documentation - WorldSkills Laravel API 2025

## 🎯 **INFORMACIÓN GENERAL**

**Base URL**: `https://api.worldskills2025.com`  
**Version**: v1  
**Autenticación**: Bearer Token (JWT)  
**Formato**: JSON  
**Charset**: UTF-8

---

## 🔐 **AUTENTICACIÓN**

### **Registro de Usuario**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

**Respuesta (201 Created):**

```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "created_at": "2025-07-23T10:30:00.000000Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### **Login de Usuario**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "SecurePass123!"
}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "roles": ["user"]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

### **Información del Usuario Autenticado**

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "created_at": "2025-07-23T10:30:00.000000Z",
      "updated_at": "2025-07-23T10:30:00.000000Z"
    },
    "permissions": ["read-products", "create-products"],
    "roles": ["user"]
  }
}
```

---

## 📦 **GESTIÓN DE PRODUCTOS**

### **Listar Productos**

```http
GET /api/v1/products
Authorization: Bearer {token}

# Parámetros de consulta opcionales:
# ?search=laptop
# ?category_id=1
# ?min_price=100
# &max_price=1000
# &active=true
# &sort_by=price
# &sort_direction=asc
# &per_page=15
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming Pro",
      "description": "Laptop de alta gama para gaming profesional",
      "price": 2499.99,
      "formatted_price": "$2.499,99",
      "sku": "PRD-LGP001",
      "stock": 15,
      "stock_status": "in_stock",
      "active": true,
      "featured": true,
      "image_url": "https://api.worldskills2025.com/storage/products/laptop-gaming-pro.jpg",
      "category": {
        "id": 1,
        "name": "Laptops",
        "slug": "laptops"
      },
      "average_rating": 4.8,
      "reviews_count": 24,
      "created_at": "2025-07-23T10:00:00.000000Z",
      "updated_at": "2025-07-23T11:30:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 67,
    "per_page": 15
  }
}
```

### **Crear Producto**

```http
POST /api/v1/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Smartphone Pro Max",
  "description": "El smartphone más avanzado del mercado",
  "price": 1299.99,
  "cost_price": 800.00,
  "category_id": 2,
  "sku": "PRD-SPM001",
  "stock": 50,
  "min_stock": 10,
  "weight": 0.195,
  "dimensions": {
    "length": 15.7,
    "width": 7.6,
    "height": 0.78
  },
  "active": true,
  "featured": false,
  "meta_title": "Smartphone Pro Max - La Revolución Móvil",
  "meta_description": "Descubre el smartphone que redefine la experiencia móvil",
  "tags": ["smartphone", "premium", "5G", "camera"]
}
```

**Respuesta (201 Created):**

```json
{
  "status": "success",
  "message": "Producto creado exitosamente",
  "data": {
    "id": 68,
    "name": "Smartphone Pro Max",
    "description": "El smartphone más avanzado del mercado",
    "price": 1299.99,
    "formatted_price": "$1.299,99",
    "sku": "PRD-SPM001",
    "stock": 50,
    "profit_margin": 62.5,
    "stock_status": "in_stock",
    "active": true,
    "featured": false,
    "image_url": null,
    "created_at": "2025-07-23T12:00:00.000000Z",
    "updated_at": "2025-07-23T12:00:00.000000Z"
  }
}
```

### **Obtener Producto por ID**

```http
GET /api/v1/products/68
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "data": {
    "id": 68,
    "name": "Smartphone Pro Max",
    "description": "El smartphone más avanzado del mercado",
    "price": 1299.99,
    "formatted_price": "$1.299,99",
    "sku": "PRD-SPM001",
    "stock": 50,
    "profit_margin": 62.5,
    "stock_status": "in_stock",
    "active": true,
    "featured": false,
    "weight": 0.195,
    "dimensions": {
      "length": 15.7,
      "width": 7.6,
      "height": 0.78
    },
    "tags": ["smartphone", "premium", "5G", "camera"],
    "image_url": null,
    "average_rating": 0,
    "reviews_count": 0,
    "category": {
      "id": 2,
      "name": "Smartphones",
      "slug": "smartphones"
    },
    "images": [],
    "reviews": [],
    "created_at": "2025-07-23T12:00:00.000000Z",
    "updated_at": "2025-07-23T12:00:00.000000Z"
  }
}
```

### **Actualizar Producto**

```http
PUT /api/v1/products/68
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Smartphone Pro Max Plus",
  "price": 1399.99,
  "stock": 45,
  "featured": true
}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 68,
    "name": "Smartphone Pro Max Plus",
    "price": 1399.99,
    "formatted_price": "$1.399,99",
    "stock": 45,
    "featured": true,
    "updated_at": "2025-07-23T12:30:00.000000Z"
  }
}
```

### **Eliminar Producto**

```http
DELETE /api/v1/products/68
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "message": "Producto eliminado exitosamente"
}
```

### **Búsqueda Avanzada**

```http
GET /api/v1/products/search?q=gaming&category_id=1&min_price=500&max_price=3000
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming Pro",
      "description": "Laptop de alta gama para gaming profesional",
      "price": 2499.99,
      "formatted_price": "$2.499,99",
      "relevance_score": 95.2
    }
  ],
  "meta": {
    "query": "gaming",
    "total_results": 8
  }
}
```

---

## 📁 **GESTIÓN DE ARCHIVOS**

### **Subir Archivo**

```http
POST /api/v1/files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [archivo binario]
folder: "products" (opcional)
visibility: "public" (opcional: public|private)
```

**Respuesta (201 Created):**

```json
{
  "status": "success",
  "message": "Archivo subido exitosamente",
  "data": {
    "id": 15,
    "filename": "laptop-gaming-pro.jpg",
    "original_name": "IMG_20250723_120045.jpg",
    "path": "files/products/2025/07/laptop-gaming-pro.jpg",
    "url": "https://api.worldskills2025.com/storage/files/products/2025/07/laptop-gaming-pro.jpg",
    "size": 2048576,
    "mime_type": "image/jpeg",
    "folder": "products",
    "visibility": "public",
    "metadata": {
      "width": 1920,
      "height": 1080,
      "exif": {
        "camera": "iPhone 14 Pro",
        "created_at": "2025-07-23T12:00:45.000Z"
      }
    },
    "uploaded_at": "2025-07-23T12:05:00.000000Z"
  }
}
```

### **Listar Archivos**

```http
GET /api/v1/files
Authorization: Bearer {token}

# Parámetros opcionales:
# ?folder=products
# &mime_type=image
# &per_page=20
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "id": 15,
      "filename": "laptop-gaming-pro.jpg",
      "path": "files/products/2025/07/laptop-gaming-pro.jpg",
      "url": "https://api.worldskills2025.com/storage/files/products/2025/07/laptop-gaming-pro.jpg",
      "size": 2048576,
      "mime_type": "image/jpeg",
      "folder": "products",
      "uploaded_at": "2025-07-23T12:05:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 42,
    "per_page": 20
  }
}
```

### **Descargar Archivo**

```http
GET /api/v1/files/15/download
Authorization: Bearer {token}
```

**Respuesta (200 OK):**

- Content-Type: [mime-type del archivo]
- Content-Disposition: attachment; filename="laptop-gaming-pro.jpg"
- [contenido binario del archivo]

---

## ⚡ **REAL-TIME & WEBSOCKETS**

### **Conexión WebSocket**

```javascript
// Cliente JavaScript
const socket = new WebSocket('wss://api.worldskills2025.com:6001');

socket.addEventListener('open', function (event) {
  console.log('Conectado al WebSocket');

  // Autenticarse
  socket.send(
    JSON.stringify({
      type: 'auth',
      token: 'Bearer ' + authToken,
    })
  );
});

socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  console.log('Mensaje recibido:', data);
});
```

### **Suscribirse a Eventos**

```http
POST /api/v1/realtime/subscribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "channels": [
    "products.updates",
    "user.notifications",
    "system.alerts"
  ]
}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "message": "Suscripción exitosa a canales",
  "data": {
    "subscribed_channels": [
      "products.updates",
      "user.notifications",
      "system.alerts"
    ],
    "websocket_url": "wss://api.worldskills2025.com:6001"
  }
}
```

### **Enviar Notificación en Tiempo Real**

```http
POST /api/v1/realtime/broadcast
Authorization: Bearer {token}
Content-Type: application/json

{
  "channel": "products.updates",
  "event": "product.created",
  "data": {
    "product_id": 68,
    "message": "Nuevo producto disponible: Smartphone Pro Max",
    "action_url": "/products/68"
  }
}
```

**Respuesta (200 OK):**

```json
{
  "status": "success",
  "message": "Evento enviado exitosamente",
  "data": {
    "channel": "products.updates",
    "event": "product.created",
    "recipients": 247,
    "sent_at": "2025-07-23T12:45:00.000000Z"
  }
}
```

---

## 🚨 **CÓDIGOS DE ERROR**

### **Errores de Autenticación**

| Código | Mensaje          | Descripción                       |
| ------ | ---------------- | --------------------------------- |
| 401    | Unauthenticated  | Token no proporcionado o inválido |
| 403    | Unauthorized     | Sin permisos para esta acción     |
| 422    | Validation Error | Datos de entrada inválidos        |

### **Errores del Servidor**

| Código | Mensaje               | Descripción                          |
| ------ | --------------------- | ------------------------------------ |
| 429    | Too Many Requests     | Rate limit excedido                  |
| 500    | Internal Server Error | Error interno del servidor           |
| 503    | Service Unavailable   | Servicio temporalmente no disponible |

### **Formato de Error Estándar**

```json
{
  "status": "error",
  "message": "Descripción del error",
  "error": "Detalles técnicos del error",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["El email es requerido"],
    "password": ["La contraseña debe tener al menos 8 caracteres"]
  },
  "timestamp": "2025-07-23T12:00:00.000000Z",
  "path": "/api/v1/auth/register"
}
```

---

## 📊 **RATE LIMITING**

- **General**: 60 requests por minuto por usuario
- **Autenticación**: 5 intentos por minuto por IP
- **Upload de archivos**: 10 requests por minuto por usuario
- **Búsquedas**: 30 requests por minuto por usuario

**Headers de Rate Limiting:**

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1690972800
```

---

## 🎯 **CONCLUSIÓN**

Esta API Laravel WorldSkills 2025 proporciona:

✅ **Autenticación JWT robusta** con refresh tokens  
✅ **CRUD completo de productos** con búsqueda avanzada  
✅ **Gestión de archivos** con metadata y seguridad  
✅ **Real-time features** con WebSockets  
✅ **Documentación completa** con ejemplos  
✅ **Manejo de errores** estandarizado  
✅ **Rate limiting** para protección

**🏆 API lista para competencia WorldSkills 2025!**

---

**📅 Última actualización**: 23 de Julio 2025  
**📖 Versión de documentación**: 1.0  
**🔗 URL de producción**: https://api.worldskills2025.com
