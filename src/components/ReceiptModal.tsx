import React, { useEffect, useState } from 'react';
import { Delivery } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, Download, Share2, X, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { generateQrDataUrl } from '../utils/qr';
import { downloadReceiptAsImage } from '../utils/receiptCanvas';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  delivery,
}) => {
  const { settings, language, formatCurrency, formatNumber, t, showToast } = useApp();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (delivery) {
      generateQrDataUrl(`AQUA-INV:${delivery.invoiceNo}:${delivery.totalPayable}`, { width: 140, margin: 1 })
        .then((url) => setQrUrl(url));
    }
  }, [delivery]);

  if (!isOpen || !delivery) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Print blocked by browser:', err);
      showToast(
        language === 'bn'
          ? 'ব্রাউজার প্রিন্ট করতে পারছে না, স্লিপ ইমেজ ডাউনলোড হচ্ছে...'
          : 'Direct print unavailable, downloading receipt slip image...',
        'info'
      );
      handleDownloadImage();
    }
  };

  const handleDownloadImage = () => {
    try {
      downloadReceiptAsImage(delivery, settings, qrUrl);
      showToast(
        language === 'bn' ? 'রসিদের ছবি (Slip) ডাউনলোড হয়েছে!' : 'Receipt slip image downloaded!',
        'success'
      );
    } catch (e) {
      console.error(e);
    }
  };

  const generateWhatsAppMessage = () => {
    const lines = [
      `💧 *${settings.name}*`,
      `*${settings.tagline}*`,
      `📞 ${settings.phone}`,
      `---------------------------------`,
      `🧾 *Invoice:* ${delivery.invoiceNo}`,
      `📅 *Date:* ${new Date(delivery.createdAt).toLocaleString('en-GB')}`,
      `👤 *Client:* ${delivery.clientName} (${delivery.clientPhone})`,
      `📍 *Address:* ${delivery.clientAddress}`,
      `🚴 *Delivery Agent:* ${delivery.deliveryManName}`,
      `---------------------------------`,
      `*ITEMS DELIVERED:*`,
      ...delivery.items.map((it, idx) => ` ${idx + 1}. ${it.productName} (${it.volumeLiters}L) - ৳${it.unitPrice}`),
      `---------------------------------`,
      `*Bill Amount:* ৳${delivery.billAmount}`,
      `*Previous Due (আগের বাকি):* ৳${delivery.previousDue}`,
      `*TOTAL PAYABLE:* ৳${delivery.totalPayable}`,
      `*Paid:* ৳${delivery.paidAmount} (${delivery.paymentMethod.toUpperCase()}${delivery.trxId ? ' Trx:' + delivery.trxId : ''})`,
      `*REMAINING DUE (বর্তমান বকেয়া):* ৳${delivery.remainingDue}`,
      delivery.emptyJarsReturned ? `*Empty Jars Returned:* ${delivery.emptyJarsReturned}` : '',
      `---------------------------------`,
      `${settings.receiptFooter}`,
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  };

  const handleWhatsApp = () => {
    const phone = delivery.clientPhone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('88') ? phone : `88${phone}`;
    const url = `https://wa.me/${cleanPhone}?text=${generateWhatsAppMessage()}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const text = decodeURIComponent(generateWhatsAppMessage());
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Controls Bar (hidden during print) */}
        <div className="no-print px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold text-xs tracking-wide truncate">
              {language === 'bn' ? 'ডেলিভারি মেমো ও ক্যাশ রসিদ' : 'Delivery Receipt'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title="Download Receipt Image (PNG)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্লিপ PNG' : 'Save Slip'}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white transition"
              title="Send to client WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div id="printable-receipt" className="p-6 text-slate-900 font-sans print-container text-xs overflow-y-auto flex-1 bg-white">
          {/* Company Branding */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-base font-extrabold tracking-tight uppercase text-sky-800">{settings.name}</h2>
            {settings.nameBn && (
              <p className="text-xs font-bold text-slate-700">{settings.nameBn}</p>
            )}
            <p className="text-[11px] text-slate-500 mt-0.5">{settings.tagline}</p>
            <p className="text-[11px] text-slate-600 mt-1">{settings.address}</p>
            <p className="text-[11px] font-semibold text-slate-700">📞 {settings.phone}</p>
          </div>

          {/* Invoice Meta */}
          <div className="py-2.5 border-b border-dashed border-slate-300 flex justify-between items-center text-[11px]">
            <div>
              <div><span className="font-bold">Invoice:</span> {delivery.invoiceNo}</div>
              <div className="text-slate-500">
                {new Date(delivery.createdAt).toLocaleDateString('en-GB')} {new Date(delivery.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-right">
              <div><span className="font-bold">Agent:</span> {delivery.deliveryManName}</div>
              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                delivery.paymentStatus === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : delivery.paymentStatus === 'partial'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {delivery.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] bg-slate-50 p-2 rounded-lg my-2">
            <div className="font-bold text-slate-800 flex items-center justify-between">
              <span>{delivery.clientName}</span>
              <span className="font-mono text-slate-500">{delivery.clientPhone}</span>
            </div>
            <div className="text-slate-600 text-[10px] mt-0.5">{delivery.clientAddress}</div>
          </div>

          {/* Items Table */}
          <div className="py-2">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-1">Item / Jar Code</th>
                  <th className="pb-1 text-center">Vol</th>
                  <th className="pb-1 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delivery.items.map((item, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1">
                      <div className="font-semibold text-slate-800">{item.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{item.jarQrCode}</div>
                    </td>
                    <td className="py-1 text-center text-slate-500">{item.volumeLiters}L</td>
                    <td className="py-1 text-right font-semibold">৳{item.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Financials */}
          <div className="pt-2 border-t-2 border-slate-800 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({delivery.itemCount} Jars):</span>
              <span className="font-semibold">৳{delivery.billAmount}</span>
            </div>

            {delivery.previousDue > 0 && (
              <div className="flex justify-between text-amber-700 font-medium">
                <span>Previous Due (আগের বাকি):</span>
                <span>+৳{delivery.previousDue}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL PAYABLE:</span>
              <span>৳{delivery.totalPayable}</span>
            </div>

            <div className="flex justify-between text-emerald-700 font-bold">
              <span>
                Paid via {delivery.paymentMethod.toUpperCase()}
                {delivery.trxId ? ` (${delivery.trxId})` : ''}:
              </span>
              <span>৳{delivery.paidAmount}</span>
            </div>

            <div className="flex justify-between text-xs font-extrabold text-rose-600 pt-1 border-t border-dashed border-slate-300">
              <span>NEW REMAINING DUE (বকেয়া):</span>
              <span>৳{delivery.remainingDue}</span>
            </div>

            {delivery.emptyJarsReturned !== undefined && delivery.emptyJarsReturned > 0 && (
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Empty Jars Received:</span>
                <span className="font-semibold">{delivery.emptyJarsReturned} bottles</span>
              </div>
            )}
          </div>

          {/* QR Code & Verification */}
          <div className="mt-4 pt-3 border-t border-dashed border-slate-300 flex flex-col items-center justify-center">
            {qrUrl && (
              <img src={qrUrl} alt="Invoice QR" className="w-24 h-24 object-contain" />
            )}
            <p className="text-[10px] text-slate-400 font-mono mt-1">{delivery.invoiceNo}</p>
          </div>

          {/* Footer Note */}
          <div className="mt-3 text-center text-[10px] text-slate-500 border-t border-slate-100 pt-2">
            <p>{settings.receiptFooter}</p>
            <p className="mt-1 font-semibold text-slate-400">Powered by AquaTrack System</p>
          </div>
        </div>

        {/* Modal Bottom Actions (hidden during print) */}
        <div className="no-print p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleCopySummary}
            className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-semibold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'মেমো কপি' : 'Copy Text')}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-xs text-slate-800 transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
