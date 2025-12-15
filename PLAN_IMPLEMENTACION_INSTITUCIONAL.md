# 🚀 Plan de Implementación del Sistema Institucional

## ✅ Fase 1: Modelo de Datos (COMPLETADO)

### **1.1 Estudiantes**
- [x] Campo `matricula` auto-generado (GE + año + secuencial)
- [x] Campo `year` (año de ingreso)
- [x] Generación automática en `studentsAPI.create()`
- [x] Formato: GE20250001, GE20250002, etc.

### **1.2 Visualización**
- [x] Componente `Matricula` styled
- [x] Mostrar matrícula en tarjeta de estudiante
- [x] Badge azul con icono 📋

## 🔄 Fase 2: Sistema de Componentes de Evaluación (EN PROGRESO)

### **2.1 Estructura de Materia**
```javascript
{
    id: 1,
    name: "TECHNICAL ENGLISH COURSE",
    code: "TEC-ENG",
    cycle: "First cycle",
    teacher: "Prof. Smith",
    color: "#3B82F6",
    components: [
        {
            id: 1,
            name: "WRITING SPEAKING",
            type: "numeric",  // puntaje + letra
            weight: 25,
            maxScore: 100
        },
        {
            id: 2,
            name: "READING COMPREHENSION",
            type: "numeric",
            weight: 25,
            maxScore: 100
        },
        {
            id: 3,
            name: "CLASES BIBLICAS",
            type: "letter",  // solo letra
            weight: 25
        },
        {
            id: 4,
            name: "ETICA Y VALORES",
            type: "letter",
            weight: 25
        }
    ]
}
```

### **2.2 Actualizar subjectsAPI**
- [ ] Agregar campo `cycle`
- [ ] Agregar campo `components`
- [ ] Validación de componentes
- [ ] Suma de weights = 100%

### **2.3 Formulario de Materia**
- [ ] Campo de ciclo (dropdown)
- [ ] Configurador de componentes
- [ ] Agregar/eliminar componentes
- [ ] Tipo: numérico o letra
- [ ] Peso/ponderación

## 📝 Fase 3: Sistema de Calificaciones por Componentes

### **3.1 Estructura de Calificación**
```javascript
{
    id: 1,
    enrollmentId: 1,
    componentId: 1,
    componentName: "WRITING SPEAKING",
    score: 75,  // solo si es numérico
    letter: "C",  // calculado o asignado
    date: "2025-01-20",
    notes: ""
}
```

### **3.2 Actualizar gradesAPI**
- [ ] Soporte para componentId
- [ ] Cálculo automático de letra
- [ ] Validación por tipo de componente
- [ ] Cálculo de promedio ponderado

### **3.3 Interfaz de Calificaciones**
- [ ] Vista por componentes
- [ ] Tabla estilo institucional
- [ ] Columnas dinámicas según componentes
- [ ] Entrada rápida de calificaciones

## 📊 Fase 4: Reportes Institucionales

### **4.1 Reporte Individual**
```
┌────────┬─────────────┬─────────┬──────┬─────────┬──────┬─────┐
│MATRICULA│   NOMBRES   │WRITING  │Literal│READING  │Literal│ AVG │
│        │             │SPEAKING │      │COMPREH. │      │     │
├────────┼─────────────┼─────────┼──────┼─────────┼──────┼─────┤
│GE202507│Edgar Daniel │   75    │  C   │   100   │  A   │87.5│
└────────┴─────────────┴─────────┴──────┴─────────┴──────┴─────┘
```

### **4.2 Actualizar PDF Service**
- [ ] Incluir matrícula en reportes
- [ ] Tabla con componentes dinámicos
- [ ] Columnas de puntaje + letra
- [ ] Promedio ponderado

## 🎨 Fase 5: UI/UX Mejoradas

### **5.1 Dashboard**
- [ ] Mostrar matrículas en búsqueda
- [ ] Filtros por ciclo
- [ ] Estadísticas por componente

### **5.2 Gestión de Calificaciones**
- [ ] Vista tipo hoja de cálculo
- [ ] Entrada rápida por componente
- [ ] Validación en tiempo real
- [ ] Guardado automático

### **5.3 Subjects**
- [ ] Configurador visual de componentes
- [ ] Preview de estructura
- [ ] Templates predefinidos

## 📋 Checklist de Implementación

### **Completado ✅**
- [x] Auto-generación de matrícula
- [x] Componente visual de matrícula
- [x] Mostrar matrícula en Students

### **Siguiente ⏭️**
- [ ] Agregar campo cycle a Subjects
- [ ] Crear configurador de componentes
- [ ] Actualizar formulario de Subjects
- [ ] Actualizar modelo de calificaciones
- [ ] Nueva interfaz de calificaciones
- [ ] Actualizar reportes PDF

## 🎯 Prioridades

### **Alta Prioridad (Hoy)**
1. Campo cycle en materias
2. Componentes de evaluación
3. Nueva interfaz de calificaciones

### **Media Prioridad (Esta Semana)**
4. Reportes con nuevo formato
5. Cálculo de promedio ponderado
6. Validaciones completas

### **Baja Prioridad (Futuro)**
7. Templates de materias
8. Importación masiva
9. Historial de cambios

## 📊 Progreso General

```
Fase 1: ████████████████████ 100% ✅
Fase 2: ████░░░░░░░░░░░░░░░░  20% 🔄
Fase 3: ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Fase 4: ░░░░░░░░░░░░░░░░░░░░   0% ⏳
Fase 5: ░░░░░░░░░░░░░░░░░░░░   0% ⏳

Total:  ████░░░░░░░░░░░░░░░░  24% 🚀
```

## 🔄 Próximos Pasos Inmediatos

1. **Actualizar Subjects.jsx**
   - Agregar campo de ciclo
   - Crear configurador de componentes

2. **Actualizar dataService.js**
   - Soporte para componentes en materias
   - Validaciones

3. **Crear nueva página de calificaciones**
   - Vista tipo tabla institucional
   - Entrada por componentes

4. **Actualizar reportes**
   - Formato institucional
   - Matrículas y componentes

---

**Estado Actual**: Matrícula implementada ✅
**Siguiente**: Componentes de evaluación 🔄
**Tiempo Estimado**: 2-3 horas para completar todo
