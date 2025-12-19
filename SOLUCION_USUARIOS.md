# 🔧 Solución: Usuarios No Cargan

## Problema Identificado

Había múltiples instancias de Node.js corriendo simultáneamente, causando conflictos en los puertos.

## Solución Aplicada

1. ✅ Detenidos todos los procesos de Node.js
2. ✅ Reiniciado el backend en puerto 3001
3. ✅ Reiniciado el frontend en puerto 5173

## Estado Actual

### Backend
- **Puerto**: 3001
- **Estado**: ✅ Corriendo
- **Base de datos**: Inicializada
- **WhatsApp**: Inicializando
- **Rutas disponibles**:
  - `GET /api/users` - Obtener todos los usuarios
  - `POST /api/users` - Crear usuario
  - `PUT /api/users/:id` - Actualizar usuario
  - `DELETE /api/users/:id` - Eliminar usuario

### Frontend
- **Puerto**: 5173
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:5173

## Verificación

### 1. Probar API de Usuarios

Abre una nueva terminal y ejecuta:

```bash
curl http://localhost:3001/api/users
```

Deberías ver una lista de usuarios en formato JSON.

### 2. Probar desde el Navegador

1. Abre http://localhost:5173
2. Inicia sesión con:
   - **Usuario**: admin
   - **Contraseña**: admin123
3. Ve a la página de **Usuarios** (solo accesible para admin)
4. Deberías ver la lista de usuarios con sus roles

## Si el Problema Persiste

### Verificar Consola del Navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca errores relacionados con:
   - `Failed to fetch`
   - `CORS`
   - `Network error`

### Verificar Network

1. En DevTools, ve a la pestaña **Network**
2. Recarga la página
3. Busca la petición a `/api/users`
4. Verifica:
   - **Status**: Debe ser 200
   - **Response**: Debe contener un array de usuarios

### Limpiar Caché

```bash
# Detener servidores (Ctrl+C en cada terminal)

# Limpiar node_modules y reinstalar
cd backend
rm -rf node_modules
npm install

cd ..
rm -rf node_modules
npm install

# Reiniciar
cd backend
npm start

# En otra terminal
cd ..
npm run dev
```

## Datos de Prueba

Si la base de datos está vacía, puedes crear un usuario de prueba:

### Desde la API (usando curl o Postman)

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "profesor1",
    "password": "profesor123",
    "email": "profesor@ejemplo.com",
    "role": "teacher",
    "fullName": "Juan Profesor"
  }'
```

### Desde la Aplicación

1. Inicia sesión como admin
2. Ve a **Usuarios**
3. Haz clic en **Nuevo Usuario**
4. Completa el formulario
5. Selecciona el rol apropiado

## Roles Disponibles

- **admin**: Acceso completo al sistema
- **teacher**: Acceso a gestión académica
- **user**: Acceso básico

## Comandos Útiles

### Ver procesos de Node.js corriendo
```bash
tasklist | findstr node
```

### Detener todos los procesos de Node.js
```bash
taskkill /F /IM node.exe
```

### Verificar que el puerto 3001 está libre
```bash
netstat -ano | findstr :3001
```

### Verificar que el puerto 5173 está libre
```bash
netstat -ano | findstr :5173
```

## Estado de los Servidores

Ambos servidores ahora están corriendo correctamente. Intenta:

1. Abrir http://localhost:5173
2. Iniciar sesión
3. Navegar a la página de Usuarios

Si aún tienes problemas, revisa la consola del navegador y comparte los errores que veas.

---

**Última actualización**: Diciembre 2025
**Estado**: ✅ Servidores corriendo correctamente
