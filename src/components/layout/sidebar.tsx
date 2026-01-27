"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ShoppingCart,
    Package,
    Users,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SidebarItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

const sidebarItems: SidebarItem[] = [
    { name: "Nueva venta", href: "/dashboard/ventas", icon: ShoppingCart },
    { name: "Productos", href: "/dashboard/productos", icon: Package },
    { name: "Clientes", href: "/dashboard/clientes", icon: Users },
    { name: "Presupuestos", href: "/dashboard/presupuestos", icon: FileText },
    { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

interface SidebarProps {
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function Sidebar({ isOpen = true, onOpenChange }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <aside
            className={cn(
                "hidden md:flex fixed left-0 top-0 z-40 h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <span className="text-white font-bold">F</span>
                        </div>
                        <span className="text-gray-900">Ferretería</span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggle}
                    className="h-8 w-8 text-gray-600 hover:bg-gray-100"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2 px-3 py-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            <Icon className={cn(
                                "h-5 w-5 flex-shrink-0",
                                isActive ? "text-blue-600" : "text-gray-400"
                            )} />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4">
                <div className="text-center text-xs text-gray-500">
                    {!isCollapsed && <p>© 2026 Ferretería</p>}
                </div>
            </div>
        </aside>
    )
}
