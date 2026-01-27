"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const price = parseFloat(formData.get("price") as string)
    const stock = parseInt(formData.get("stock") as string)
    const category = formData.get("category") as string
    const barcode = formData.get("barcode") as string | null

    // Defaults to a hardcoded company ID or creates one if not exists (for demo purposes)
    // In a real app, this would come from the session
    let company = await prisma.company.findFirst()
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: "Demo Company",
            }
        })
    }

    await prisma.product.create({
        data: {
            name,
            price,
            stock,
            category,
            barcode: barcode || null,
            companyId: company.id,
        },
    })

    revalidatePath("/dashboard/productos")
}

export async function getProducts(query?: string) {
    let company = await prisma.company.findFirst()
    if (!company) return []

    if (!query) {
        return await prisma.product.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: 'desc' }
        })
    }

    return await prisma.product.findMany({
        where: {
            companyId: company.id,
            OR: [
                { name: { contains: query } },
                { barcode: { contains: query } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getClients(query?: string) {
    let company = await prisma.company.findFirst()
    if (!company) return []

    if (!query) {
        return await prisma.client.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: 'desc' }
        })
    }

    return await prisma.client.findMany({
        where: {
            companyId: company.id,
            OR: [
                { name: { contains: query } },
                { phone: { contains: query } }
            ]
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createClient(name: string, phone: string) {
    let company = await prisma.company.findFirst()
    if (!company) throw new Error("No company found")

    const client = await prisma.client.create({
        data: {
            name,
            phone,
            companyId: company.id,
        }
    })

    return client
}

export async function createQuote(items: { productId: string, quantity: number, price: number }[], clientId: string) {
    let company = await prisma.company.findFirst()
    if (!company) throw new Error("No company found")

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
        // 1. Create the quote
        const quote = await tx.quote.create({
            data: {
                companyId: company.id,
                clientId,
                total,
                status: "ACEPTADO", // Mark as accepted sale
                items: {
                    create: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })

        // 2. Update stock for each product
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        return quote
    })

    return result
}
