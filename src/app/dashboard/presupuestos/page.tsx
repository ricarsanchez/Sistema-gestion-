'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Search, Calendar, DollarSign, User } from "lucide-react"
import { useState } from "react"

export default function PresupuestosPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Datos de ejemplo
    const presupuestos = [
        { id: 1, cliente: "Juan Pérez", monto: 1250.50, fecha: "2026-01-25", estado: "pendiente" },
        { id: 2, cliente: "María García", monto: 3500.00, fecha: "2026-01-20", estado: "aprobado" },
        { id: 3, cliente: "Carlos López", monto: 890.75, fecha: "2026-01-15", estado: "rechazado" },
    ]

    const filteredPresupuestos = presupuestos.filter(pres =>
        pres.cliente.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "aprobado":
                return "bg-green-100 text-green-800"
            case "pendiente":
                return "bg-yellow-100 text-yellow-800"
            case "rechazado":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "aprobado":
                return "✓ Aprobado"
            case "pendiente":
                return "⏳ Pendiente"
            case "rechazado":
                return "✗ Rechazado"
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Presupuestos</h1>
                </div>
                <p className="text-blue-100 mt-2">Crea, gestiona y realiza seguimiento de presupuestos para tus clientes</p>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar presupuesto por cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Presupuesto
                </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Presupuestos</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Monto Total</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">$28.5K</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pendientes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Listado de presupuestos */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-900">Historial de Presupuestos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {filteredPresupuestos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Monto</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPresupuestos.map((pres) => (
                                        <tr key={pres.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-900">#{pres.id}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{pres.cliente}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-gray-900">${pres.monto.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{pres.fecha}</td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pres.estado)}`}>
                                                    {getStatusLabel(pres.estado)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                                                    Ver
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay presupuestos que coincidan con tu búsqueda.</p>
                            <p className="text-sm mt-1">Haz clic en "Nuevo Presupuesto" para crear uno.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
