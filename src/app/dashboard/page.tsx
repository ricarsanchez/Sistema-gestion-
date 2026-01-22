import DashboardLayout from "@/components/layout/dashboard-layout"
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
        <DashboardLayout>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            </div>

            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Clientes
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Total registrados
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Productos Bajo Stock
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Menos de 10 unidades
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Presupuestos del Mes
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{quotesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Generados este mes
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
