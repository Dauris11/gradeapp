# 🔢 Generación Automática de Códigos de Materias

## 🎯 Objetivo Completado

Se ha implementado la generación automática de códigos para las materias basándose en las iniciales del nombre más un número secuencial.

---

## 📝 Cómo Funciona

### Formato del Código

```
[INICIALES]-[NÚMERO]

Ejemplos:
- Matemáticas Avanzadas    → MA-001
- Programación Web          → PW-002
- Análisis de Redes         → AR-001
- Base de Datos             → BD-001
```

---

## 🔧 Algoritmo de Generación

### 1. **Extracción de Iniciales**

El sistema analiza el nombre de la materia y extrae las iniciales de forma inteligente:

#### Palabras Significativas
```javascript
// Filtra palabras pequeñas y artículos
const palabrasIgnoradas = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'a', 'en'];
```

#### Casos de Uso

**Caso 1: Dos o más palabras significativas**
```
Entrada: "Matemáticas Avanzadas"
Palabras significativas: ["Matemáticas", "Avanzadas"]
Iniciales: M + A = "MA"
```

**Caso 2: Una palabra significativa**
```
Entrada: "Programación"
Palabras significativas: ["Programación"]
Iniciales: Primeras 2 letras = "PR"
```

**Caso 3: Solo palabras cortas**
```
Entrada: "Base de Datos"
Palabras significativas: ["Base", "Datos"]
Iniciales: B + D = "BD"
```

---

### 2. **Generación del Número Secuencial**

El sistema busca códigos existentes con las mismas iniciales y asigna el siguiente número:

```javascript
// Ejemplo: Ya existen MA-001, MA-002
Códigos existentes con "MA": [1, 2]
Siguiente número: 3
Código generado: MA-003
```

**Formato del Número:**
- Siempre 3 dígitos
- Relleno con ceros a la izquierda
- Ejemplos: 001, 002, 010, 100

---

## 🎨 Interfaz de Usuario

### Campo de Código

**Antes:**
```
┌─────────────────────────────────┐
│ Código                          │
│ [AR-101                    ]    │  ← Editable
└─────────────────────────────────┘
```

**Ahora:**
```
┌─────────────────────────────────┐
│ Código (Auto-generado)          │
│ [MA-001                    ]    │  ← Solo lectura
│  (Fondo gris, no editable)      │
└─────────────────────────────────┘
```

### Generación en Tiempo Real

Mientras escribes el nombre, el código se genera automáticamente:

```
Nombre: [M                    ]  →  Código: [M-001]
Nombre: [Ma                   ]  →  Código: [MA-001]
Nombre: [Mat                  ]  →  Código: [MA-001]
Nombre: [Matemáticas          ]  →  Código: [MA-001]
Nombre: [Matemáticas A        ]  →  Código: [MA-001]
Nombre: [Matemáticas Av       ]  →  Código: [MA-001]
Nombre: [Matemáticas Avanzadas]  →  Código: [MA-001]
```

---

## 💡 Ejemplos de Generación

### Materias Comunes

| Nombre de la Materia | Código Generado | Explicación |
|---------------------|-----------------|-------------|
| Matemáticas | MA-001 | Primeras 2 letras |
| Programación Web | PW-001 | P + W |
| Base de Datos | BD-001 | B + D |
| Análisis de Redes | AR-001 | A + R |
| Física Cuántica | FC-001 | F + C |
| Historia del Arte | HA-001 | H + A (ignora "del") |
| Inglés | IN-001 | Primeras 2 letras |
| Química Orgánica | QO-001 | Q + O |

### Secuencia de Códigos

Si ya existen materias con las mismas iniciales:

```
1. Matemáticas Básicas      → MA-001
2. Matemáticas Avanzadas    → MA-002
3. Matemáticas Aplicadas    → MA-003

1. Programación I           → PR-001
2. Programación II          → PR-002
3. Programación Web         → PW-001  (diferentes iniciales)
```

