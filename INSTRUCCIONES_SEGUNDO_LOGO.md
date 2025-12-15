# 📝 Instrucciones para Agregar el Segundo Logo

## ✅ Cambios Realizados

### **1. Logo Principal (Izquierda)**
- ✅ Ahora mantiene su **proporción original**
- ✅ No se deforma
- ✅ Se centra verticalmente en el header
- ✅ Tamaño máximo: 30x25 unidades

### **2. Logo Secundario (Derecha)**
- ✅ Espacio reservado en la **esquina derecha**
- ✅ Mantiene proporción automáticamente
- ✅ Se centra verticalmente
- ✅ Tamaño máximo: 30x25 unidades

## 📁 Cómo Agregar el Segundo Logo

### **Paso 1: Preparar la Imagen**

1. **Formato recomendado**: PNG con fondo transparente
2. **Tamaño recomendado**: 500x500px o similar (cuadrado)
3. **Peso**: Menos de 200KB para carga rápida

### **Paso 2: Guardar el Archivo**

Coloca tu imagen en:
```
public/imagenes/logo-secundario.png
```

**Ruta completa:**
```
grade-manager/
  └── public/
      └── imagenes/
          ├── ge-logo.png (logo actual)
          └── logo-secundario.png (NUEVO - tu logo)
```

### **Paso 3: ¡Listo!**

El sistema detectará automáticamente el logo y lo mostrará en:
- ✅ Reportes individuales (esquina derecha)
- ✅ Reportes consolidados (esquina derecha)

## 🎨 Diseño del Header

```
┌─────────────────────────────────────────────────────┐
│ [Logo 1]        REPORTE ACADÉMICO        [Logo 2]  │
│ (izquierda)  Sistema de Gestión        (derecha)   │
└─────────────────────────────────────────────────────┘
```

### **Posiciones:**
- **Logo 1**: 15 unidades desde la izquierda
- **Logo 2**: 15 unidades desde la derecha
- **Ambos**: Centrados verticalmente en el header

## 🔧 Características Técnicas

### **Cálculo Automático de Proporciones**

El sistema calcula automáticamente el tamaño para mantener la proporción:

```javascript
// Si el logo es horizontal (más ancho que alto)
width = 30 unidades
height = 30 / ratio

// Si el logo es vertical (más alto que ancho)
height = 25 unidades
width = 25 * ratio
```

### **Ejemplo con Diferentes Proporciones:**

| Proporción Original | Tamaño en PDF |
|---------------------|---------------|
| 500x500 (1:1) | 25x25 |
| 600x400 (3:2) | 30x20 |
| 400x600 (2:3) | 16.7x25 |
| 800x200 (4:1) | 30x7.5 |

## 🧪 Probar el Segundo Logo

### **Opción 1: Con Logo Real**
1. Coloca tu imagen en `public/imagenes/logo-secundario.png`
2. Recarga la aplicación (Ctrl+R)
3. Genera un reporte PDF
4. ✅ Verás ambos logos

### **Opción 2: Sin Logo (Temporal)**
- Si no colocas el archivo, el sistema continúa normalmente
- Solo se mostrará el logo principal
- No hay errores ni warnings

## 📊 Nombres de Archivo Aceptados

El sistema busca específicamente:
```
logo-secundario.png
```

**Si quieres usar otro nombre**, edita en `pdfService.js`:
```javascript
// Línea ~55 y ~343
const logo2Path = window.location.origin + '/imagenes/TU-NOMBRE-AQUI.png';
```

## ✨ Ventajas del Sistema

1. **Automático** - Solo coloca el archivo y funciona
2. **Proporcional** - Nunca se deforma
3. **Opcional** - Funciona con o sin el segundo logo
4. **Silencioso** - No muestra errores si falta el logo
5. **Rápido** - Timeout de 1 segundo para no retrasar

## 🎯 Recomendaciones de Diseño

### **Para Mejor Resultado:**

1. **Usa PNG** con fondo transparente
2. **Colores** que contrasten con el header azul
3. **Tamaño** cuadrado o ligeramente horizontal
4. **Calidad** alta pero peso bajo (<200KB)
5. **Simplificado** - Logos simples se ven mejor en PDF

### **Ejemplos de Buenos Logos:**
- ✅ Logo institucional
- ✅ Escudo universitario
- ✅ Logo de acreditación
- ✅ Sello oficial

### **Evitar:**
- ❌ Logos muy detallados
- ❌ Texto muy pequeño
- ❌ Colores muy claros (no se verán en header azul)
- ❌ Imágenes muy pesadas

## 🔍 Verificar que Funciona

### **Consola del Navegador (F12):**

**Con logo secundario:**
```
(No debería mostrar ningún mensaje)
```

**Sin logo secundario:**
```
(Tampoco muestra mensaje - es silencioso)
```

**Si hay error al cargar:**
```
Logo secundario no disponible
```

## 📝 Ejemplo de Uso

### **Caso 1: Universidad**
- Logo 1: Logo de la universidad
- Logo 2: Escudo de la facultad

### **Caso 2: Colegio**
- Logo 1: Logo del colegio
- Logo 2: Logo del ministerio de educación

### **Caso 3: Instituto**
- Logo 1: Logo del instituto
- Logo 2: Sello de acreditación

## 🚀 Próximos Pasos

1. **Consigue tu segundo logo** en formato PNG
2. **Guárdalo** como `logo-secundario.png`
3. **Colócalo** en `public/imagenes/`
4. **Recarga** la aplicación
5. **Genera** un reporte PDF
6. **¡Disfruta** de tus reportes con ambos logos!

---

**Estado**: ✅ Listo para Agregar Logo
**Archivo a Crear**: `public/imagenes/logo-secundario.png`
**Formato**: PNG (recomendado)
**Tamaño**: 500x500px (recomendado)
**Peso**: <200KB (recomendado)
