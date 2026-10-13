import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { language } = useApp();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>
        {language === 'bn'
          ? 'অফলাইন মোড — ক্যাশ মেমরি ব্যবহৃত হচ্ছে'
          : 'Offline Mode — Local data in use'}
      </span>
    </div>
  );
};
