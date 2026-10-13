import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Delivery } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';
import {
  TrendingUp,
  Droplets,
  Truck,
  AlertCircle,
  Receipt,
  QrCode,
  Boxes,
  HandCoins,
  Factory,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    deliveries,
    clients,
    suppliers,
    jarQrs,
    formatCurrency,
    formatNumber,
    language,
    t,
    setActiveTab,
    openInvoiceModal,
    openClientProfileModal,
    openUserDetailsModal,
  } = useApp();

  // Calculations
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysDeliveries = deliveries.filter((d) => d.createdAt.slice(0, 10) === todayStr);

  const todaysSales = todaysDeliveries.reduce((acc, d) => acc + d.billAmount, 0);
  const todaysCollection = todaysDeliveries.reduce((acc, d) => acc + d.paidAmount, 0);
  const todaysJarsCount = todaysDeliveries.reduce((acc, d) => acc + d.itemCount, 0);
  const todaysLiters = todaysDeliveries.reduce((acc, d) => acc + d.totalLiters, 0);

  const totalClientDue = clients.reduce((acc, c) => acc + c.currentDue, 0);
  const totalSupplierDue = suppliers.reduce((acc, s) => acc + s.currentDue, 0);

  const unusedQrsCount = jarQrs.filter((q) => q.status === 'unused').length;
  const deliveredQrsCount = jarQrs.filter((q) => q.status === 'delivered').length;

  // Top clients by volume
  const clientVolumeMap: Record<string, { name: string; liters: number; due: number }> = {};
  deliveries.forEach((d) => {
    if (!clientVolumeMap[d.clientId]) {
      clientVolumeMap[d.clientId] = { name: d.clientName, liters: 0, due: 0 };
    }
    clientVolumeMap[d.clientId].liters += d.totalLiters;
  });
  clients.forEach((c) => {
    if (clientVolumeMap[c.id]) {
      clientVolumeMap[c.id].due = c.currentDue;
    }
  });

  const topClients = Object.values(clientVolumeMap)
    .sort((a, b) => b.liters - a.liters)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {language === 'bn' ? 'মালিক ও অপারেশন ড্যাশবোর্ড' : 'Operations & Sales Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'bn'
              ? 'দৈনিক পানির জার ডেলিভারি, কিউআর ট্র্যাকিং এবং বকেয়ার লাইভ সারসংক্ষেপ'
              : 'Live tracking of water jars, QR stickers, sales, and credit ledgers'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('new-delivery')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্ক্যান ডেলিভারি' : 'Scan & Deliver'}</span>
          </button>
          <button
            onClick={() => setActiveTab('qr-generator')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-sky-600" />
            <span>{language === 'bn' ? 'কিউআর তৈরি' : 'Gen Jar QRs'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.todaysSales}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(todaysSales)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {todaysDeliveries.length} {language === 'bn' ? 'টি চালান আজ' : 'invoices today'}
          </div>
        </div>

        {/* Today's Collection */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.todaysCollection}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
              <HandCoins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(todaysCollection)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {language === 'bn' ? 'ক্যাশ + বিকাশ + নগদ আদায়' : 'Cash + Digital collected'}
          </div>
        </div>

        {/* Total Client Due */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.totalClientDue}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(totalClientDue)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {clients.filter((c) => c.currentDue > 0).length} {language === 'bn' ? 'গ্রাহকের বকেয়া বাকি' : 'clients have dues'}
          </div>
        </div>

        {/* Deliveries & Liters */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'আজকের মোট পানি' : 'Water Delivered'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(todaysLiters)} <span className="text-sm font-bold text-slate-500">Liters</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {todaysJarsCount} {language === 'bn' ? 'টি জার সরবরাহ হয়েছে' : 'bottles/jars dispatched'}
          </div>
        </div>
      </div>

      {/* QR Sticker Inventory Status & Supplier Due */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* QR Stickers Status Box */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-3xl shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-sky-400" />
              <h3 className="font-extrabold text-sm tracking-wide">
                {language === 'bn' ? 'কিউআর স্টিকার ইনভেন্টরি অবস্থা' : 'Jar QR Sticker Inventory'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('qr-generator')}
              className="text-xs text-sky-300 hover:text-white font-bold flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'নতুন ব্যাচ তৈরি' : 'Generate More'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
            <div className="p-3 bg-white/5 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-sky-300 block">
                {language === 'bn' ? 'তৈরি করা মোট কিউআর' : 'Total Generated'}
              </span>
              <span className="text-xl font-black mt-1 block">
                {formatNumber(jarQrs.length)}
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                {language === 'bn' ? 'অব্যবহৃত (প্রিন্ট/স্টক)' : 'Unused (Ready)'}
              </span>
              <span className="text-xl font-black text-emerald-400 mt-1 block">
                {formatNumber(unusedQrsCount)}
              </span>
            </div>

            <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20">
              <span className="text-[10px] uppercase font-bold text-sky-400 block">
                {language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}
              </span>
              <span className="text-xl font-black text-sky-400 mt-1 block">
                {formatNumber(deliveredQrsCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Supplier Due Snapshot */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {t.totalSupplierDue}
              </span>
              <Factory className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {formatCurrency(totalSupplierDue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn'
                ? 'জার, ক্যাপ এবং আর.ও ফিল্টার সাপ্লায়ারদের বাকি'
                : 'Outstanding balance for jar & cap supplies'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('suppliers')}
            className="mt-4 w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>{language === 'bn' ? 'সাপ্লায়ার লেজার দেখুন' : 'View Supplier Ledger'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Deliveries Table & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Deliveries List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-600" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {t.recentDeliveries}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('deliveries')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              {t.viewAll} →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {deliveries.slice(0, 6).map((deliv) => (
              <div
                key={deliv.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 px-2 rounded-xl transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* CLICKABLE CLIENT NAME */}
                    <button
                      onClick={() => openClientProfileModal(deliv.clientId || deliv.clientName)}
                      className="font-bold text-xs text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer truncate text-left"
                      title={language === 'bn' ? 'গ্রাহক প্রোফাইল ও বিবরণ দেখতে ক্লিক করুন' : 'Click to view client details'}
                    >
                      {deliv.clientName}
                    </button>

                    {/* CLICKABLE INVOICE NUMBER */}
                    <button
                      onClick={() => openInvoiceModal(deliv)}
                      className="font-mono text-[10px] text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 transition"
                      title={language === 'bn' ? 'রসিদ ও মেমো দেখতে ক্লিক করুন' : 'Click to view receipt'}
                    >
                      <Receipt className="w-3 h-3 text-sky-500" />
                      <span>{deliv.invoiceNo}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <span>{deliv.itemCount} Jars ({deliv.totalLiters}L) • by</span>
                    {/* CLICKABLE RIDER NAME */}
                    <button
                      onClick={() => openUserDetailsModal(deliv.deliveryManId || deliv.deliveryManName)}
                      className="hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer font-bold text-slate-700 dark:text-slate-300"
                      title={language === 'bn' ? 'ডেলিভারি ম্যান প্রোফাইল দেখতে ক্লিক করুন' : 'View rider profile'}
                    >
                      {deliv.deliveryManName.split(' ')[0]}
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                      ৳{deliv.totalPayable}
                    </div>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        deliv.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : deliv.paymentStatus === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {deliv.paymentStatus}
                    </span>
                  </div>

                  {/* Click to open receipt */}
                  <button
                    onClick={() => openInvoiceModal(deliv)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-950 text-slate-600 dark:text-slate-300 hover:text-sky-700 transition cursor-pointer"
                    title={language === 'bn' ? 'রসিদ দেখুন' : 'View Receipt'}
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Top Volume Clients */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-600" />
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'সর্বোচ্চ পানি নেওয়া ক্লায়েন্ট' : 'Top Volume Clients'}
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {topClients.map((cl, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="min-w-0">
                  {/* CLICKABLE TOP CLIENT NAME */}
                  <button
                    onClick={() => openClientProfileModal(cl.name)}
                    className="font-bold text-xs text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer truncate text-left block"
                    title={language === 'bn' ? 'গ্রাহক প্রোফাইল দেখতে ক্লিক করুন' : 'Click to view client details'}
                  >
                    {cl.name}
                  </button>
                  <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5">
                    {formatNumber(cl.liters)} Liters consumed
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Due</span>
                  <span
                    className={`text-xs font-bold ${
                      cl.due > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    ৳{cl.due}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 text-center block transition cursor-pointer"
            >
              {language === 'bn' ? 'বিস্তারিত মাসিক লিটার রিপোর্ট →' : 'Detailed Liter Consumption Report →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
