# 📡 APIs REST - Grade Manager Backend

**Base URL:** `http://localhost:3001`

---

## 👤 USUARIOS

### Obtener todos los usuarios
```http
GET /api/users
```
**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@gradeapp.com",
    "role": "admin",
    "fullName": "Administrador",
    "createdAt": "2024-12-15T18:20:00.000Z"
  }
]
```

### Crear usuario
```http
POST /api/users
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "password": "password123",
  "email": "usuario@email.com",
  "role": "user",
  "fullName": "Nombre Completo"
}
```

---

## 🎓 ESTUDIANTES

### Obtener todos los estudiantes
```http
GET /api/students
```
**Response:**
```json
[
  {
    "id": 1,
    "matricula": "GE20250001",
    "name": "Juan Pérez",
    "email": "juan.perez@email.com",
    "phone": "809-555-0001",
    "year": 2025,
    "enrollmentDate": "2024-01-15",
    "createdAt": "2024-12-15T18:20:00.000Z"
  }
]
```

### Obtener estudiante por ID
```http
GET /api/students/:id
```
**Ejemplo:** `GET /api/students/1`

### Crear estudiante
```http
POST /api/students
Content-Type: application/json

{
  "name": "Nuevo Estudiante",
  "email": "nuevo@email.com",
  "phone": "809-555-9999",
  "enrollmentDate": "2024-12-15"
}
```
**Nota:** La matrícula se genera automáticamente (GE2025XXXX)

### Actualizar estudiante
```http
PUT /api/students/:id
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "email": "actualizado@email.com",
  "phone": "809-555-1111"
}
```

### Eliminar estudiante
```http
DELETE /api/students/:id
```
**Nota:** Elimina en cascada enrollments y grades relacionados

---

## 📚 MATERIAS

### Obtener todas las materias
```http
GET /api/subjects
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Matemáticas Avanzadas",
    "code": "MAT101",
    "credits": "4",
    "schedule": "Lun-Mié-Vie 8:00-10:00",
    "teacher": "Dr. Roberto Fernández",
    "cycle": "First cycle",
    "color": "#3B82F6, #2563EB",
    "enrolled": 0,
    "components": [
      {
        "id": 1,
        "name": "Tareas",
        "type": "numeric",
        "weight": 30,
        "maxScore": 100
      },
      {
        "id": 2,
        "name": "Parciales",
        "type": "numeric",
        "weight": 40,
        "maxScore": 100
      }
    ],
    "createdAt": "2024-12-15T18:20:00.000Z"
  }
]
```

### Crear materia
```http
POST /api/subjects
Content-Type: application/json

{
  "name": "Nueva Materia",
  "code": "NUE101",
  "credits": "3",
  "schedule": "Mar-Jue 10:00-12:00",
  "teacher": "Prof. Nuevo",
  "cycle": "First cycle",
  "components": [
    {
      "id": 1,
      "name": "Tareas",
      "type": "numeric",
      "weight": 40,
      "maxScore": 100
    },
    {
      "id": 2,
      "name": "Exámenes",
      "type": "numeric",
      "weight": 60,
      "maxScore": 100
    }
  ]
}
```
**Nota:** Si no se envían components, se crean por defecto (Tareas 40%, Exámenes 60%)

### Actualizar materia
```http
PUT /api/subjects/:id
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "code": "ACT101",
  "credits": "4",
  "schedule": "Lun-Mié 14:00-16:00",
  "teacher": "Prof. Actualizado",
  "cycle": "Second cycle",
  "components": [...]
}
```

### Eliminar materia
```http
DELETE /api/subjects/:id
```
**Nota:** Elimina en cascada enrollments y grades relacionados

---

## 📋 INSCRIPCIONES

### Obtener todas las inscripciones
```http
GET /api/enrollments
```
**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "Juan Pérez",
    "subjectId": 1,
    "subjectName": "Matemáticas Avanzadas",
    "subjectCode": "MAT101",
    "teacher": "Dr. Roberto Fernández",
    "color": "#3B82F6, #2563EB",
    "enrollmentDate": "2024-01-15",
    "createdAt": "2024-12-15T18:20:00.000Z"
  }
]
```

