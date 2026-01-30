/**
 * Mock de usuarios para testing en desarrollo
 * Elimina estos cuando tengas el backend listo
 */

import type { User } from '@/lib/types';

export const MOCK_ADMIN: User = {
  id: 'mock_admin_001',
  email: 'admin@ferreteria.com',
  name: 'Juan Pérez - Admin',
  role: 'admin',
  roles: ['admin'],
  permissions: ['*'], // Wildcard para todos los permisos
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
  createdAt: new Date('2024-01-01'),
};

export const MOCK_OPERADOR: User = {
  id: 'mock_operador_001',
  email: 'operador@ferreteria.com',
  name: 'María García - Operadora',
  role: 'operador',
  roles: ['operador'],
  permissions: [
    'productos.view',
    'productos.editar',
    'productos.bulk_import',
    'ventas.view',
    'ventas.crear',
    'clientes.view',
    'analytics.view',
  ],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  createdAt: new Date('2024-06-15'),
};

export const MOCK_VENDEDOR: User = {
  id: 'mock_vendedor_001',
  email: 'vendedor@ferreteria.com',
  name: 'Carlos López - Vendedor',
  role: 'vendedor',
  roles: ['vendedor'],
  permissions: [
    'productos.view',
    'ventas.view',
    'ventas.crear',
    'clientes.view',
  ],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  createdAt: new Date('2024-09-20'),
};

export const MOCK_USERS = [MOCK_ADMIN, MOCK_OPERADOR, MOCK_VENDEDOR];
