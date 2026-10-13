import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompanySettings, Product, User } from '../types';
import {
  Settings as SettingsIcon,
  Building,
  DollarSign,
  CreditCard,
  Users,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    products,
    addProduct,
    updateProduct,
    users,
    addUser,
    updateUser,
    deleteUser,
    openUserDetailsModal,
    openUserEditModal,
    resetAllData,
    language,
    t,
  } = useApp();

  // Company settings form
  const [formData, setFormData] = useState<CompanySettings>(settings);

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('01764996718');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'delivery' | 'manager' | 'customer'>('delivery');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [newUserArea, setNewUserArea] = useState('Dhanmondi');

  // New Product Modal/Fields
  const [newProdName, setNewProdName] = useState('');
  const [newProdSize, setNewProdSize] = useState('');
  const [newProdLiters, setNewProdLiters] = useState('20');
  const [newProdPrice, setNewProdPrice] = useState('80');
  const [showAddProd, setShowAddProd] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSize) return;

    addProduct({
      name: newProdName.trim(),
      size: newProdSize.trim().toUpperCase(),
      volumeLiters: Number(newProdLiters) || 20,
      defaultPrice: Number(newProdPrice) || 80,
      active: true,
    });

    setNewProdName('');
    setNewProdSize('');
    setShowAddProd(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-sky-600" />
          <span>{language === 'bn' ? 'কোম্পানি সেটিংস ও কনফিগারেশন' : 'Company Settings & Pricing'}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'কোম্পানির নাম, ঠিকানা ও স্লোগান যা সব কিউআর স্টিকার ও রসিদে স্বয়ংক্রিয়ভাবে প্রিন্ট হবে'
            : 'Company branding automatically synced to all printed QR stickers and invoices'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Profile Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-sky-600" />
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {language === 'bn' ? 'কোম্পানি প্রোফাইল ও প্রিন্ট ডিটেইলস' : 'Company Branding & Print Header'}
            </h2>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                কোম্পানির নাম (বাংলা)
              </label>
              <input
                type="text"
                value={formData.nameBn}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tagline / স্লোগান
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Helpline Phones
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, phone: '01521311748, 01764996718' })}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 hover:bg-sky-200 text-sky-800 font-mono font-bold cursor-pointer transition"
                    >
                      01521311748, 01764996718
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01521311748, 01764996718"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office / Plant Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Receipt Footer Message (রসিদের নিচের বার্তা)
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooter}
                onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'কোম্পানি তথ্য সেভ করুন' : 'Save Company Details'}</span>
            </button>
          </form>
        </div>

        {/* Product Sizes & Default Pricing */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {language === 'bn' ? 'পানির জারের সাইজ ও ডিফল্ট রেট' : 'Product Sizes & Standard Rates'}
                </h2>
              </div>
              <button
                onClick={() => setShowAddProd(!showAddProd)}
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'নতুন সাইজ' : 'Add Size'}</span>
              </button>
            </div>

            {showAddProd && (
              <form onSubmit={handleAddProduct} className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. 5L Dispenser Bottle"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Size Code</label>
                    <input
                      type="text"
                      placeholder="5L"
                      value={newProdSize}
                      onChange={(e) => setNewProdSize(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-white mt-1 uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Volume (Liters)</label>
                    <input
                      type="number"
                      value={newProdLiters}
                      onChange={(e) => setNewProdLiters(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Default Price (৳)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-white mt-1 font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProd(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold"
                  >
                    Save Size
                  </button>
                </div>
              </form>
            )}

            {/* List of existing products */}
            <div className="space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {prod.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {prod.size}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Volume: {prod.volumeLiters} Liters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Rate:</span>
                    <input
                      type="number"
                      value={prod.defaultPrice}
                      onChange={(e) =>
                        updateProduct({ ...prod, defaultPrice: Number(e.target.value) })
                      }
                      className="w-20 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-black text-xs text-right text-emerald-600"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">৳</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods Activation */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'পেমেন্ট মাধ্যম সমূহ' : 'Payment Gateways & Methods'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Cash (নগদ টাকা)', key: 'enableCash' },
                { label: 'bKash (বিকাশ)', key: 'enableBkash' },
                { label: 'Nagad (নগদ)', key: 'enableNagad' },
                { label: 'Bank Transfer (ব্যাংক)', key: 'enableBank' },
              ].map((m) => (
                <div
                  key={m.key}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between border"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-rose-900 dark:text-rose-200">
                {language === 'bn' ? 'ডেমো ডেটা রিসেট করুন' : 'Reset All System Demo Data'}
              </h3>
              <p className="text-[10px] text-rose-600 mt-0.5">
                {language === 'bn'
                  ? 'পূর্ববর্তী সব নমুনা ক্লায়েন্ট, ডেলিভারি ও কিউআর রিস্টোর হবে'
                  : 'Restores initial clean demo database state for testing'}
              </p>
            </div>
            <button
              onClick={resetAllData}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TEAM & USER MANAGEMENT SECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'bn' ? 'টিম ও ইউজার ম্যানেজমেন্ট' : 'Team & User Accounts Management'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'মালিক, ডেলিভারি রাইডার ও গ্রাহক অ্যাকাউন্ট পরিচালনা করুন (ছবি, ফোন ও রোল আপডেট)'
                : 'Manage admin, riders, managers, and customer accounts with custom photos and phones'}
            </p>
          </div>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন ইউজার যোগ করুন' : 'Add New User'}</span>
          </button>
        </div>

        {/* Users Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 flex flex-col justify-between transition hover:border-sky-300 dark:hover:border-sky-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* User Photo */}
                    <div className="relative shrink-0">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-black text-lg flex items-center justify-center border border-sky-300 dark:border-sky-700">
                          {u.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      {/* CLICKABLE USER NAME */}
                      <button
                        onClick={() => openUserDetailsModal(u)}
                        className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer truncate text-left block"
                        title={language === 'bn' ? 'ইউজার বিবরণ দেখতে ক্লিক করুন' : 'Click to view user details'}
                      >
                        {u.name}
                      </button>
                      <div className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                        {u.phone}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : u.role === 'delivery'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : u.role === 'manager'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>

                {u.address && (
                  <p className="text-[11px] text-slate-500 truncate mb-2">
                    {u.address} {u.area ? `(${u.area})` : ''}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => openUserDetailsModal(u)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold text-xs border border-slate-200 dark:border-slate-700 text-center transition cursor-pointer"
                >
                  {language === 'bn' ? 'বিবরণ দেখুন' : 'View Details'}
                </button>

                <button
                  onClick={() => openUserEditModal(u)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center shadow-2xs transition cursor-pointer"
                >
                  {language === 'bn' ? 'এডিট ও ছবি' : 'Edit Profile'}
                </button>

                {u.id !== 'user-admin' && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Delete user"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {language === 'bn' ? 'নতুন ইউজার বা স্টাফ যোগ করুন' : 'Add New Staff / User'}
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserName.trim() || !newUserPhone.trim()) return;
                addUser({
                  name: newUserName.trim(),
                  phone: newUserPhone.trim(),
                  role: newUserRole,
                  avatar: newUserAvatar.trim() || undefined,
                  address: newUserAddress.trim() || undefined,
                  area: newUserArea.trim() || undefined,
                  active: true,
                });
                setNewUserName('');
                setNewUserPhone('01764996718');
                setNewUserAvatar('');
                setShowAddUserModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Phone Number *
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setNewUserPhone('01521311748')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 text-sky-800 font-mono font-bold"
                    >
                      01521311748
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewUserPhone('01764996718')}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold"
                    >
                      01764996718
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="delivery">Delivery Staff (রাইডার)</option>
                  <option value="manager">Manager / Accountant (ম্যানেজার)</option>
                  <option value="customer">Customer / Client (গ্রাহক)</option>
                  <option value="admin">Admin / Owner (মালিক)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={newUserAvatar}
                  onChange={(e) => setNewUserAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newUserAddress}
                    onChange={(e) => setNewUserAddress(e.target.value)}
                    placeholder="Area / Flat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    value={newUserArea}
                    onChange={(e) => setNewUserArea(e.target.value)}
                    placeholder="Dhanmondi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-sm cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
