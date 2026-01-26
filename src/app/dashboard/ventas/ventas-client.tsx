"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarcodeScanner } from "@/components/products/barcode-scanner"
import { createQuote, getProducts, getClients, createClient } from "@/lib/actions"
import { toast } from "sonner"
import { Trash2, ShoppingCart, FileText, Loader2, Plus, X, Download, Mail } from "lucide-react"

interface Product {
    id: string
    name: string
    price: number
    barcode: string | null
}

interface Client {
    id: string
    name: string
    phone: string
}

interface CartItem extends Product {
    quantity: number
}

interface QuoteData {
    id: string
    code: string
    clientName: string
    total: number
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
}

export function VentasClient() {
    const [query, setQuery] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [clients, setClients] = useState<Client[]>([])
    const [selectedClientId, setSelectedClientId] = useState<string>("")
    const [showClientForm, setShowClientForm] = useState(false)
    const [newClientName, setNewClientName] = useState("")
    const [newClientPhone, setNewClientPhone] = useState("")
    const [clientsLoading, setClientsLoading] = useState(false)
    const [comments, setComments] = useState("")
    const [vendorName, setVendorName] = useState("Vendedor Principal")
    const [showQuoteModal, setShowQuoteModal] = useState(false)
    const [generatedQuote, setGeneratedQuote] = useState<QuoteData | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        setClientsLoading(true)
        try {
            const data = await getClients()
            setClients(data)
            // Buscar "Consumidor Final" como cliente por defecto
            const defaultClient = data.find(c => c.name.toLowerCase().includes("consumidor") || c.name.toLowerCase().includes("final"))
            if (defaultClient) {
                setSelectedClientId(defaultClient.id)
            } else if (data.length > 0 && !selectedClientId) {
                setSelectedClientId(data[0].id)
            }
        } catch (error) {
            toast.error("Error al cargar clientes")
        } finally {
            setClientsLoading(false)
        }
    }

    const handleAddClient = async () => {
        if (!newClientName.trim()) {
            toast.error("Ingresa el nombre del cliente")
            return
        }

        try {
            const newClient = await createClient(newClientName, newClientPhone)
            setClients(prev => [...prev, newClient])
            setSelectedClientId(newClient.id)
            setNewClientName("")
            setNewClientPhone("")
            setShowClientForm(false)
            toast.success("Cliente creado exitosamente")
        } catch (error) {
            toast.error("Error al crear cliente")
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleSearch = async (term: string) => {
        if (!term) return
        setLoading(true)
        try {
            const products = await getProducts(term)
            if (products.length === 1) {
                addToCart(products[0] as Product)
                setQuery("")
            } else if (products.length > 1) {
                // Ideally show a list to pick, but for now just pick the first one matching exactly or warn
                // For POS speed, if exact match on code, pick it.
                const exactMatch = products.find(p => p.barcode === term || p.name.toLowerCase() === term.toLowerCase())
                if (exactMatch) {
                    addToCart(exactMatch as Product)
                    setQuery("")
                } else {
                    toast.info(`Se encontraron ${products.length} productos. Sé más específico.`)
                }
            } else {
                toast.error("Producto no encontrado")
            }
        } catch (error) {
            toast.error("Error al buscar producto")
        } finally {
            setLoading(false)
            searchInputRef.current?.focus()
        }
    }

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ...product, quantity: 1 }]
        })
        toast.success(`Agregado: ${product.name}`)
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const updateQuantityDirect = (id: string, value: string) => {
        const qty = parseInt(value) || 0
        if (qty < 1) return
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: qty }
            }
            return item
        }))
    }

    const handleScan = (code: string) => {
        // Auto search/add when scanned
        if (code) {
            handleSearch(code)
        }
    }

    const handleCheckout = async () => {
        if (cart.length === 0) return
        if (!selectedClientId) {
            toast.error("Por favor selecciona un cliente")
            return
        }
        setProcessing(true)
        try {
            const quote = await createQuote(cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })), selectedClientId)
            
            // Generar código de presupuesto (PR-1001, PR-1002, etc)
            const quoteCode = `PR-${String(quote.id).padStart(4, '0')}`
            
            // Preparar datos para el modal
            const selectedClient = clients.find(c => c.id === selectedClientId)
            setGeneratedQuote({
                id: quote.id,
                code: quoteCode,
                clientName: selectedClient?.name || "Consumidor Final",
                total: quote.total,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
            
            setShowQuoteModal(true)
            setCart([])
            setComments("")
            toast.success("Presupuesto generado exitosamente")
        } catch (error) {
            console.error(error)
            toast.error("Error al generar presupuesto")
        } finally {
            setProcessing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Grid principal: Formulario + Carrito */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sección izquierda: Formulario de Presupuesto */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card: Datos del Presupuesto */}
                        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg">
                                <CardTitle className="text-lg font-bold text-gray-800">Datos del Presupuesto</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Código (auto-generado) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Código</label>
                                        <Input
                                            placeholder="PR-XXXX"
                                            disabled
                                            value="Auto-generado"
                                            className="bg-gray-50 border-gray-200 text-gray-500"
                                        />
                                    </div>

                                    {/* Fecha */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Fecha</label>
                                        <Input
                                            type="date"
                                            disabled
                                            value={new Date().toISOString().split('T')[0]}
                                            className="bg-gray-50 border-gray-200"
                                        />
                                    </div>

                                    {/* Vendedor */}
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Vendedor</label>
                                        <Input
                                            placeholder="Nombre del vendedor"
                                            value={vendorName}
                                            onChange={(e) => setVendorName(e.target.value)}
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Cliente */}
                        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg">
                                <CardTitle className="text-lg font-bold text-gray-800">Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {showClientForm ? (
                                    <div className="space-y-3">
                                        <Input
                                            placeholder="Nombre del cliente"
                                            value={newClientName}
                                            onChange={(e) => setNewClientName(e.target.value)}
                                            className="border-gray-200 focus:border-blue-500"
                                        />
                                        <Input
                                            placeholder="Teléfono (opcional)"
                                            value={newClientPhone}
                                            onChange={(e) => setNewClientPhone(e.target.value)}
                                            className="border-gray-200 focus:border-blue-500"
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={handleAddClient} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                                Crear Cliente
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowClientForm(false)
                                                    setNewClientName("")
                                                    setNewClientPhone("")
                                                }}
                                                className="flex-1 border-gray-200"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <select
                                            value={selectedClientId}
                                            onChange={(e) => setSelectedClientId(e.target.value)}
                                            disabled={clientsLoading}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                        >
                                            <option value="">Selecciona un cliente...</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name} {client.phone && `(${client.phone})`}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowClientForm(true)}
                                            className="w-full gap-2 border-gray-200 text-gray-700 hover:bg-blue-50"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Nuevo Cliente
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Card: Buscador de Productos */}
                        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg">
                                <CardTitle className="text-lg font-bold text-gray-800">Agregar Productos</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            ref={searchInputRef}
                                            placeholder="Escanear código o buscar por nombre..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                            disabled={loading}
                                            autoFocus
                                            className="pr-10 border-gray-200 focus:border-blue-500"
                                        />
                                        {loading && (
                                            <div className="absolute right-3 top-3">
                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                    <Button 
                                        onClick={() => handleSearch(query)} 
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Agregar
                                    </Button>
                                    <BarcodeScanner onScan={handleScan} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Comentarios */}
                        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg">
                                <CardTitle className="text-lg font-bold text-gray-800">Comentarios</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <textarea
                                    placeholder="Agregar observaciones o comentarios sobre el presupuesto..."
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección derecha: Carrito y Resumen */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Card: Detalle del Carrito */}
                        <Card className="border-0 shadow-sm bg-white h-fit">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                    Artículos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {cart.length === 0 ? (
                                        <p className="text-center text-gray-500 text-sm py-8">
                                            Sin productos agregados
                                        </p>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.quantity}x ${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-800 ml-2">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-gray-400 hover:text-red-500"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card: Resumen Total */}
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 sticky top-6">
                            <CardHeader className="border-b border-blue-200">
                                <CardTitle className="text-lg font-bold text-gray-800">Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Subtotal:</span>
                                        <span className="font-semibold text-gray-800">${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Cantidad de artículos:</span>
                                        <span className="font-semibold text-gray-800">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                    </div>
                                </div>
                                <Separator className="bg-blue-200" />
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total:</span>
                                    <span className="text-3xl font-bold text-blue-600">
                                        ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                    </span>
                                </div>
                            </CardContent>
                            <Separator className="bg-blue-200" />
                            <CardFooter className="pt-4 flex flex-col gap-3">
                                <Button
                                    className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0 || processing || !selectedClientId}
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Generando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Generar Presupuesto
                                        </div>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-gray-600">
                                    Se asignará código PR automáticamente
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal: Presupuesto Generado */}
            <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
                <DialogContent className="max-w-2xl bg-white rounded-lg shadow-lg">
                    <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 -m-6 mb-6 p-6 rounded-t-lg border-b border-blue-200">
                        <DialogTitle className="text-2xl font-bold text-gray-800">
                            Presupuesto Generado
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Tu presupuesto ha sido creado exitosamente
                        </DialogDescription>
                    </DialogHeader>

                    {generatedQuote && (
                        <div className="space-y-6 p-6">
                            {/* Código del Presupuesto destacado */}
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                                <p className="text-sm text-gray-600">Código del Presupuesto</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{generatedQuote.code}</p>
                            </div>

                            {/* Información del Cliente */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Cliente</p>
                                <p className="text-lg text-gray-900">{generatedQuote.clientName}</p>
                            </div>

                            {/* Tabla de Productos */}
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-3">Detalle de Artículos</p>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-b border-gray-200 bg-gray-50">
                                                <TableHead className="text-xs font-semibold text-gray-700">Producto</TableHead>
                                                <TableHead className="text-xs font-semibold text-gray-700 text-center">Cantidad</TableHead>
                                                <TableHead className="text-xs font-semibold text-gray-700 text-right">Precio Unit.</TableHead>
                                                <TableHead className="text-xs font-semibold text-gray-700 text-right">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {generatedQuote.items.map((item, index) => (
                                                <TableRow key={index} className="border-b border-gray-100">
                                                    <TableCell className="text-sm text-gray-800">{item.name}</TableCell>
                                                    <TableCell className="text-sm text-center text-gray-800">{item.quantity}</TableCell>
                                                    <TableCell className="text-sm text-right text-gray-800">${item.price.toFixed(2)}</TableCell>
                                                    <TableCell className="text-sm text-right font-semibold text-gray-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total del Presupuesto</span>
                                    <span className="text-4xl font-bold text-blue-600">${generatedQuote.total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
                                    onClick={() => {
                                        // Aquí irían las acciones de impresión/descarga
                                        toast.success("Presupuesto descargado")
                                        setShowQuoteModal(false)
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                    Descargar PDF
                                </Button>
                                <Button
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold gap-2"
                                    onClick={() => {
                                        // Aquí irían las acciones de envío por email
                                        toast.success("Enviado por email")
                                        setShowQuoteModal(false)
                                    }}
                                >
                                    <Mail className="h-4 w-4" />
                                    Enviar por Email
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-gray-200"
                                    onClick={() => setShowQuoteModal(false)}
                                >
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
