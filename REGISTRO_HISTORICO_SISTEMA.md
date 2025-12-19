# 📚 Sistema de Registro Histórico de Estudiantes por Cuatrimestre

## 🎯 Objetivo

Mantener un registro completo y permanente de todos los estudiantes que han estudiado en la institución, organizados por períodos académicos (cuatrimestres), permitiendo a los profesores acceder al historial en cualquier momento.

---

## 📊 Estructura del Sistema

### 1. **Períodos Académicos** (`academic_periods`)

Gestiona los cuatrimestres o períodos académicos.

**Campos:**
- `id` - Identificador único
- `name` - Nombre del período (ej: "Cuatrimestre 1 - 2025")
- `code` - Código único (ej: "2025-Q1")
- `startDate` - Fecha de inicio
- `endDate` - Fecha de fin
- `year` - Año
- `quarter` - Cuatrimestre (1, 2, 3, 4)
- `isActive` - Si es el período activo actual
- `createdAt` - Fecha de creación

**Ejemplo:**
```
2025-Q1: Cuatrimestre 1 - 2025 (Enero - Marzo)
2025-Q2: Cuatrimestre 2 - 2025 (Abril - Junio)
2025-Q3: Cuatrimestre 3 - 2025 (Julio - Septiembre)
2025-Q4: Cuatrimestre 4 - 2025 (Octubre - Diciembre)
```

---

### 2. **Registro de Estudiantes por Período** (`student_period_records`)

Mantiene un registro de cada estudiante en cada cuatrimestre que cursó.

**Campos:**
- `id` - Identificador único
- `studentId` - ID del estudiante
- `periodId` - ID del período académico
- `studentName` - Nombre del estudiante
- `matricula` - Matrícula del estudiante
- `email` - Email
- `phone` - Teléfono
- `status` - Estado (active, completed, withdrawn, suspended)
- `enrollmentDate` - Fecha de inscripción
- `completionDate` - Fecha de finalización
- `averageGrade` - Promedio de calificaciones
- `totalCredits` - Total de créditos cursados
- `notes` - Notas adicionales
- `createdAt` - Fecha de creación
- `updatedAt` - Última actualización

**Estados posibles:**
- `active` - Estudiante activo en el período
- `completed` - Completó el período exitosamente
- `withdrawn` - Se retiró del período
- `suspended` - Suspendido temporalmente

---

### 3. **Inscripciones por Período** (`period_enrollments`)

Registra las materias que cada estudiante cursó en cada período.

**Campos:**
- `id` - Identificador único
- `studentId` - ID del estudiante
- `periodId` - ID del período académico
- `subjectId` - ID de la materia
- `studentName` - Nombre del estudiante
- `subjectName` - Nombre de la materia
- `subjectCode` - Código de la materia
- `teacher` - Profesor
- `finalGrade` - Calificación final
- `status` - Estado (in_progress, completed, failed, withdrawn)
- `enrollmentDate` - Fecha de inscripción
- `completionDate` - Fecha de finalización
- `createdAt` - Fecha de creación

---

## 🔌 API Endpoints

### Períodos Académicos

#### Obtener todos los períodos
```http
GET /api/academic/periods
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Cuatrimestre 4 - 2025",
    "code": "2025-Q4",
    "year": 2025,
    "quarter": 4,
    "isActive": 1,
    "studentCount": 45
  }
]
```

#### Obtener período activo
```http
GET /api/academic/periods/active
```

#### Crear nuevo período
```http
POST /api/academic/periods
Content-Type: application/json

{
  "name": "Cuatrimestre 1 - 2026",
  "code": "2026-Q1",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "year": 2026,
  "quarter": 1
}
```

#### Activar un período
```http
POST /api/academic/periods/:id/activate
```

---

### Registro de Estudiantes

#### Obtener estudiantes de un período
```http
GET /api/academic/periods/:periodId/students
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "studentId": 15,
    "periodId": 1,
    "studentName": "Juan Pérez",
    "matricula": "GE20250001",
    "status": "active",
    "averageGrade": 85.5,
    "totalCredits": 24,
    "enrolledSubjects": 6
  }
]
```

#### Registrar estudiante en período
```http
POST /api/academic/periods/:periodId/students
Content-Type: application/json

{
  "studentId": 15,
  "studentName": "Juan Pérez",
  "matricula": "GE20250001",
  "email": "juan@example.com",
  "phone": "555-1234",
  "enrollmentDate": "2025-10-01"
}
```

#### Actualizar registro de estudiante
```http
PUT /api/academic/periods/:periodId/students/:recordId
Content-Type: application/json

{
  "status": "completed",
  "completionDate": "2025-12-31",
  "averageGrade": 87.5,
  "totalCredits": 30,
  "notes": "Completó exitosamente el cuatrimestre"
}
```

#### Obtener historial completo de un estudiante
```http
GET /api/academic/students/:studentId/history
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "studentId": 15,
    "periodId": 1,
    "periodName": "Cuatrimestre 4 - 2025",
    "periodCode": "2025-Q4",
    "year": 2025,
    "quarter": 4,
    "status": "completed",
    "averageGrade": 87.5
  },
  {
    "id": 2,
    "studentId": 15,
    "periodId": 2,
    "periodName": "Cuatrimestre 3 - 2025",
    "periodCode": "2025-Q3",
    "year": 2025,
    "quarter": 3,
    "status": "completed",
    "averageGrade": 85.0
  }
]
```

