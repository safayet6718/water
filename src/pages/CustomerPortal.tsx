import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderRequest, Product } from '../types';
import { ClientQRCardModal } from '../components/ClientQRCardModal';
import { ReceiptModal } from '../components/ReceiptModal';
import {
  Droplets,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  QrCode,
  Calendar,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerPortal: React.FC = () => {
  const {
    currentUser,
    clients,
    products,
    orderRequests,
    createOrderRequest,
    deliveries,
    formatCurrency,
    formatNumber,
    language,
    t,
  } = useApp();

  // Find linked client record
  const currentClient =
    clients.find((c) => c.id === currentUser.clientId) ||
    clients.find((c) => c.phone === currentUser.phone) ||
    clients[0];

  // Order form state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[1]?.id || products[0]?.id
  );
  const [quantity, setQuantity] = useState<number>(2);
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [timeSlot, setTimeSlot] = useState<string>('Morning (9 AM - 12 PM)');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [emptyJarsReady, setEmptyJarsReady] = useState<number>(2);
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [viewDeliveryId, setViewDeliveryId] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  let unitPrice = selectedProduct?.defaultPrice || 80;
  if (currentClient?.customPrices && currentClient.customPrices[selectedProduct.id] !== undefined) {
    unitPrice = currentClient.customPrices[selectedProduct.id];
  }
  const estimatedTotal = unitPrice * quantity;

  // Filter orders for this customer
  const myOrders = orderRequests.filter(
    (ord) => ord.clientId === currentClient?.id || ord.clientPhone === currentUser.phone
  );

  const myDeliveries = deliveries.filter(
    (d) => d.clientId === currentClient?.id || d.clientPhone === currentUser.phone
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient || quantity <= 0) return;

    createOrderRequest({
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientPhone: currentClient.phone,
      clientAddress: currentClient.address,
      clientArea: currentClient.area,
      items: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity,
          unitPrice,
        },
      ],
      totalQuantity: quantity,
      estimatedAmount: estimatedTotal,
      preferredDate,
      preferredTimeSlot: timeSlot,
      urgent: isUrgent,
      notes: orderNotes.trim()
        ? `${orderNotes.trim()} (${emptyJarsReady} empty jars ready)`
        : `${emptyJarsReady} empty jars ready for return`,
    });

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}

    setOrderNotes('');
  };

  const selectedDelivery = deliveries.find((d) => d.id === viewDeliveryId) || null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Customer Header Card */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-sky-600/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block">
              {language === 'bn' ? 'গ্রাহক অ্যাকাউন্ট পোর্টাল' : 'CUSTOMER PORTAL'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {currentClient ? currentClient.name : currentUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-100 mt-1">
              <span className="flex items-center gap-1 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                ID: {currentClient?.code || 'CL-CUST'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentClient?.address} ({currentClient?.area})
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/20">
            <div>
              <span className="text-[10px] text-sky-100 block">
                {language === 'bn' ? 'বর্তমান বকেয়া (Due)' : 'Current Due'}
              </span>
              <span className="text-xl font-black text-white">
                ৳{currentClient ? currentClient.currentDue : 0}
              </span>
            </div>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-sky-700 font-extrabold text-xs flex items-center gap-1.5 shadow-sm hover:bg-sky-50 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আমার ডোর কিউআর' : 'My Door QR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Place Order Request Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {language === 'bn' ? 'পানির জার ডেলিভারি রিকোয়েস্ট করুন' : 'Order Water Jars Delivery'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আপনার বাসায় বা অফিসে বিশুদ্ধ পানির জার অর্ডার করুন'
                  : 'Place delivery order to your doorstep'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* Select Product Size */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              {language === 'bn' ? 'পানির জারের ধরণ নির্বাচন করুন:' : 'Choose Bottle Type:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {products.map((p) => {
                const isSelected = p.id === selectedProductId;
                let price = p.defaultPrice;
                if (currentClient?.customPrices && currentClient.customPrices[p.id]) {
                  price = currentClient.customPrices[p.id];
                }

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {p.size}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between items-center text-xs">
                      <span className="text-slate-400">{p.volumeLiters} Liters</span>
                      <span className="font-extrabold text-sky-600">৳{price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Empty Return */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'জারের সংখ্যা (Quantity):' : 'Number of Jars:'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-lg flex items-center justify-center hover:bg-slate-200"
                >
                  -
                </button>
                <div className="flex-1 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-black text-lg text-slate-900 dark:text-white">
                  {quantity} {language === 'bn' ? 'টি' : 'Jars'}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-lg flex items-center justify-center hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {language === 'bn' ? 'খালি জার ফেরত আছে:' : 'Empty Jars Ready to Return:'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEmptyJarsReady(Math.max(0, emptyJarsReady - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-lg flex items-center justify-center hover:bg-slate-200"
                >
                  -
                </button>
                <div className="flex-1 py-2 text-center rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-black text-lg text-slate-900 dark:text-white">
                  {emptyJarsReady} {language === 'bn' ? 'টি খালি' : 'Empty'}
                </div>
                <button
                  type="button"
                  onClick={() => setEmptyJarsReady(emptyJarsReady + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-lg flex items-center justify-center hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'পছন্দের তারিখ:' : 'Preferred Delivery Date:'}
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'সময় (Time Slot):' : 'Preferred Time Slot:'}
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="Morning (9 AM - 12 PM)">সকাল (Morning 9 AM - 12 PM)</option>
                <option value="Afternoon (2 PM - 5 PM)">দুপুর/বিকাল (Afternoon 2 PM - 5 PM)</option>
                <option value="Evening (5 PM - 8 PM)">সন্ধ্যা (Evening 5 PM - 8 PM)</option>
              </select>
            </div>
          </div>

          {/* Urgent checkbox & Instructions */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urgentCheck"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="urgentCheck" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                ⚡ {language === 'bn' ? 'জরুরি ডেলিভারি (Urgent Delivery)' : 'Urgent Delivery Request'}
              </label>
            </div>
            {isUrgent && (
              <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded">
                High Priority
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'bn' ? 'বিশেষ নির্দেশ বা ঠিকানা (ঐচ্ছিক):' : 'Special Instructions:'}
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Ring calling bell twice / Flat 4B"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Estimated Amount Box & Submit */}
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-sky-800 dark:text-sky-300">
                {language === 'bn' ? 'আনুমানিক বিল:' : 'Estimated Bill:'}
              </span>
              <div className="text-base font-black text-sky-900 dark:text-sky-100">
                ৳{estimatedTotal} ({quantity}x ৳{unitPrice})
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-md shadow-sky-600/30 transition cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'অর্ডার সাবমিট করুন' : 'Confirm Order'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Customer's Active Order Tracking */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" />
          <span>{language === 'bn' ? 'আমার অর্ডার স্ট্যাটাস ও ট্র্যাকিং' : 'My Orders & Delivery Status'}</span>
        </h2>

        {myOrders.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            {language === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' : 'No active orders placed yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {myOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-sky-700 dark:text-sky-300">
                      {ord.orderNo}
                    </span>
                    {ord.urgent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Date: {ord.preferredDate} • {ord.preferredTimeSlot}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'assigned' || ord.status === 'out_for_delivery'
                          ? 'bg-sky-100 text-sky-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status === 'pending'
                        ? language === 'bn' ? 'অপেক্ষমাণ (Pending)' : 'Pending'
                        : ord.status === 'assigned'
                        ? language === 'bn' ? `রাইডার: ${ord.assignedDeliveryManName?.split(' ')[0]}` : `Rider: ${ord.assignedDeliveryManName?.split(' ')[0]}`
                        : ord.status}
                    </span>
                    <div className="text-[11px] font-black text-slate-900 dark:text-white mt-0.5">
                      ৳{ord.estimatedAmount}
                    </div>
                  </div>

                  {ord.deliveryId && (
                    <button
                      onClick={() => setViewDeliveryId(ord.deliveryId!)}
                      className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100"
                      title="View Delivery Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer's Past Invoices */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>{language === 'bn' ? 'বিগত ডেলিভারির চালান মেমো' : 'Past Delivery Invoices'}</span>
        </h2>

        {myDeliveries.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            {language === 'bn' ? 'কোনো পূর্ববর্তী ডেলিভারি রেকর্ড নেই।' : 'No delivery history recorded.'}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myDeliveries.map((deliv) => (
              <div key={deliv.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <button
                    onClick={() => setViewDeliveryId(deliv.id)}
                    className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer flex items-center gap-1 font-mono text-xs"
                    title={language === 'bn' ? 'চালান ও রসিদ দেখতে ক্লিক করুন' : 'Click to view invoice receipt'}
                  >
                    <Receipt className="w-3.5 h-3.5 text-sky-500" />
                    <span>{deliv.invoiceNo}</span>
                  </button>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(deliv.createdAt).toLocaleDateString()} • {deliv.itemCount} Jars ({deliv.totalLiters}L)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">৳{deliv.totalPayable}</span>
                    <span className="block text-[10px] text-emerald-600">Paid: ৳{deliv.paidAmount}</span>
                  </div>
                  <button
                    onClick={() => setViewDeliveryId(deliv.id)}
                    className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 cursor-pointer transition"
                    title={language === 'bn' ? 'রসিদ দেখুন' : 'View Receipt'}
                  >
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client QR Modal */}
      <ClientQRCardModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        client={currentClient}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedDelivery}
        onClose={() => setViewDeliveryId(null)}
        delivery={selectedDelivery}
      />
    </div>
  );
};
