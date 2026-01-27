# 📄 Crear las Páginas Faltantes

Tu sidebar está completo, pero algunas rutas no tienen páginas aún. Aquí te muestro cómo crearlas.

## Páginas Faltantes

1. ✅ `/dashboard/ventas` - ✨ **Ya existe**
2. ✅ `/dashboard/productos` - ✨ **Ya existe**
3. ❌ `/dashboard/clientes` - **Falta crear**
4. ❌ `/dashboard/presupuestos` - **Falta crear**
5. ❌ `/dashboard/configuracion` - **Falta crear**

---

## 📁 Crear: Página de Clientes

### Archivo: `src/app/dashboard/clientes/page.tsx`

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Search } from "lucide-react"

export default function ClientesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <p className="text-gray-600 mt-2">Gestiona tu base de clientes</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay clientes registrados aún.</p>
                        <p className="text-sm mt-1">Haz clic en "Nuevo Cliente" para crear uno.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
```

---

## 📄 Crear: Página de Presupuestos

### Archivo: `src/app/dashboard/presupuestos/page.tsx`

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Search } from "lucide-react"

export default function PresupuestosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
                <p className="text-gray-600 mt-2">Crea y gestiona presupuestos para tus clientes</p>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar presupuesto..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Presupuesto
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Tarjetas de presupuestos iría aquí */}
            </div>

            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-gray-900">Historial de Presupuestos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay presupuestos registrados aún.</p>
                        <p className="text-sm mt-1">Haz clic en "Nuevo Presupuesto" para crear uno.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
```

---

## ⚙️ Crear: Página de Configuración

### Archivo: `src/app/dashboard/configuracion/page.tsx`

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Save, Bell, Lock, Palette } from "lucide-react"

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-600 mt-2">Personaliza tu cuenta y la aplicación</p>
            </div>

            {/* Configuración General */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Settings className="h-5 w-5 text-blue-600" />
                        Configuración General
                    </CardTitle>
                    <CardDescription>Ajusta la configuración básica de tu ferretería</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Nombre del Negocio
                        </label>
                        <input
                            type="text"
                            placeholder="Ferretería..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="info@ferreteria.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                    </Button>
                </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Bell className="h-5 w-5 text-blue-600" />
                        Notificaciones
                    </CardTitle>
                    <CardDescription>Controla cómo recibes notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">
                            Notificaciones por correo
                        </label>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-900">
                            Alertas de stock bajo
                        </label>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                </CardContent>
            </Card>

            {/* Seguridad */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Lock className="h-5 w-5 text-blue-600" />
                        Seguridad
                    </CardTitle>
                    <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="bg-gray-200 hover:bg-gray-300 text-gray-900">
                        Cambiar Contraseña
                    </Button>
                </CardContent>
            </Card>

            {/* Apariencia */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Palette className="h-5 w-5 text-blue-600" />
                        Apariencia
                    </CardTitle>
                    <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Tema
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <option>Claro (Predeterminado)</option>
                            <option>Oscuro</option>
                            <option>Automático</option>
                        </select>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
```

---

## 🗂️ Estructura de Carpetas Después

```
src/app/dashboard/
├── layout.tsx              ✅ Existente
├── page.tsx                ✅ Actualizado
├── ventas/
│   ├── layout.tsx          ✅ Existente
│   ├── page.tsx            ✅ Existente
│   ├── ventas-client.tsx   ✅ Existente
│   └── scan-wrapper.tsx    ✅ Existente
├── productos/
│   └── page.tsx            ✅ Existente
├── clientes/               📁 NUEVO
│   └── page.tsx            📝 CREAR
├── presupuestos/           📁 NUEVO
│   └── page.tsx            📝 CREAR
└── configuracion/          📁 NUEVO
    └── page.tsx            📝 CREAR
```

---

## 🚀 Instrucciones para Crear

### Opción 1: Crear carpetas manualmente en VS Code

1. Haz clic derecho en `src/app/dashboard/`
2. Selecciona "Nueva carpeta"
3. Escribe: `clientes`
4. Repite para `presupuestos` y `configuracion`
5. En cada carpeta, crea un archivo `page.tsx`
6. Copia el código de arriba

### Opción 2: Usar terminal

```bash
# En la raíz del proyecto
mkdir -p src/app/dashboard/clientes
mkdir -p src/app/dashboard/presupuestos
mkdir -p src/app/dashboard/configuracion

# Crear archivos page.tsx
touch src/app/dashboard/clientes/page.tsx
touch src/app/dashboard/presupuestos/page.tsx
touch src/app/dashboard/configuracion/page.tsx
```

Luego copia el código de las secciones de arriba en cada archivo.

---

## ✅ Verificación

Después de crear los archivos:

1. ✅ Compila el proyecto: `npm run build`
2. ✅ Inicia el dev server: `npm run dev`
3. ✅ Navega a cada ruta:
   - http://localhost:3000/dashboard/clientes
   - http://localhost:3000/dashboard/presupuestos
   - http://localhost:3000/dashboard/configuracion
4. ✅ Verifica que el sidebar muestra los items activos

---

## 💡 Próximos Pasos

Una vez creadas las páginas:

1. **Clientes:**
   - Conectar con Prisma (tabla `Client`)
   - Implementar CRUD (Create, Read, Update, Delete)
   - Añadir formulario de nuevo cliente

2. **Presupuestos:**
   - Conectar con Prisma (tabla `Quote`)
   - Implementar generación de PDF
   - Historial de presupuestos

3. **Configuración:**
   - Conectar con base de datos
   - Guardar preferencias del usuario
   - Integrar autenticación

---

**¡Ahora tu sidebar está completamente funcional! 🎉**
