"use client"

import { BarcodeScanner } from "@/components/products/barcode-scanner"
import { useRouter } from "next/navigation"

export function ScanClientWrapper() {
    const router = useRouter()

    const handleScan = (code: string) => {
        // Play a beep sound or vibrate if possible
        if (navigator.vibrate) navigator.vibrate(200)

        // Redirect to search
        const params = new URLSearchParams()
        params.set("q", code)
        router.push(`/dashboard/productos?${params.toString()}`)
    }

    return <BarcodeScanner onScan={handleScan} />
}
