"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Menu,
    LogOut,
    Settings,
    ShoppingCart,
    Package,
    Users,
    FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Sidebar from "./sidebar"

const mobileMenuItems = [
    { name: "Nueva venta", href: "/dashboard/ventas", icon: ShoppingCart },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Presupuestos", href: "/dashboard/presupuestos", icon: FileText },
    { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex w-full flex-col md:ml-64 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 md:hidden text-blue-600 hover:bg-blue-50"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col bg-white p-0">
                            <div className="flex h-16 items-center border-b border-gray-200 px-4">
                                <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                        <span className="text-white font-bold">F</span>
                                    </div>
                                    <span>Ferretería</span>
                                </Link>
                            </div>
                            <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
                                {mobileMenuItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                                    const Icon = item.icon

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-blue-600" : "text-gray-400"
                                            )} />
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <div className="flex w-full items-center justify-between gap-4">
                        <h1 className="text-lg font-semibold text-gray-900">Ferretería Demo</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" alt="Usuario" />
                                        <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">Menú de usuario</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4 text-blue-600" /> Configuración
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