### Crear inscripción
```http
POST /api/enrollments
Content-Type: application/json

{
  "studentId": 1,
  "subjectId": 2,
  "studentName": "Juan Pérez",
  "subjectName": "Historia Universal",
  "subjectCode": "HIS201",
  "teacher": "Lic. Patricia Morales",
  "color": "#22C55E, #16A34A",
  "enrollmentDate": "2024-12-15"
}
```

### Eliminar inscripción
```http
DELETE /api/enrollments/:id
```
**Nota:** Elimina en cascada grades relacionados

---

## 📊 CALIFICACIONES

### Obtener todas las calificaciones
```http
GET /api/grades
```
**Response:**
```json
[
  {
    "id": 1,
    "enrollmentId": 1,
    "studentId": 1,
    "componentId": 1,
    "componentName": "Tareas",
    "type": "assignment",
    "name": "Tarea 1",
    "score": 95,
    "maxScore": 100,
    "date": "2024-09-15T00:00:00.000Z",
    "notes": "",
    "createdAt": "2024-12-15T18:20:00.000Z"
  }
]
```

### Obtener calificaciones por inscripción
```http
GET /api/grades/enrollment/:enrollmentId
```
**Ejemplo:** `GET /api/grades/enrollment/1`

### Crear calificación
```http
POST /api/grades
Content-Type: application/json

{
  "enrollmentId": 1,
  "studentId": 1,
  "componentId": 1,
  "componentName": "Tareas",
  "type": "assignment",
  "name": "Tarea 1",
  "score": 95,
  "maxScore": 100,
  "date": "2024-12-15",
  "notes": "Excelente trabajo"
}
```

### Actualizar calificación
```http
PUT /api/grades/:id
Content-Type: application/json

{
  "score": 98,
  "notes": "Corregido - Excelente"
}
```

### Eliminar calificación
```http
DELETE /api/grades/:id
```

---

## 📝 Ejemplos de Uso con JavaScript

### Fetch API

```javascript
// Obtener estudiantes
const getStudents = async () => {
  const response = await fetch('http://localhost:3001/api/students');
  const students = await response.json();
  return students;
};

// Crear estudiante
const createStudent = async (studentData) => {
  const response = await fetch('http://localhost:3001/api/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData)
  });
  const newStudent = await response.json();
  return newStudent;
};

// Actualizar estudiante
const updateStudent = async (id, updates) => {
  const response = await fetch(`http://localhost:3001/api/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  const updated = await response.json();
  return updated;
};

// Eliminar estudiante
const deleteStudent = async (id) => {
  const response = await fetch(`http://localhost:3001/api/students/${id}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  return result;
};
```

### Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Obtener materias
const getSubjects = async () => {
  const { data } = await axios.get(`${API_URL}/subjects`);
  return data;
};

// Crear materia
const createSubject = async (subjectData) => {
  const { data } = await axios.post(`${API_URL}/subjects`, subjectData);
  return data;
};

// Obtener calificaciones de una inscripción
const getGradesByEnrollment = async (enrollmentId) => {
  const { data } = await axios.get(`${API_URL}/grades/enrollment/${enrollmentId}`);
  return data;
};
```

---

## 🔒 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 400 | Bad Request - Error en los datos enviados |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🗄️ Estructura de Base de Datos

### Tablas:
1. **users** - Usuarios del sistema
2. **students** - Estudiantes
3. **subjects** - Materias
4. **enrollments** - Inscripciones (FK: studentId, subjectId)
5. **grades** - Calificaciones (FK: enrollmentId, studentId)

### Foreign Keys:
- `enrollments.studentId` → `students.id` (CASCADE)
- `enrollments.subjectId` → `subjects.id` (CASCADE)
- `grades.enrollmentId` → `enrollments.id` (CASCADE)
- `grades.studentId` → `students.id` (CASCADE)

---

## 🚀 Iniciar Backend

```bash
cd backend
npm start
```

**Servidor:** `http://localhost:3001`
**Base de datos:** `backend/grade_manager.db`

---

## 📊 Datos de Ejemplo

- ✅ 1 usuario admin (admin/admin123)
- ✅ 8 estudiantes
- ✅ 6 materias
- ✅ 27 inscripciones
- ✅ 248 calificaciones
