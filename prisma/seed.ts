import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Company
    const company = await prisma.company.create({
        data: {
            name: 'Ferretería Demo',
        },
    })
    console.log(`Created company: ${company.name} (${company.id})`)

    // 2. Create Admin User
    const password = await bcrypt.hash('123456', 10)
    const user = await prisma.user.create({
        data: {
            email: 'admin@ferro.com',
            password: password,
            name: 'Admin User',
            companyId: company.id,
        },
    })
    console.log(`Created user: ${user.email}`)

    // 3. Create Products
    const productsData = [
        { name: 'Martillo Carpintero', price: 15.50, stock: 50, category: 'Herramientas' },
        { name: 'Destornillador Phillips', price: 5.25, stock: 100, category: 'Herramientas' },
        { name: 'Taladro Percutor', price: 120.00, stock: 15, category: 'Herramientas Eléctricas' },
        { name: 'Sierra Circular', price: 85.00, stock: 10, category: 'Herramientas Eléctricas' },
        { name: 'Caja de Clavos 2"', price: 3.50, stock: 200, category: 'Fijaciones' },
        { name: 'Tornillos Madera 3cm', price: 4.00, stock: 150, category: 'Fijaciones' },
        { name: 'Pintura Blanca 20L', price: 45.00, stock: 20, category: 'Pintura' },
        { name: 'Rodillo', price: 6.50, stock: 40, category: 'Pintura' },
        { name: 'Lija Grano 100', price: 0.50, stock: 500, category: 'Consumibles' },
        { name: 'Cinta Métrica 5m', price: 8.00, stock: 30, category: 'Herramientas' },
    ]

    for (const p of productsData) {
        await prisma.product.create({
            data: {
                ...p,
                companyId: company.id,
            },
        })
    }
    console.log(`Created ${productsData.length} products`)

    // 4. Create Clients
    const clientsData = [
        { name: 'Juan Pérez', phone: '555-0101' },
        { name: 'Construcciones SA', phone: '555-0202' },
        { name: 'María Gonzalez', phone: '555-0303' },
    ]

    for (const c of clientsData) {
        await prisma.client.create({
            data: {
                ...c,
                companyId: company.id,
            },
        })
    }
    console.log(`Created ${clientsData.length} clients`)

    // 5. Create Quotes
    const clientForQuote = await prisma.client.findFirst()
    const productForQuote = await prisma.product.findFirst()

    if (clientForQuote && productForQuote) {
        await prisma.quote.create({
            data: {
                total: 150.00,
                status: 'ACEPTADO',
                clientId: clientForQuote.id,
                companyId: company.id,
                items: {
                    create: [
                        {
                            productId: productForQuote.id,
                            quantity: 1,
                            price: 150.00
                        }
                    ]
                }
            }
        })
        const client2 = await prisma.client.findFirst({ where: { NOT: { id: clientForQuote.id } } })
        if (client2) {
            await prisma.quote.create({
                data: {
                    total: 500.00,
                    status: 'PENDIENTE',
                    clientId: client2.id,
                    companyId: company.id,
                    items: {
                        create: [
                            {
                                productId: productForQuote.id,
                                quantity: 2,
                                price: 250.00
                            }
                        ]
                    }
                }
            })
        }
        console.log('Created sample quotes')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
