'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Search, Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function ClientesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    // Datos de ejemplo
    const clientes = [
        { id: 1, nombre: "Juan Pérez", email: "juan@example.com", telefono: "555-0101", ciudad: "Madrid" },
        { id: 2, nombre: "María García", email: "maria@example.com", telefono: "555-0102", ciudad: "Barcelona" },
    ]

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
                <div className="flex items-center gap-3">
                    <Users className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Clientes</h1>
                </div>
                <p className="text-blue-100 mt-2">Gestiona tu base de clientes y sus datos de contacto</p>
            </div>

            {/* Barra de búsqueda y botón */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cliente
                </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Clientes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Activos Este Mes</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Contacto Pendiente</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Users className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de clientes */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {filteredClientes.length > 0 ? (
                        <div className="space-y-4">
                            {filteredClientes.map((cliente) => (
                                <div key={cliente.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{cliente.nombre}</h3>
                                            <div className="flex flex-col gap-2 mt-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                    {cliente.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-blue-600" />
                                                    {cliente.telefono}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-blue-600" />
                                                    {cliente.ciudad}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="text-blue-600 border-blue-200">
                                            Editar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay clientes que coincidan con tu búsqueda.</p>
                            <p className="text-sm mt-1">Intenta con otro nombre o crea un nuevo cliente.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
