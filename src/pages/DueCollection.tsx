import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client, PaymentMethod, CashHandover } from '../types';
import {
  HandCoins,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Receipt,
  Phone,
  Calendar,
} from 'lucide-react';

export const DueCollection: React.FC = () => {
  const {
    clients,
    clientPayments,
    recordClientPayment,
    deliveries,
    cashHandovers,
    recordCashHandover,
    acceptCashHandover,
    currentUser,
    users,
    formatCurrency,
    formatNumber,
    openClientProfileModal,
    openUserDetailsModal,
    language,
    t,
  } = useApp();

  // Due Collection Form
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [collectionAmount, setCollectionAmount] = useState<string>('');
  const [collectionMethod, setCollectionMethod] = useState<PaymentMethod>('cash');
  const [trxId, setTrxId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [handoverAmount, setHandoverAmount] = useState<string>('');
  const [handoverNotes, setHandoverNotes] = useState<string>('');

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleCollectDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !collectionAmount) return;

    const amount = Number(collectionAmount);
    if (amount <= 0) return;

    recordClientPayment({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      amount,
      paymentMethod: collectionMethod,
      trxId: trxId.trim() || undefined,
      receivedById: currentUser.id,
      receivedByName: currentUser.name,
      notes: notes.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
    });

    setCollectionAmount('');
    setTrxId('');
    setNotes('');
    setSelectedClientId('');
  };

  const handleDepositCash = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(handoverAmount);
    if (amount <= 0) return;

    recordCashHandover(amount, handoverNotes.trim() || undefined);
    setHandoverAmount('');
    setHandoverNotes('');
  };

  // Agent Cash in Hand calculation for today
  const todayStr = new Date().toISOString().slice(0, 10);
  const myDeliveriesToday = deliveries.filter(
    (d) => d.deliveryManId === currentUser.id && d.createdAt.slice(0, 10) === todayStr
  );
  const myCashFromDeliveries = myDeliveriesToday
    .filter((d) => d.paymentMethod === 'cash')
    .reduce((acc, d) => acc + d.paidAmount, 0);

  const myCollectionsToday = clientPayments.filter(
    (p) => p.receivedById === currentUser.id && p.date === todayStr && p.paymentMethod === 'cash'
  );
  const myCashFromDues = myCollectionsToday.reduce((acc, p) => acc + p.amount, 0);

  const totalCashCollectedToday = myCashFromDeliveries + myCashFromDues;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <HandCoins className="w-6 h-6 text-sky-600" />
          <span>{language === 'bn' ? 'বকেয়া আদায় ও ক্যাশ জমা' : 'Due Collection & Cash Management'}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'ডেলিভারি ছাড়া সরাসরি পুরাতন বকেয়া আদায় এবং মালিকের নিকট ক্যাশ জমা'
            : 'Collect past dues directly without delivery, and reconcile cash-in-hand handovers'}
        </p>
      </div>

      {/* Grid: Cash in hand snapshot & Receive Due Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Cash in Hand & Handover */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {language === 'bn' ? 'হাতে নগদ ক্যাশ (আজ)' : "Today's Cash in Hand"}
              </span>
            </div>

            <div className="text-3xl font-black">
              {formatCurrency(totalCashCollectedToday)}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি থেকে ক্যাশ:' : 'From Deliveries:'}</span>
                <span className="font-bold text-white">৳{myCashFromDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'বকেয়া আদায় থেকে ক্যাশ:' : 'From Past Dues:'}</span>
                <span className="font-bold text-white">৳{myCashFromDues}</span>
              </div>
            </div>
          </div>

          {/* Handover request form for Delivery Man */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              {language === 'bn' ? 'মালিককে ক্যাশ জমা প্রদান' : 'Deposit Cash to Owner'}
            </h3>
            <form onSubmit={handleDepositCash} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  required
                  value={handoverAmount}
                  onChange={(e) => setHandoverAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Dhanmondi shift collection"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-sky-600 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                {language === 'bn' ? 'জমা রিকোয়েস্ট পাঠান' : 'Submit Handover Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Cols: Due Collection Entry Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <HandCoins className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {language === 'bn' ? 'ক্লায়েন্টের বকেয়া টাকা আদায় (Receive Due)' : 'Collect Outstanding Balance'}
            </h2>
          </div>

          <form onSubmit={handleCollectDue} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'ক্লায়েন্ট নির্বাচন করুন *' : 'Select Customer *'}
              </label>
              <select
                required
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  const cl = clients.find((c) => c.id === e.target.value);
                  if (cl) setCollectionAmount(String(cl.currentDue));
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="">{language === 'bn' ? '-- ক্লায়েন্ট সিলেক্ট করুন --' : '-- Choose Customer --'}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code}) — {language === 'bn' ? 'বাকি: ' : 'Due: '}৳{c.currentDue}
                  </option>
                ))}
              </select>
            </div>

            {selectedClient && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedClient.name}</div>
                  <div className="text-slate-500">{selectedClient.phone} • {selectedClient.address}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Due Amount</span>
                  <span className="text-base font-black text-rose-600">৳{selectedClient.currentDue}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'আদায়কৃত টাকা (৳) *' : 'Amount Collected (৳) *'}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={collectionAmount}
                  onChange={(e) => setCollectionAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.paymentMethod}
                </label>
                <select
                  value={collectionMethod}
                  onChange={(e) => setCollectionMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="cash">{language === 'bn' ? 'ক্যাশ (Cash)' : 'Cash'}</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>

            {(collectionMethod === 'bkash' || collectionMethod === 'nagad') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {collectionMethod.toUpperCase()} {t.trxId}
                </label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 8BK209X"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Note / Description
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Collected past month due balance"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedClient}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              {language === 'bn' ? 'টাকা জমা ও রসিদ এন্ট্রি নিশ্চিত করুন' : 'Confirm Collection & Update Balance'}
            </button>
          </form>
        </div>
      </div>

      {/* Cash Handovers Settlements Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          {language === 'bn' ? 'ক্যাশ জমা হিস্ট্রি (মালিকের নিকট জমা)' : 'Cash Deposit Handover Log'}
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {cashHandovers.map((ch) => (
            <div key={ch.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {ch.deliveryManName} → ৳{ch.amount}
                </div>
                <div className="text-[10px] text-slate-400">
                  Date: {ch.date} {ch.notes ? `• ${ch.notes}` : ''}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ch.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ch.status}
                </span>

                {ch.status === 'pending' && currentUser.role === 'admin' && (
                  <button
                    onClick={() => acceptCashHandover(ch.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                  >
                    {language === 'bn' ? 'গ্রহণ করুন' : 'Accept'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
