# 📊 Guía: Cargar Datos Reales en el Sistema

## 🎯 Base de Datos del Proyecto

Este proyecto usa **localStorage** del navegador como base de datos.

### **Ubicación:**
- No hay archivos físicos
- Los datos se guardan en el navegador
- Cada navegador tiene su propia copia

### **Acceder a los datos:**
1. Abre DevTools (F12)
2. Ve a "Application" o "Almacenamiento"
3. Busca "Local Storage"
4. Verás: `students`, `subjects`, `enrollments`, `grades`

## 🔄 Cómo Cargar los Datos Reales

### **Opción 1: Desde la Consola del Navegador** (Recomendado)

1. **Abre la aplicación** en el navegador
2. **Presiona F12** para abrir DevTools
3. **Ve a la pestaña "Console"**
4. **Copia y pega** el contenido de `populate-database.js`
5. **Presiona Enter**
6. **Recarga la página** (Ctrl+R o F5)

### **Opción 2: Crear un Botón en la App**

Puedo crear un botón "Cargar Datos de Ejemplo" en el Dashboard.

### **Opción 3: Automático al Iniciar**

Puedo hacer que cargue datos automáticamente si no hay ninguno.

## 📋 Datos que se Cargarán

### **8 Estudiantes** (de la imagen):
```
1. Edgar Daniel Diaz Beato      - GE202507
2. Emely Caminero                - GE202523
3. Ronalhys De Jesus Cruz Lopez  - GE202541
4. Harol Tapia Gomez             - GE202553
5. Marianyi Acosta Paulino       - GE202555
6. Dwaris Manuel Peña Lopez      - GE202566
7. Soribel Jean Alexander        - GE202569
8. Oliannys Liberato             - GE202571
```

### **1 Materia:**
```
TECHNICAL ENGLISH COURSE (TEC-ENG)
- First cycle
- Prof. Smith

Componentes:
1. WRITING SPEAKING       - Numérico - 25%
2. READING COMPREHENSION  - Numérico - 25%
3. CLASES BIBLICAS        - Letra   - 25%
4. ETICA Y VALORES        - Letra   - 25%
```

### **Calificaciones** (de la imagen):
```
Edgar Daniel:   Writing 75,  Reading 100
Emely:          Writing 83,  Reading 100
Ronalhys:       Writing 78,  Reading 82
Harol:          Writing 82,  Reading 94
Marianyi:       Writing 88,  Reading 100
Dwaris:         Writing 93,  Reading 100
Soribel:        Writing 91,  Reading 100
Oliannys:       Writing 98,  Reading 100
```

## ✅ Cambios Responsive Implementados

### **ComponentsConfigurator:**
- ✅ Grid responsive (desktop: 5 columnas, mobile: 1 columna)
- ✅ Etiquetas móviles (solo visibles en pantallas pequeñas)
- ✅ Espaciado ajustado para móvil
- ✅ Botones adaptados

### **Breakpoints:**
```css
Desktop: > 768px  - Grid de 5 columnas
Mobile:  ≤ 768px  - Grid de 1 columna con etiquetas
```

## 🚀 Pasos para Usar el Sistema Completo

### **1. Cargar Datos:**
```javascript
// En la consola del navegador (F12)
// Pegar el contenido de populate-database.js
```

### **2. Verificar:**
- Ve a "Estudiantes" - Deberías ver 8 estudiantes con matrículas
- Ve a "Materias" - Deberías ver TECHNICAL ENGLISH COURSE
- Ve a "Gestión de Calificaciones" - Deberías ver las calificaciones

### **3. Probar Configurador:**
- Crea una nueva materia
- Configura componentes personalizados
- Verifica que sume 100%

## 📱 Responsive Design

### **Desktop (> 768px):**
```
┌────────────────────────────────────────────────────┐
│ [Nombre] [Tipo] [Peso] [Máx] [🗑️]                │
│ [Nombre] [Tipo] [Peso] [Máx] [🗑️]                │
└────────────────────────────────────────────────────┘
```

### **Mobile (≤ 768px):**
```
┌──────────────────┐
│ Nombre           │
│ [Input]          │
│                  │
│ Tipo             │
│ [Select]         │
│                  │
│ Peso (%)         │
│ [Input]          │
│                  │
│ Puntaje Máximo   │
│ [Input]          │
│                  │
│ [🗑️ Eliminar]   │
└──────────────────┘
```

## 🎨 Mejoras de UX

1. **Etiquetas Contextuales**
   - Desktop: Sin etiquetas (grid compacto)
   - Mobile: Con etiquetas (más claro)

2. **Espaciado Adaptativo**
   - Desktop: Compacto
   - Mobile: Más espacio entre campos

3. **Botones**
   - Tamaño adecuado para touch
   - Feedback visual al tocar

## 📝 Archivos Actualizados

1. ✅ `populate-database.js` - Script de datos
2. ✅ `ComponentsConfigurator.jsx` - Responsive
3. ✅ `GUIA_CARGAR_DATOS.md` - Este archivo

## 🔧 Troubleshooting

### **No veo los datos:**
1. Verifica que ejecutaste el script
2. Recarga la página (Ctrl+R)
3. Revisa la consola por errores

### **Los datos se borran:**
- localStorage se limpia si borras datos del navegador
- Vuelve a ejecutar el script

### **Quiero empezar de cero:**
```javascript
localStorage.clear();
location.reload();
```

## 🎯 Próximos Pasos

1. **Cargar los datos** con el script
2. **Probar el configurador** responsive
3. **Crear más materias** con diferentes componentes
4. **Registrar más calificaciones**

---

**¿Necesitas ayuda?**
- Script listo en: `populate-database.js`
- Solo copia y pega en la consola
- Recarga y listo ✅
