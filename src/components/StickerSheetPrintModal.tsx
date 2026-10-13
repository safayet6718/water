import React, { useEffect, useState } from 'react';
import { JarQrCode, QrBatch } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, X, Grid } from 'lucide-react';
import { generateQrDataUrl, formatJarQrCode } from '../utils/qr';

interface StickerSheetPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: QrBatch | null;
  singleJar?: JarQrCode | null;
}

export const StickerSheetPrintModal: React.FC<StickerSheetPrintModalProps> = ({
  isOpen,
  onClose,
  batch,
  singleJar,
}) => {
  const { jarQrs, products, settings, language, t } = useApp();
  const [gridCols, setGridCols] = useState<number>(3); // 3x8 = 24 stickers
  const [filterMode, setFilterMode] = useState<'all' | 'unused'>('all');
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const targetJars = singleJar
    ? [singleJar]
    : batch
    ? jarQrs.filter((j) => j.batchId === batch.id && (filterMode === 'all' || j.status === 'unused'))
    : [];

  const product = products.find((p) => p.id === (singleJar?.productId || batch?.productId));
  const prodName = product ? `${product.size} JAR` : 'WATER JAR';

  useEffect(() => {
    if (!isOpen || targetJars.length === 0) return;

    let isMounted = true;
    setLoading(true);

    const generateAll = async () => {
      const map: Record<string, string> = {};
      for (const jar of targetJars) {
        if (!qrMap[jar.code]) {
          const url = await generateQrDataUrl(formatJarQrCode(jar.code), { width: 140, margin: 1 });
          map[jar.code] = url;
        }
      }
      if (isMounted) {
        setQrMap((prev) => ({ ...prev, ...map }));
        setLoading(false);
      }
    };

    generateAll();

    return () => {
      isMounted = false;
    };
  }, [isOpen, batch?.id, singleJar?.id, filterMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]">
        {/* Header Toolbar (no-print) */}
        <div className="no-print px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">
              {singleJar
                ? `${language === 'bn' ? 'সিঙ্গেল স্টিকার রিপ্রিন্ট:' : 'Reprint Jar Sticker:'} ${singleJar.code}`
                : `${language === 'bn' ? 'স্টিকার শিট প্রিন্ট:' : 'Print Sticker Sheet:'} ${batch?.batchNumber}`}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-sky-500/20 text-sky-300 font-mono">
              {targetJars.length} stickers
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!singleJar && (
              <div className="flex items-center gap-1.5 text-xs bg-slate-800 p-1 rounded-xl">
                <span className="text-slate-400 pl-1 flex items-center gap-1">
                  <Grid className="w-3 h-3" /> Grid:
                </span>
                <button
                  onClick={() => setGridCols(3)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition ${
                    gridCols === 3 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  3 Cols (3x8)
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition ${
                    gridCols === 4 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  4 Cols (4x8)
                </button>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট শিট' : 'Print Sheet'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Stickers Sheet */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/60 print:bg-white print:p-0">
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              Generating high-resolution printable QR codes...
            </div>
          ) : (
            <div
              className={`grid gap-2.5 print:gap-2 ${
                gridCols === 4
                  ? 'grid-cols-2 sm:grid-cols-4 print:grid-cols-4'
                  : 'grid-cols-1 sm:grid-cols-3 print:grid-cols-3'
              }`}
            >
              {targetJars.map((jar) => (
                <div
                  key={jar.id}
                  className="bg-white border-2 border-dashed border-slate-300 print:border-black/50 p-2.5 rounded-xl flex items-center gap-2 shadow-xs print:shadow-none print:break-inside-avoid"
                  style={{ minHeight: '85px' }}
                >
                  {/* Left QR */}
                  <div className="shrink-0 w-16 h-16 bg-white flex items-center justify-center">
                    {qrMap[jar.code] ? (
                      <img
                        src={qrMap[jar.code]}
                        alt={jar.code}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100" />
                    )}
                  </div>

                  {/* Right Details */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-tight text-slate-800 print:text-black truncate">
                        {settings.name}
                      </div>
                      <div className="text-[11px] font-black text-sky-700 print:text-black">
                        {prodName}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[9px] font-extrabold text-slate-900 print:text-black truncate bg-slate-100 print:bg-transparent px-1 py-0.5 rounded">
                        {jar.code}
                      </div>
                      <div className="flex justify-between items-center text-[8px] text-slate-500 print:text-black mt-0.5">
                        <span>{batch?.date || new Date().toISOString().slice(0, 10)}</span>
                        <span className="font-bold uppercase text-[7px] border border-slate-300 print:border-black px-1 rounded">
                          Single Use
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (no-print) */}
        <div className="no-print p-3 bg-white border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>
            {language === 'bn'
              ? 'টিপস: ব্রাউজারের প্রিন্ট ডায়ালগে "Margins: Minimum" সিলেক্ট করুন।'
              : 'Tip: In browser print dialog, select "Margins: Minimum" or None.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-800 transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
