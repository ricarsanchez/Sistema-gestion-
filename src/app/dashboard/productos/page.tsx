import { createProduct, getProducts } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { BarcodeScanner } from "@/components/products/barcode-scanner"
import { redirect } from "next/navigation"

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q
    const products = await getProducts(query)

    async function searchAction(formData: FormData) {
        "use server"
        const q = formData.get("q")
        redirect(`/dashboard/productos?q=${q || ""}`)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Productos</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                        </DialogHeader>
                        <form action={createProduct} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nombre
                                </Label>
                                <Input id="name" name="name" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Categoría
                                </Label>
                                <Input id="category" name="category" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Precio ($)
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">
                                    Stock
                                </Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="barcode" className="text-right">
                                    Código
                                </Label>
                                <Input id="barcode" name="barcode" placeholder="Opcional" className="col-span-3" />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit">Guardar Producto</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <form action={searchAction} className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                        type="search"
                        name="q"
                        placeholder="Buscar por nombre o código..."
                        defaultValue={query}
                    />
                    <Button type="submit" variant="secondary">Buscar</Button>
                </form>
                <ScanWrapper />
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron productos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">
                                        {product.barcode || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${product.price.toLocaleString("es-AR")}
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${product.stock < 5 ? "text-red-500" : ""}`}>
                                        {product.stock}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

// Client component wrapper for the scanner redirection logic
import { ScanClientWrapper } from "./scan-wrapper"

function ScanWrapper() {
    return <ScanClientWrapper />
}
