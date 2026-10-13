import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientQRCardModal } from './ClientQRCardModal';
import {
  Users,
  Phone,
  MapPin,
  QrCode,
  DollarSign,
  Droplets,
  Calendar,
  CheckCircle2,
  XCircle,
  Receipt,
  Printer,
  Edit2,
  X,
  MessageCircle,
  Clock,
  ArrowRight,
  HandCoins,
} from 'lucide-react';

export const ClientDetailsModal: React.FC = () => {
  const {
    viewingClient,
    closeClientProfileModal,
    deliveries,
    clientPayments,
    openInvoiceModal,
    toggleClientActive,
    setActiveTab,
    formatCurrency,
    formatNumber,
    language,
    t,
  } = useApp();

  const [activeTab, setActiveModalTab] = useState<'deliveries' | 'payments' | 'rates'>('deliveries');
  const [showQrCardModal, setShowQrCardModal] = useState(false);

  if (!viewingClient) return null;

  // Compute client statistics
  const clientDeliveries = deliveries.filter((d) => d.clientId === viewingClient.id);
  const clientPaymentsList = clientPayments.filter((p) => p.clientId === viewingClient.id);

  const totalJars = clientDeliveries.reduce((sum, d) => sum + d.itemCount, 0);
  const totalLiters = clientDeliveries.reduce((sum, d) => sum + d.totalLiters, 0);
  const totalBilled = clientDeliveries.reduce((sum, d) => sum + d.billAmount, 0) + (viewingClient.openingDue || 0);
  const totalPaid =
    clientDeliveries.reduce((sum, d) => sum + d.paidAmount, 0) +
    clientPaymentsList.reduce((sum, p) => sum + p.amount, 0);

  // Clean phone for WhatsApp link
  const cleanPhone = viewingClient.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('88')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `88${cleanPhone}`
    : `880${cleanPhone}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto flex flex-col max-h-[92vh]">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white p-5 pb-6">
            <button
              onClick={closeClientProfileModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between pr-8">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {viewingClient.name}
                  </h2>
                  <span className="font-mono text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-lg border border-white/30">
                    {viewingClient.code}
                  </span>
                </div>
                <p className="text-xs text-sky-100 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{viewingClient.address} • {viewingClient.area}</span>
                </p>
              </div>

              {/* Status pill & toggle */}
              <button
                onClick={() => toggleClientActive(viewingClient.id)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewingClient.active
                    ? 'bg-emerald-500/25 text-emerald-100 border border-emerald-300/40 hover:bg-emerald-500/40'
                    : 'bg-rose-500/25 text-rose-100 border border-rose-300/40 hover:bg-rose-500/40'
                }`}
                title={language === 'bn' ? 'স্ট্যাটাস টগল করতে ক্লিক করুন' : 'Click to toggle status'}
              >
                {viewingClient.active ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{language === 'bn' ? 'সক্রিয় ক্লায়েন্ট' : 'Active'}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-300" />
                    <span>{language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
              <a
                href={`tel:${viewingClient.phone}`}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-sky-200" />
                <span>{viewingClient.phone}</span>
              </a>

              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 font-bold flex items-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
              </a>

              <button
                onClick={() => setShowQrCardModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-900" />
                <span>{language === 'bn' ? 'দরজার কিউআর স্টিকার প্রিন্ট' : 'Print Door QR Card'}</span>
              </button>
            </div>
          </div>

          {/* KPI Financial Overview Cards */}
          <div className="p-4 sm:p-5 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {language === 'bn' ? 'মোট সরবরাহ' : 'Total Jars'}
              </span>
              <span className="text-base font-black text-sky-600">
                {totalJars} Jars
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {formatNumber(totalLiters)} Liters
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {language === 'bn' ? 'মোট বিল' : 'Total Billed'}
              </span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatCurrency(totalBilled)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                {language === 'bn' ? 'মোট পরিশোধ' : 'Total Paid'}
              </span>
              <span className="text-base font-black text-emerald-600">
                {formatCurrency(totalPaid)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-center">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold uppercase block">
                {language === 'bn' ? 'বর্তমান বকেয়া' : 'Current Due'}
              </span>
              <span
                className={`text-lg font-black ${
                  viewingClient.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {formatCurrency(viewingClient.currentDue)}
              </span>
            </div>
          </div>

          {/* Notes bar if present */}
          {viewingClient.notes && (
            <div className="mx-4 sm:mx-5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200">
              <span className="font-bold">{language === 'bn' ? 'বিশেষ নোট:' : 'Note:'} </span>
              {viewingClient.notes}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="px-4 sm:px-5 pt-3 border-b border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => setActiveModalTab('deliveries')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
                activeTab === 'deliveries'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {language === 'bn' ? 'ডেলিভারি চালান সমূহ' : 'Invoices & Deliveries'} ({clientDeliveries.length})
            </button>

            <button
              onClick={() => setActiveModalTab('payments')}
              className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
                activeTab === 'payments'
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {language === 'bn' ? 'বকেয়া জমার রসিদ' : 'Due Payment Receipts'} ({clientPaymentsList.length})
            </button>

            {viewingClient.customPrices && Object.keys(viewingClient.customPrices).length > 0 && (
              <button
                onClick={() => setActiveModalTab('rates')}
                className={`pb-2.5 px-3 text-xs font-black border-b-2 transition cursor-pointer ${
                  activeTab === 'rates'
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {language === 'bn' ? 'স্পেশাল রেট' : 'Special Rates'}
              </button>
            )}
          </div>

          {/* Tab Content Area */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2 text-xs">
            {activeTab === 'deliveries' && (
              <div className="space-y-2">
                {clientDeliveries.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {language === 'bn' ? 'এই ক্লায়েন্টের কোনো ডেলিভারি চালান নেই' : 'No deliveries recorded yet'}
                  </div>
                ) : (
                  clientDeliveries.map((deliv) => (
                    <div
                      key={deliv.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-sky-300 dark:hover:border-sky-700 transition"
                    >
                      <div>
                        {/* CLICKABLE INVOICE NUMBER! */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              closeClientProfileModal();
                              openInvoiceModal(deliv);
                            }}
                            className="font-mono font-bold text-sky-600 hover:text-sky-800 underline decoration-sky-300 text-xs inline-flex items-center gap-1 cursor-pointer"
                            title={language === 'bn' ? 'রসিদ ও মেমো প্রিন্ট দেখতে ক্লিক করুন' : 'Click to view invoice'}
                          >
                            <Receipt className="w-3.5 h-3.5 text-sky-500" />
                            <span>{deliv.invoiceNo}</span>
                          </button>
                          <span className="text-[10px] text-slate-400">
                            {new Date(deliv.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1">
                          {deliv.itemCount} Jars ({deliv.totalLiters}L) • by {deliv.deliveryManName.split(' ')[0]}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-black text-xs text-slate-900 dark:text-white">
                          ৳{deliv.totalPayable}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] text-emerald-600 font-bold">
                            Paid: ৳{deliv.paidAmount}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              deliv.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : deliv.paymentStatus === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {deliv.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-2">
                {clientPaymentsList.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {language === 'bn' ? 'কোনো সরাসরি বকেয়া আদায়ের রসিদ নেই' : 'No direct payment receipts'}
                  </div>
                ) : (
                  clientPaymentsList.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {p.receiptNo}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.date} • Collected by {p.receivedByName}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-600">
                          +৳{p.amount}
                        </div>
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {p.paymentMethod} {p.trxId ? `(${p.trxId})` : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'rates' && viewingClient.customPrices && (
              <div className="space-y-2">
                {Object.entries(viewingClient.customPrices).map(([prodId, price]) => (
                  <div
                    key={prodId}
                    className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between"
                  >
                    <span className="font-bold text-sky-900 dark:text-sky-200">
                      Product ID: {prodId}
                    </span>
                    <span className="font-black text-sky-700 text-sm">
                      ৳{price} / Jar
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            {viewingClient.currentDue > 0 ? (
              <button
                onClick={() => {
                  closeClientProfileModal();
                  setActiveTab('due-collection');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <HandCoins className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বকেয়া টাকা জমা নিন' : 'Collect Due'}</span>
              </button>
            ) : (
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'সকল বকেয়া পরিশোধিত' : 'Zero outstanding balance'}</span>
              </div>
            )}

            <button
              onClick={closeClientProfileModal}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>

      {/* Door QR Card Modal */}
      <ClientQRCardModal
        isOpen={showQrCardModal}
        onClose={() => setShowQrCardModal(false)}
        client={viewingClient}
      />
    </>
  );
};