---

### Inscripciones por Período

#### Obtener inscripciones de un estudiante en un período
```http
GET /api/academic/periods/:periodId/students/:studentId/enrollments
```

#### Registrar inscripción
```http
POST /api/academic/periods/:periodId/enrollments
Content-Type: application/json

{
  "studentId": 15,
  "subjectId": 5,
  "studentName": "Juan Pérez",
  "subjectName": "Matemáticas",
  "subjectCode": "MAT101",
  "teacher": "Prof. García"
}
```

#### Actualizar inscripción (calificación final)
```http
PUT /api/academic/periods/:periodId/enrollments/:enrollmentId
Content-Type: application/json

{
  "finalGrade": 88.5,
  "status": "completed",
  "completionDate": "2025-12-15"
}
```

---

### Estadísticas y Reportes

#### Obtener estadísticas de un período
```http
GET /api/academic/periods/:periodId/stats
```

**Respuesta:**
```json
{
  "totalStudents": 45,
  "activeStudents": 42,
  "completedStudents": 3,
  "totalEnrollments": 270,
  "averageGrade": 82.3
}
```

#### Obtener todos los estudiantes históricos
```http
GET /api/academic/students/all-time
```

**Respuesta:**
```json
[
  {
    "id": 15,
    "name": "Juan Pérez",
    "matricula": "GE20250001",
    "periodsAttended": 3,
    "lastPeriod": "2025-Q4",
    "status": "active"
  }
]
```

---

## 🔄 Flujo de Trabajo

### 1. Inicio de Cuatrimestre

```javascript
// 1. Crear nuevo período académico
POST /api/academic/periods
{
  "name": "Cuatrimestre 1 - 2026",
  "code": "2026-Q1",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "year": 2026,
  "quarter": 1
}

// 2. Activar el período
POST /api/academic/periods/1/activate

// 3. Registrar estudiantes en el período
POST /api/academic/periods/1/students
{
  "studentId": 15,
  "studentName": "Juan Pérez",
  "matricula": "GE20250001"
}

// 4. Inscribir estudiantes en materias
POST /api/academic/periods/1/enrollments
{
  "studentId": 15,
  "subjectId": 5,
  "subjectName": "Matemáticas"
}
```

### 2. Durante el Cuatrimestre

```javascript
// Actualizar calificaciones en las inscripciones
PUT /api/academic/periods/1/enrollments/1
{
  "finalGrade": 88.5
}
```

### 3. Fin de Cuatrimestre

```javascript
// Completar registro del estudiante
PUT /api/academic/periods/1/students/1
{
  "status": "completed",
  "completionDate": "2026-03-31",
  "averageGrade": 87.5,
  "totalCredits": 30
}
```

---

## 📈 Beneficios del Sistema

### Para la Institución
- ✅ **Registro permanente** de todos los estudiantes
- ✅ **Historial académico completo** por cuatrimestre
- ✅ **Estadísticas precisas** por período
- ✅ **Trazabilidad** de la trayectoria estudiantil
- ✅ **Cumplimiento normativo** de registros académicos

### Para los Profesores
- ✅ **Acceso al historial** de cualquier estudiante
- ✅ **Consulta de períodos anteriores**
- ✅ **Seguimiento de progreso** a lo largo del tiempo
- ✅ **Reportes históricos** disponibles siempre

### Para los Estudiantes
- ✅ **Historial académico** completo y permanente
- ✅ **Certificados** basados en registros históricos
- ✅ **Constancias** de estudios realizados

---

## 🔒 Características de Seguridad

1. **Integridad Referencial**
   - Foreign keys garantizan consistencia
   - Cascada en eliminaciones cuando corresponde

2. **Registro de Auditoría**
   - `createdAt` y `updatedAt` en todos los registros
   - Trazabilidad de cambios

3. **Unicidad**
   - Un estudiante solo puede tener un registro por período
   - Códigos de período únicos

---

## 📝 Notas de Implementación

### Migración Automática

El sistema crea automáticamente:
- Tablas necesarias
- Período académico actual
- Columnas adicionales en tablas existentes

### Compatibilidad

- ✅ Compatible con el sistema actual de inscripciones
- ✅ No afecta funcionalidad existente
- ✅ Se integra perfectamente con calificaciones actuales

---

## 🚀 Próximos Pasos

1. **Interfaz de Usuario**
   - Página de gestión de períodos académicos
   - Vista de historial de estudiantes
   - Reportes por cuatrimestre

2. **Automatización**
   - Creación automática de períodos
   - Migración automática de datos al finalizar período
   - Cálculo automático de promedios

3. **Reportes Avanzados**
   - Certificados de estudios
   - Constancias por período
   - Historial académico completo

---

**Estado:** ✅ Backend implementado y funcionando

**Última actualización:** Diciembre 2025
