import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';
import {
  User as UserIcon,
  Phone,
  Camera,
  Upload,
  Link,
  MapPin,
  Shield,
  Bike,
  Calculator,
  UserCheck,
  CheckCircle2,
  X,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

const AVATAR_PRESETS = [
  {
    name: 'Executive Malik 1',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Executive Malik 2',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rider Rahim',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rider Kamal',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Accountant Tanvir',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Female Executive',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const UserEditModal: React.FC = () => {
  const { editingUser, closeUserEditModal, updateUser, language, t } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('delivery');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [active, setActive] = useState(true);
  const [photoTab, setPhotoTab] = useState<'upload' | 'url' | 'presets'>('upload');

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || '');
      setPhone(editingUser.phone || '');
      setRole(editingUser.role || 'delivery');
      setAvatar(editingUser.avatar || '');
      setPassword(editingUser.password || 'password123');
      setAddress(editingUser.address || '');
      setArea(editingUser.area || '');
      setActive(editingUser.active ?? true);
    }
  }, [editingUser]);

  if (!editingUser) return null;

  // Handle local image file upload (convert to Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert(language === 'bn' ? 'ছবির সাইজ ৩ মেগাবাইটের কম হতে হবে' : 'Photo must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    updateUser({
      ...editingUser,
      name: name.trim(),
      phone: phone.trim(),
      role,
      password: password.trim() || editingUser.password || 'password123',
      avatar: avatar.trim() || undefined,
      address: address.trim() || undefined,
      area: area.trim() || undefined,
      active,
    });

    closeUserEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-600" />
              <span>
                {language === 'bn' ? 'ইউজার তথ্য ও ছবি আপডেট করুন' : 'Edit User Profile & Photo'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'bn'
                ? 'নাম, মোবাইল নম্বর, ছবি ও রোল পরিবর্তন করুন'
                : 'Update user name, phone number, photo avatar, and role'}
            </p>
          </div>
          <button
            onClick={closeUserEditModal}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Avatar Preview & Selection */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 font-black text-xl flex items-center justify-center border-2 border-dashed border-sky-300">
                    {name ? name.charAt(0) : '?'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">
                  {language === 'bn' ? 'প্রোফাইল ছবি (Avatar Photo)' : 'Profile Photo / Avatar'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {language === 'bn'
                    ? 'ফোন বা কম্পিউটার থেকে সরাসরি ফটো আপলোড করুন অথবা ছবি লিংক দিন'
                    : 'Upload direct photo from device or paste image URL'}
                </span>
              </div>
            </div>

            {/* Photo Tabs */}
            <div className="flex rounded-xl bg-slate-200 dark:bg-slate-700/60 p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setPhotoTab('upload')}
                className={`flex-1 py-1 rounded-lg transition ${
                  photoTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                {language === 'bn' ? 'ফটো আপলোড' : 'Upload File'}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('presets')}
                className={`flex-1 py-1 rounded-lg transition ${
                  photoTab === 'presets'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                {language === 'bn' ? 'নমুনা ছবি' : 'Presets'}
              </button>
              <button
                type="button"
                onClick={() => setPhotoTab('url')}
                className={`flex-1 py-1 rounded-lg transition ${
                  photoTab === 'url'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Link className="w-3.5 h-3.5 inline mr-1" />
                {language === 'bn' ? 'ছবি লিংক' : 'Image URL'}
              </button>
            </div>

            {/* Tab 1: File Upload */}
            {photoTab === 'upload' && (
              <div>
                <label className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 bg-white dark:bg-slate-900 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-sky-500 mb-1" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {language === 'bn' ? 'ছবি সিলেক্ট করতে ক্লিক করুন' : 'Click to choose image file'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 3MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Tab 2: Presets */}
            {photoTab === 'presets' && (
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition ${
                      avatar === p.url ? 'border-sky-500 scale-105 shadow-sm' : 'border-transparent hover:opacity-80'
                    }`}
                    title={p.name}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-11 object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Tab 3: URL */}
            {photoTab === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* User Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'ইউজারের পুরো নাম *' : 'Full Name *'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Safayet Hossain / Rahim Mia"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Phone Number with quick suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">{language === 'bn' ? 'সরাসরি সিলেক্ট:' : 'Quick set:'}</span>
                <button
                  type="button"
                  onClick={() => setPhone('01521311748')}
                  className="px-2 py-0.5 rounded-md bg-sky-100 hover:bg-sky-200 text-sky-800 font-mono text-[10px] font-bold transition cursor-pointer"
                >
                  01521311748
                </button>
                <button
                  type="button"
                  onClick={() => setPhone('01764996718')}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-mono text-[10px] font-bold transition cursor-pointer"
                >
                  01764996718
                </button>
              </div>
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01521311748 / 01764996718"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Login Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'bn' ? 'লগইন পাসওয়ার্ড (Login Password) *' : 'Login Password *'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'দেখুন' : 'Show')}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৪ অক্ষর"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'ইউজার রোল (Role) *' : 'User Role *'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'admin', label: 'Admin (মালিক)', icon: <Shield className="w-3.5 h-3.5" /> },
                { id: 'delivery', label: 'Delivery Staff (রাইডার)', icon: <Bike className="w-3.5 h-3.5" /> },
                { id: 'manager', label: 'Manager / Accountant', icon: <Calculator className="w-3.5 h-3.5" /> },
                { id: 'customer', label: 'Customer (গ্রাহক)', icon: <UserCheck className="w-3.5 h-3.5" /> },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as Role)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 font-bold transition cursor-pointer ${
                    role === r.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {r.icon}
                  <span className="truncate">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Address & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ঠিকানা (Address)' : 'Address'}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House 42, Road 5, Dhanmondi"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'এরিয়া / রুট (Area/Route)' : 'Area / Route'}
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Dhanmondi / Gulshan / Mirpur"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                {language === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
              </span>
              <span className="text-[10px] text-slate-400">
                {active
                  ? language === 'bn' ? 'সক্রিয় (Active): ইউজার সিস্টেমে কাজ করতে পারবে' : 'Active: User has system access'
                  : language === 'bn' ? 'নিষ্ক্রিয় (Deactivated): লগইন বা অ্যাক্সেস বন্ধ' : 'Deactivated: Access suspended'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`w-12 h-6 rounded-full transition relative cursor-pointer ${
                active ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition absolute top-0.5 ${
                  active ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeUserEditModal}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md transition cursor-pointer"
            >
              {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
