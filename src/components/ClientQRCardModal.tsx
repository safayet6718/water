import React, { useEffect, useState } from 'react';
import { Client } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, Download, X } from 'lucide-react';
import { generateQrDataUrl, formatClientQrCode } from '../utils/qr';

interface ClientQRCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export const ClientQRCardModal: React.FC<ClientQRCardModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { settings, language, t, showToast } = useApp();
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (client) {
      generateQrDataUrl(formatClientQrCode(client.code), { width: 300, margin: 2 })
        .then((url) => setQrUrl(url));
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      handleDownloadCard();
    }
  };

  const handleDownloadCard = () => {
    if (!qrUrl) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 560);

    // Blue Border
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 380, 540);

    // Company Header
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(settings.name.toUpperCase(), 200, 48);

    if (settings.nameBn) {
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(settings.nameBn, 200, 72);
    }

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText(settings.tagline, 200, 92);
    ctx.fillText(`Helpline: ${settings.phone}`, 200, 110);

    // Client ID badge
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(100, 125, 200, 28);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(100, 125, 200, 28);
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`CUSTOMER ID: ${client.code}`, 200, 144);

    // Draw QR code image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 85, 165, 230, 230);

      // Customer Info Box
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(30, 410, 340, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(client.name, 200, 435);
      ctx.font = '12px monospace';
      ctx.fillText(client.phone, 200, 455);
      ctx.font = '11px sans-serif';
      ctx.fillText(`${client.address} (${client.area})`, 200, 475);

      // Footer notice
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('পানির জার ডেলিভারির সময় এই কিউআর স্ক্যান করা হবে।', 200, 520);

      // Download
      const link = document.createElement('a');
      link.download = `client_door_qr_${client.code}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(
        language === 'bn' ? 'ডোর কিউআর কার্ড ইমেজ ডাউনলোড হয়েছে!' : 'Door QR card downloaded!',
        'success'
      );
    };
    img.src = qrUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header toolbar */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <span className="font-bold text-xs">
            {language === 'bn' ? 'ক্লায়েন্ট ডোর কিউআর কার্ড' : 'Client Door QR Card'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownloadCard}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কার্ড PNG' : 'Save PNG'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Door Card */}
        <div className="p-6 text-center print-container bg-white">
          <div className="border-4 border-sky-600 rounded-3xl p-5 bg-gradient-to-b from-sky-50/50 to-white shadow-sm">
            {/* Header */}
            <div className="border-b border-sky-200 pb-3">
              <h3 className="text-lg font-black text-sky-900 uppercase tracking-tight">{settings.name}</h3>
              {settings.nameBn && (
                <p className="text-xs font-bold text-sky-700">{settings.nameBn}</p>
              )}
              <p className="text-[10px] text-slate-500 font-medium">{settings.tagline}</p>
              <p className="text-[11px] font-bold text-sky-800 mt-1">Helpline: {settings.phone}</p>
            </div>

            {/* Client Badge */}
            <div className="mt-3 bg-white py-1.5 px-3 rounded-full border border-slate-200 inline-block shadow-xs">
              <span className="text-xs font-mono font-black text-sky-700 tracking-wider">
                CUSTOMER ID: {client.code}
              </span>
            </div>

            {/* QR Code */}
            <div className="my-4 flex justify-center">
              <div className="p-2 bg-white rounded-2xl shadow-md border-2 border-slate-100 inline-block">
                {qrUrl ? (
                  <img src={qrUrl} alt={client.name} className="w-48 h-48 object-contain" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">Loading QR...</div>
                )}
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-sky-900 text-white p-3 rounded-2xl">
              <h4 className="text-base font-extrabold">{client.name}</h4>
              <p className="text-xs text-sky-200 font-mono mt-0.5">{client.phone}</p>
              <p className="text-xs text-sky-100 mt-1">{client.address}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-sky-800 rounded-md text-[10px] font-semibold">
                Area: {client.area}
              </span>
            </div>

            {/* Notice */}
            <p className="text-[10px] text-slate-500 mt-3 italic leading-tight">
              {language === 'bn'
                ? 'পানির জার ডেলিভারির সময় ডেলিভারি ম্যান এই কিউআর স্ক্যান করবেন।'
                : 'Delivery agent will scan this QR on every water jar delivery.'}
            </p>
          </div>
        </div>

        {/* Modal footer */}
        <div className="no-print p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
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
