# 🎨 Cómo Cambiar el Logo de Tauri

## Problema Actual
El logo que aparece en la barra de tareas es el ícono por defecto de Tauri, no el logo de GradePro.

## Solución

### Opción 1: Usar tu Logo Actual (Recomendado)

1. **Convierte tu logo a los formatos necesarios:**
   - Necesitas crear íconos en varios tamaños
   - Usa una herramienta online como: https://icon.kitchen/ o https://www.favicon-generator.org/

2. **Formatos necesarios:**
   - `icon.ico` (Windows) - 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
   - `icon.icns` (macOS) - Varios tamaños
   - `icon.png` - 512x512 o 1024x1024
   - `32x32.png`, `128x128.png`, `128x128@2x.png`

3. **Reemplaza los archivos en:**
   ```
   src-tauri/icons/
   ```

4. **Rebuild la aplicación:**
   ```bash
   npm run tauri:build
   ```

### Opción 2: Usar el Logo Actual del Proyecto

Tu logo está en: `public/imagenes/logo-principal.png`

**Pasos:**

1. **Instala una herramienta para convertir imágenes:**
   ```bash
   npm install -g @tauri-apps/cli
   ```

2. **Genera los íconos automáticamente:**
   ```bash
   # Desde la raíz del proyecto
   npx @tauri-apps/cli icon public/imagenes/logo-principal.png
   ```

   Esto generará automáticamente todos los tamaños necesarios en `src-tauri/icons/`

3. **Rebuild:**
   ```bash
   npm run tauri:build
   ```

### Opción 3: Manual (Más Control)

1. **Abre tu logo en un editor de imágenes** (Photoshop, GIMP, Photopea, etc.)

2. **Exporta en estos tamaños:**
   - 1024x1024 → `icon.png`
   - 256x256 → Para el `.ico`
   - 512x512 → Para el `.icns`

3. **Convierte a .ico (Windows):**
   - Usa: https://convertio.co/png-ico/
   - Sube tu imagen de 256x256
   - Descarga como `icon.ico`

4. **Convierte a .icns (macOS):**
   - Usa: https://cloudconvert.com/png-to-icns
   - Sube tu imagen de 512x512
   - Descarga como `icon.icns`

5. **Copia los archivos a:**
   ```
   src-tauri/icons/icon.ico
   src-tauri/icons/icon.icns
   src-tauri/icons/icon.png
   src-tauri/icons/32x32.png
   src-tauri/icons/128x128.png
   src-tauri/icons/128x128@2x.png
   ```

6. **Rebuild:**
   ```bash
   npm run tauri:build
   ```

## ⚠️ Importante

- En **modo desarrollo** (`npm run tauri:dev`), el ícono puede no cambiar inmediatamente
- El ícono correcto se verá en la **versión compilada** (`npm run tauri:build`)
- Para ver el cambio en desarrollo, cierra completamente la app y vuelve a ejecutar `npm run tauri:dev`

## 🎯 Cambios Ya Aplicados

✅ **Nombre del producto**: Cambiado de "Grade Manager" a "GradePro"
✅ **Título de ventana**: "GradePro - Sistema de Gestión Académica"
✅ **Identifier**: Cambiado a "com.gradeapp.pro"

Solo falta cambiar los archivos de íconos físicamente.

## 🚀 Recomendación Rápida

La forma más rápida es usar el comando de Tauri:

```bash
# Asegúrate de que tu logo sea cuadrado y de buena calidad (mínimo 512x512)
npx @tauri-apps/cli icon public/imagenes/logo-principal.png
```

Luego rebuild:
```bash
npm run tauri:build
```

---

**¿Quieres que genere los íconos automáticamente con tu logo actual?**
