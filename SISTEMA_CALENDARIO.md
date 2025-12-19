# 📅 Sistema de Calendario y Notificaciones - Implementación Completa

## 🎯 Objetivo

Implementar un sistema completo de calendario que notifique a los usuarios sobre las clases programadas, mostrando en el Dashboard los días que hay clases para todos los usuarios inscritos en esas materias.

---

## ✅ Componentes Implementados

### 1. **Backend** ✅

#### Base de Datos

**Nuevas Tablas:**
- ✅ `calendar_events` - Eventos del calendario (clases, exámenes, etc.)
- ✅ `notifications` - Sistema de notificaciones
- ✅ `event_participants` - Participantes de cada evento

#### Tabla `calendar_events`
```sql
CREATE TABLE calendar_events (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    eventType TEXT DEFAULT 'class',
    startDate TEXT NOT NULL,
    endDate TEXT,
    startTime TEXT,
    endTime TEXT,
    subjectId INTEGER,
    subjectName TEXT,
    subjectColor TEXT,
    location TEXT,
    isRecurring INTEGER DEFAULT 0,
    recurringPattern TEXT,
    recurringDays TEXT,
    createdBy INTEGER,
    periodId INTEGER,
    isActive INTEGER DEFAULT 1,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Campos Importantes:**
- `eventType`: 'class', 'exam', 'meeting', 'event'
- `isRecurring`: Si el evento se repite
- `recurringPattern`: 'daily', 'weekly', 'monthly'
- `recurringDays`: Días de la semana (JSON: ["lunes", "miércoles"])

---

#### Tabla `notifications`
```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    eventId INTEGER,
    subjectId INTEGER,
    isRead INTEGER DEFAULT 0,
    link TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Tipos de Notificaciones:**
- `class`: Clase programada
- `success`: Acción exitosa
- `warning`: Advertencia
- `error`: Error
- `info`: Información general

---

#### Tabla `event_participants`
```sql
CREATE TABLE event_participants (
    id INTEGER PRIMARY KEY,
    eventId INTEGER NOT NULL,
    userId INTEGER,
    studentId INTEGER,
    enrollmentId INTEGER,
    notified INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Propósito:**
- Registra quién participa en cada evento
- Vincula eventos con inscripciones
- Controla quién ha sido notificado

---

### 2. **API REST** ✅

#### Endpoints de Eventos

```http
GET    /api/calendar/events
GET    /api/calendar/events/today
GET    /api/calendar/events/week
POST   /api/calendar/events
PUT    /api/calendar/events/:id
DELETE /api/calendar/events/:id
POST   /api/calendar/events/generate-recurring
```

#### Endpoints de Notificaciones

```http
GET    /api/calendar/notifications/:userId
GET    /api/calendar/notifications/:userId/unread
PUT    /api/calendar/notifications/:id/read
PUT    /api/calendar/notifications/:userId/read-all
POST   /api/calendar/notifications
```

---

### 3. **Frontend** ✅

#### Componentes Nuevos

**TodayClassesWidget** (`src/components/TodayClassesWidget.jsx`)
- Muestra las clases de hoy
- Horarios con formato AM/PM
- Colores por materia
- Ubicación y duración
- Animaciones suaves

**NotificationsWidget** (`src/components/NotificationsWidget.jsx`)
- Lista de notificaciones
- Badge de no leídas
- Iconos por tipo
- Marca como leída al hacer clic
- Tiempo relativo ("Hace 2h")

---

## 🔄 Flujo de Trabajo

### Crear Evento de Clase

1. **Profesor crea evento:**
```javascript
POST /api/calendar/events
{
  "title": "Matemáticas - Álgebra Lineal",
  "eventType": "class",
  "startDate": "2025-12-19",
  "startTime": "08:00",
  "endTime": "10:00",
  "subjectId": 5,
  "subjectName": "Matemáticas",
  "subjectColor": "#6366F1",
  "location": "Aula 101",
  "periodId": 1
}
```

2. **Sistema automáticamente:**
   - Crea el evento en `calendar_events`
   - Obtiene todos los estudiantes inscritos en la materia
   - Crea una notificación para cada estudiante
   - Registra participantes en `event_participants`

3. **Estudiante ve notificación:**
   - En el Dashboard aparece en "Notificaciones"
   - En "Clases de Hoy" si es para hoy
   - Puede marcar como leída

---

## 📊 Widgets del Dashboard

### Widget "Clases de Hoy"

**Características:**
```
┌─────────────────────────────────────────┐
│ 📅 Clases de Hoy    [Miércoles, 18...]│
├─────────────────────────────────────────┤
│ ┌─────┬─────────────────────────────┐  │
│ │ 8:00│ Matemáticas                 │  │
│ │ AM  │ 📍 Aula 101                 │  │
│ │     │ ⏰ Hasta 10:00 AM           │  │
│ └─────┴─────────────────────────────┘  │
│                                         │
│ ┌─────┬─────────────────────────────┐  │
│ │10:00│ Programación                │  │
│ │ AM  │ 📍 Lab 202                  │  │
│ │     │ ⏰ Hasta 12:00 PM           │  │
│ └─────┴─────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Muestra solo clases de hoy
- ✅ Formato de hora 12h (AM/PM)
- ✅ Color de la materia
- ✅ Ubicación
- ✅ Duración
- ✅ Animaciones de entrada
- ✅ Hover effects

