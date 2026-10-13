import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Droplets,
  Truck,
  Users,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    clients,
    deliveries,
    products,
    users,
    suppliers,
    formatCurrency,
    formatNumber,
    openClientProfileModal,
    openUserDetailsModal,
    openInvoiceModal,
    language,
    t,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'week' | 'today'>('all');
  const [activeTab, setActiveTab] = useState<'clients' | 'agents' | 'areas'>('clients');

  // Filter deliveries by date
  const now = new Date();
  const filteredDeliveries = deliveries.filter((d) => {
    if (dateFilter === 'all') return true;
    const dDate = new Date(d.createdAt);
    if (dateFilter === 'today') {
      return dDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'week') {
      const diffTime = Math.abs(now.getTime() - dDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (dateFilter === 'month') {
      return (
        dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Client volume report computation
  const clientReport = clients.map((cl) => {
    const clDeliveries = filteredDeliveries.filter((d) => d.clientId === cl.id);
    let count10L = 0;
    let count20L = 0;
    let count30L = 0;
    let totalLiters = 0;
    let totalBilled = 0;
    let totalPaid = 0;

    clDeliveries.forEach((d) => {
      totalBilled += d.billAmount;
      totalPaid += d.paidAmount;
      d.items.forEach((it) => {
        if (it.productId === 'prod-10L') count10L++;
        else if (it.productId === 'prod-20L') count20L++;
        else if (it.productId === 'prod-30L') count30L++;
        totalLiters += it.volumeLiters;
      });
    });

    const totalJars = count10L + count20L + count30L;

    return {
      client: cl,
      count10L,
      count20L,
      count30L,
      totalJars,
      totalLiters,
      totalBilled,
      totalPaid,
      currentDue: cl.currentDue,
    };
  });

  // Delivery agent performance computation
  const deliveryAgents = users.filter((u) => u.role === 'delivery');
  const agentReport = deliveryAgents.map((ag) => {
    const agDeliveries = filteredDeliveries.filter((d) => d.deliveryManId === ag.id);
    const totalDeliveries = agDeliveries.length;
    const totalJars = agDeliveries.reduce((acc, d) => acc + d.itemCount, 0);
    const totalLiters = agDeliveries.reduce((acc, d) => acc + d.totalLiters, 0);
    const cashCollected = agDeliveries
      .filter((d) => d.paymentMethod === 'cash')
      .reduce((acc, d) => acc + d.paidAmount, 0);
    const digitalCollected = agDeliveries
      .filter((d) => d.paymentMethod === 'bkash' || d.paymentMethod === 'nagad')
      .reduce((acc, d) => acc + d.paidAmount, 0);
    const totalCollected = cashCollected + digitalCollected;

    return {
      agent: ag,
      totalDeliveries,
      totalJars,
      totalLiters,
      cashCollected,
      digitalCollected,
      totalCollected,
    };
  });

  // Area consumption computation
  const areas = Array.from(new Set(clients.map((c) => c.area))).filter(Boolean);
  const areaReport = areas.map((areaName) => {
    const areaClients = clients.filter((c) => c.area === areaName);
    const areaClientIds = areaClients.map((c) => c.id);
    const areaDeliveries = filteredDeliveries.filter((d) => areaClientIds.includes(d.clientId));
    const totalJars = areaDeliveries.reduce((acc, d) => acc + d.itemCount, 0);
    const totalLiters = areaDeliveries.reduce((acc, d) => acc + d.totalLiters, 0);
    const totalSales = areaDeliveries.reduce((acc, d) => acc + d.billAmount, 0);

    return {
      areaName,
      clientsCount: areaClients.length,
      totalJars,
      totalLiters,
      totalSales,
    };
  });

  // Overall Financials
  const grandSales = filteredDeliveries.reduce((acc, d) => acc + d.billAmount, 0);
  const grandCollected = filteredDeliveries.reduce((acc, d) => acc + d.paidAmount, 0);
  const grandLiters = filteredDeliveries.reduce((acc, d) => acc + d.totalLiters, 0);
  const totalClientDue = clients.reduce((acc, c) => acc + c.currentDue, 0);
  const totalSupplierDue = suppliers.reduce((acc, s) => acc + s.currentDue, 0);

  // CSV Exporter
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'clients') {
      csvContent += 'Client Name,Code,Area,Phone,10L Jars,20L Jars,30L Jars,Total Jars,Total Liters,Total Billed,Total Paid,Current Due\n';
      clientReport.forEach((row) => {
        csvContent += `"${row.client.name}","${row.client.code}","${row.client.area}","${row.client.phone}",${row.count10L},${row.count20L},${row.count30L},${row.totalJars},${row.totalLiters},${row.totalBilled},${row.totalPaid},${row.currentDue}\n`;
      });
    } else if (activeTab === 'agents') {
      csvContent += 'Agent Name,Deliveries Count,Total Jars,Total Liters,Cash Collected,Digital Collected,Total Collected\n';
      agentReport.forEach((row) => {
        csvContent += `"${row.agent.name}",${row.totalDeliveries},${row.totalJars},${row.totalLiters},${row.cashCollected},${row.digitalCollected},${row.totalCollected}\n`;
      });
    } else {
      csvContent += 'Area,Clients Count,Total Jars,Total Liters,Total Sales\n';
      areaReport.forEach((row) => {
        csvContent += `"${row.areaName}",${row.clientsCount},${row.totalJars},${row.totalLiters},${row.totalSales}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aquatrack_report_${activeTab}_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 print-container">
      {/* Header (No-print controls) */}
      <div className="no-print bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            <span>{language === 'bn' ? 'রিপোর্ট ও বিশ্লেষণ' : 'Reports & Liter Consumption'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'গ্রাহকভিত্তিক পানির মোট লিটার, বিক্রয়, আদায় ও রুটভিত্তিক চাহিদা'
              : 'Client-wise total water liters, revenue, collection, and delivery metrics'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-sky-600" />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'bn' ? 'এক্সেল / সিএসভি' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Tab Switcher (No-print) */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-1 w-full sm:w-auto">
          {[
            { id: 'clients', label: language === 'bn' ? 'ক্লায়েন্ট লিটার হিসাব' : 'Client Liters', icon: Droplets },
            { id: 'agents', label: language === 'bn' ? 'ডেলিভারি ম্যান পারফরম্যান্স' : 'Delivery Agents', icon: Truck },
            { id: 'areas', label: language === 'bn' ? 'এলাকা / রুট রিপোর্ট' : 'Area Demand', icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: language === 'bn' ? 'সব সময়' : 'All Time' },
            { id: 'month', label: language === 'bn' ? 'এই মাস' : 'This Month' },
            { id: 'week', label: language === 'bn' ? 'এই সপ্তাহ' : 'This Week' },
            { id: 'today', label: language === 'bn' ? 'আজ' : 'Today' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                dateFilter === f.id
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Liters Delivered</span>
          <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">
            {formatNumber(grandLiters)} <span className="text-xs font-semibold text-slate-500">Liters</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sales</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {formatCurrency(grandSales)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Collected</span>
          <span className="text-xl font-black text-emerald-600">
            {formatCurrency(grandCollected)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Outstanding Client Due</span>
          <span className="text-xl font-black text-rose-600">
            {formatCurrency(totalClientDue)}
          </span>
        </div>
      </div>

      {/* TAB 1: CLIENT LITER CONSUMPTION REPORT */}
      {activeTab === 'clients' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'গ্রাহকভিত্তিক পানির মোট লিটার ও জারের হিসাব' : 'Client Water Volume Report (Liters & Bottles)'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? '১০লি, ২০লি এবং ৩০লি জারের সংখ্যা এবং মোট কত লিটার পানি সরবরাহ করা হয়েছে'
                : 'Itemized 10L, 20L, 30L bottles and cumulative liters delivered'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Client Name / Code</th>
                  <th className="py-3 px-4">Area</th>
                  <th className="py-3 px-4 text-center">10L Jars</th>
                  <th className="py-3 px-4 text-center">20L Jars</th>
                  <th className="py-3 px-4 text-center">30L Jars</th>
                  <th className="py-3 px-4 text-center font-black text-slate-700 dark:text-slate-200">Total Liters (L)</th>
                  <th className="py-3 px-4 text-right">Billed</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Current Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {clientReport.map((row) => (
                  <tr key={row.client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openClientProfileModal(row.client)}
                        className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer text-left block"
                        title={language === 'bn' ? 'গ্রাহক প্রোফাইল ও বিবরণ দেখতে ক্লিক করুন' : 'Click to view client details'}
                      >
                        {row.client.name}
                      </button>
                      <div className="font-mono text-[10px] text-slate-400">{row.client.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{row.client.area}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{row.count10L}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">{row.count20L}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{row.count30L}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 font-black text-cyan-700 dark:text-cyan-300">
                        {formatNumber(row.totalLiters)} L
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ৳{row.totalBilled}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      ৳{row.totalPaid}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-black ${
                          row.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        ৳{row.currentDue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AGENT PERFORMANCE */}
      {activeTab === 'agents' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'ডেলিভারি ম্যান পারফরম্যান্স রিপোর্ট' : 'Delivery Agent Delivery & Collection Metrics'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Delivery Agent</th>
                  <th className="py-3 px-4 text-center">Deliveries</th>
                  <th className="py-3 px-4 text-center">Jars Delivered</th>
                  <th className="py-3 px-4 text-center">Liters Delivered</th>
                  <th className="py-3 px-4 text-right">Cash Collected</th>
                  <th className="py-3 px-4 text-right">bKash/Nagad Collected</th>
                  <th className="py-3 px-4 text-right">Total Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agentReport.map((row) => (
                  <tr key={row.agent.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <button
                        onClick={() => openUserDetailsModal(row.agent)}
                        className="hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer text-left font-bold"
                        title={language === 'bn' ? 'ডেলিভারি ম্যান প্রোফাইল দেখতে ক্লিক করুন' : 'Click to view agent details'}
                      >
                        {row.agent.name}
                      </button>
                      <div className="text-[10px] text-slate-400">{row.agent.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{row.totalDeliveries}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-sky-600">{row.totalJars} Jars</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-600">{row.totalLiters} L</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800 dark:text-slate-200">
                      ৳{row.cashCollected}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-pink-600">
                      ৳{row.digitalCollected}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600">
                      ৳{row.totalCollected}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AREA DEMAND */}
      {activeTab === 'areas' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'এলাকা / রুটভিত্তিক চাহিদা' : 'Area & Route Consumption Demand'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Area / Route</th>
                  <th className="py-3 px-4 text-center">Clients Count</th>
                  <th className="py-3 px-4 text-center">Total Jars</th>
                  <th className="py-3 px-4 text-center">Total Water (Liters)</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {areaReport.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.areaName}</td>
                    <td className="py-3 px-4 text-center font-bold">{row.clientsCount} Clients</td>
                    <td className="py-3 px-4 text-center font-bold text-sky-600">{row.totalJars} Jars</td>
                    <td className="py-3 px-4 text-center font-black text-cyan-600">{row.totalLiters} L</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">
                      ৳{row.totalSales}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
