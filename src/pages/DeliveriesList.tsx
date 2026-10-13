import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Delivery } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';
import {
  Truck,
  Search,
  Calendar,
  Receipt,
  Filter,
  Eye,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export const DeliveriesList: React.FC = () => {
  const {
    deliveries,
    users,
    openInvoiceModal,
    openClientProfileModal,
    openUserDetailsModal,
    formatCurrency,
    formatNumber,
    language,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const deliveryAgents = users.filter((u) => u.role === 'delivery');

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.clientPhone.includes(search) ||
      d.items.some((it) => it.jarQrCode.toLowerCase().includes(search.toLowerCase()));

    const matchesAgent = selectedAgent === 'all' || d.deliveryManId === selectedAgent;
    const matchesStatus = statusFilter === 'all' || d.paymentStatus === statusFilter;

    return matchesSearch && matchesAgent && matchesStatus;
  });

  const totalInvoiced = filteredDeliveries.reduce((acc, d) => acc + d.billAmount, 0);
  const totalCollected = filteredDeliveries.reduce((acc, d) => acc + d.paidAmount, 0);
  const totalJars = filteredDeliveries.reduce((acc, d) => acc + d.itemCount, 0);
  const totalLiters = filteredDeliveries.reduce((acc, d) => acc + d.totalLiters, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-600" />
            <span>{language === 'bn' ? 'সকল ডেলিভারি ও চালানের রেকর্ড' : 'All Invoices & Deliveries'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'স্ক্যান করা জারের রসিদ, পেমেন্ট মাধ্যম এবং ডেলিভারি ম্যানের হিসাব'
              : 'Invoice archive, payment collection status, and delivery agent records'}
          </p>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Jars</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatNumber(totalJars)} Jars
          </span>
          <span className="text-[10px] text-cyan-600 font-semibold block mt-0.5">
            {formatNumber(totalLiters)} Liters
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {formatCurrency(totalInvoiced)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Collected</span>
          <span className="text-lg font-black text-emerald-600">
            {formatCurrency(totalCollected)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Invoices Count</span>
          <span className="text-lg font-black text-sky-600">
            {filteredDeliveries.length}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'চালান নম্বর, ক্লায়েন্টের নাম বা জারের কোড...' : 'Search invoice, client, jar QR...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'bn' ? 'সকল ডেলিভারি ম্যান' : 'All Agents'}</option>
            {deliveryAgents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'bn' ? 'সকল পেমেন্ট অবস্থা' : 'All Status'}</option>
            <option value="paid">{language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid'}</option>
            <option value="partial">{language === 'bn' ? 'আংশিক (Partial)' : 'Partial'}</option>
            <option value="due">{language === 'bn' ? 'বাকি (Due)' : 'Due'}</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice / Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Delivery Agent</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Bill</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeliveries.map((deliv) => (
                <tr key={deliv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    {/* CLICKABLE INVOICE NUMBER */}
                    <button
                      onClick={() => openInvoiceModal(deliv)}
                      className="font-mono font-bold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white hover:underline cursor-pointer flex items-center gap-1 text-xs"
                      title={language === 'bn' ? 'চালান ও রসিদ দেখতে ক্লিক করুন' : 'Click to view invoice receipt'}
                    >
                      <Receipt className="w-3.5 h-3.5 text-sky-500" />
                      <span>{deliv.invoiceNo}</span>
                    </button>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(deliv.createdAt).toLocaleDateString('en-GB')}{' '}
                      {new Date(deliv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {/* CLICKABLE CLIENT NAME */}
                    <button
                      onClick={() => openClientProfileModal(deliv.clientId || deliv.clientName)}
                      className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer text-left block"
                      title={language === 'bn' ? 'গ্রাহক প্রোফাইল ও বিবরণ দেখতে ক্লিক করুন' : 'Click to view client details'}
                    >
                      {deliv.clientName}
                    </button>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                      {deliv.clientAddress}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {/* CLICKABLE RIDER NAME */}
                    <button
                      onClick={() => openUserDetailsModal(deliv.deliveryManId || deliv.deliveryManName)}
                      className="font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer"
                      title={language === 'bn' ? 'ডেলিভারি ম্যান প্রোফাইল দেখতে ক্লিক করুন' : 'Click to view rider details'}
                    >
                      {deliv.deliveryManName.split(' ')[0]}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {deliv.itemCount} Jars
                    </span>
                    <div className="text-[10px] text-slate-400">{deliv.totalLiters}L</div>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                    ৳{deliv.totalPayable}
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                    ৳{deliv.paidAmount}
                    <div className="text-[9px] text-slate-400 uppercase font-mono">
                      {deliv.paymentMethod}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        deliv.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : deliv.paymentStatus === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {deliv.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openInvoiceModal(deliv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                      title={language === 'bn' ? 'রসিদ দেখুন' : 'View receipt'}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
