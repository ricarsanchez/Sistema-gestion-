import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateSaleTicket = (sale, customer = null) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200], // Ticket size
  });

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FERRETERÍA', 40, 10, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión', 40, 16, { align: 'center' });
  doc.text('================================', 40, 20, { align: 'center' });
  
  // Sale info
  doc.setFontSize(9);
  doc.text(`Ticket #: ${sale.id.substring(0, 8)}`, 5, 26);
  doc.text(`Fecha: ${new Date(sale.fecha).toLocaleString()}`, 5, 31);
  doc.text(`Vendedor: ${sale.vendedor_nombre}`, 5, 36);
  
  if (customer) {
    doc.text(`Cliente: ${customer.nombre}`, 5, 41);
  }
  
  doc.text('================================', 40, 45, { align: 'center' });
  
  // Items table
  let yPos = 50;
  doc.setFont('helvetica', 'bold');
  doc.text('Producto', 5, yPos);
  doc.text('Cant', 50, yPos);
  doc.text('Precio', 63, yPos);
  
  doc.setFont('helvetica', 'normal');
  yPos += 5;
  
  sale.items.forEach((item) => {
    // Product name (truncate if too long)
    const productName = item.producto_nombre.length > 20 
      ? item.producto_nombre.substring(0, 20) + '...' 
      : item.producto_nombre;
    
    doc.text(productName, 5, yPos);
    doc.text(item.cantidad.toString(), 50, yPos);
    doc.text(`$${item.subtotal.toFixed(2)}`, 63, yPos);
    yPos += 5;
  });
  
  doc.text('================================', 40, yPos, { align: 'center' });
  yPos += 5;
  
  // Total
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: $${sale.total.toFixed(2)}`, 40, yPos, { align: 'center' });
  yPos += 6;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pago: ${sale.metodo_pago.toUpperCase()}`, 40, yPos, { align: 'center' });
  yPos += 6;
  
  doc.text('================================', 40, yPos, { align: 'center' });
  yPos += 5;
  
  doc.setFontSize(8);
  doc.text('¡Gracias por su compra!', 40, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Vuelva pronto', 40, yPos, { align: 'center' });

  return doc;
};

export const generateSaleInvoice = (sale, customer = null) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FERRETERÍA', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Gestión', 105, 27, { align: 'center' });
  doc.text('Dirección: Calle Principal #123', 105, 32, { align: 'center' });
  doc.text('Tel: (123) 456-7890', 105, 37, { align: 'center' });

  // Invoice info
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA', 105, 50, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`No. Factura: ${sale.id.substring(0, 12).toUpperCase()}`, 15, 60);
  doc.text(`Fecha: ${new Date(sale.fecha).toLocaleDateString()}`, 15, 66);
  doc.text(`Hora: ${new Date(sale.fecha).toLocaleTimeString()}`, 15, 72);
  doc.text(`Vendedor: ${sale.vendedor_nombre}`, 15, 78);

  // Customer info
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE:', 15, 88);
  doc.setFont('helvetica', 'normal');
  
  if (customer) {
    doc.text(`Nombre: ${customer.nombre}`, 15, 94);
    doc.text(`DNI: ${customer.dni || 'N/A'}`, 15, 100);
    doc.text(`Email: ${customer.email || 'N/A'}`, 15, 106);
    doc.text(`Teléfono: ${customer.telefono || 'N/A'}`, 15, 112);
  } else {
    doc.text('Cliente: General', 15, 94);
  }

  // Items table
  const tableData = sale.items.map(item => [
    item.producto_nombre,
    item.cantidad,
    `$${item.precio_unitario.toFixed(2)}`,
    `$${item.subtotal.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 120,
    head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: $${sale.total.toFixed(2)}`, 195, finalY, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Método de Pago: ${sale.metodo_pago.toUpperCase()}`, 195, finalY + 7, { align: 'right' });
  
  // Estado
  doc.text(`Estado: ${sale.estado.toUpperCase()}`, 195, finalY + 14, { align: 'right' });

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('¡Gracias por su preferencia!', 105, 280, { align: 'center' });
  doc.text('Este documento es una factura oficial', 105, 285, { align: 'center' });

  return doc;
};

export const downloadPDF = (doc, filename) => {
  doc.save(filename);
};

export const printPDF = (doc) => {
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};
