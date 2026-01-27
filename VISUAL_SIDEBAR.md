# 🎨 Visual del Sidebar Profesional - Cobrando Style

## Screenshot ASCII Art

### Vista Desktop - Sidebar Expandido

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ≡ Menu                                                  Ferretería Demo    ⭘ │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌──────────────────┐                                                        │
│ │  [F] Ferretería  │  ╔════════════════════════════════════════════════╗   │
│ ├──────────────────┤  ║                                                ║   │
│ │                  │  ║  Bienvenido al Dashboard                      ║   │
│ │ 🛒 Nueva venta   │  ║  Gestiona tu ferretería desde un único lugar  ║   │
│ │                  │  ║                                                ║   │
│ │ 📦 Productos     │  ╠════════════════════════════════════════════════╣   │
│ │                  │  ║                                                ║   │
│ │ 👥 Clientes      │  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐      ║   │
│ │                  │  ║  │ [👥] 12  │ │ [⚠️]  5  │ │ [📄]  8  │      ║   │
│ │ 📄 Presupuestos  │  ║  │ Clientes │ │   Stock  │ │Presupues │      ║   │
│ │                  │  ║  └──────────┘ └──────────┘ └──────────┘      ║   │
│ │ ⚙️ Configuración │  ║                                                ║   │
│ │                  │  ║  Accesos Rápidos                              ║   │
│ │ [<] Colapsar     │  ║  Usa el menú lateral para acceder a las      ║   │
│ │                  │  ║  diferentes secciones.                        ║   │
│ ├──────────────────┤  ║                                                ║   │
│ │  © 2026          │  ╚════════════════════════════════════════════════╝   │
│ │  Ferretería      │                                                       │
│ └──────────────────┘                                                       │
└──────────────────────────────────────────────────────────────────────────────┘

