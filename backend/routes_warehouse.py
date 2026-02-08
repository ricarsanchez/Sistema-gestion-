from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List, Optional
from datetime import datetime
import io
import openpyxl

from models import (
    Warehouse, WarehouseCreate, WarehouseUpdate,
    Supplier, SupplierCreate, SupplierUpdate,
    Purchase, PurchaseCreate, PurchaseStatus,
    SupplierPrice, SupplierPriceCreate, SupplierPriceUpdate,
    StockWarehouse, UserRole
)
from permissions import Permission, require_permission
from database import (
    warehouses_collection, suppliers_collection, purchases_collection,
    supplier_prices_collection, product_stock_collection, products_collection,
    serialize_doc, serialize_docs, log_audit
)

# ===== WAREHOUSES ROUTES =====

async def get_warehouses_list(current_user: dict):
    """List all warehouses"""
    require_permission(UserRole(current_user["rol"]), Permission.DEPOSITOS_VER)
    
    warehouses = await warehouses_collection.find({}, {"_id": 0}).to_list(1000)
    return warehouses

async def create_warehouse(warehouse_data: WarehouseCreate, current_user: dict):
    """Create new warehouse"""
    require_permission(UserRole(current_user["rol"]), Permission.DEPOSITOS_CREAR)
    
    # Check if name already exists
    existing = await warehouses_collection.find_one({"nombre": warehouse_data.nombre})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un depósito con ese nombre"
        )
    
    warehouse = Warehouse(**warehouse_data.model_dump())
    doc = warehouse.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await warehouses_collection.insert_one(doc)
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="crear",
        modulo="depositos",
        detalles=f"Depósito creado: {warehouse.nombre}"
    )
    
    return warehouse

async def update_warehouse(warehouse_id: str, warehouse_data: WarehouseUpdate, current_user: dict):
    """Update warehouse"""
    require_permission(UserRole(current_user["rol"]), Permission.DEPOSITOS_EDITAR)
    
    existing = await warehouses_collection.find_one({"id": warehouse_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Depósito no encontrado"
        )
    
    update_data = warehouse_data.model_dump(exclude_unset=True)
    
    if update_data:
        await warehouses_collection.update_one(
            {"id": warehouse_id},
            {"$set": update_data}
        )
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="actualizar",
        modulo="depositos",
        detalles=f"Depósito actualizado: {warehouse_id}"
    )
    
    updated = await warehouses_collection.find_one({"id": warehouse_id}, {"_id": 0})
    return Warehouse(**updated)

async def delete_warehouse(warehouse_id: str, current_user: dict):
    """Delete warehouse"""
    require_permission(UserRole(current_user["rol"]), Permission.DEPOSITOS_ELIMINAR)
    
    existing = await warehouses_collection.find_one({"id": warehouse_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Depósito no encontrado"
        )
    
    # Check if warehouse has stock
    stock_count = await product_stock_collection.count_documents({"deposito_id": warehouse_id})
    if stock_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar. El depósito tiene {stock_count} productos con stock"
        )
    
    await warehouses_collection.delete_one({"id": warehouse_id})
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="eliminar",
        modulo="depositos",
        detalles=f"Depósito eliminado: {warehouse_id}"
    )
    
    return {"message": "Depósito eliminado exitosamente"}

# ===== SUPPLIERS ROUTES =====

async def get_suppliers_list(current_user: dict):
    """List all suppliers"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_VER)
    
    suppliers = await suppliers_collection.find({}, {"_id": 0}).to_list(1000)
    return suppliers

async def create_supplier(supplier_data: SupplierCreate, current_user: dict):
    """Create new supplier"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_CREAR)
    
    supplier = Supplier(**supplier_data.model_dump())
    doc = supplier.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await suppliers_collection.insert_one(doc)
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="crear",
        modulo="proveedores",
        detalles=f"Proveedor creado: {supplier.nombre}"
    )
    
    return supplier

