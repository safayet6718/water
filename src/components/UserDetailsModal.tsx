import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Truck,
  DollarSign,
  Droplets,
  Edit2,
  X,
  MessageCircle,
  Shield,
  Bike,
  Calculator,
  UserCheck,
  ExternalLink,
  Receipt,
  LogOut,
} from 'lucide-react';

export const UserDetailsModal: React.FC = () => {
  const {
    currentUser,
    logout,
    viewingUser,
    closeUserDetailsModal,
    openUserEditModal,
    switchUserById,
    deliveries,
    cashHandovers,
    openInvoiceModal,
    openClientProfileModal,
    formatCurrency,
    formatNumber,
    language,
    t,
  } = useApp();

  if (!viewingUser) return null;

  // Filter deliveries done by this user if delivery staff
  const staffDeliveries = deliveries.filter((d) => d.deliveryManId === viewingUser.id);
  const totalLitersDispatched = staffDeliveries.reduce((sum, d) => sum + d.totalLiters, 0);
  const totalJarsDispatched = staffDeliveries.reduce((sum, d) => sum + d.itemCount, 0);
  const totalCashCollected = staffDeliveries
    .filter((d) => d.paymentMethod === 'cash')
    .reduce((sum, d) => sum + d.paidAmount, 0);

  // Clean phone for WhatsApp link
  const cleanPhone = viewingUser.phone.replace(/[^0-9]/g, '');
  const waPhone = cleanPhone.startsWith('88')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `88${cleanPhone}`
    : `880${cleanPhone}`;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: language === 'bn' ? 'মালিক / অ্যাডমিন (Admin)' : 'Owner / Admin',
          icon: <Shield className="w-3.5 h-3.5 text-amber-500" />,
          bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-800',
        };
      case 'delivery':
        return {
          label: language === 'bn' ? 'ডেলিভারি রাইডার (Delivery Rider)' : 'Delivery Rider',
          icon: <Bike className="w-3.5 h-3.5 text-sky-500" />,
          bg: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200 border-sky-200 dark:border-sky-800',
        };
      case 'manager':
        return {
          label: language === 'bn' ? 'হিসাবরক্ষক / ম্যানেজার (Manager)' : 'Accountant / Manager',
          icon: <Calculator className="w-3.5 h-3.5 text-purple-500" />,
          bg: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800',
        };
      default:
        return {
          label: language === 'bn' ? 'গ্রাহক / ক্লায়েন্ট (Customer)' : 'Customer',
          icon: <UserCheck className="w-3.5 h-3.5 text-emerald-500" />,
          bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
        };
    }
  };

  const roleInfo = getRoleBadge(viewingUser.role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 text-white p-5 pb-6">
          <button
            onClick={closeUserDetailsModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* User Photo / Avatar */}
            <div className="relative shrink-0">
              {viewingUser.avatar ? (
                <img
                  src={viewingUser.avatar}
                  alt={viewingUser.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-white shadow-md bg-slate-100"
                />
              ) : (
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-3 border-white flex items-center justify-center text-white text-2xl font-black shadow-md">
                  {viewingUser.name.charAt(0)}
                </div>
              )}
              <button
                onClick={() => {
                  closeUserDetailsModal();
                  openUserEditModal(viewingUser);
                }}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition cursor-pointer"
                title={language === 'bn' ? 'ছবি ও তথ্য এডিট করুন' : 'Edit photo & details'}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="min-w-0 pr-6">
              <h2 className="text-lg sm:text-xl font-black text-white truncate">
                {viewingUser.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.bg}`}
                >
                  {roleInfo.icon}
                  {roleInfo.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingUser.active
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                      : 'bg-rose-500/20 text-rose-200 border border-rose-400/30'
                  }`}
                >
                  {viewingUser.active ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      {language === 'bn' ? 'সক্রিয়' : 'Active'}
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-300" />
                      {language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick Contact & Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${viewingUser.phone}`}
              className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 flex items-center justify-center gap-2 font-black transition hover:bg-sky-100 dark:hover:bg-sky-900/50"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>{viewingUser.phone}</span>
            </a>

            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 font-black transition hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Details Info List */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {language === 'bn' ? 'ইউজার আইডি' : 'User ID'}
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {viewingUser.id}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {viewingUser.phone}
              </span>
            </div>

            {viewingUser.address && (
              <div className="flex items-start justify-between py-1 border-b border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-500 font-bold flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {language === 'bn' ? 'ঠিকানা ও এরিয়া' : 'Address & Area'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right ml-4">
                  {viewingUser.address} {viewingUser.area ? `(${viewingUser.area})` : ''}
                </span>
              </div>
            )}

            {viewingUser.clientId && (
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-bold">
                  {language === 'bn' ? 'সংযুক্ত ক্লায়েন্ট প্রোফাইল' : 'Linked Client'}
                </span>
                <button
                  onClick={() => {
                    closeUserDetailsModal();
                    openClientProfileModal(viewingUser.clientId!);
                  }}
                  className="font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'ক্লায়েন্ট প্রোফাইল দেখুন' : 'View Profile'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Delivery Staff Performance Summary */}
          {viewingUser.role === 'delivery' && (
            <div className="space-y-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'bn' ? 'ডেলিভারি ও ক্যাশ সামারি' : 'Delivery & Cash Performance'}
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    {language === 'bn' ? 'মোট চালান' : 'Deliveries'}
                  </span>
                  <span className="text-base font-black text-sky-600">
                    {staffDeliveries.length}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    {language === 'bn' ? 'মোট লিটার' : 'Total Liters'}
                  </span>
                  <span className="text-base font-black text-cyan-700 dark:text-cyan-400">
                    {formatNumber(totalLitersDispatched)}L
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">
                    {language === 'bn' ? 'ক্যাশ আদায়' : 'Cash Collected'}
                  </span>
                  <span className="text-base font-black text-emerald-600">
                    {formatCurrency(totalCashCollected)}
                  </span>
                </div>
              </div>

              {/* Recent Deliveries by this staff member */}
              {staffDeliveries.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    {language === 'bn' ? 'সাম্প্রতিক চালান সমূহ (ক্লিক করে রসিদ দেখুন):' : 'Recent Invoices (Click to view):'}
                  </h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    {staffDeliveries.slice(0, 4).map((deliv) => (
                      <div
                        key={deliv.id}
                        className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                      >
                        <div>
                          <button
                            onClick={() => {
                              closeUserDetailsModal();
                              openInvoiceModal(deliv);
                            }}
                            className="font-mono font-bold text-sky-600 hover:text-sky-800 underline decoration-sky-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-sky-500" />
                            <span>{deliv.invoiceNo}</span>
                          </button>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            {deliv.clientName} • {deliv.itemCount} Jars
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                            ৳{deliv.totalPayable}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              deliv.paymentStatus === 'paid'
                                ? 'text-emerald-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {deliv.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          {viewingUser.id === currentUser.id ? (
            <button
              onClick={() => {
                closeUserDetailsModal();
                logout();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-rose-200 dark:border-rose-900/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                switchUserById(viewingUser.id);
                closeUserDetailsModal();
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'এই ইউজারে লগইন' : 'Switch to this User'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeUserDetailsModal();
                openUserEditModal(viewingUser);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'তথ্য এডিট করুন' : 'Edit Details'}</span>
            </button>

            <button
              onClick={closeUserDetailsModal}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
