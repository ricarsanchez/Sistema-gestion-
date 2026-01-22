"use client"

import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScanBarcode } from "lucide-react"
import { toast } from "sonner"

interface BarcodeScannerProps {
    onScan: (decodedText: string) => void
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
    const [open, setOpen] = useState(false)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    const playBeep = () => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)

        oscillator.start()
        oscillator.stop(audioCtx.currentTime + 0.1)
    }

    useEffect(() => {
        if (open && !scannerRef.current) {
            // Render the scanner when dialog opens
            // Little timeout to ensure DOM is ready
            const timeout = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.EAN_8,
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                            Html5QrcodeSupportedFormats.CODE_128,
                        ],
                    },
                    /* verbose= */ false
                )
                scanner.render(
                    (decodedText) => {
                        playBeep()
                        toast.success(`Código detectado: ${decodedText}`)
                        onScan(decodedText)
                        setOpen(false)
                        scanner.clear().catch(console.error)
                        scannerRef.current = null
                    },
                    (errorMessage) => {
                        // console.warn(errorMessage) // Ignore errors scanning frame
                    }
                )
                scannerRef.current = scanner
            }, 100)

            return () => clearTimeout(timeout)
        }

        if (!open && scannerRef.current) {
            scannerRef.current.clear().catch(console.error)
            scannerRef.current = null
        }
    }, [open, onScan])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <ScanBarcode className="h-4 w-4" />
                    Escanear Código
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Escanear Código de Barras</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div id="reader" className="w-full h-auto min-h-[300px] bg-slate-100 rounded-md overflow-hidden"></div>
                    <p className="text-sm text-muted-foreground">
                        Apunta la cámara al código de barras del producto.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
