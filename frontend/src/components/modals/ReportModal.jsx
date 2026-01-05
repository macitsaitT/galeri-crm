import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  Building2,
  Car,
  Wallet,
  ShoppingCart,
  CreditCard,
  Search
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function ReportModal({ 
  isOpen, 
  onClose, 
  inventory, 
  transactions, 
  customers,
  userProfile 
}) {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportScope, setReportScope] = useState('general'); // general, business, stock, sold, deposit, car
  const [selectedCarId, setSelectedCarId] = useState('');
  const reportRef = useRef(null);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    let txs = transactions.filter(t => {
      if (t.deleted) return false;
      const tDate = new Date(t.date);
      return tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
    });

    // Filter by scope
    if (reportScope === 'business') {
      txs = txs.filter(t => !t.carId);
    } else if (reportScope === 'stock') {
      const stockCarIds = inventory.filter(c => c.ownership === 'stock' && !c.deleted).map(c => c.id);
      txs = txs.filter(t => t.carId && stockCarIds.includes(t.carId));
    } else if (reportScope === 'sold') {
      const soldCarIds = inventory.filter(c => c.status === 'Satıldı' && !c.deleted).map(c => c.id);
      txs = txs.filter(t => t.carId && soldCarIds.includes(t.carId));
    } else if (reportScope === 'deposit') {
      const depositCarIds = inventory.filter(c => c.status === 'Kapora Alındı' && !c.deleted).map(c => c.id);
      txs = txs.filter(t => t.carId && depositCarIds.includes(t.carId));
    } else if (reportScope === 'car' && selectedCarId) {
      txs = txs.filter(t => t.carId === selectedCarId);
    }

    return txs.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, dateRange, reportScope, selectedCarId, inventory]);

  // Calculate totals
  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      net: income - expense
    };
  }, [filteredTransactions]);

  // Get report title based on scope
  const getReportTitle = () => {
    switch (reportScope) {
      case 'business': return 'İşletme Giderleri Raporu';
      case 'stock': return 'Stok Araçlar Raporu';
      case 'sold': return 'Satılan Araçlar Raporu';
      case 'deposit': return 'Kapora Alınan Araçlar Raporu';
      case 'car': 
        const car = inventory.find(c => c.id === selectedCarId);
        return car ? `${car.plate?.toLocaleUpperCase('tr-TR')} - ${car.brand} ${car.model} Raporu` : 'Araç Raporu';
      default: return 'Finansal Durum Raporu';
    }
  };

  const getScopeLabel = () => {
    switch (reportScope) {
      case 'business': return 'İşletme Raporu';
      case 'stock': return 'Stok Raporu';
      case 'sold': return 'Satış Raporu';
      case 'deposit': return 'Kapora Raporu';
      case 'car': return 'Araç Raporu';
      default: return 'Genel Rapor';
    }
  };

  // Print function
  const handlePrint = () => {
    const printContent = reportRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Rapor - ${userProfile?.name || 'Galeri CRM'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { font-weight: bold; }
            .text-right { text-align: right; }
            .text-green { color: #16a34a; }
            .text-red { color: #dc2626; }
            .summary-box { display: inline-block; padding: 15px 30px; margin-right: 20px; border: 1px solid #ddd; }
            .signature-area { display: flex; justify-between; margin-top: 60px; padding-top: 20px; }
            .signature-box { text-align: center; width: 200px; }
            .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
            img { max-height: 40px !important; width: auto !important; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // PDF download
  const handleDownloadPDF = () => {
    if (typeof window.html2pdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => generatePDF();
      document.head.appendChild(script);
    } else {
      generatePDF();
    }
  };

  const generatePDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `rapor_${dateRange.start}_${dateRange.end}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    window.html2pdf().set(opt).from(element).save();
  };

  const scopeButtons = [
    { id: 'general', label: 'Genel', icon: Building2 },
    { id: 'business', label: 'İşletme', icon: Wallet },
    { id: 'stock', label: 'Stok', icon: Car },
    { id: 'sold', label: 'Satılan', icon: ShoppingCart },
    { id: 'deposit', label: 'Kapora', icon: CreditCard },
    { id: 'car', label: 'Araç', icon: Search },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-900">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <FileText size={20}/> Rapor Oluşturucu
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition flex items-center gap-2"
            >
              <Download size={16}/> PDF İndir
            </button>
            <button 
              onClick={handlePrint}
              className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-400 transition flex items-center gap-2"
            >
              <Printer size={16}/> Yazdır
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
              <X size={24}/>
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap gap-6 items-end">
            {/* Date Range */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Tarih Aralığı</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange({...dateRange, start: e.target.value})}
                  className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white"
                />
                <span className="text-neutral-400">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange({...dateRange, end: e.target.value})}
                  className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>
            </div>
            
            {/* Report Scope */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Rapor Kapsamı</label>
              <div className="flex gap-1">
                {scopeButtons.map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setReportScope(btn.id);
                      if (btn.id !== 'car') setSelectedCarId('');
                    }}
                    className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition border ${
                      reportScope === btn.id 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <btn.icon size={14}/> {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Car selector for 'car' scope */}
          {reportScope === 'car' && (
            <div className="mt-4">
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Araç Seçin</label>
              <select
                value={selectedCarId}
                onChange={e => setSelectedCarId(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white min-w-[300px]"
              >
                <option value="">-- Araç Seçiniz --</option>
                {inventory.filter(c => !c.deleted).map(car => (
                  <option key={car.id} value={car.id}>
                    {car.plate?.toLocaleUpperCase('tr-TR')} - {car.brand} {car.model} ({car.year})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div ref={reportRef} className="max-w-4xl mx-auto">
            {/* Report Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
              <div>
                <h2 className="text-lg font-bold text-neutral-600">{getReportTitle()}</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{getScopeLabel()}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <h1 className="text-xl font-black text-black tracking-tight">
                    {userProfile?.name?.toLocaleUpperCase('tr-TR') || 'GALERİ ADI'}
                  </h1>
                  {userProfile?.phone && (
                    <p className="text-xs text-neutral-500">{userProfile.phone}</p>
                  )}
                </div>
                {userProfile?.logo && (
                  <img 
                    src={userProfile.logo} 
                    alt="Logo" 
                    className="h-10 w-auto object-contain"
                  />
                )}
              </div>
            </div>
            
            {/* Summary Boxes */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 p-4 border border-neutral-200 rounded-lg">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Toplam Gelir</p>
                <p className="text-2xl font-black text-green-600">{formatCurrency(totals.income)}</p>
              </div>
              <div className="flex-1 p-4 border border-neutral-200 rounded-lg">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Toplam Gider</p>
                <p className="text-2xl font-black text-red-600">{formatCurrency(totals.expense)}</p>
              </div>
              <div className="flex-1 p-4 border border-neutral-200 rounded-lg">
                <p className="text-xs font-bold text-neutral-500 uppercase mb-1">Net Kâr</p>
                <p className={`text-2xl font-black ${totals.net >= 0 ? 'text-black' : 'text-red-600'}`}>
                  {formatCurrency(totals.net)}
                </p>
              </div>
            </div>
            
            {/* Transaction Table */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-neutral-200">İşlem Dökümü</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="text-left py-2 font-bold text-neutral-600">Tarih</th>
                    <th className="text-left py-2 font-bold text-neutral-600">Tür</th>
                    <th className="text-left py-2 font-bold text-neutral-600">Kategori</th>
                    <th className="text-left py-2 font-bold text-neutral-600">Açıklama</th>
                    <th className="text-right py-2 font-bold text-neutral-600">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="border-b border-neutral-100">
                        <td className="py-2 text-neutral-500">{formatDate(t.date)}</td>
                        <td className="py-2">
                          <span className={`text-xs font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? 'GELİR' : 'GİDER'}
                          </span>
                        </td>
                        <td className="py-2">{t.category}</td>
                        <td className="py-2 text-neutral-600">{t.description}</td>
                        <td className={`py-2 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-neutral-400">
                        Bu tarih aralığında işlem bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Totals Summary */}
            <div className="border-t border-neutral-300 pt-4">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-600">Toplam Gelir:</span>
                    <span className="font-bold text-green-600">{formatCurrency(totals.income)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-600">Toplam Gider:</span>
                    <span className="font-bold text-red-600">-{formatCurrency(totals.expense)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-neutral-300 mt-2">
                    <span className="font-bold">NET SONUÇ:</span>
                    <span className={`font-black ${totals.net >= 0 ? 'text-black' : 'text-red-600'}`}>
                      {formatCurrency(totals.net)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Signature Area */}
            <div className="flex justify-between mt-16 pt-4 border-t border-neutral-200">
              <div className="text-center">
                <p className="font-bold text-sm mb-12">Muhasebe / Onay</p>
                <div className="border-t border-black pt-2 w-48">
                  <p className="text-xs text-neutral-500">İmza / Kaşe</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm mb-12">{userProfile?.name || 'Galeri'} Yetkilisi</p>
                <div className="border-t border-black pt-2 w-48">
                  <p className="text-xs text-neutral-500">İmza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
