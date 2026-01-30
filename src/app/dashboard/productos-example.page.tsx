/**
 * EJEMPLO PRÁCTICO COMPLETO: Página de Productos con Control de Permisos
 * Copia este código como referencia para implementar en tus páginas
 */

'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download } from 'lucide-react';
import { usePermissions } from '@/lib/usePermissions';
import {
  ProtectedContent,
  AdminOnly,
  ConditionalButton,
} from '@/components/ProtectedContent';
import { Button } from '@/components/ui/button';

/**
 * Ejemplo de página que respeta roles y permisos
 */
export default function ProductosPageExample() {
  const {
    user,
    isAdmin,
    hasPermission,
    hasRole,
    canAccessByPermission,
  } = usePermissions();
  const [productos, setProductos] = useState([
    { id: 1, name: 'Destornillador', price: 5.99 },
    { id: 2, name: 'Martillo', price: 12.50 },
  ]);

  // Si no tiene acceso, mostrar mensaje
  if (!hasPermission('productos.view')) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-bold">Acceso Denegado</h2>
          <p className="text-red-700">
            No tienes permisos para ver el catálogo de productos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header con permisos */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">
            Gestión del catálogo de productos
          </p>
        </div>

        {/* Información del usuario actual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Usuario:</strong> {user?.name} ({user?.role})
          </p>
          <p className="text-sm text-blue-800 mt-1">
            <strong>Permisos:</strong> {user?.permissions?.join(', ') || 'Ninguno'}
          </p>
        </div>
      </div>

      {/* Botones de acción con control de permisos */}
      <div className="flex gap-3 flex-wrap">
        {/* Crear producto - Solo si tiene permiso */}
        <ConditionalButton
          permission="productos.crear"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Crear Producto
        </ConditionalButton>

        {/* Importar masivo - Solo admin */}
        <ConditionalButton
          role="admin"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          Importar Masivo
        </ConditionalButton>

        {/* Exportar - Admin o si tiene permiso específico */}
        {(isAdmin() || hasPermission('productos.export')) && (
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        )}
      </div>

      {/* Lista de productos con acciones contextuales */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-900">
                Nombre
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-900">
                Precio
              </th>
              <th className="text-left px-6 py-3 font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{producto.name}</td>
                <td className="px-6 py-4 text-gray-900">${producto.price}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {/* Editar - Si tiene permiso */}
                    {hasPermission('productos.editar') && (
                      <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    )}

                    {/* Eliminar - Solo admin */}
                    <AdminOnly
                      fallback={
                        <span className="text-xs text-gray-400">
                          (Sin permiso)
                        </span>
                      }
                    >
                      <button className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </AdminOnly>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección visible solo para admin o específicas */}
      <ProtectedContent requiredRole="admin" fallback={null}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">⚙️ Panel Administrativo</h3>
          <p className="text-yellow-800 text-sm mb-3">
            Opciones avanzadas solo para administradores:
          </p>
          <div className="space-y-2">
            <button className="block w-full text-left px-4 py-2 bg-white border border-yellow-200 rounded hover:bg-yellow-100 text-sm">
              📊 Ver estadísticas detalladas
            </button>
            <button className="block w-full text-left px-4 py-2 bg-white border border-yellow-200 rounded hover:bg-yellow-100 text-sm">
              🔧 Configurar precios automáticos
            </button>
            <button className="block w-full text-left px-4 py-2 bg-white border border-yellow-200 rounded hover:bg-yellow-100 text-sm">
              📋 Auditoría de cambios
            </button>
          </div>
        </div>
      </ProtectedContent>

      {/* Tabla de referencia de lo que cada rol puede hacer */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">
          📊 Matriz de Permisos (Referencia)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left px-4 py-2">Acción</th>
                <th className="text-center px-4 py-2">Admin</th>
                <th className="text-center px-4 py-2">Operador</th>
                <th className="text-center px-4 py-2">Vendedor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Ver Productos</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Crear Producto</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
                <td className="text-center">❌</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Editar Producto</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Eliminar Producto</td>
                <td className="text-center">✅</td>
                <td className="text-center">❌</td>
                <td className="text-center">❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================
 * CÓMO IMPLEMENTAR EN TUS PÁGINAS
 * ============================================
 *
 * 1. OPCIÓN A: Usar hooks directamente
 *
 *    import { usePermissions } from '@/lib/usePermissions';
 *
 *    export default function MiPagina() {
 *      const { hasPermission, isAdmin } = usePermissions();
 *
 *      if (!hasPermission('productos.ver')) {
 *        return <p>Sin acceso</p>;
 *      }
 *
 *      return (...);
 *    }
 *
 * ============================================
 *
 * 2. OPCIÓN B: Usar componentes ProtectedContent
 *
 *    import { ProtectedContent } from '@/components/ProtectedContent';
 *
 *    export default function MiPagina() {
 *      return (
 *        <ProtectedContent requiredPermissions={['productos.ver']}>
 *          <MiContenido />
 *        </ProtectedContent>
 *      );
 *    }
 *
 * ============================================
 *
 * 3. OPCIÓN C: Combinar ambas (MÁS RECOMENDADO)
 *
 *    Usa ProtectedContent para controlar la visibilidad general
 *    Usa usePermissions para controlar botones/acciones específicas
 *
 * ============================================
 */
