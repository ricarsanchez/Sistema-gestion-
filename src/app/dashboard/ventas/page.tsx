import { VentasClient } from "./ventas-client"

export default function VentasPage() {
    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-theme(spacing.20))]">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Nueva Venta Demo</h1>
            </div>
            <VentasClient />
        </div>
    )
}
