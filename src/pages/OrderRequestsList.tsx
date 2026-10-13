import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderRequest, OrderStatus } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  UserCheck,
  Phone,
  MapPin,
  QrCode,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';

export const OrderRequestsList: React.FC = () => {
  const {
    orderRequests,
    updateOrderStatus,
    prefillDeliveryWithOrder,
    users,
    currentUser,
    formatCurrency,
    formatNumber,
    openClientProfileModal,
    openUserDetailsModal,
    openInvoiceModal,
    language,
    t,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const [assignModalOrder, setAssignModalOrder] = useState<OrderRequest | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const deliveryAgents = users.filter((u) => u.role === 'delivery');

  const filteredOrders = orderRequests.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch =
      ord.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      ord.clientName.toLowerCase().includes(search.toLowerCase()) ||
      ord.clientPhone.includes(search) ||
      ord.clientArea.toLowerCase().includes(search.toLowerCase());

    // If currentUser is delivery agent, show either orders assigned to them or pending
    if (currentUser.role === 'delivery') {
      return (
        matchesStatus &&
        matchesSearch &&
        (ord.assignedDeliveryManId === currentUser.id || ord.status === 'pending')
      );
    }

    return matchesStatus && matchesSearch;
  });

  const handleAssignRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalOrder || !selectedAgentId) return;

    updateOrderStatus(assignModalOrder.id, 'assigned', selectedAgentId);
    setAssignModalOrder(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-sky-600" />
            <span>{language === 'bn' ? 'গ্রাহকদের পানির অর্ডার রিকোয়েস্ট' : 'Customer Water Order Requests'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'অ্যাপ থেকে গ্রাহকদের পাঠানো জার অর্ডার রিকোয়েস্ট, রাইডার অ্যাসাইন এবং কিউআর ডেলিভারি'
              : 'Incoming jar delivery requests from customer portal, rider dispatching, and QR fulfillment'}
          </p>
        </div>

        {/* Counter chip */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
            {orderRequests.filter((o) => o.status === 'pending').length}{' '}
            {language === 'bn' ? 'টি নতুন অর্ডার' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'অর্ডার কোড, গ্রাহক বা ফোন নম্বর...' : 'Search by order #, client, phone...'}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: language === 'bn' ? 'সব' : 'All' },
            { id: 'pending', label: language === 'bn' ? 'অপেক্ষমাণ' : 'Pending' },
            { id: 'assigned', label: language === 'bn' ? 'অ্যাসাইনড' : 'Assigned' },
            { id: 'delivered', label: language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No matching order requests found.'}
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className={`p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                ord.urgent
                  ? 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-lg">
                      {ord.orderNo}
                    </span>
                    {ord.urgent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                        ⚡ Urgent
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'assigned'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                {/* CLICKABLE CUSTOMER NAME */}
                <button
                  onClick={() => openClientProfileModal(ord.clientId || ord.clientName)}
                  className="font-extrabold text-base text-slate-900 dark:text-white mt-1 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer text-left block"
                  title={language === 'bn' ? 'গ্রাহক বিবরণ দেখতে ক্লিক করুন' : 'Click to view client details'}
                >
                  {ord.clientName}
                </button>
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{ord.clientPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ord.clientAddress} ({ord.clientArea})</span>
                  </div>
                </div>

                {/* Items & Schedule Details */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>
                      {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                    </span>
                    <span className="text-sky-600">৳{ord.estimatedAmount}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Schedule: {ord.preferredDate} • {ord.preferredTimeSlot}
                  </div>
                  {ord.notes && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-300 italic pt-1 border-t border-slate-200 dark:border-slate-700">
                      Note: {ord.notes}
                    </div>
                  )}
                  {ord.assignedDeliveryManName && (
                    <div className="text-[11px] text-sky-700 dark:text-sky-300 font-semibold pt-1">
                      🚴 Assigned Rider: {ord.assignedDeliveryManName}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                {ord.status !== 'delivered' && (
                  <>
                    {currentUser.role === 'admin' && ord.status === 'pending' && (
                      <button
                        onClick={() => {
                          setAssignModalOrder(ord);
                          setSelectedAgentId(deliveryAgents[0]?.id || '');
                        }}
                        className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'bn' ? 'রাইডার দিন' : 'Assign Rider'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => prefillDeliveryWithOrder(ord)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/25 transition cursor-pointer active:scale-98"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'স্ক্যান ও ডেলিভারি দিন' : 'Scan & Deliver Now'}</span>
                    </button>
                  </>
                )}

                {ord.status === 'delivered' && (
                  <div className="w-full py-1.5 text-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                    ✓ {language === 'bn' ? 'ডেলিভারি সম্পন্ন হয়েছে' : 'Delivered & Fulfilled via QR'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ASSIGN RIDER MODAL */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'অর্ডার ডেলিভারির জন্য রাইডার নির্ধারণ' : 'Assign Delivery Agent'}
            </h3>
            <p className="text-xs text-slate-500">
              Order #{assignModalOrder.orderNo} ({assignModalOrder.clientName})
            </p>

            <form onSubmit={handleAssignRider} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Agent *
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {deliveryAgents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
