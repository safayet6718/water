import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import {
  User as UserIcon,
  X,
  Shield,
  Bike,
  Calculator,
  Droplets,
  Plus,
  LogIn,
  CheckCircle2,
  MapPin,
  Phone,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    users,
    switchUserById,
    registerUser,
    language,
    t,
  } = useApp();

  const [mode, setMode] = useState<'switch' | 'register'>('switch');

  // Register Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Dhanmondi');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    registerUser({
      name: name.trim(),
      phone: phone.trim(),
      role,
      address: address.trim() || undefined,
      area: area.trim() || undefined,
    });

    onClose();
  };

  const handleSelectUser = (userId: string) => {
    switchUserById(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {mode === 'switch'
                  ? language === 'bn' ? 'ইউজার লগইন ও রোল নির্বাচন' : 'User Login & Role Switch'
                  : language === 'bn' ? 'নতুন অ্যাকাউন্ট নিবন্ধন (Sign Up)' : 'Create New Account'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'মালিক, রাইডার অথবা গ্রাহক হিসেবে ব্যবহার করুন' : 'Owner, Rider, or Customer account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/30 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-xl transition ${
              mode === 'switch'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'bn' ? 'বিদ্যমান অ্যাকাউন্ট নির্বাচন' : 'Existing Accounts'}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl transition ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            + {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি' : 'Register New User'}
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {mode === 'switch' ? (
            <div className="space-y-4">
              {/* Currently logged in */}
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                    {language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Logged in as'}
                  </span>
                  <span className="font-extrabold text-sm text-sky-900 dark:text-sky-100">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-500 capitalize">
                    Role: {currentUser.role} • {currentUser.phone}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Accounts list */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {language === 'bn' ? 'অন্যান্য অ্যাকাউন্টে সুইচ করুন:' : 'Switch to Account:'}
                </h4>
                <div className="space-y-2">
                  {users.map((u) => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUser(u.id)}
                        className={`w-full text-left p-3 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                          isCurrent
                            ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-700'
                              : u.role === 'delivery'
                              ? 'bg-emerald-100 text-emerald-700'
                              : u.role === 'customer'
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {u.role === 'admin' ? (
                              <Shield className="w-4 h-4" />
                            ) : u.role === 'delivery' ? (
                              <Bike className="w-4 h-4" />
                            ) : u.role === 'customer' ? (
                              <Droplets className="w-4 h-4" />
                            ) : (
                              <Calculator className="w-4 h-4" />
                            )}
                          </div>

                          <div>
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {u.role === 'customer'
                                ? language === 'bn' ? 'গ্রাহক (অনলাইন অর্ডার ও ব্যালেন্স)' : 'Customer (Online Orders)'
                                : u.role === 'delivery'
                                ? language === 'bn' ? 'ডেলিভারি রাইডার' : 'Delivery Rider'
                                : u.role}
                            </div>
                          </div>
                        </div>

                        {isCurrent && (
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Role selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'bn' ? 'ভূমিকা / রোল নির্বাচন করুন *' : 'Select Account Role *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'customer', label: language === 'bn' ? 'গ্রাহক' : 'Customer', icon: Droplets },
                    { id: 'delivery', label: language === 'bn' ? 'রাইডার' : 'Rider', icon: Bike },
                    { id: 'manager', label: language === 'bn' ? 'ম্যানেজার' : 'Staff', icon: Calculator },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as Role)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                        role === r.id
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-2xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <r.icon className="w-4 h-4" />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / নাম *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number / মোবাইল *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {role === 'customer' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Area / Route (এলাকা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Address / বাসার ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House 12, Road 4, Flat 3B"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition cursor-pointer"
              >
                {language === 'bn' ? 'অ্যাকাউন্ট তৈরি ও সাইন ইন' : 'Create Account & Log In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
