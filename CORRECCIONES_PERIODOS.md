# 🔧 Correcciones Pendientes

## 1. Botón "Ver Detalles" ✅ CORREGIDO

El botón ahora muestra un alert mejorado con toda la información del período:
- Nombre del período
- Código
- Fechas formateadas
- Estadísticas (estudiantes, año, cuatrimestre)
- Estado (Activo/Inactivo)

---

## 2. Selector de Período Académico en Materias ⏳ PENDIENTE

### Problema
Cuando se crea una materia, no se puede seleccionar a qué período académico pertenece.

### Solución Necesaria

Agregar un selector de período académico en el formulario de materias (`Subjects.jsx`):

#### Paso 1: Cargar períodos disponibles

```javascript
// En el componente Subjects
const [periods, setPeriods] = useState([]);
const [activePeriod, setActivePeriod] = useState(null);

useEffect(() => {
    loadPeriods();
}, []);

const loadPeriods = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/academic/periods');
        const data = await response.json();
        setPeriods(data);
        
        const active = data.find(p => p.isActive === 1);
        setActivePeriod(active);
    } catch (error) {
        console.error('Error cargando períodos:', error);
    }
};
```

#### Paso 2: Actualizar formData

```javascript
const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    schedule: '',
    teacher: '',
    cycle: 'First cycle',
    color: '#6366F1',
    periodId: null,  // ← AGREGAR ESTO
    components: [...]
});
```

#### Paso 3: Agregar selector en el formulario

Agregar después del campo "Ciclo Académico" (línea ~766):

```javascript
<FormGroup>
    <label>Período Académico</label>
    <Select
        value={formData.periodId || ''}
        onChange={(e) => setFormData({ 
            ...formData, 
            periodId: e.target.value ? parseInt(e.target.value) : null 
        })}
        required
    >
        <option value="">-- Seleccionar Período --</option>
        {periods.map(period => (
            <option 
                key={period.id} 
                value={period.id}
            >
                {period.name} {period.isActive === 1 ? '(Activo)' : ''}
            </option>
        ))}
    </Select>
</FormGroup>
```

#### Paso 4: Actualizar handleOpenModal

Cuando se edita una materia, cargar el periodId:

```javascript
const handleOpenModal = (subject = null) => {
    if (subject) {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code || '',
            credits: subject.credits || '',
            schedule: subject.schedule || '',
            teacher: subject.teacher || '',
            cycle: subject.cycle || 'First cycle',
            color: subject.color || '#6366F1',
            periodId: subject.periodId || activePeriod?.id || null,  // ← AGREGAR
            components: subject.components || [...]
        });
    } else {
        setEditingSubject(null);
        setFormData({
            name: '', 
            code: '', 
            credits: '', 
            schedule: '', 
            teacher: '',
            cycle: 'First cycle', 
            color: '#6366F1',
            periodId: activePeriod?.id || null,  // ← AGREGAR (auto-seleccionar activo)
            components: [...]
        });
    }
    setIsModalOpen(true);
};
```

---

## 3. Mostrar Período en la Tarjeta de Materia

Agregar indicador visual del período en cada tarjeta de materia:

```javascript
// En la tarjeta de materia, después de InfoBar (línea ~634)
{s.periodId && (
    <div style={{
        padding: '8px 12px',
        background: s.isActive ? '#10B98120' : '#94A3B820',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        color: s.isActive ? '#10B981' : '#64748B',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    }}>
        <Calendar size={14} />
        {periods.find(p => p.id === s.periodId)?.name || 'Período no encontrado'}
    </div>
)}
```

---

## 4. Filtrar Materias por Período (Opcional)

Agregar un filtro para ver materias de un período específico:

```javascript
// Agregar selector de filtro en TopBar
<Select
    value={selectedPeriodFilter}
    onChange={(e) => setSelectedPeriodFilter(e.target.value)}
    style={{ width: '250px' }}
>
    <option value="">Todos los períodos</option>
    {periods.map(period => (
        <option key={period.id} value={period.id}>
            {period.name}
        </option>
    ))}
</Select>

// Actualizar filteredSubjects
const filteredSubjects = subjects.filter(s =>
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.code && s.code.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!selectedPeriodFilter || s.periodId === parseInt(selectedPeriodFilter))
);
```

---

## Resumen de Cambios Necesarios

### Archivos a Modificar

**`src/pages/Subjects.jsx`**
1. ✅ Agregar estado para períodos
2. ✅ Cargar períodos al montar componente
3. ✅ Agregar `periodId` al formData
4. ✅ Agregar selector en el formulario
5. ✅ Actualizar handleOpenModal
6. ✅ (Opcional) Mostrar período en tarjeta
7. ✅ (Opcional) Agregar filtro por período

---

## Estado Actual

- ✅ **Botón "Ver Detalles"**: Funcionando correctamente
- ⏳ **Selector de Período**: Pendiente de implementar
- ⏳ **Visualización de Período**: Pendiente de implementar

---

**Próximo paso:** Implementar el selector de período académico en el formulario de materias.
