# ⚡ Referencia Rápida - Sidebar

## 🚀 Inicio Rápido

```bash
# Iniciar servidor
npm run dev

# Compilar
npm run build

# URL del dashboard
http://localhost:3000/dashboard
```

---

## 📋 Items del Sidebar

| Nombre | Ruta | Icono | Estado |
|--------|------|-------|--------|
| 🛒 Nueva venta | `/dashboard/ventas` | ShoppingCart | ✅ Existe |
| 📦 Productos | `/dashboard/productos` | Package | ✅ Existe |
| 👥 Clientes | `/dashboard/clientes` | Users | ❌ Crear |
| 📄 Presupuestos | `/dashboard/presupuestos` | FileText | ❌ Crear |
| ⚙️ Configuración | `/dashboard/configuracion` | Settings | ❌ Crear |

---

## 🎨 Colores

```
Primario:   #0066CC (blue-600)
Fondo:      #FFFFFF (white)
Hover:      #F9FAFB (gray-50)
Activo:     #EFF6FF (blue-50)
Texto:      #111827 (gray-900)
```

---

## 📁 Archivos Clave

```
Componentes:
├── src/components/layout/sidebar.tsx           ← NUEVO
└── src/components/layout/dashboard-layout.tsx  ← ACTUALIZADO

Páginas:
├── src/app/dashboard/page.tsx                  ← ACTUALIZADO
├── src/app/dashboard/ventas/                   ✅
├── src/app/dashboard/productos/                ✅
├── src/app/dashboard/clientes/                 ❌ CREAR
├── src/app/dashboard/presupuestos/             ❌ CREAR
└── src/app/dashboard/configuracion/            ❌ CREAR

Documentación:
├── PROYECTO_COMPLETADO.md     ← LEER PRIMERO
├── CAMBIOS_REALIZADOS.md
├── SIDEBAR_DOCS.md
├── SIDEBAR_PREVIEW.md
├── VISUAL_SIDEBAR.md
└── CREAR_PAGINAS_FALTANTES.md
```

---

## 💻 Usar el Sidebar

### En Desktop
1. Sidebar visible a la izquierda
2. Click en items para navegar
3. Click en `<` o `>` para colapsar

### En Móvil
1. Click en hamburguesa `≡`
2. Se abre menú lateral
3. Click en item cierra automáticamente

---

## 🔧 Personalizar

### Cambiar color primario
**Archivo:** `src/components/layout/sidebar.tsx`

Reemplaza:
- `bg-blue-600` → `bg-[tu-color]-600`
- `text-blue-600` → `text-[tu-color]-600`
- `bg-blue-50` → `bg-[tu-color]-50`

### Cambiar logo
**Línea ~55 de sidebar.tsx:**
```tsx
<div className="...">
    <span className="...">F</span>  ← Cambiar esto
</div>
```

### Agregar items
**Línea ~27 de sidebar.tsx:**
```tsx
const sidebarItems: SidebarItem[] = [
    // ... items existentes
    { name: "Nuevo", href: "/dashboard/nuevo", icon: IconoNuevo },
]
```

---

## ✨ Características

- ✅ Responsive (Mobile, Tablet, Desktop)
- ✅ Colapsable en desktop
- ✅ Indicador de página activa
- ✅ Menú hamburguesa en móvil
- ✅ Transiciones suaves
- ✅ Sin dependencias nuevas

---

## 📱 Breakpoints

```
Mobile:    < 768px   (md)
Tablet:    768px     (md)
Desktop:   ≥ 768px   (md)
```

Sidebar aparece en **md y mayor** (≥768px)

---

## 🎯 Estados Visuales

### Inactivo
```
Color: gray-600
Fondo: transparent
Hover: gray-50
```

### Activo
```
Color: blue-600
Fondo: blue-50
```

---

## 🚨 Si Algo No Funciona

### El sidebar no aparece
- Verifica que estés en `/dashboard`
- Abre DevTools (F12)
- Revisa la consola de errores

### Colores incorrectos
- Regenera CSS: `npm run dev`
- Limpia caché: `Ctrl+Shift+R`

### Menú móvil no abre
- Verifica que estés en pantalla < 768px
- Presiona F12 → Toggle device toolbar

### Errores de compilación
- Revisa: `npm run build`
- Verifica imports en los archivos

---

## 📞 Contacto

**Documentación completa en:**
- `PROYECTO_COMPLETADO.md` ← Leer primero
- `CAMBIOS_REALIZADOS.md` ← Detalles técnicos
- `SIDEBAR_DOCS.md` ← API del componente
- `CREAR_PAGINAS_FALTANTES.md` ← Próximos pasos

---

## 🎓 Conceptos Usados

- React Hooks (useState, usePathname)
- Next.js App Router
- Tailwind CSS
- TypeScript
- Component composition
- Responsive design
- Conditional rendering

---

## 📊 Tamaños

```
Sidebar expandido:  256px (w-64)
Sidebar colapsado:  80px  (w-20)
Header:             64px  (h-16)
Iconos:             20px  (h-5 w-5)
Padding items:      12px  (py-3 px-4)
```

---

## 🎉 ¡LISTO!

Tu sidebar está completamente funcional y listo para usar.

**Próximo paso:** Crea las 3 páginas faltantes.

Ver: `CREAR_PAGINAS_FALTANTES.md`
