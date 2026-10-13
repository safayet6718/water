import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, SupplyItem, PaymentMethod } from '../types';
import {
  Factory,
  Plus,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  Layers,
  ArrowUpRight,
  HandCoins,
  FileSpreadsheet,
  X,
  CreditCard,
} from 'lucide-react';

export const SuppliersList: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    supplies,
    supplierPayments,
    recordSupply,
    recordSupplierPayment,
    formatCurrency,
    formatNumber,
    language,
    t,
  } = useApp();

  // Modals
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isSupplyEntryOpen, setIsSupplyEntryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [ledgerSupplier, setLedgerSupplier] = useState<Supplier | null>(null);

  // Supplier Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [itemsSupplied, setItemsSupplied] = useState('');

  // Supply Entry Form
  const [supplySupplierId, setSupplySupplierId] = useState('');
  const [supplyDate, setSupplyDate] = useState(new Date().toISOString().slice(0, 10));
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([
    { id: '1', itemName: '20L Polycarbonate Jars', quantity: 50, rate: 320, amount: 16000 },
  ]);
  const [supplyPaidAmount, setSupplyPaidAmount] = useState('10000');
  const [supplyMethod, setSupplyMethod] = useState<PaymentMethod>('bank');
  const [supplyNotes, setSupplyNotes] = useState('');

  // Payment Form
  const [paySupplierId, setPaySupplierId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('bank');
  const [payNotes, setPayNotes] = useState('');

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSupplier({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      itemsSupplied: itemsSupplied.split(',').map((s) => s.trim()).filter(Boolean),
      active: true,
    });

    setName('');
    setPhone('');
    setAddress('');
    setItemsSupplied('');
    setIsAddSupplierOpen(false);
  };

  const handleSupplyItemChange = (index: number, field: keyof SupplyItem, value: any) => {
    setSupplyItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        item.amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      }
      copy[index] = item;
      return copy;
    });
  };

  const handleAddSupplyRow = () => {
    setSupplyItems((prev) => [
      ...prev,
      { id: String(Date.now()), itemName: 'Jar Caps 55mm', quantity: 500, rate: 5, amount: 2500 },
    ]);
  };

  const handleRemoveSupplyRow = (index: number) => {
    setSupplyItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const supplyTotalAmount = supplyItems.reduce((acc, it) => acc + it.amount, 0);

  const handleSubmitSupply = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplySupplierId);
    if (!sup) return;

    recordSupply({
      supplierId: sup.id,
      supplierName: sup.name,
      date: supplyDate,
      items: supplyItems,
      totalAmount: supplyTotalAmount,
      paidAmount: Number(supplyPaidAmount) || 0,
      paymentMethod: supplyMethod,
      notes: supplyNotes.trim() || undefined,
    });

    setIsSupplyEntryOpen(false);
  };

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === paySupplierId);
    if (!sup || !payAmount) return;

    recordSupplierPayment({
      supplierId: sup.id,
      supplierName: sup.name,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      notes: payNotes.trim() || undefined,
      date: new Date().toISOString().slice(0, 10),
    });

    setIsPaymentOpen(false);
    setPayAmount('');
    setPayNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Factory className="w-6 h-6 text-sky-600" />
            <span>{language === 'bn' ? 'সাপ্লায়ার ও কাঁচামাল ম্যানেজমেন্ট' : 'Supplier Management & Supplies'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'জার, ক্যাপ, লেবেল এবং ফিল্টার সরবরাহকারী প্রতিষ্ঠান ও তাদের দেনা-পাওনা'
              : 'Jar, cap, and filter suppliers ledger, supply purchases, and payables'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setSupplySupplierId(suppliers[0]?.id || '');
              setIsSupplyEntryOpen(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'মাল জমার এন্ট্রি' : 'New Supply Entry'}</span>
          </button>

          <button
            onClick={() => {
              setPaySupplierId(suppliers[0]?.id || '');
              setIsPaymentOpen(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'টাকা পরিশোধ' : 'Pay Supplier'}</span>
          </button>

          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            + {language === 'bn' ? 'নতুন সাপ্লায়ার' : 'Supplier'}
          </button>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-lg">
                  VENDOR
                </span>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">DUE (বাকি)</span>
                  <span className={`text-base font-black ${sup.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ৳{sup.currentDue}
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                {sup.name}
              </h3>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sup.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{sup.address}</span>
                </div>
              </div>

              {/* Items supplied tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {sup.itemsSupplied.map((it, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    {it}
                  </span>
                ))}
              </div>

              {/* Ledger Summary Box */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Supplied:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ৳{sup.totalSupplied}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Paid:</span>
                  <span className="font-bold text-emerald-600">
                    ৳{sup.totalPaid}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setLedgerSupplier(sup)}
                className="py-1.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-bold transition flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সাপ্লায়ার লেজার' : 'View Ledger'}</span>
              </button>

              <button
                onClick={() => deleteSupplier(sup.id)}
                className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NEW SUPPLY ENTRY MODAL */}
      {isSupplyEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'নতুন মাল জমার এন্ট্রি (Purchase Supply)' : 'New Supply Purchase'}
            </h2>

            <form onSubmit={handleSubmitSupply} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier *
                  </label>
                  <select
                    value={supplySupplierId}
                    onChange={(e) => setSupplySupplierId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Due: ৳{s.currentDue})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={supplyDate}
                    onChange={(e) => setSupplyDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Supply Items Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden p-3 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>Purchased Materials & Parts</span>
                  <button
                    type="button"
                    onClick={handleAddSupplyRow}
                    className="text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Row
                  </button>
                </div>

                {supplyItems.map((item, idx) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-xs">
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => handleSupplyItemChange(idx, 'itemName', e.target.value)}
                      placeholder="Item name"
                      className="col-span-5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleSupplyItemChange(idx, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleSupplyItemChange(idx, 'rate', Number(e.target.value))}
                      placeholder="Rate"
                      className="col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-right"
                    />
                    <div className="col-span-2 font-bold text-right text-slate-800 dark:text-slate-200">
                      ৳{item.amount}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSupplyRow(idx)}
                      className="col-span-1 text-slate-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Bill:</span>
                  <span>৳{supplyTotalAmount}</span>
                </div>
              </div>

              {/* Payment Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Paid Right Now (৳)
                  </label>
                  <input
                    type="number"
                    value={supplyPaidAmount}
                    onChange={(e) => setSupplyPaidAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={supplyMethod}
                    onChange={(e) => setSupplyMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="bank">Bank / Cheque</option>
                    <option value="cash">Cash</option>
                    <option value="bkash">bKash</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupplyEntryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-sm"
                >
                  Save Supply Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY SUPPLIER MODAL */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'সাপ্লায়ারকে বকেয়া পরিশোধ' : 'Record Supplier Payment'}
            </h2>

            <form onSubmit={handlePaySupplierSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supplier *
                </label>
                <select
                  value={paySupplierId}
                  onChange={(e) => setPaySupplierId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Due: ৳{s.currentDue})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount (৳) *
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="bank">Bank Transfer / Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="bkash">bKash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Cheque No / Purpose"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW SUPPLIER MODAL */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.addSupplier}
            </h2>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Supplier Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Padma Plastics Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="BSCIC, Tongi, Gazipur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Items Supplied (comma separated)
                </label>
                <input
                  type="text"
                  value={itemsSupplied}
                  onChange={(e) => setItemsSupplied(e.target.value)}
                  placeholder="20L Jars, Jar Caps, Labels, Filters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-sm"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPLIER LEDGER MODAL */}
      {ledgerSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 my-auto space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {ledgerSupplier.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{ledgerSupplier.address} • {ledgerSupplier.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Remaining Due</span>
                <span className="text-lg font-black text-rose-600">৳{ledgerSupplier.currentDue}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">Purchases & Supply Bills</h4>
              {supplies.filter((s) => s.supplierId === ledgerSupplier.id).map((s) => (
                <div key={s.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{s.billNo}</div>
                    <div className="text-[10px] text-slate-400">
                      {s.date} • {s.items.map((i) => `${i.itemName} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">৳{s.totalAmount}</div>
                    <span className="text-[10px] text-emerald-600">Paid: ৳{s.paidAmount}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setLedgerSupplier(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
