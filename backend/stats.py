from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from typing import List, Dict
from collections import Counter

async def get_dashboard_stats(current_user: dict):
    """Get comprehensive dashboard statistics"""
    from database import (
        products_collection,
        sales_collection,
        customers_collection,
        quotes_collection,
    )
    
    # Basic counts
    total_products = await products_collection.count_documents({})
    total_customers = await customers_collection.count_documents({})
    total_sales = await sales_collection.count_documents({})
    total_quotes = await quotes_collection.count_documents({})
    
    # Sales stats
    sales = await sales_collection.find({}, {"_id": 0}).to_list(1000)
    
    total_revenue = sum(sale.get("total", 0) for sale in sales if sale.get("estado") == "completada")
    
    # Calculate daily revenue (last 7 days)
    today = datetime.utcnow().date()
    daily_revenue = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        
        day_sales = [
            sale for sale in sales
            if sale.get("estado") == "completada" and
            day_start <= datetime.fromisoformat(sale.get("fecha")) <= day_end
        ]
        
        day_total = sum(sale.get("total", 0) for sale in day_sales)
        
        daily_revenue.append({
            "fecha": day.isoformat(),
            "dia": day.strftime("%d/%m"),
            "ingresos": round(day_total, 2),
            "ventas": len(day_sales)
        })
    
    # Top selling products
    all_items = []
    for sale in sales:
        if sale.get("estado") == "completada":
            all_items.extend(sale.get("items", []))
    
    product_sales = Counter()
    product_revenue = {}
    
    for item in all_items:
        product_id = item.get("producto_id")
        product_name = item.get("producto_nombre")
        quantity = item.get("cantidad", 0)
        subtotal = item.get("subtotal", 0)
        
        product_sales[product_name] += quantity
        product_revenue[product_name] = product_revenue.get(product_name, 0) + subtotal
    
    top_products = [
        {
            "nombre": name,
            "cantidad_vendida": count,
            "ingresos": round(product_revenue.get(name, 0), 2)
        }
        for name, count in product_sales.most_common(5)
    ]
    
    # Low stock alerts
    products = await products_collection.find({}, {"_id": 0}).to_list(1000)
    low_stock_products = [
        {
            "id": p.get("id"),
            "nombre": p.get("nombre"),
            "stock_actual": p.get("stock_actual", 0),
            "stock_minimo": p.get("stock_minimo", 0)
        }
        for p in products
        if p.get("stock_actual", 0) <= p.get("stock_minimo", 0)
    ]
    
    # Recent sales (last 5)
    recent_sales = sorted(
        [s for s in sales if s.get("estado") == "completada"],
        key=lambda x: x.get("fecha", ""),
        reverse=True
    )[:5]
    
    recent_sales_data = [
        {
            "id": sale.get("id"),
            "fecha": sale.get("fecha"),
            "total": sale.get("total", 0),
            "items_count": len(sale.get("items", [])),
            "vendedor": sale.get("vendedor_nombre")
        }
        for sale in recent_sales
    ]
    
    # Monthly comparison (current vs previous month)
    current_month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
    
    current_month_sales = [
        sale for sale in sales
        if sale.get("estado") == "completada" and
        datetime.fromisoformat(sale.get("fecha")) >= current_month_start
    ]
    
    previous_month_sales = [
        sale for sale in sales
        if sale.get("estado") == "completada" and
        previous_month_start <= datetime.fromisoformat(sale.get("fecha")) < current_month_start
    ]
    
    current_month_revenue = sum(sale.get("total", 0) for sale in current_month_sales)
    previous_month_revenue = sum(sale.get("total", 0) for sale in previous_month_sales)
    
    revenue_change = 0
    if previous_month_revenue > 0:
        revenue_change = ((current_month_revenue - previous_month_revenue) / previous_month_revenue) * 100
    
    return {
        "resumen": {
            "total_productos": total_products,
            "total_clientes": total_customers,
            "total_ventas": total_sales,
            "total_presupuestos": total_quotes,
            "ingresos_totales": round(total_revenue, 2),
            "ingresos_mes_actual": round(current_month_revenue, 2),
            "ingresos_mes_anterior": round(previous_month_revenue, 2),
            "cambio_porcentual": round(revenue_change, 2)
        },
        "ingresos_diarios": daily_revenue,
        "productos_mas_vendidos": top_products,
        "alertas_stock_bajo": low_stock_products,
        "ventas_recientes": recent_sales_data
    }
