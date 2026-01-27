import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Users, AlertTriangle, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
    let clientsCount = 0;
    let lowStockCount = 0;
    let quotesCount = 0;
    let error = null;

    try {
        const [clients, lowStock, quotes] = await Promise.all([
            prisma.client.count(),
            prisma.product.count({
                where: {
                    stock: {
                        lte: 10
                    }
                }
            }),
            prisma.quote.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            })
        ]);

        clientsCount = clients;
        lowStockCount = lowStock;
        quotesCount = quotes;

    } catch (e) {
        console.error("Error fetching dashboard data:", e);
        error = "Error al cargar los datos del dashboard. Por favor, intente nuevamente más tarde.";
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Dashboard</h1>
                <p className="text-gray-600 mt-2">Gestiona tu ferretería desde un único lugar</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Clientes
                        </CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{clientsCount}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Total registrados
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Productos Bajo Stock
                        </CardTitle>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{lowStockCount}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Menos de 10 unidades
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Presupuestos del Mes
                        </CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{quotesCount}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Generados este mes
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-sm bg-blue-50">
                <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Accesos Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">
                        Usa el menú lateral para acceder a: <strong>Nueva venta, Productos, Clientes, Presupuestos y Configuración</strong>. En dispositivos móviles, haz clic en el menú (☰) en la esquina superior izquierda.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
