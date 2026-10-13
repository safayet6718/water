import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : toast.type === 'warning'
            ? AlertTriangle
            : Info;

        const bg =
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : toast.type === 'error'
            ? 'bg-rose-600 text-white'
            : toast.type === 'warning'
            ? 'bg-amber-600 text-white'
            : 'bg-slate-900 text-white';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top duration-200 ${bg}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
