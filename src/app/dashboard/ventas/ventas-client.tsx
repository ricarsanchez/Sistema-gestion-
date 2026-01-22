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
import { BarcodeScanner } from "@/components/products/barcode-scanner"
import { createQuote, getProducts, getClients, createClient } from "@/lib/actions"
import { toast } from "sonner"
import { Trash2, ShoppingCart, FileText, Loader2, Plus } from "lucide-react"

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
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        setClientsLoading(true)
        try {
            const data = await getClients()
            setClients(data)
            if (data.length > 0 && !selectedClientId) {
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
            await createQuote(cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })), selectedClientId)
            toast.success("Venta registrada exitosamente")
            setCart([])
        } catch (error) {
            console.error(error)
            toast.error("Error al generar venta")
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
        <div className="grid gap-6 md:grid-cols-[1fr_350px] lg:grid-cols-[1fr_400px]">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Seleccionar Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {showClientForm ? (
                            <div className="space-y-3">
                                <Input
                                    placeholder="Nombre del cliente"
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                />
                                <Input
                                    placeholder="Teléfono (opcional)"
                                    value={newClientPhone}
                                    onChange={(e) => setNewClientPhone(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleAddClient} className="flex-1">
                                        Crear Cliente
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowClientForm(false)
                                            setNewClientName("")
                                            setNewClientPhone("")
                                        }}
                                        className="flex-1"
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
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
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
                                    className="w-full gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Nuevo Cliente
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                    <CardHeader className="pb-4">
                        <CardTitle>Buscador de Productos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Input
                                    ref={searchInputRef}
                                    placeholder="Escanear código o buscar por nombre..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={loading}
                                    autoFocus
                                    className="pr-10"
                                />
                                {loading && (
                                    <div className="absolute right-3 top-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <Button onClick={() => handleSearch(query)} disabled={loading}>
                                Agregar
                            </Button>
                            <BarcodeScanner onScan={handleScan} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Carrito de Venta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="text-center w-[120px]">Cant.</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-40 text-muted-foreground">
                                            No hay productos en el carrito
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    cart.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{item.name}</span>
                                                    <span className="text-xs text-muted-foreground">{item.barcode}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${item.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                                        -
                                                    </Button>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantityDirect(item.id, e.target.value)}
                                                        className="w-12 h-8 text-center p-0"
                                                    />
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                                        +
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-6">
                <Card className="sticky top-6">
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle>Resumen de Venta</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-4">
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span className="text-2xl">${total.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)} items en total
                        </div>
                    </CardContent>
                    <Separator className="my-2" />
                    <CardFooter className="flex flex-col gap-3 pt-4">
                        <Button
                            className="w-full h-12 text-lg gap-2"
                            size="lg"
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || processing || !selectedClientId}
                        >
                            {processing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <FileText className="h-5 w-5" />
                            )}
                            Generar Presupuesto
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Al generar, se guardará en el historial de ventas.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

function Separator({ className }: { className?: string }) {
    return <div className={`h-[1px] w-full bg-border ${className}`} />
}
