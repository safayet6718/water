import { Delivery, CompanySettings } from '../types';

export function downloadReceiptAsImage(delivery: Delivery, settings: CompanySettings, qrDataUrl?: string): void {
  const canvas = document.createElement('canvas');
  const width = 450;
  // Dynamic height based on items
  const height = 680 + delivery.items.length * 36;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Border outline
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Header
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(settings.name.toUpperCase(), width / 2, 45);

  if (settings.nameBn) {
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(settings.nameBn, width / 2, 70);
  }

  ctx.fillStyle = '#64748b';
  ctx.font = '12px sans-serif';
  ctx.fillText(settings.tagline, width / 2, 92);
  ctx.fillText(settings.address, width / 2, 110);
  ctx.fillText(`Phone: ${settings.phone}`, width / 2, 128);

  // Divider
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(25, 145);
  ctx.lineTo(width - 25, 145);
  ctx.stroke();
  ctx.setLineDash([]);

  // Invoice & Agent details
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`INVOICE: ${delivery.invoiceNo}`, 25, 170);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`Date: ${new Date(delivery.createdAt).toLocaleDateString()} ${new Date(delivery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 25, 190);
  ctx.fillText(`Agent: ${delivery.deliveryManName}`, 25, 208);

  // Client Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(25, 222, width - 50, 48);
  ctx.strokeStyle = '#cbd5e1';
  ctx.strokeRect(25, 222, width - 50, 48);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(delivery.clientName, 35, 242);
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`${delivery.clientPhone} • ${delivery.clientAddress}`, 35, 260);

  // Items Table Header
  let y = 295;
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(25, y - 18, width - 50, 24);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('ITEM / CODE', 35, y);
  ctx.fillText('VOL', 260, y);
  ctx.textAlign = 'right';
  ctx.fillText('PRICE', width - 35, y);

  // Items
  y += 24;
  ctx.textAlign = 'left';
  delivery.items.forEach((item, idx) => {
    ctx.fillStyle = '#0f172a';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${idx + 1}. ${item.productName}`, 35, y);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText(item.jarQrCode, 35, y + 12);

    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${item.volumeLiters}L`, 260, y);

    ctx.textAlign = 'right';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`৳${item.unitPrice}`, width - 35, y);
    ctx.textAlign = 'left';

    y += 32;
  });

  // Totals divider
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(25, y);
  ctx.lineTo(width - 25, y);
  ctx.stroke();

  y += 20;
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`Jars Subtotal (${delivery.itemCount} jars):`, 35, y);
  ctx.textAlign = 'right';
  ctx.fillText(`৳${delivery.billAmount}`, width - 35, y);
  ctx.textAlign = 'left';

  if (delivery.previousDue > 0) {
    y += 20;
    ctx.fillStyle = '#b45309';
    ctx.fillText(`Previous Due (আগের বাকি):`, 35, y);
    ctx.textAlign = 'right';
    ctx.fillText(`+৳${delivery.previousDue}`, width - 35, y);
    ctx.textAlign = 'left';
  }

  y += 24;
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`TOTAL PAYABLE:`, 35, y);
  ctx.textAlign = 'right';
  ctx.fillText(`৳${delivery.totalPayable}`, width - 35, y);
  ctx.textAlign = 'left';

  y += 22;
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`Paid (${delivery.paymentMethod.toUpperCase()}):`, 35, y);
  ctx.textAlign = 'right';
  ctx.fillText(`৳${delivery.paidAmount}`, width - 35, y);
  ctx.textAlign = 'left';

  y += 22;
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`REMAINING DUE:`, 35, y);
  ctx.textAlign = 'right';
  ctx.fillText(`৳${delivery.remainingDue}`, width - 35, y);
  ctx.textAlign = 'left';

  if (delivery.emptyJarsReturned) {
    y += 18;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Empty Jars Returned: ${delivery.emptyJarsReturned} bottles`, 35, y);
  }

  // Footer Note
  y += 35;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#475569';
  ctx.font = '11px sans-serif';
  ctx.fillText(settings.receiptFooter, width / 2, y);

  // Trigger download
  const link = document.createElement('a');
  link.download = `aquatrack_receipt_${delivery.invoiceNo}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
