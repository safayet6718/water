import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrBatch, JarQrCode } from '../types';
import { StickerSheetPrintModal } from '../components/StickerSheetPrintModal';
import {
  Boxes,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const {
    batches,
    jarQrs,
    products,
    generateBatch,
    language,
    formatNumber,
    t,
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[1]?.id || products[0]?.id);
  const [dateStr, setDateStr] = useState<string>(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState<number>(24); // 24 = standard 3x8 A4 sticker sheet
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatchForPrint, setSelectedBatchForPrint] = useState<QrBatch | null>(null);
  const [singleJarForPrint, setSingleJarForPrint] = useState<JarQrCode | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;

    const res = generateBatch(selectedProductId, quantity, dateStr);
    setSelectedBatchForPrint(res.batch);
    setSingleJarForPrint(null);
    setIsPrintModalOpen(true);
  };

  const handleOpenBatchPrint = (batch: QrBatch) => {
    setSelectedBatchForPrint(batch);
    setSingleJarForPrint(null);
    setIsPrintModalOpen(true);
  };

  const handleOpenSinglePrint = (jar: JarQrCode) => {
    setSelectedBatchForPrint(null);
    setSingleJarForPrint(jar);
    setIsPrintModalOpen(true);
  };

  // Filtered jars for search
  const filteredJars = searchQuery.trim()
    ? jarQrs.filter((q) => q.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Boxes className="w-6 h-6 text-sky-600" />
          <span>{language === 'bn' ? 'জারের কিউআর স্টিকার জেনারেটর' : 'Jar QR Sticker Generator'}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {language === 'bn'
            ? 'প্রতিটি পানির জারের জন্য ইউনিক সিঙ্গেল-ইউজ কিউআর কোড এবং A4 স্টিকার শিট প্রিন্ট করুন।'
            : 'Generate batches of unique single-use jar QR codes and print A4 adhesive sticker sheets.'}
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.selectDate}</span>
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.selectProduct}</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.size}) — ৳{p.defaultPrice}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.quantity}
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Quantity Presets (Pills) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400">
              {language === 'bn' ? 'দ্রুত শিট সাইজ:' : 'Presets:'}
            </span>
            {[
              { label: '24 Stickers (1 A4 Sheet 3x8)', val: 24 },
              { label: '32 Stickers (4x8)', val: 32 },
              { label: '48 Stickers (2 Sheets)', val: 48 },
              { label: '100 Batch', val: 100 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setQuantity(preset.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  quantity === preset.val
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white text-xs font-black shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.generateBatchBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Code Search Tool */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'সিঙ্গেল জার স্টিকার সার্চ ও রি-প্রিন্ট' : 'Look Up & Reprint Jar QR'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'যেকোনো জারের কোড দিয়ে অনুসন্ধান করুন' : 'Search any code e.g. J-20261013-20L-0001'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="J-20261013..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-mono text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
            {filteredJars.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                {language === 'bn' ? 'কোনো জার পাওয়া যায়নি' : 'No jar code found'}
              </p>
            ) : (
              filteredJars.map((j) => (
                <div key={j.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {j.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        j.status === 'unused'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {j.status}
                    </span>
                    {j.deliveredAt && (
                      <span className="text-[10px] text-slate-400">
                        Delivered on {new Date(j.deliveredAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenSinglePrint(j)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>{language === 'bn' ? 'রিপ্রিন্ট' : 'Reprint'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Batches History List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          {language === 'bn' ? 'পূর্ববর্তী কিউআর ব্যাচ সমূহ' : 'Generated QR Batches'}
        </h2>

        <div className="space-y-3">
          {batches.map((b) => {
            const batchJars = jarQrs.filter((j) => j.batchId === b.id);
            const unusedCount = batchJars.filter((j) => j.status === 'unused').length;
            const deliveredCount = batchJars.filter((j) => j.status === 'delivered').length;
            const prod = products.find((p) => p.id === b.productId);
            const isExpanded = expandedBatchId === b.id;

            return (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-700 dark:text-sky-300">
                        {b.batchNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {prod?.size || 'Jar'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Date: {b.date} • Created by {b.createdByName}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-600 font-bold">
                        {unusedCount} {language === 'bn' ? 'অব্যবহৃত' : 'unused'}
                      </span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-500">
                        {deliveredCount} {language === 'bn' ? 'ডেলিভারি' : 'used'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenBatchPrint(b)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'প্রিন্ট শিট' : 'Print Sheet'}</span>
                      </button>

                      <button
                        onClick={() => setExpandedBatchId(isExpanded ? null : b.id)}
                        className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                        title="View codes"
                      >
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded codes preview */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-400 mb-2">
                      {language === 'bn' ? 'ব্যাচের কিউআর কোড সমূহ:' : 'Individual Jar Codes in this batch:'}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                      {batchJars.map((j) => (
                        <div
                          key={j.id}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                        >
                          <span className="font-mono text-slate-800 dark:text-slate-200 truncate">
                            {j.code.split('-').slice(-2).join('-')}
                          </span>
                          <button
                            onClick={() => handleOpenSinglePrint(j)}
                            className="text-sky-600 hover:text-sky-800 p-0.5"
                            title="Print this single sticker"
                          >
                            <Printer className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STICKER PRINT MODAL */}
      <StickerSheetPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        batch={selectedBatchForPrint}
        singleJar={singleJarForPrint}
      />
    </div>
  );
};
