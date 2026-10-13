import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCw, CheckCircle2, Keyboard, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { parseScannedQr } from '../utils/qr';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (scannedText: string) => void;
  title: string;
  expectedType?: 'client' | 'jar';
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title,
  expectedType,
}) => {
  const { clients, jarQrs, language, t } = useApp();
  const [activeMode, setActiveMode] = useState<'camera' | 'test_presets' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-camera-stream-box';

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      // Clean up previous instance if any
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleSuccess(decodedText);
        },
        () => {
          // Frame scan error (normal when no QR is in viewfinder)
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(
        language === 'bn'
          ? 'ক্যামেরা চালু করা যায়নি বা অনুমতি নেই। আপনি নিচের "টেস্ট কিউআর" বা "টাইপ কোড" অপশন ব্যবহার করতে পারেন।'
          : 'Unable to access camera or permission denied. You can use Quick Test Presets or Manual Entry below.'
      );
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Camera stop error:', err);
      } finally {
        scannerRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const handleSuccess = (code: string) => {
    stopCamera();
    onScan(code);
    onClose();
  };

  if (!isOpen) return null;

  // Quick test items for convenience
  const unusedJars = jarQrs.filter((j) => j.status === 'unused').slice(0, 8);
  const deliveredJars = jarQrs.filter((j) => j.status === 'delivered').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {expectedType === 'client'
                  ? language === 'bn'
                    ? 'ক্লায়েন্ট কিউআর কোড স্ক্যান করুন'
                    : 'Scan customer door QR'
                  : language === 'bn'
                  ? 'জারের সিঙ্গেল-ইউজ কিউআর স্টিকার'
                  : 'Scan single-use jar sticker'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 p-1 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('camera')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'camera'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ক্যামেরা' : 'Camera'}</span>
          </button>
          <button
            onClick={() => setActiveMode('test_presets')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'test_presets'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সরাসরি টেস্ট কিউআর' : 'Quick Demo'}</span>
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeMode === 'manual'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'টাইপ কোড' : 'Type Code'}</span>
          </button>
        </div>

        {/* Body content based on tab */}
        <div className="p-4 overflow-y-auto flex-1">
          {activeMode === 'camera' && (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-[280px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-sky-500/40">
                <div id={scannerContainerId} className="w-full h-full" />
                {/* Laser scan line overlay */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-sky-400 shadow-[0_0_12px_#38bdf8] pointer-events-none animate-pulse" />
                {/* Viewfinder frame corners */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl-lg pointer-events-none" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br-lg pointer-events-none" />
              </div>

              {cameraError ? (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">{cameraError}</p>
                    <button
                      onClick={() => setActiveMode('test_presets')}
                      className="mt-2 text-sky-600 underline font-semibold"
                    >
                      {language === 'bn' ? 'সরাসরি টেস্ট কিউআর সিলেক্ট করুন →' : 'Switch to Quick Demo Selector →'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500 text-center">
                  {language === 'bn'
                    ? 'ক্যামেরা ফ্রেমের মাঝে কিউআর কোডটি সরাসরি রাখুন'
                    : 'Position the QR code inside the viewfinder frame'}
                </p>
              )}
            </div>
          )}

          {activeMode === 'test_presets' && (
            <div className="space-y-4">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-800 dark:text-sky-300">
                <span className="font-bold">⚡ {language === 'bn' ? 'সিমুলেশন ও টেস্ট:' : 'Instant Testing:'}</span>{' '}
                {language === 'bn'
                  ? 'কোনো ফিজিক্যাল প্রিন্ট না থাকলেও নিচের যেকোনো কিউআরে ক্লিক করে স্ক্যান সফল করুন।'
                  : 'Click any realistic QR below to simulate an instant successful camera scan.'}
              </div>

              {expectedType === 'client' ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {language === 'bn' ? 'ডেমো ক্লায়েন্ট নির্বাচন করুন' : 'Select Demo Client'}
                  </h4>
                  <div className="space-y-2">
                    {clients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSuccess(`AQUA-CLIENT:${c.code}`)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                          !c.active
                            ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-amber-950/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-400 hover:bg-sky-50/50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {c.code}
                            </span>
                            {!c.active && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                {language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate">{c.address} ({c.area})</p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className="text-xs font-semibold text-rose-600">
                            {language === 'bn' ? 'বাকি: ' : 'Due: '}৳{c.currentDue}
                          </div>
                          <span className="text-[10px] text-sky-600 font-semibold">{language === 'bn' ? 'স্ক্যান করুন' : 'Scan'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                      {language === 'bn' ? 'অব্যবহৃত জার (সফল হবে)' : 'Unused Jars (Will Succeed)'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {unusedJars.map((j) => (
                        <button
                          key={j.id}
                          onClick={() => handleSuccess(`AQUA-JAR:${j.code}`)}
                          className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 hover:border-emerald-400 text-left transition cursor-pointer"
                        >
                          <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 truncate">
                            {j.code}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {j.productId === 'prod-20L' ? '20 Liter Jar' : j.productId === 'prod-10L' ? '10 Liter Jar' : '30 Liter Jar'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {deliveredJars.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                        {language === 'bn' ? 'পূর্বে ব্যবহৃত জার (ডুপ্লিকেট ওয়ার্নিং টেস্ট)' : 'Delivered Jars (Test Duplicate Warning)'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {deliveredJars.map((j) => (
                          <button
                            key={j.id}
                            onClick={() => handleSuccess(`AQUA-JAR:${j.code}`)}
                            className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 text-left transition cursor-pointer"
                          >
                            <div className="text-xs font-mono font-bold text-rose-800 dark:text-rose-300 truncate">
                              {j.code}
                            </div>
                            <div className="text-[10px] text-rose-600 font-semibold">
                              {language === 'bn' ? 'ইতোমধ্যে ব্যবহৃত' : 'Already Used'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeMode === 'manual' && (
            <div className="space-y-4 py-2">
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'সরাসরি কোডটি টাইপ করুন (যেমন: CL-101 অথবা J-20261013-20L-0005):'
                  : 'Enter code directly (e.g. CL-101 or J-20261013-20L-0005):'}
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder={expectedType === 'client' ? 'CL-101' : 'J-20261013-20L-0001'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-sm uppercase bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  autoFocus
                />
                <button
                  type="button"
                  disabled={!manualCode.trim()}
                  onClick={() => handleSuccess(manualCode.trim())}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition cursor-pointer"
                >
                  {language === 'bn' ? 'কোড সাবমিট করুন' : 'Submit Code'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
          <span>AquaTrack QR Engine</span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-600 dark:text-slate-300 font-semibold hover:underline"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
