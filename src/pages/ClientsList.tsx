import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client, Product } from '../types';
import { ClientQRCardModal } from '../components/ClientQRCardModal';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  QrCode,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  HandCoins,
  FileText,
  Filter,
} from 'lucide-react';

export const ClientsList: React.FC = () => {
  const {
    clients,
    products,
    addClient,
    updateClient,
    deleteClient,
    toggleClientActive,
    deliveries,
    clientPayments,
    formatCurrency,
    formatNumber,
    openClientProfileModal,
    openInvoiceModal,
    language,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [qrModalClient, setQrModalClient] = useState<Client | null>(null);
  const [ledgerClient, setLedgerClient] = useState<Client | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formOpeningDue, setFormOpeningDue] = useState('0');
  const [formNotes, setFormNotes] = useState('');
  const [formCustomPrices, setFormCustomPrices] = useState<Record<string, number>>({});

  // Distinct areas
  const areas = Array.from(new Set(clients.map((c) => c.area))).filter(Boolean);

  const openAddModal = () => {
    setEditingClient(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormArea('Dhanmondi');
    setFormOpeningDue('0');
    setFormNotes('');
    setFormCustomPrices({});
    setIsAddEditOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormPhone(client.phone);
    setFormAddress(client.address);
    setFormArea(client.area);
    setFormOpeningDue(String(client.openingDue));
    setFormNotes(client.notes || '');
    setFormCustomPrices(client.customPrices || {});
    setIsAddEditOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    if (editingClient) {
      updateClient({
        ...editingClient,
        name: formName.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
        area: formArea.trim(),
        openingDue: Number(formOpeningDue) || 0,
        notes: formNotes.trim() || undefined,
        customPrices: Object.keys(formCustomPrices).length > 0 ? formCustomPrices : undefined,
      });
    } else {
      addClient({
        name: formName.trim(),
        phone: formPhone.trim(),
        address: formAddress.trim(),
        area: formArea.trim(),
        openingDue: Number(formOpeningDue) || 0,
        active: true,
        notes: formNotes.trim() || undefined,
        customPrices: Object.keys(formCustomPrices).length > 0 ? formCustomPrices : undefined,
      });
    }
    setIsAddEditOpen(false);
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === 'all' || c.area === selectedArea;
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'active' && c.active) ||
      (activeFilter === 'inactive' && !c.active);
    return matchesSearch && matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            <span>{language === 'bn' ? 'গ্রাহক ও ক্লায়েন্ট তালিকা' : 'Client Directory'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'গ্রাহকের দরজার কিউআর কার্ড প্রিন্ট, বকেয়া এবং ডেলিভারি হিসাব'
              : 'Door QR cards, ledgers, custom corporate pricing, and balances'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer transition active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addClient}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, মোবাইল, আইডি বা ঠিকানা খুঁজুন...' : 'Search by name, phone, CL-ID...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'bn' ? 'সকল এলাকা / রুট' : 'All Areas'}</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Active status filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'bn' ? 'সব ক্লায়েন্ট' : 'All Status'}</option>
            <option value="active">{language === 'bn' ? 'সক্রিয়' : 'Active'}</option>
            <option value="inactive">{language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientDeliveries = deliveries.filter((d) => d.clientId === client.id);
          const totalJarsDelivered = clientDeliveries.reduce((acc, d) => acc + d.itemCount, 0);

          return (
            <div
              key={client.id}
              className={`p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between ${
                !client.active
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-lg">
                      {client.code}
                    </span>
                    <button
                      onClick={() => toggleClientActive(client.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        client.active
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                      title="Click to toggle active status"
                    >
                      {client.active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'bn' ? 'বকেয়া (Due)' : 'Current Due'}
                    </span>
                    <span
                      className={`text-sm font-black ${
                        client.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      ৳{client.currentDue}
                    </span>
                  </div>
                </div>

                {/* Name & Contact - CLICKABLE! */}
                <button
                  onClick={() => openClientProfileModal(client)}
                  className="font-extrabold text-base text-slate-900 dark:text-white mt-1 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer text-left block"
                  title={language === 'bn' ? 'গ্রাহক প্রোফাইল ও বিবরণ দেখতে ক্লিক করুন' : 'Click to view client profile'}
                >
                  {client.name}
                </button>
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{client.address} ({client.area})</span>
                  </div>
                </div>

                {/* Stats badge */}
                <div className="mt-3 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">
                    {language === 'bn' ? 'ডেলিভারি নিয়েছে:' : 'Total Jars:'}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {formatNumber(totalJarsDelivered)} Jars
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setQrModalClient(client)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কিউআর কার্ড' : 'Door QR'}</span>
                </button>

                <button
                  onClick={() => openClientProfileModal(client)}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  title="View Ledger & Profile"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্রোফাইল ও খতিয়ান' : 'Profile'}</span>
                </button>

                <button
                  onClick={() => openEditModal(client)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteClient(client.id)}
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLIENT ADD / EDIT MODAL */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingClient ? t.editClient : t.addClient}
            </h2>

            <form onSubmit={handleSaveClient} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.clientName} *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Mahbubur Rahman / Green Valley Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.area} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.address}
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="House 42, Road 5, Flat 3B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {!editingClient && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.openingDue}
                  </label>
                  <input
                    type="number"
                    value={formOpeningDue}
                    onChange={(e) => setFormOpeningDue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {/* Custom Prices Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {language === 'bn' ? 'বিশেষ কাস্টম দর (ঐচ্ছিক):' : 'Custom Corporate Prices (Optional):'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {products.map((p) => (
                    <div key={p.id}>
                      <span className="text-[10px] text-slate-500 font-semibold block">{p.name}</span>
                      <input
                        type="number"
                        placeholder={`৳${p.defaultPrice}`}
                        value={formCustomPrices[p.id] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormCustomPrices((prev) => {
                            if (!val) {
                              const copy = { ...prev };
                              delete copy[p.id];
                              return copy;
                            }
                            return { ...prev, [p.id]: Number(val) };
                          });
                        }}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Gate code, delivery preferences, monthly bill rules..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT DOOR QR CARD MODAL */}
      <ClientQRCardModal
        isOpen={!!qrModalClient}
        onClose={() => setQrModalClient(null)}
        client={qrModalClient}
      />

      {/* CLIENT PROFILE / LEDGER MODAL */}
      {ledgerClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    {ledgerClient.name}
                  </h2>
                  <span className="font-mono text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-lg">
                    {ledgerClient.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{ledgerClient.address} • {ledgerClient.phone}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Current Due</span>
                <span className="text-lg font-black text-rose-600">৳{ledgerClient.currentDue}</span>
              </div>
            </div>

            {/* Delivery & Payment records */}
            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'bn' ? 'ডেলিভারি চালান হিস্ট্রি' : 'Delivery History'}
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {deliveries.filter((d) => d.clientId === ledgerClient.id).map((d) => (
                    <div key={d.id} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{d.invoiceNo}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(d.createdAt).toLocaleDateString()} • {d.itemCount} Jars ({d.totalLiters}L)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-white">৳{d.billAmount}</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          Paid: ৳{d.paidAmount} ({d.paymentMethod})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {language === 'bn' ? 'বকেয়া জমার হিস্ট্রি' : 'Direct Due Payment Receipts'}
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {clientPayments.filter((p) => p.clientId === ledgerClient.id).map((p) => (
                    <div key={p.id} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-emerald-700">{p.receiptNo}</div>
                        <div className="text-[10px] text-slate-400">
                          {p.date} • by {p.receivedByName}
                        </div>
                      </div>
                      <div className="text-right font-black text-emerald-600">
                        +৳{p.amount} ({p.paymentMethod})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setLedgerClient(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800"
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