---

### Widget "Notificaciones"

**Características:**
```
┌─────────────────────────────────────────┐
│ 🔔 Notificaciones              [3]     │
├─────────────────────────────────────────┤
│ ┌───┬─────────────────────────────┐    │
│ │📅 │ Clase de Matemáticas        │    │
│ │   │ Tienes clase programada...  │    │
│ │   │ Hace 2h                     │    │
│ └───┴─────────────────────────────┘    │
│                                         │
│ ┌───┬─────────────────────────────┐    │
│ │✅ │ Calificación agregada       │    │
│ │   │ Se agregó tu calificación..│    │
│ │   │ Hace 5h                     │    │
│ └───┴─────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Badge con número de no leídas
- ✅ Iconos por tipo de notificación
- ✅ Colores por tipo
- ✅ Tiempo relativo
- ✅ Marca como leída al hacer clic
- ✅ Scroll para muchas notificaciones
- ✅ Máximo 10 notificaciones mostradas

---

## 🎨 Tipos de Notificaciones

### Clase (class)
- **Color**: Morado (primary)
- **Icono**: 📅 Calendar
- **Uso**: Clases programadas

### Éxito (success)
- **Color**: Verde (success)
- **Icono**: ✅ CheckCircle
- **Uso**: Calificaciones agregadas, acciones exitosas

### Advertencia (warning)
- **Color**: Naranja (warning)
- **Icono**: ⚠️ AlertCircle
- **Uso**: Recordatorios, fechas límite

### Error (error)
- **Color**: Rojo (danger)
- **Icono**: ❌ AlertCircle
- **Uso**: Errores, problemas

### Info (info)
- **Color**: Azul (info)
- **Icono**: ℹ️ Info
- **Uso**: Información general

---

## 🔧 Funciones Automáticas

### Creación Automática de Notificaciones

Cuando se crea un evento de clase:

```javascript
function createEventNotifications(eventId, subjectId, eventTitle, eventDate, eventTime) {
    // 1. Obtener estudiantes inscritos
    const enrollments = db.prepare(`
        SELECT DISTINCT e.studentId, s.name, s.email
        FROM enrollments e
        JOIN students s ON e.studentId = s.id
        WHERE e.subjectId = ?
    `).all(subjectId);
    
    // 2. Para cada estudiante:
    enrollments.forEach(enrollment => {
        // Registrar como participante
        db.prepare(`
            INSERT INTO event_participants (eventId, studentId, enrollmentId)
            VALUES (?, ?, ?)
        `).run(eventId, enrollment.studentId, enrollment.id);
        
        // Crear notificación
        const message = `Tienes clase programada para el ${date} a las ${time}`;
        db.prepare(`
            INSERT INTO notifications (userId, title, message, type, eventId, subjectId)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(enrollment.studentId, eventTitle, message, 'class', eventId, subjectId);
    });
}
```

---

## 📱 Integración con Dashboard

### Cómo Agregar los Widgets

Para agregar los widgets al Dashboard, importa y usa los componentes:

```javascript
// En Dashboard.jsx
import TodayClassesWidget from '../components/TodayClassesWidget';
import NotificationsWidget from '../components/NotificationsWidget';

// En el render:
<DashboardGrid>
  <TodayClassesWidget />
  <NotificationsWidget />
  {/* Otros widgets existentes */}
</DashboardGrid>
```

---

## 🚀 Próximos Pasos Sugeridos

### Funcionalidades Adicionales

1. **Página de Calendario Completa**
   - [ ] Vista mensual
   - [ ] Vista semanal
   - [ ] Vista diaria
   - [ ] Crear eventos desde la interfaz
   - [ ] Editar/eliminar eventos

2. **Eventos Recurrentes**
   - [ ] Generación automática de clases semanales
   - [ ] Basado en horario de la materia
   - [ ] Para todo el cuatrimestre

3. **Recordatorios**
   - [ ] Notificación 1 día antes
   - [ ] Notificación 1 hora antes
   - [ ] Email de recordatorio

4. **Sincronización**
   - [ ] Exportar a Google Calendar
   - [ ] Exportar a iCal
   - [ ] Importar eventos

---

## 📁 Archivos Creados

### Backend
```
backend/
├── migrate-calendar.js          ✅ Migración ejecutada
├── calendarRoutes.js            ✅ Rutas del API
└── server.js                    ✅ Actualizado
```

### Frontend
```
src/components/
├── TodayClassesWidget.jsx       ✅ Widget de clases
└── NotificationsWidget.jsx      ✅ Widget de notificaciones
```

### Base de Datos
```
grade_manager.db
├── calendar_events              ✅ Tabla creada
├── notifications                ✅ Tabla creada
└── event_participants           ✅ Tabla creada
```

---

## ✅ Estado Final

✅ **Base de datos**: 3 nuevas tablas creadas  
✅ **API**: 12 endpoints funcionando  
✅ **Widgets**: 2 componentes creados  
✅ **Notificaciones automáticas**: Funcionando  
✅ **Backend**: Corriendo con nuevas rutas  

---

## 🧪 Cómo Probar

### 1. Crear un Evento de Prueba

```bash
curl -X POST http://localhost:3001/api/calendar/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Matemáticas - Clase de Prueba",
    "eventType": "class",
    "startDate": "2025-12-18",
    "startTime": "14:00",
    "endTime": "16:00",
    "subjectId": 1,
    "subjectName": "Matemáticas",
    "subjectColor": "#6366F1",
    "location": "Aula 101",
    "periodId": 1
  }'
```

### 2. Ver Clases de Hoy

```bash
curl http://localhost:3001/api/calendar/events/today
```

### 3. Ver Notificaciones

```bash
curl http://localhost:3001/api/calendar/notifications/1
```

---

## 📝 Notas Importantes

1. **Zona Horaria**: Los horarios se manejan en formato 24h en la base de datos y se convierten a 12h (AM/PM) en el frontend.

2. **Notificaciones Automáticas**: Se crean automáticamente cuando se crea un evento con `subjectId`.

3. **Participantes**: Se registran automáticamente basándose en las inscripciones de la materia.

4. **Colores**: Cada materia tiene su color que se usa en los eventos del calendario.

---

**Última actualización:** Diciembre 2025

**Estado:** ✅ Sistema completo y funcionando