COLORES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sidebar:      Blanco (#FFFFFF)
Header:       Blanco (#FFFFFF)
Fondo:        Gris claro (#F3F4F6)
Iconos:       Azul (#0066CC)
Texto:        Gris oscuro (#111827)
Activo:       Azul claro (#EFF6FF) + Azul (#0066CC)
Hover:        Gris claro (#F9FAFB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Vista Desktop - Sidebar Colapsado

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ≡ Menu                                                  Ferretería Demo    ⭘ │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌────┐  ╔════════════════════════════════════════════════════════════════╗  │
│ │ F  │  ║                                                                ║  │
│ ├────┤  ║  Bienvenido al Dashboard                                      ║  │
│ │ 🛒  │  ║  Gestiona tu ferretería desde un único lugar                 ║  │
│ │    │  ║                                                                ║  │
│ │ 📦  │  ║  ┌──────────┐ ┌──────────┐ ┌──────────┐                      ║  │
│ │    │  ║  │ [👥] 12  │ │ [⚠️]  5  │ │ [📄]  8  │                      ║  │
│ │ 👥  │  ║  │ Clientes │ │   Stock  │ │Presupues │                      ║  │
│ │    │  ║  └──────────┘ └──────────┘ └──────────┘                      ║  │
│ │ 📄  │  ║                                                                ║  │
│ │    │  ║  Accesos Rápidos                                              ║  │
│ │ ⚙️   │  ║  Usa el menú lateral para acceder a las                     ║  │
│ │    │  ║  diferentes secciones.                                        ║  │
│ │ [>] │  ║                                                                ║  │
│ │    │  ╚════════════════════════════════════════════════════════════════╝  │
│ └────┘                                                                       │
└──────────────────────────────────────────────────────────────────────────────┘

ANCHO:
• Expandido: 256px (w-64)
• Colapsado: 80px (w-20)
```

### Vista Mobile

```
┌──────────────────────────────┐
│ ≡  Ferretería    | User      │
├──────────────────────────────┤
│                              │
│  Bienvenido al Dashboard     │
│  Gestiona tu ferretería...   │
│                              │
│  ┌──────────────────────────┐│
│  │ 👥 Total Clientes     12 ││
│  │ ⚠️ Productos bajo stock 5 ││
│  │ 📄 Presupuestos mes     8 ││
│  └──────────────────────────┘│
│                              │
│ (Menú móvil oculto)          │
│                              │
└──────────────────────────────┘

AL HACER CLIC EN ≡:

┌─────────────────┬──────────────┐
│  [F] Ferretería │              │
├─────────────────┤              │
│                 │              │
│ 🛒 Nueva venta  │  Contenido   │
│ 📦 Productos    │  del         │
│ 👥 Clientes     │  Dashboard   │
│ 📄 Presupuestos │              │
│ ⚙️ Configuración │              │
│                 │              │
└─────────────────┴──────────────┘
```

---

## 🎯 Estados Visuales

### 1. Estado Normal (Inactivo)

```
┌─────────────────────────┐
│ 🛒  Nueva venta         │   Color: Gray-600
│                         │   Icon: Gray-400
└─────────────────────────┘   Hover: Gray-50
```

### 2. Estado Activo (Página Actual)

```
┌─────────────────────────┐
│ 🛒  Nueva venta         │   Color: Blue-600
│                         │   Background: Blue-50
└─────────────────────────┘   Icon: Blue-600
```

### 3. Estado Hover

```
┌─────────────────────────┐
│ 📦  Productos           │   Color: Gray-900
│                         │   Background: Gray-50
└─────────────────────────┘   Transición suave
```

---

## 🔤 Tipografía

```
TÍTULO DE PÁGINA
Tamaño: 30px (text-3xl)
Peso: Bold (font-bold)
Color: Gray-900

Subtítulo
Tamaño: 14px
Peso: Normal
Color: Gray-600

ITEM DEL SIDEBAR
Tamaño: 14px (text-sm)
Peso: Medium (font-medium)
Color: Gray-600 (inactivo) / Blue-600 (activo)

FOOTER SIDEBAR
Tamaño: 12px (text-xs)
Peso: Normal
Color: Gray-500
```

---

## 🎨 Paleta Tailwind Completa

| Elemento | Color Tailwind | Hex |
|----------|----------------|-----|
| Fondo Sidebar | white | #FFFFFF |
| Fondo App | gray-50 | #F9FAFB |
| Borde | gray-200 | #E5E7EB |
| Icono Inactivo | gray-400 | #9CA3AF |
| Texto Gris | gray-600 | #4B5563 |
| Texto Oscuro | gray-900 | #111827 |
| Primario Activo | blue-600 | #2563EB |
| Fondo Activo | blue-50 | #EFF6FF |
| Hover Fondo | gray-50 | #F9FAFB |

---

## 📊 Dimensiones CSS

```css
/* SIDEBAR */
width:    260px (w-64) expandido, 80px (w-20) colapsado
height:   100vh (full height)
position: fixed left-0 top-0
z-index:  z-40 (debajo del header)

/* HEADER */
height:   64px (h-16)
width:    100%
position: sticky top-0
z-index:  z-30

/* ITEMS */
padding:  12px 16px (py-3 px-4)
gap:      12px (gap-3)
icons:    20px (h-5 w-5)

/* MAIN CONTENT */
margin-left: 256px (md:ml-64)
padding:     24px (p-6)
```

---

## ✨ Animaciones

```css
/* Sidebar Expand/Collapse */
transition: all 300ms ease-in-out
duration:   300ms

/* Item Hover */
transition: colors
duration:   instant (on hover)

/* Card Hover */
transition: shadow
duration:   300ms
```

---

## 🎯 Breakpoints Responsivos

```
XS:  0px                - Mobile phones
SM:  640px              - Landscape phones
MD:  768px (BREAKPOINT) - Tablets
LG:  1024px             - Desktops
XL:  1280px             - Wide desktops
2XL: 1536px             - Very wide screens
```

**Tu sidebar aparece en: MD y mayor (≥768px)**

---

## 📱 Responsive Grid

```
Mobile (<640px):
Grid: 1 columna
Sidebar: Oculto (en Sheet)
Header: Full width

Tablet (640px - 768px):
Grid: 2 columnas (md:grid-cols-2)
Sidebar: Visible
Header: Con margin

Desktop (768px+):
Grid: 3 columnas (lg:grid-cols-3)
Sidebar: Visible expandido
Header: Full con sidebar

Ultra-Wide (1536px+):
Grid: 4 columnas
Sidebar: Expandido
Contenido: Máximo ancho
```

---

## 🔗 Estructura HTML Simplificada

```html
<div class="flex">
  <!-- SIDEBAR DESKTOP -->
  <aside class="hidden md:flex w-64 bg-white border-r">
    <!-- Logo -->
    <!-- Nav Items -->
    <!-- Footer -->
  </aside>

  <!-- MAIN CONTENT AREA -->
  <div class="flex flex-col md:ml-64 w-full">
    
    <!-- HEADER -->
    <header class="sticky top-0 h-16 bg-white border-b">
      <!-- Hamburger (mobile) -->
      <!-- Title -->
      <!-- User Menu -->
    </header>

    <!-- MOBILE MENU SHEET -->
    <Sheet>
      <!-- Mobile Sidebar Contents -->
    </Sheet>

    <!-- MAIN -->
    <main class="flex-1 p-6">
      <!-- Page Content -->
    </main>
  </div>
</div>
```

---

## 🎉 Resultado Visual Final

Tu dashboard ahora se ve como una aplicación **profesional y moderna**, con:

✅ **Sidebar limpio y funcional**
✅ **Colores corporativos (azul y blanco)**
✅ **Navegación intuitiva**
✅ **Responsive en todos los dispositivos**
✅ **Animaciones suaves**
✅ **Estilo similar a CobrandoApp**

**¡Listo para mostrar! 🚀**
