import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  QrCode,
  Truck,
  Users,
  Factory,
  Boxes,
  HandCoins,
  BarChart3,
  Settings as SettingsIcon,
  X,
  History,
  Wallet,
  Clock,
  Droplets,
  PlusCircle,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, activeTab, setActiveTab, orderRequests, language, t, logout } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const pendingOrdersCount = orderRequests.filter((o) => o.status === 'pending').length;

  // Menu items for Customer / Client
  const customerNavItems: NavItem[] = [
    {
      id: 'customer-portal',
      label: language === 'bn' ? 'পানি অর্ডার করুন (হোম)' : 'Order Water (Portal)',
      icon: Droplets,
      highlight: true,
    },
    {
      id: 'orders',
      label: language === 'bn' ? 'আমার অর্ডার ট্র্যাকিং' : 'My Orders & Tracking',
      icon: Clock,
    },
    {
      id: 'my-deliveries',
      label: language === 'bn' ? 'ডেলিভারি মেমো হিস্ট্রি' : 'Past Invoices',
      icon: History,
    },
  ];

  // Menu items for Delivery Agent (Mobile-first)
  const deliveryNavItems: NavItem[] = [
    {
      id: 'new-delivery',
      label: language === 'bn' ? 'নতুন ডেলিভারি (স্ক্যান)' : 'New Delivery (Scan)',
      icon: QrCode,
      highlight: true,
    },
    {
      id: 'orders',
      label: language === 'bn' ? 'অর্ডার রিকোয়েস্ট সমূহ' : 'Order Requests',
      icon: Clock,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'my-deliveries',
      label: language === 'bn' ? 'আমার ডেলিভারি হিস্ট্রি' : 'My Delivery History',
      icon: History,
    },
    {
      id: 'due-collection',
      label: language === 'bn' ? 'বকেয়া আদায় ও জমা' : 'Due Collection & Cash',
      icon: Wallet,
    },
  ];

  // Menu items for Admin & Manager
  const fullNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: language === 'bn' ? 'অর্ডার রিকোয়েস্ট' : 'Order Requests',
      icon: Clock,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    {
      id: 'new-delivery',
      label: language === 'bn' ? 'স্ক্যান ও ডেলিভারি' : 'Scan & Deliver',
      icon: QrCode,
      highlight: true,
    },
    {
      id: 'deliveries',
      label: t.deliveries,
      icon: Truck,
    },
    {
      id: 'clients',
      label: t.clients,
      icon: Users,
    },
    {
      id: 'due-collection',
      label: t.dueCollection,
      icon: HandCoins,
    },
    {
      id: 'qr-generator',
      label: t.qrGenerator,
      icon: Boxes,
    },
    ...(currentUser.role === 'admin'
      ? [
          {
            id: 'suppliers',
            label: t.suppliers,
            icon: Factory,
          },
        ]
      : []),
    {
      id: 'reports',
      label: t.reports,
      icon: BarChart3,
    },
    ...(currentUser.role === 'admin'
      ? [
          {
            id: 'settings',
            label: t.settings,
            icon: SettingsIcon,
          },
        ]
      : []),
  ];

  const items =
    currentUser.role === 'customer'
      ? customerNavItems
      : currentUser.role === 'delivery'
      ? deliveryNavItems
      : fullNavItems;

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:z-10 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
              AT
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              {currentUser.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Alert / Notice */}
        <div className="px-3 pt-3">
          <div
            className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
              currentUser.role === 'customer'
                ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
                : currentUser.role === 'delivery'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : currentUser.role === 'admin'
                ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
            <div className="truncate">
              <span className="uppercase text-[10px] tracking-wider block font-mono">
                {currentUser.role}
              </span>
              <span>{currentUser.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? item.highlight
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-extrabold'
                    : item.highlight
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? item.highlight
                          ? 'text-white'
                          : 'text-sky-600 dark:text-sky-400'
                        : item.highlight
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shrink-0 ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Fast Action for Delivery Agents */}
        {currentUser.role === 'delivery' && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('new-delivery')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-black shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{language === 'bn' ? 'স্ক্যান শুরু করুন' : 'START SCANNING'}</span>
            </button>
          </div>
        )}

        {/* Bottom Fast Action for Customers */}
        {currentUser.role === 'customer' && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNavClick('customer-portal')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-xs font-black shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
            >
              <Droplets className="w-4 h-4" />
              <span>{language === 'bn' ? 'পানি অর্ডার করুন' : 'ORDER WATER'}</span>
            </button>
          </div>
        )}

        {/* User Session Logout Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাকাউন্ট থেকে লগআউট' : 'Sign Out / Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
