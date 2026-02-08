import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { suppliersAPI } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, Pencil, Trash2, Upload, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Proveedores = () => {
  const { hasPermission } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [supplierToImport, setSupplierToImport] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    cuit: '',
  });

  const canCreate = hasPermission('proveedores:crear');
  const canEdit = hasPermission('proveedores:editar');
  const canDelete = hasPermission('proveedores:eliminar');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        nombre: supplier.nombre,
        contacto: supplier.contacto || '',
        email: supplier.email || '',
        telefono: supplier.telefono || '',
        direccion: supplier.direccion || '',
        cuit: supplier.cuit || '',
      });
    } else {
      setEditingSupplier(null);
      setFormData({ nombre: '', contacto: '', email: '', telefono: '', direccion: '', cuit: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersAPI.update(editingSupplier.id, formData);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await suppliersAPI.create(formData);
        toast.success('Proveedor creado exitosamente');
      }
      setDialogOpen(false);
      loadSuppliers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await suppliersAPI.delete(supplierToDelete.id);
      toast.success('Proveedor eliminado exitosamente');
      setDeleteDialogOpen(false);
      loadSuppliers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleImportPrices = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await suppliersAPI.importPrices(supplierToImport.id, file);
      toast.success(
        `Lista importada: ${response.data.precios_actualizados} precios actualizados`
      );
      setImportDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="proveedores-title">
            Proveedores
          </h1>
          <p className="text-slate-600 mt-1">Gestión de proveedores y listas de precios</p>
        </div>
        {canCreate && (
          <Button onClick={() => handleOpenDialog()} data-testid="create-supplier-button">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            {suppliers.length} proveedor{suppliers.length !== 1 ? 'es' : ''} registrado{suppliers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No hay proveedores registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">Contacto</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          {supplier.nombre}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.contacto || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell">{supplier.email || '-'}</TableCell>
                      <TableCell>{supplier.telefono || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={supplier.activo ? 'default' : 'secondary'}>
                          {supplier.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {canCreate && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSupplierToImport(supplier);
                              setImportDialogOpen(true);
                            }}
                            title="Importar lista de precios"
                          >
                            <Upload className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(supplier)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSupplierToDelete(supplier);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Actualiza los datos del proveedor' : 'Ingresa los datos del nuevo proveedor'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  data-testid="supplier-nombre-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cuit">CUIT/RUT</Label>
                <Input
                  id="cuit"
                  value={formData.cuit}
                  onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" data-testid="supplier-submit-button">
                {editingSupplier ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Lista de Precios</DialogTitle>
            <DialogDescription>
              Proveedor: {supplierToImport?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Formato del Excel:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Columna A: Código de Barras del producto</li>
                <li>• Columna B: Precio</li>
                <li>• Columna C: Código del proveedor (opcional)</li>
              </ul>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportPrices}
              className="hidden"
              id="import-prices"
            />
            <Button
              onClick={() => document.getElementById('import-prices').click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar Archivo Excel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el proveedor "{supplierToDelete?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Proveedores;
