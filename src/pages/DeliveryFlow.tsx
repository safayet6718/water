import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client, Delivery, DeliveryItem, PaymentMethod, PaymentStatus, Product } from '../types';
import { QRScannerModal } from '../components/QRScannerModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { parseScannedQr } from '../utils/qr';
import confetti from 'canvas-confetti';
import {
  QrCode,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Phone,
  MapPin,
  RotateCcw,
  Receipt,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const DeliveryFlow: React.FC = () => {
  const {
    clients,
    products,
    currentUser,
    validateJarQr,
    recordDelivery,
    pendingDeliveryOrder,
    setPendingDeliveryOrder,
    language,
    formatCurrency,
    formatNumber,
    t,
    showToast,
  } = useApp();

  // Wizard state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [scannedItems, setScannedItems] = useState<DeliveryItem[]>([]);
  const [emptyJarsReturned, setEmptyJarsReturned] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [clientWarningDismissed, setClientWarningDismissed] = useState(false);

  // Auto-populate if fulfilling an order request
  React.useEffect(() => {
    if (pendingDeliveryOrder) {
      const target = clients.find((c) => c.id === pendingDeliveryOrder.clientId);
      if (target) {
        setSelectedClient(target);
        setDeliveryNote(`Order #${pendingDeliveryOrder.orderNo} fulfilled`);
        setEmptyJarsReturned(1);
      }
    }
  }, [pendingDeliveryOrder, clients]);

  // Scanner Modal state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerType, setScannerType] = useState<'client' | 'jar'>('client');
  const [scannerTitle, setScannerTitle] = useState('');

  // Success state
  const [completedDelivery, setCompletedDelivery] = useState<Delivery | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Calculate financials
  const itemsSubtotal = scannedItems.reduce((acc, it) => acc + it.unitPrice, 0);
  const previousDue = selectedClient?.currentDue || 0;
  const totalPayable = itemsSubtotal + previousDue;
  const numericPaid = parseFloat(paidAmount) || 0;
  const remainingDue = Math.max(0, totalPayable - numericPaid);

  let paymentStatus: PaymentStatus = 'due';
  if (numericPaid >= totalPayable && totalPayable > 0) {
    paymentStatus = 'paid';
  } else if (numericPaid > 0) {
    paymentStatus = 'partial';
  }

  // Scanner Openers
  const handleOpenClientScanner = () => {
    setScannerType('client');
    setScannerTitle(language === 'bn' ? '১. ক্লায়েন্ট কিউআর স্ক্যান করুন' : '1. Scan Client QR Code');
    setScannerOpen(true);
  };

  const handleOpenJarScanner = () => {
    if (!selectedClient) {
      showToast(language === 'bn' ? 'প্রথমে ক্লায়েন্ট স্ক্যান করুন' : 'Please scan client first', 'warning');
      return;
    }
    setScannerType('jar');
    setScannerTitle(language === 'bn' ? '২. পানির জারের কিউআর স্ক্যান করুন' : '2. Scan Jar QR Sticker');
    setScannerOpen(true);
  };

  // Handle Scan result
  const handleScanResult = (rawText: string) => {
    const parsed = parseScannedQr(rawText);

    if (scannerType === 'client') {
      // Find client by code or ID
      const targetClient = clients.find(
        (c) => c.code.toLowerCase() === parsed.code.toLowerCase() || c.id === parsed.code
      );

      if (!targetClient) {
        showToast(
          language === 'bn'
            ? `ক্লায়েন্ট পাওয়া যায়নি (${parsed.code})`
            : `Client not found (${parsed.code})`,
          'error'
        );
        return;
      }

      setSelectedClient(targetClient);
      setClientWarningDismissed(false);
      // Auto pre-populate empty jars return estimate
      setEmptyJarsReturned(1);
      showToast(
        language === 'bn'
          ? `ক্লায়েন্ট পাওয়া গেছে: ${targetClient.name}`
          : `Client verified: ${targetClient.name}`,
        'success'
      );
    } else {
      // Jar QR scan
      const jarCode = parsed.code;

      // 1. Check if already scanned in current bill
      if (scannedItems.some((it) => it.jarQrCode === jarCode)) {
        showToast(t.duplicateJarAlert, 'warning');
        return;
      }

      // 2. Validate with DB/storage
      const validation = validateJarQr(jarCode);
      if (!validation.valid) {
        showToast(validation.message || t.jarAlreadyDeliveredAlert, 'error');
        return;
      }

      const product = validation.product || products[1]; // default 20L
      // Apply custom price if client has one for this product
      let finalPrice = product.defaultPrice;
      if (selectedClient?.customPrices && selectedClient.customPrices[product.id] !== undefined) {
        finalPrice = selectedClient.customPrices[product.id];
      }

      const newItem: DeliveryItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        jarQrCode: jarCode,
        productId: product.id,
        productName: product.name,
        unitPrice: finalPrice,
        volumeLiters: product.volumeLiters,
      };

      setScannedItems((prev) => [...prev, newItem]);
      showToast(
        language === 'bn'
          ? `জার যুক্ত হয়েছে: ${product.name} (৳${finalPrice})`
          : `Jar added: ${product.name} (৳${finalPrice})`,
        'success'
      );
    }
  };

  const handleRemoveItem = (index: number) => {
    setScannedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetQuickPayment = (amount: number, method: PaymentMethod) => {
    setPaidAmount(String(amount));
    setPaymentMethod(method);
  };

  const handleSubmitDelivery = () => {
    if (!selectedClient) {
      showToast(language === 'bn' ? 'ক্লায়েন্ট নির্বাচন করুন' : 'Please select client', 'warning');
      return;
    }

    if (scannedItems.length === 0) {
      showToast(language === 'bn' ? 'কমপক্ষে একটি পানির জার স্ক্যান করুন' : 'Please scan at least one water jar', 'warning');
      return;
    }

    if (!selectedClient.active && !clientWarningDismissed && currentUser.role !== 'admin') {
      showToast(
        language === 'bn'
          ? 'এই ক্লায়েন্ট নিষ্ক্রিয়! ডেলিভারি সম্পূর্ণ করতে অ্যাডমিনের অনুমোদন প্রয়োজন।'
          : 'Client is inactive! Cannot proceed without admin approval.',
        'error'
      );
      return;
    }

    const totalLiters = scannedItems.reduce((acc, it) => acc + it.volumeLiters, 0);

    const delivery = recordDelivery({
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientPhone: selectedClient.phone,
      clientAddress: selectedClient.address,
      deliveryManId: currentUser.id,
      deliveryManName: currentUser.name,
      items: scannedItems,
      itemCount: scannedItems.length,
      totalLiters,
      billAmount: itemsSubtotal,
      previousDue,
      totalPayable,
      paidAmount: numericPaid,
      remainingDue,
      paymentMethod: numericPaid === 0 ? 'due' : paymentMethod,
      paymentStatus,
      trxId: trxId.trim() || undefined,
      emptyJarsReturned,
      orderRequestId: pendingDeliveryOrder?.id,
      notes: deliveryNote.trim() || undefined,
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setCompletedDelivery(delivery);
    setReceiptOpen(true);
    setPendingDeliveryOrder(null);
  };

  const handleStartNextDelivery = () => {
    setSelectedClient(null);
    setScannedItems([]);
    setEmptyJarsReturned(0);
    setPaidAmount('');
    setTrxId('');
    setDeliveryNote('');
    setCompletedDelivery(null);
    setReceiptOpen(false);
    setClientWarningDismissed(false);
    setPendingDeliveryOrder(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* Title & Quick Status */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 rounded-3xl p-5 text-white shadow-xl shadow-sky-600/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block">
              {language === 'bn' ? 'মোবাইল ডেলিভারি স্ক্যানার' : 'MOBILE DELIVERY DISPATCH'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {language === 'bn' ? 'পানির জার ডেলিভারি ও বিল' : 'Jar Delivery & Instant Billing'}
            </h1>
            <p className="text-xs text-sky-100 mt-0.5">
              {language === 'bn'
                ? '১. ক্লায়েন্ট কিউআর → ২. জার কিউআর → ৩. অটোমেটিক বিল ও পেমেন্ট'
                : '1. Scan Client QR → 2. Scan Jar QR → 3. Auto Bill & Submit'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-sky-100 block">Agent</span>
            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-xl">
              {currentUser.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Order Request Banner */}
      {pendingDeliveryOrder && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-800 dark:text-amber-200">
                {pendingDeliveryOrder.orderNo}
              </span>
              <span className="font-extrabold text-amber-900 dark:text-amber-100">
                {language === 'bn' ? 'অর্ডার পূরণ করা হচ্ছে' : 'Fulfilling Order Request'}
              </span>
            </div>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              {pendingDeliveryOrder.clientName} ({pendingDeliveryOrder.clientArea}) • {pendingDeliveryOrder.totalQuantity} Jars requested
            </p>
          </div>
          <button
            onClick={() => setPendingDeliveryOrder(null)}
            className="text-[11px] text-amber-800 font-bold underline hover:text-amber-950"
          >
            {language === 'bn' ? 'বাতিল' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* STEP 1: CLIENT SELECTION & QR SCAN */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'ক্লায়েন্ট কিউআর স্ক্যান' : 'Customer Door QR Scan'}
            </h2>
          </div>

          {selectedClient && (
            <button
              onClick={() => setSelectedClient(null)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পরিবর্তন' : 'Change'}</span>
            </button>
          )}
        </div>

        {!selectedClient ? (
          <div className="space-y-3">
            <button
              onClick={handleOpenClientScanner}
              className="w-full py-5 rounded-2xl border-2 border-dashed border-sky-400 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100/60 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-bold text-sm flex flex-col items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-base font-black">
                {language === 'bn' ? 'গ্রাহকের কিউআর স্ক্যান করুন' : 'Tap to Scan Client QR'}
              </span>
              <span className="text-xs text-sky-600 font-normal">
                {language === 'bn'
                  ? 'গ্রাহকের দরজায় লাগানো কিউআর কোড স্ক্যান করুন (বা টেস্ট অপশন নিন)'
                  : 'Scan customer door QR or pick demo client'}
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Client Card */}
            <div
              className={`p-4 rounded-2xl border ${
                !selectedClient.active
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      {selectedClient.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                      {selectedClient.code}
                    </span>
                  </div>

                  <div className="mt-1 space-y-0.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedClient.address} ({selectedClient.area})</span>
                    </div>
                  </div>
                </div>

                {/* Outstanding balance tag */}
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    {language === 'bn' ? 'আগের বাকি' : 'Previous Due'}
                  </div>
                  <div
                    className={`text-base font-black ${
                      selectedClient.currentDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'
                    }`}
                  >
                    ৳{selectedClient.currentDue}
                  </div>
                </div>
              </div>

              {/* Deactivated Client Warning */}
              {!selectedClient.active && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      {language === 'bn'
                        ? 'ক্লায়েন্ট নিষ্ক্রিয় (Deactivated)। ডেলিভারির আগে নিশ্চিত হোন।'
                        : 'Client is INACTIVE. Caution on delivery.'}
                    </span>
                  </div>
                  <button
                    onClick={() => setClientWarningDismissed(true)}
                    className="px-2 py-1 rounded bg-amber-200 dark:bg-amber-800 text-[10px] font-bold text-amber-900 dark:text-amber-100"
                  >
                    {language === 'bn' ? 'অনুমোদন দিন' : 'Override'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: JAR QR SCANNING */}
      {selectedClient && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'bn' ? 'পানির জার স্ক্যান করুন' : 'Scan Water Jar QR Stickers'}
              </h2>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-lg">
              {scannedItems.length} {language === 'bn' ? 'টি স্ক্যান করা হয়েছে' : 'Jars'}
            </span>
          </div>

          {/* Action button to scan jar */}
          <button
            onClick={handleOpenJarScanner}
            className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/25 active:scale-98 transition cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            <span>
              {scannedItems.length === 0
                ? language === 'bn' ? 'প্রথম জার স্ক্যান করুন' : 'Scan 1st Water Jar'
                : language === 'bn' ? '+ পরবর্তী জার স্ক্যান করুন' : '+ Scan Next Jar'}
            </span>
          </button>

          {/* Scanned Jars List */}
          {scannedItems.length > 0 ? (
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'bn' ? 'স্ক্যান করা জারের তালিকা:' : 'Scanned Jars in this Delivery:'}
              </div>
              {scannedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.productName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {item.jarQrCode} • {item.volumeLiters} Liters
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      ৳{item.unitPrice}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove jar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Subtotal of items */}
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl flex justify-between items-center text-xs font-bold text-sky-900 dark:text-sky-200">
                <span>{language === 'bn' ? 'জারের মোট দাম:' : 'Jars Subtotal:'}</span>
                <span className="text-sm">৳{itemsSubtotal}</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-center text-xs text-slate-400">
              {language === 'bn'
                ? 'এখনও কোনো জার স্ক্যান করা হয়নি। উপরের বাটনে চাপ দিন।'
                : 'No jars scanned yet. Tap button above to scan sticker.'}
            </p>
          )}

          {/* Empty Jar Return Tracker */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'খালি জার ফেরত নিয়েছে:' : 'Empty Jars Returned:'}
              </span>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'গ্রাহক কয়টি খালি জার দিলো' : 'Bottles collected back'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEmptyJarsReturned(Math.max(0, emptyJarsReturned - 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                -
              </button>
              <span className="w-8 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                {emptyJarsReturned}
              </span>
              <button
                type="button"
                onClick={() => setEmptyJarsReturned(emptyJarsReturned + 1)}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BILLING & PAYMENT */}
      {selectedClient && scannedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'অটো বিল ও পেমেন্ট সিলেক্ট' : 'Auto Billing & Payment Submission'}
            </h2>
          </div>

          {/* Breakdown Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>{language === 'bn' ? 'বর্তমান জারের বিল:' : 'Current Jars Bill:'}</span>
              <span className="font-bold">৳{itemsSubtotal}</span>
            </div>

            {previousDue > 0 && (
              <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                <span>{language === 'bn' ? 'আগের বাকি (Due):' : 'Previous Due:'}</span>
                <span>+৳{previousDue}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>{language === 'bn' ? 'মোট প্রদেয় টাকা:' : 'TOTAL PAYABLE:'}</span>
              <span className="text-base text-sky-600 dark:text-sky-400">৳{totalPayable}</span>
            </div>
          </div>

          {/* Quick Payment Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              {language === 'bn' ? 'দ্রুত পেমেন্ট সিলেক্ট করুন:' : 'Quick Payment Preset:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSetQuickPayment(totalPayable, 'cash')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  numericPaid === totalPayable && paymentMethod === 'cash'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {language === 'bn' ? 'সম্পূর্ণ শোধ (ক্যাশ)' : 'Full Paid (Cash)'}
                <div className="text-[10px] font-normal">৳{totalPayable}</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetQuickPayment(totalPayable, 'bkash')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  numericPaid === totalPayable && paymentMethod === 'bkash'
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                    : 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800 hover:bg-pink-100'
                }`}
              >
                {language === 'bn' ? 'সম্পূর্ণ শোধ (বিকাশ)' : 'Full (bKash)'}
                <div className="text-[10px] font-normal">৳{totalPayable}</div>
              </button>

              <button
                type="button"
                onClick={() => handleSetQuickPayment(0, 'due')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  numericPaid === 0
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                }`}
              >
                {language === 'bn' ? 'সম্পূর্ণ বাকি' : 'Full Unpaid / Due'}
                <div className="text-[10px] font-normal">৳0 Paid</div>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              {t.paymentMethod}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['cash', 'bkash', 'nagad', 'bank'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition border cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-sky-600 dark:border-sky-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {method === 'cash' ? (language === 'bn' ? 'ক্যাশ' : 'Cash') : method}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Amount Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t.paidAmount} (৳)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'নতুন বাকি থাকবে:' : 'Remaining Due:'}
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-black text-sm text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700">
                ৳{remainingDue}
              </div>
            </div>
          </div>

          {/* Trx ID for bKash/Nagad */}
          {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {paymentMethod.toUpperCase()} {t.trxId}
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. 9K20XA991"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Delivery Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.deliveryNote}
            </label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder={language === 'bn' ? 'দরজার পাশে রাখা হলো / রসিদ সাইন করা' : 'Optional note for owner'}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Big Submit Button */}
          <button
            type="button"
            onClick={handleSubmitDelivery}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base shadow-xl shadow-emerald-600/30 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t.submitDelivery}</span>
          </button>
        </div>
      )}

      {/* QR SCANNER MODAL */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScanResult}
        title={scannerTitle}
        expectedType={scannerType}
      />

      {/* RECEIPT MODAL UPON SUCCESS */}
      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        delivery={completedDelivery}
      />

      {/* POST-DELIVERY QUICK ACTION BAR */}
      {completedDelivery && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold">{completedDelivery.invoiceNo}</span>
              <p className="text-[10px] text-slate-400">{completedDelivery.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReceiptOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রসিদ' : 'Receipt'}</span>
            </button>
            <button
              onClick={handleStartNextDelivery}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold flex items-center gap-1 text-white shadow-sm"
            >
              <span>{language === 'bn' ? 'পরবর্তী ডেলিভারি' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