async def update_supplier(supplier_id: str, supplier_data: SupplierUpdate, current_user: dict):
    """Update supplier"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_EDITAR)
    
    existing = await suppliers_collection.find_one({"id": supplier_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    update_data = supplier_data.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    await suppliers_collection.update_one(
        {"id": supplier_id},
        {"$set": update_data}
    )
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="actualizar",
        modulo="proveedores",
        detalles=f"Proveedor actualizado: {supplier_id}"
    )
    
    updated = await suppliers_collection.find_one({"id": supplier_id}, {"_id": 0})
    return Supplier(**updated)

async def delete_supplier(supplier_id: str, current_user: dict):
    """Delete supplier"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_ELIMINAR)
    
    existing = await suppliers_collection.find_one({"id": supplier_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    await suppliers_collection.delete_one({"id": supplier_id})
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="eliminar",
        modulo="proveedores",
        detalles=f"Proveedor eliminado: {supplier_id}"
    )
    
    return {"message": "Proveedor eliminado exitosamente"}

# ===== SUPPLIER PRICES ROUTES =====

async def get_product_prices(producto_id: str, current_user: dict):
    """Get all supplier prices for a product"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_VER)
    
    prices = await supplier_prices_collection.find(
        {"producto_id": producto_id},
        {"_id": 0}
    ).to_list(100)
    
    return prices

async def add_supplier_price(price_data: SupplierPriceCreate, current_user: dict):
    """Add or update supplier price for a product"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_CREAR)
    
    # Check if price already exists
    existing = await supplier_prices_collection.find_one({
        "producto_id": price_data.producto_id,
        "proveedor_id": price_data.proveedor_id
    })
    
    if existing:
        # Update existing price
        await supplier_prices_collection.update_one(
            {"id": existing["id"]},
            {"$set": {
                "precio": price_data.precio,
                "codigo_proveedor": price_data.codigo_proveedor,
                "fecha_actualizacion": datetime.utcnow().isoformat()
            }}
        )
        message = "Precio actualizado"
    else:
        # Create new price
        price = SupplierPrice(**price_data.model_dump())
        doc = price.model_dump()
        doc['fecha_actualizacion'] = doc['fecha_actualizacion'].isoformat()
        
        await supplier_prices_collection.insert_one(doc)
        message = "Precio agregado"
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="actualizar_precio",
        modulo="proveedores",
        detalles=f"Precio de proveedor actualizado: {price_data.proveedor_nombre}"
    )
    
    return {"message": message}

