import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { language } = useApp();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer"
        title="Install AquaTrack as an App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-sky-300 dark:border-sky-600 bg-sky-50 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'iOS-এ ইনস্টল' : 'Install iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-sky-600" />
                  {language === 'bn' ? 'iPhone / iPad এ ইনস্টল' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                {language === 'bn' ? (
                  <>
                    ১. Safari ব্রাউজারের নিচের <strong>Share</strong> (শেয়ার) বাটনে চাপ দিন।<br />
                    ২. নিচে স্ক্রল করে <strong>Add to Home Screen</strong> এ চাপুন।
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition"
              >
                {language === 'bn' ? 'বুঝেছি' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
