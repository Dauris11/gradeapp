# Guía de Implementación de Notificaciones Toast

## Sistema de Notificaciones Implementado

Se ha creado un sistema de notificaciones toast reutilizable en `src/components/Toast.jsx` que incluye:

### Tipos de Notificaciones
- ✅ **Success** (Verde): Para operaciones exitosas
- ❌ **Error** (Rojo): Para errores
- ⚠️ **Warning** (Naranja): Para advertencias
- ℹ️ **Info** (Azul): Para información general

## Cómo Implementar en Cada Página

### 1. Importar el Hook y Componente

```javascript
import { Toast, useToast } from '../components/Toast';
```

### 2. Inicializar el Hook en el Componente

```javascript
const MyComponent = () => {
    const toast = useToast();
    
    // ... resto del código
}
```

### 3. Renderizar el Componente Toast

```javascript
return (
    <Container>
        <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
        {/* ... resto del contenido */}
    </Container>
);
```

### 4. Usar las Notificaciones

#### En Operaciones CRUD:

**CREATE (Crear)**
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    try {
        if (editingItem) {
            itemsAPI.update(editingItem.id, formData);
            toast.success('Registro actualizado correctamente', 'Actualización Exitosa');
        } else {
            itemsAPI.create(formData);
            toast.success('Registro creado exitosamente', 'Creación Exitosa');
        }
        loadData();
        setIsModalOpen(false);
    } catch (error) {
        toast.error('No se pudo guardar el registro. Por favor, intenta nuevamente.', 'Error al Guardar');
    }
};
```

**UPDATE (Actualizar)**
```javascript
const handleEdit = (item) => {
    try {
        setEditingItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    } catch (error) {
        toast.error('No se pudo cargar los datos para editar', 'Error de Carga');
    }
};
```

**DELETE (Eliminar)**
```javascript
const handleDelete = (id) => {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        try {
            itemsAPI.delete(id);
            toast.success('Registro eliminado correctamente', 'Eliminación Exitosa');
            loadData();
        } catch (error) {
            toast.error('No se pudo eliminar el registro. Puede tener datos relacionados.', 'Error al Eliminar');
        }
    }
};
```

**READ (Cargar Datos)**
```javascript
const loadData = () => {
    try {
        const data = itemsAPI.getAll();
        setItems(data);
    } catch (error) {
        toast.error('No se pudieron cargar los datos. Por favor, recarga la página.', 'Error de Carga');
    }
};
```

## Mensajes Específicos por Página

### Students (Estudiantes)
- **Crear**: "Estudiante registrado exitosamente"
- **Actualizar**: "Datos del estudiante actualizados correctamente"
- **Eliminar**: "Estudiante eliminado del sistema"
- **Error Crear**: "No se pudo registrar el estudiante. Verifica que el email no esté duplicado."
- **Error Eliminar**: "No se pudo eliminar el estudiante. Puede tener inscripciones activas."

### Subjects (Materias)
- **Crear**: "Materia creada exitosamente"
- **Actualizar**: "Información de la materia actualizada"
- **Eliminar**: "Materia eliminada del sistema"
- **Error Crear**: "No se pudo crear la materia. Verifica que el código no esté duplicado."
- **Error Eliminar**: "No se pudo eliminar la materia. Tiene estudiantes inscritos."

### Enrollments (Inscripciones)
- **Crear**: "Estudiante inscrito exitosamente en la materia"
- **Eliminar**: "Inscripción eliminada correctamente"
- **Error Crear**: "El estudiante ya está inscrito en esta materia"
- **Error Eliminar**: "No se pudo eliminar la inscripción. Puede tener calificaciones registradas."

### Grades (Calificaciones)
- **Crear**: "Calificación registrada exitosamente"
- **Actualizar**: "Calificación actualizada correctamente"
- **Eliminar**: "Calificación eliminada del sistema"
- **Error Crear**: "No se pudo registrar la calificación. Verifica los datos ingresados."
- **Error Validación**: "La puntuación no puede ser mayor que la puntuación máxima"

## Validaciones con Toast

### Validación de Formularios
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de email
    if (!formData.email.includes('@')) {
        toast.warning('Por favor ingresa un email válido', 'Email Inválido');
        return;
    }
    
    // Validación de teléfono
    if (formData.phone && formData.phone.length < 10) {
        toast.warning('El teléfono debe tener al menos 10 dígitos', 'Teléfono Inválido');
        return;
    }
    
    // Continuar con el guardado...
};
```

### Validación de Duplicados
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    
    const exists = items.some(item => 
        item.code === formData.code && item.id !== editingItem?.id
    );
    
    if (exists) {
        toast.error('Ya existe un registro con este código', 'Código Duplicado');
        return;
    }
    
    // Continuar con el guardado...
};
```

## Personalización de Duración

```javascript
// Toast que dura 2 segundos
toast.success('Guardado rápido', null, 2000);

// Toast que dura 6 segundos
toast.error('Error detallado que requiere más tiempo de lectura', null, 6000);

// Toast que no se cierra automáticamente
toast.info('Información importante', null, 0);
```

## Ejemplo Completo de Implementación

Ver archivo: `src/pages/Students.jsx` (próxima actualización)

## Páginas a Actualizar

- [ ] Students.jsx
- [ ] Subjects.jsx  
- [ ] Enrollments.jsx
- [ ] GradeManagement.jsx
- [ ] Login.jsx (para errores de autenticación)

## Notas Importantes

1. **Siempre usar try-catch** en operaciones CRUD
2. **Mensajes claros y específicos** para cada operación
3. **Validar antes de enviar** al API
4. **Cerrar modales solo después** de operación exitosa
5. **Recargar datos** después de crear/actualizar/eliminar
