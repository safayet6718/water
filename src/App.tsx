import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DeliveryFlow } from './pages/DeliveryFlow';
import { ClientsList } from './pages/ClientsList';
import { DeliveriesList } from './pages/DeliveriesList';
import { QRGenerator } from './pages/QRGenerator';
import { DueCollection } from './pages/DueCollection';
import { SuppliersList } from './pages/SuppliersList';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CustomerPortal } from './pages/CustomerPortal';
import { OrderRequestsList } from './pages/OrderRequestsList';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ToastContainer } from './components/ToastContainer';
import { ReceiptModal } from './components/ReceiptModal';
import { ClientDetailsModal } from './components/ClientDetailsModal';
import { UserDetailsModal } from './components/UserDetailsModal';
import { UserEditModal } from './components/UserEditModal';
import { LoginPage } from './components/LoginPage';
import {
  QrCode,
  LayoutDashboard,
  Truck,
  Users,
  HandCoins,
  History,
  Wallet,
  Clock,
  Droplets,
  User as UserIcon,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    currentUser,
    orderRequests,
    viewingDelivery,
    closeInvoiceModal,
    openUserDetailsModal,
    language,
    t,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not authenticated with password, show LoginPage without any demo
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const pendingOrdersCount = orderRequests.filter((o) => o.status === 'pending').length;

  const renderActiveScreen = () => {
    // Role-based view protection: Customer Portal is strictly separated
    if (currentUser.role === 'customer') {
      if (activeTab === 'orders') return <OrderRequestsList />;
      if (activeTab === 'my-deliveries') return <DeliveriesList />;
      return <CustomerPortal />;
    }

    // Delivery Agent Portal is strictly separated
    if (currentUser.role === 'delivery') {
      if (activeTab === 'orders') return <OrderRequestsList />;
      if (activeTab === 'my-deliveries') return <DeliveriesList />;
      if (activeTab === 'due-collection') return <DueCollection />;
      return <DeliveryFlow />;
    }

    // Admin & Manager panel
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customer-portal':
        return <CustomerPortal />;
      case 'orders':
        return <OrderRequestsList />;
      case 'new-delivery':
        return <DeliveryFlow />;
      case 'deliveries':
      case 'my-deliveries':
        return <DeliveriesList />;
      case 'clients':
        return <ClientsList />;
      case 'due-collection':
        return <DueCollection />;
      case 'qr-generator':
        return <QRGenerator />;
      case 'suppliers':
        return <SuppliersList />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar tailored by Role */}
      <nav className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg">
        {currentUser.role === 'customer' ? (
          <>
            <button
              onClick={() => setActiveTab('customer-portal')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'customer-portal'
                  ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'text-slate-500'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center -mt-4 shadow-lg shadow-sky-600/40">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{language === 'bn' ? 'অর্ডার পোর্টাল' : 'Order Jars'}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'orders'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-[10px]">{language === 'bn' ? 'আমার অর্ডার' : 'My Orders'}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-deliveries')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'my-deliveries'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-[10px]">{language === 'bn' ? 'চালান মেমো' : 'Invoices'}</span>
            </button>

            <button
              onClick={() => openUserDetailsModal(currentUser)}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-500 hover:text-sky-600 transition"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-sky-400"
                />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              <span className="text-[10px]">{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
            </button>
          </>
        ) : currentUser.role === 'delivery' ? (
          <>
            <button
              onClick={() => setActiveTab('new-delivery')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'new-delivery'
                  ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                  : 'text-slate-500'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center -mt-4 shadow-lg shadow-sky-600/40">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px]">{language === 'bn' ? 'স্ক্যান' : 'Scan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl relative transition ${
                activeTab === 'orders'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              <span className="text-[10px]">{language === 'bn' ? 'অর্ডার রিকোয়েস্ট' : 'Orders'}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-deliveries')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'my-deliveries'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-[10px]">{language === 'bn' ? 'চালান' : 'History'}</span>
            </button>

            <button
              onClick={() => setActiveTab('due-collection')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition ${
                activeTab === 'due-collection'
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span className="text-[10px]">{language === 'bn' ? 'ক্যাশ' : 'Cash'}</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
                activeTab === 'dashboard'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[10px]">{t.dashboard}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl relative transition ${
                activeTab === 'orders'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Clock className="w-4 h-4" />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-0.5 right-1 px-1 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                  {pendingOrdersCount}
                </span>
              )}
              <span className="text-[10px]">{language === 'bn' ? 'অর্ডার' : 'Orders'}</span>
            </button>

            <button
              onClick={() => setActiveTab('new-delivery')}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-sky-600"
            >
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center -mt-4 shadow-lg shadow-sky-600/40">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">{language === 'bn' ? 'স্ক্যান' : 'Scan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
                activeTab === 'clients'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px]">{t.clients}</span>
            </button>

            <button
              onClick={() => setActiveTab('deliveries')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
                activeTab === 'deliveries'
                  ? 'text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-500'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span className="text-[10px]">{t.deliveries}</span>
            </button>
          </>
        )}
      </nav>

      {/* Global Interactive Clickable Modals */}
      <ReceiptModal
        isOpen={!!viewingDelivery}
        onClose={closeInvoiceModal}
        delivery={viewingDelivery}
      />
      <ClientDetailsModal />
      <UserDetailsModal />
      <UserEditModal />

      {/* Global Alerts & Toasts */}
      <OfflineIndicator />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