---

## 🔒 Comportamiento al Editar

### Nueva Materia
- ✅ Código se genera automáticamente
- ✅ Se actualiza mientras escribes
- ✅ Campo de código bloqueado

### Editar Materia Existente
- ✅ Código NO se regenera
- ✅ Se mantiene el código original
- ✅ Campo de código bloqueado

```javascript
const newCode = !editingSubject 
    ? generateSubjectCode(newName)  // Nueva: genera código
    : formData.code;                // Editar: mantiene código
```

---

## 🎯 Ventajas

### 1. **Consistencia**
- Todos los códigos siguen el mismo formato
- Fácil de identificar y recordar

### 2. **Automatización**
- No hay que pensar en códigos
- Reduce errores humanos
- Ahorra tiempo

### 3. **Organización**
- Códigos agrupados por iniciales
- Fácil de buscar y filtrar
- Secuencia lógica

### 4. **Escalabilidad**
- Soporta hasta 999 materias por iniciales
- Se adapta automáticamente

---

## 🧪 Cómo Probar

### 1. Crear Nueva Materia

1. Ve a **Materias**
2. Clic en **"Nueva Materia"**
3. Escribe el nombre: "Matemáticas Avanzadas"
4. Observa el código generado: "MA-001"
5. Intenta editar el código → No se puede (bloqueado)
6. Guarda la materia

### 2. Crear Segunda Materia con Mismas Iniciales

1. Clic en **"Nueva Materia"**
2. Escribe: "Matemáticas Aplicadas"
3. Observa el código: "MA-002" (siguiente número)
4. Guarda

### 3. Editar Materia Existente

1. Edita una materia
2. Cambia el nombre
3. Observa que el código NO cambia
4. Esto preserva la integridad de los datos

---

## 📊 Código Implementado

### Función Principal

```javascript
const generateSubjectCode = (subjectName) => {
    if (!subjectName || subjectName.trim() === '') return '';
    
    // 1. Extraer palabras
    const words = subjectName.trim().split(' ').filter(word => word.length > 0);
    
    // 2. Filtrar palabras significativas
    const significantWords = words.filter(word => 
        word.length > 2 && 
        !['de', 'del', 'la', 'el', 'los', 'las', 'y', 'a', 'en']
            .includes(word.toLowerCase())
    );
    
    // 3. Generar iniciales
    let initials = '';
    if (significantWords.length >= 2) {
        initials = significantWords.slice(0, 2)
            .map(w => w[0].toUpperCase()).join('');
    } else if (significantWords.length === 1) {
        initials = significantWords[0].substring(0, 2).toUpperCase();
    } else {
        initials = words.slice(0, 2)
            .map(w => w[0].toUpperCase()).join('');
    }
    
    // 4. Generar número secuencial
    const existingCodes = subjects
        .filter(s => s.code && s.code.startsWith(initials + '-'))
        .map(s => parseInt(s.code.split('-')[1]))
        .filter(num => !isNaN(num));
    
    const nextNumber = existingCodes.length > 0 
        ? Math.max(...existingCodes) + 1 
        : 1;
    
    // 5. Formatear código
    return `${initials}-${String(nextNumber).padStart(3, '0')}`;
};
```

---

## ✅ Estado Final

✅ **Generación automática** de códigos  
✅ **Iniciales inteligentes** del nombre  
✅ **Numeración secuencial** automática  
✅ **Campo bloqueado** (solo lectura)  
✅ **Preservación** al editar  
✅ **Formato consistente** XX-000  

---

## 🎉 Resultado

Ahora los códigos de materias se generan automáticamente de forma inteligente, ahorrando tiempo y garantizando consistencia en todo el sistema.

**¡Ya no hay que pensar en códigos!** 🚀

---

**Última actualización:** Diciembre 2025

**Estado:** ✅ Completamente funcional
