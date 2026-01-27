# 📌 Sidebar Profesional - Documentación

## ✨ Características

Se ha implementado un **sidebar profesional** con el estilo de CobrandoApp para tu aplicación de ferretería. Este menú lateral es visible en todas las páginas del dashboard y proporciona una navegación intuitiva.

### Características Principales:

- ✅ **Fondo blanco y limpio** - Diseño minimalista y profesional
- ✅ **Iconos azules** - Colores consistentes con la marca
- ✅ **Colapsable en móviles** - Se oculta automáticamente en dispositivos pequeños
- ✅ **Modo expandido/colapsado** - Botón para minimizar el sidebar en desktop
- ✅ **Navegación activa** - Destaca la página actual
- ✅ **Responsive** - Funciona perfectamente en todos los tamaños de pantalla

## 📋 Opciones del Menú

El sidebar incluye los siguientes botones:

1. **Nueva venta** → `/dashboard/ventas`
   - Icono: ShoppingCart (carrito de compras)
   - Para gestionar y crear nuevas ventas

2. **Productos** → `/dashboard/productos`
   - Icono: Package (paquete)
   - Gestión del inventario

3. **Clientes** → `/dashboard/clientes`
   - Icono: Users (usuarios)
   - Administración de clientes

4. **Presupuestos** → `/dashboard/presupuestos`
   - Icono: FileText (documento)
   - Gestión de presupuestos y cotizaciones

5. **Configuración** → `/dashboard/configuracion`
   - Icono: Settings (engranaje)
   - Configuración de la aplicación

## 🎨 Estilos Aplicados

### Colores:
- **Fondo**: Blanco (`bg-white`)
- **Iconos activos**: Azul 600 (`text-blue-600`)
- **Iconos inactivos**: Gris 400 (`text-gray-400`)
- **Hover**: Gris claro (`hover:bg-gray-50`)
- **Fondo activo**: Azul 50 (`bg-blue-50`)

### Componentes:
- Sidebar en desktop (md breakpoint): Visible por defecto
- Sidebar en móvil: Menú hamburguesa en la cabecera
- Animaciones suaves con transiciones CSS

## 📱 Comportamiento Responsivo

### Desktop (md y mayor):
- Sidebar siempre visible a la izquierda
- Ancho de 256px (w-64) cuando expandido
- Ancho de 80px (w-20) cuando colapsado
- Botón de toggle en la esquina superior derecha del sidebar

### Móvil (menor a md):
- Sidebar oculto por defecto
- Menú hamburguesa en la cabecera
- Se abre como Sheet (modal deslizable) al hacer clic

## 🔧 Uso en Componentes

### Importar el Sidebar:

```tsx
import Sidebar from "@/components/layout/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col md:ml-64">
        {/* Contenido aquí */}
      </div>
    </div>
  )
}
```

### Estructura del Componente Sidebar:

El componente `Sidebar` está ubicado en:
```
src/components/layout/sidebar.tsx
```

Proporciona:
- `SidebarItem` - Interfaz para los items del menú
- Elementos interactivos con iconos de lucide-react
- Gestión de estado (expandido/colapsado)

## 📂 Archivos Modificados

1. **`src/components/layout/sidebar.tsx`** (NUEVO)
   - Componente principal del sidebar

2. **`src/components/layout/dashboard-layout.tsx`** (ACTUALIZADO)
   - Integración del sidebar
   - Mejora del header responsivo
   - Menú móvil mejorado

3. **`src/app/dashboard/page.tsx`** (ACTUALIZADO)
   - Diseño mejorado de la página de inicio
   - Tarjetas con iconos coloreados
   - Información de accesos rápidos

## 🚀 Siguientes Pasos

Para completar tu dashboard, asegúrate de:

1. ✅ Crear las páginas que faltan:
   - `/dashboard/clientes`
   - `/dashboard/presupuestos`
   - `/dashboard/configuracion`

2. ✅ Personalizar los estilos según tu marca

3. ✅ Agregar funcionalidad a cada sección

## 💡 Tips de Personalización

### Cambiar colores:
Edita `sidebar.tsx` y reemplaza `blue-600`, `blue-50`, etc. con tus colores preferidos.

### Agregar más items:
```tsx
const sidebarItems: SidebarItem[] = [
  // ... items existentes
  { name: "Mi nuevo item", href: "/dashboard/new-page", icon: StarIcon },
]
```

### Personalizar el logo:
Modifica el logo en la sección "Logo Section" del sidebar.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias de mejora, puedes:
- Revisar el código en `src/components/layout/sidebar.tsx`
- Ajustar las clases de Tailwind según sea necesario
- Verificar que los iconos de lucide-react estén correctamente importados
