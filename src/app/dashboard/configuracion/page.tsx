'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Save, Bell, Lock, Palette, Globe, Shield, Moon } from "lucide-react"
import { useState } from "react"

export default function ConfiguracionPage() {
    const [settings, setSettings] = useState({
        businessName: "Mi Ferretería",
        email: "info@ferreteria.com",
        phone: "555-123-4567",
        emailNotifications: true,
        stockAlerts: true,
        theme: "light"
    })

    const handleChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value })
    }

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
                <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Configuración</h1>
                </div>
                <p className="text-blue-100 mt-2">Personaliza tu cuenta y las preferencias de la aplicación</p>
            </div>

            {/* Configuración General */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-gray-900">Configuración General</CardTitle>
                            <CardDescription>Información básica de tu ferretería</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Nombre del Negocio
                        </label>
                        <input
                            type="text"
                            value={settings.businessName}
                            onChange={(e) => handleChange("businessName", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Este nombre aparecerá en el dashboard</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={settings.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Usaremos esto para contactos importantes</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={settings.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
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
                <CardHeader className="border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-gray-900">Notificaciones</CardTitle>
                            <CardDescription>Controla cómo y cuándo recibes notificaciones</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <div>
                            <p className="font-semibold text-gray-900">Notificaciones por Correo</p>
                            <p className="text-sm text-gray-600 mt-1">Recibe alertas importantes por email</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                            className="w-5 h-5 text-blue-600 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <div>
                            <p className="font-semibold text-gray-900">Alertas de Stock Bajo</p>
                            <p className="text-sm text-gray-600 mt-1">Se alerta cuando el stock sea menor a 10 unidades</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.stockAlerts}
                            onChange={(e) => handleChange("stockAlerts", e.target.checked)}
                            className="w-5 h-5 text-blue-600 cursor-pointer"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Apariencia */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-gray-900">Apariencia</CardTitle>
                            <CardDescription>Personaliza cómo se ve la aplicación</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Tema de Color
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleChange("theme", "light")}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    settings.theme === "light"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="text-center">
                                    <Moon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                    <p className="text-sm font-semibold text-gray-900">Claro</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleChange("theme", "dark")}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    settings.theme === "dark"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="text-center">
                                    <Moon className="h-6 w-6 mx-auto mb-2 text-gray-600 rotate-45" />
                                    <p className="text-sm font-semibold text-gray-900">Oscuro</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleChange("theme", "auto")}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    settings.theme === "auto"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="text-center">
                                    <Globe className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                                    <p className="text-sm font-semibold text-gray-900">Automático</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Seguridad */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                            <CardTitle className="text-gray-900">Seguridad</CardTitle>
                            <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Cambiar Contraseña</p>
                                <p className="text-sm text-gray-600 mt-1">Actualiza tu contraseña regularmente para mayor seguridad</p>
                            </div>
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                <Lock className="h-4 w-4 mr-2" />
                                Cambiar
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">Autenticación de Dos Factores</p>
                                <p className="text-sm text-gray-600 mt-1">Añade una capa extra de seguridad a tu cuenta</p>
                            </div>
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                Activar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Peligro */}
            <Card className="border-0 shadow-sm border-red-200 bg-red-50">
                <CardHeader className="border-b border-red-200">
                    <CardTitle className="text-red-900">Zona de Peligro</CardTitle>
                    <CardDescription className="text-red-700">Acciones irreversibles</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                        Eliminar Cuenta
                    </Button>
                    <p className="text-xs text-red-700 mt-2">Una vez eliminada, tu cuenta no podrá recuperarse.</p>
                </CardContent>
            </Card>
        </div>
    )
}