async def compare_prices(producto_id: str, current_user: dict):
    """Compare prices from all suppliers for a product"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_VER)
    
    # Get product
    product = await products_collection.find_one({"id": producto_id}, {"_id": 0})
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Get all prices
    prices = await supplier_prices_collection.find(
        {"producto_id": producto_id},
        {"_id": 0}
    ).to_list(100)
    
    # Sort by price
    prices_sorted = sorted(prices, key=lambda x: x.get("precio", float('inf')))
    
    best_price = prices_sorted[0] if prices_sorted else None
    
    return {
        "producto": product,
        "precios": prices_sorted,
        "mejor_precio": best_price,
        "total_proveedores": len(prices_sorted)
    }

# ===== PURCHASES ROUTES =====

async def get_purchases_list(current_user: dict):
    """List all purchases"""
    require_permission(UserRole(current_user["rol"]), Permission.COMPRAS_VER)
    
    purchases = await purchases_collection.find({}, {"_id": 0}).sort("fecha", -1).to_list(100)
    return purchases

async def create_purchase(purchase_data: PurchaseCreate, current_user: dict):
    """Create new purchase order"""
    require_permission(UserRole(current_user["rol"]), Permission.COMPRAS_CREAR)
    
    # Validate supplier exists
    supplier = await suppliers_collection.find_one({"id": purchase_data.proveedor_id})
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    # Validate warehouse exists
    warehouse = await warehouses_collection.find_one({"id": purchase_data.deposito_id})
    if not warehouse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Depósito no encontrado"
        )
    
    # Calculate total
    total = sum(item.subtotal for item in purchase_data.items)
    
    # Create purchase
    purchase = Purchase(
        **purchase_data.model_dump(),
        proveedor_nombre=supplier["nombre"],
        deposito_nombre=warehouse["nombre"],
        total=total
    )
    
    doc = purchase.model_dump()
    doc['fecha'] = doc['fecha'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    if doc.get('fecha_recepcion'):
        doc['fecha_recepcion'] = doc['fecha_recepcion'].isoformat()
    
    await purchases_collection.insert_one(doc)
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="crear",
        modulo="compras",
        detalles=f"Compra creada por ${total}"
    )
    
    return purchase

async def receive_purchase(purchase_id: str, current_user: dict):
    """Mark purchase as received and update stock"""
    require_permission(UserRole(current_user["rol"]), Permission.COMPRAS_RECIBIR)
    
    purchase = await purchases_collection.find_one({"id": purchase_id})
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Compra no encontrada"
        )
    
    if purchase["estado"] == PurchaseStatus.RECIBIDA:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La compra ya fue recibida"
        )
    
    # Update stock for each product in the warehouse
    for item in purchase["items"]:
        # Check if stock record exists for this product-warehouse combination
        stock_record = await product_stock_collection.find_one({
            "producto_id": item["producto_id"],
            "deposito_id": purchase["deposito_id"]
        })
        
        if stock_record:
            # Update existing stock
            await product_stock_collection.update_one(
                {"producto_id": item["producto_id"], "deposito_id": purchase["deposito_id"]},
                {"$inc": {"cantidad": item["cantidad"]}}
            )
        else:
            # Create new stock record
            stock_doc = {
                "producto_id": item["producto_id"],
                "deposito_id": purchase["deposito_id"],
                "deposito_nombre": purchase["deposito_nombre"],
                "cantidad": item["cantidad"],
                "ubicacion_interna": None
            }
            await product_stock_collection.insert_one(stock_doc)
        
        # Update product total stock
        await products_collection.update_one(
            {"id": item["producto_id"]},
            {"$inc": {"stock_actual": item["cantidad"]}}
        )
    
    # Mark purchase as received
    await purchases_collection.update_one(
        {"id": purchase_id},
        {"$set": {
            "estado": PurchaseStatus.RECIBIDA,
            "recibida_por": current_user["nombre"],
            "fecha_recepcion": datetime.utcnow().isoformat()
        }}
    )
    
    await log_audit(
        usuario_id=current_user["id"],
        usuario_nombre=current_user["nombre"],
        accion="recibir",
        modulo="compras",
        detalles=f"Compra recibida: {purchase_id}"
    )
    
    return {"message": "Compra recibida y stock actualizado exitosamente"}

async def get_product_stock_by_warehouse(producto_id: str, current_user: dict):
    """Get stock breakdown by warehouse for a product"""
    require_permission(UserRole(current_user["rol"]), Permission.PRODUCTOS_VER)
    
    stocks = await product_stock_collection.find(
        {"producto_id": producto_id},
        {"_id": 0}
    ).to_list(100)
    
    total_stock = sum(s.get("cantidad", 0) for s in stocks)
    
    return {
        "producto_id": producto_id,
        "stock_total": total_stock,
        "stock_por_deposito": stocks
    }

async def import_supplier_prices(file: UploadFile, proveedor_id: str, current_user: dict):
    """Import supplier price list from Excel"""
    require_permission(UserRole(current_user["rol"]), Permission.PROVEEDORES_CREAR)
    
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo debe ser un Excel (.xlsx o .xls)"
        )
    
    # Validate supplier exists
    supplier = await suppliers_collection.find_one({"id": proveedor_id})
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proveedor no encontrado"
        )
    
    try:
        # Read Excel file
        contents = await file.read()
        workbook = openpyxl.load_workbook(io.BytesIO(contents))
        sheet = workbook.active
        
        prices_updated = 0
        errors = []
        
        # Expected columns: codigo_barras, precio, codigo_proveedor
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            try:
                if not row[0]:  # Skip empty rows
                    continue
                
                codigo_barras = str(row[0]).strip()
                precio = float(row[1]) if row[1] else 0.0
                codigo_proveedor = str(row[2]).strip() if row[2] else None
                
                # Find product by barcode
                product = await products_collection.find_one({"codigo_barras": codigo_barras})
                if not product:
                    errors.append(f"Fila {row_idx}: Producto con código {codigo_barras} no encontrado")
                    continue
                
                # Add or update price
                price_data = SupplierPriceCreate(
                    producto_id=product["id"],
                    producto_nombre=product["nombre"],
                    proveedor_id=proveedor_id,
                    proveedor_nombre=supplier["nombre"],
                    precio=precio,
                    codigo_proveedor=codigo_proveedor
                )
                
                await add_supplier_price(price_data, current_user)
                prices_updated += 1
                    
            except Exception as e:
                errors.append(f"Fila {row_idx}: {str(e)}")
        
        return {
            "message": "Importación completada",
            "precios_actualizados": prices_updated,
            "errores": errors
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al procesar el archivo: {str(e)}"
        )
