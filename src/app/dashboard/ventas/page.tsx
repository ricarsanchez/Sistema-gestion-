import { VentasClient } from "./ventas-client"

export default function VentasPage() {
    return (
        <div className="flex flex-col gap-6 bg-gradient-to-br from-gray-50 to-white min-h-screen -m-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Nueva Venta</h1>
            </div>
            <VentasClient />
        </div>
    )
}
