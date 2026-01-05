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
  const [reportScope, setReportScope] = useState('general');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [plateSearch, setPlateSearch] = useState('');
  const reportRef = useRef(null);

  // Filter cars by plate search
  const filteredCars = useMemo(() => {
    if (!plateSearch.trim()) return inventory.filter(c => !c.deleted);
    const search = plateSearch.toLowerCase().replace(/\s/g, '');
    return inventory.filter(c => 
      !c.deleted && c.plate?.toLowerCase().replace(/\s/g, '').includes(search)
    );
  }, [inventory, plateSearch]);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    let txs = transactions.filter(t => {
      if (t.deleted) return false;
      const tDate = new Date(t.date);
      return tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
    });

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

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const net = income - expense;
    const percentage = income > 0 ? ((net / income) * 100).toFixed(1) : 0;

    return { income, expense, net, percentage };
  }, [filteredTransactions]);

  const getReportTitle = () => {
    switch (reportScope) {
      case 'business': return 'İşletme Giderleri Raporu';
      case 'stock': return 'Stok Araçlar Raporu';
      case 'sold': return 'Satılan Araçlar Raporu';
      case 'deposit': return 'Kapora Alınan Araçlar Raporu';
      case 'car': 
        const car = inventory.find(c => c.id === selectedCarId);
        return car ? `${car.plate?.toLocaleUpperCase('tr-TR')} - ${car.brand} ${car.model}` : 'Araç Raporu';
      default: return 'Finansal Durum Raporu';
    }
  };

  const getFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    switch (reportScope) {
      case 'business': return `Isletme_Raporu_${date}`;
      case 'stock': return `Stok_Raporu_${date}`;
      case 'sold': return `Satis_Raporu_${date}`;
      case 'deposit': return `Kapora_Raporu_${date}`;
      case 'car': 
        const car = inventory.find(c => c.id === selectedCarId);
        return car ? `${car.plate?.replace(/\s/g, '_')}_Raporu_${date}` : `Arac_Raporu_${date}`;
      default: return `Genel_Rapor_${date}`;
    }
  };

  const handlePrint = () => {
    const printContent = reportRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${getReportTitle()} - ${userProfile?.name || 'Galeri'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 15px; color: #000; font-size: 11px; }
            img, .report-logo { height: 32px !important; max-height: 32px !important; max-width: 80px !important; width: auto !important; object-fit: contain !important; display: inline-block !important; }
            .flex { display: flex; }
            .flex-1 { flex: 1; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .justify-between { justify-content: space-between; }
            .justify-end { justify-content: flex-end; }
            .gap-2 { gap: 8px; }
            .gap-3 { gap: 12px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .font-bold { font-weight: bold; }
            .font-black { font-weight: 900; }
            .border-b-2 { border-bottom: 2px solid #000; }
            .border-b { border-bottom: 1px solid #eee; }
            .border { border: 1px solid #ddd; }
            .border-t { border-top: 1px solid #ddd; }
            .border-black { border-color: #000; }
            .rounded { border-radius: 4px; }
            .p-2 { padding: 8px; }
            .p-4 { padding: 16px; }
            .py-0\\.5 { padding-top: 2px; padding-bottom: 2px; }
            .py-1 { padding-top: 4px; padding-bottom: 4px; }
            .py-1\\.5 { padding-top: 6px; padding-bottom: 6px; }
            .px-1 { padding-left: 4px; padding-right: 4px; }
            .mb-0\\.5 { margin-bottom: 2px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-8 { margin-bottom: 32px; }
            .mt-0\\.5 { margin-top: 2px; }
            .mt-1 { margin-top: 4px; }
            .mt-10 { margin-top: 40px; }
            .pb-1 { padding-bottom: 4px; }
            .pb-3 { padding-bottom: 12px; }
            .pt-1 { padding-top: 4px; }
            .pt-2 { padding-top: 8px; }
            .pt-3 { padding-top: 12px; }
            .w-32 { width: 128px; }
            .w-48 { width: 192px; }
            .max-w-3xl { max-width: 768px; margin: 0 auto; }
            .text-base { font-size: 14px; }
            .text-sm { font-size: 12px; }
            .text-xs { font-size: 10px; }
            .text-\\[9px\\] { font-size: 9px; }
            .text-\\[10px\\] { font-size: 10px; }
            .uppercase { text-transform: uppercase; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .max-w-\\[150px\\] { max-width: 150px; }
            .text-black { color: #000; }
            .text-neutral-400 { color: #a3a3a3; }
            .text-neutral-500 { color: #737373; }
            .text-neutral-600 { color: #525252; }
            .text-neutral-700 { color: #404040; }
            .text-green-600 { color: #16a34a; }
            .text-red-600 { color: #dc2626; }
            .bg-neutral-50 { background: #fafafa; }
            .border-neutral-100 { border-color: #f5f5f5; }
            .border-neutral-200 { border-color: #e5e5e5; }
            .border-neutral-300 { border-color: #d4d4d4; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th { background: #fafafa; padding: 6px 4px; text-align: left; font-weight: bold; border-bottom: 2px solid #d4d4d4; }
            td { padding: 5px 4px; border-bottom: 1px solid #eee; }
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
              img, .report-logo { height: 32px !important; max-height: 32px !important; max-width: 80px !important; }
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

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
      margin: [10, 10, 10, 10],
      filename: `${getFileName()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
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
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex justify-between items-center bg-neutral-900">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText size={18}/> Rapor Oluşturucu
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-red-700 transition flex items-center gap-1"
            >
              <Download size={14}/> PDF
            </button>
            <button 
              onClick={handlePrint}
              className="bg-amber-500 text-black px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1"
            >
              <Printer size={14}/> Yazdır
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-white ml-2">
              <X size={20}/>
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Tarih Aralığı</label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange({...dateRange, start: e.target.value})}
                  className="border border-neutral-300 rounded px-2 py-1 text-xs bg-white"
                />
                <span className="text-neutral-400 text-xs">-</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange({...dateRange, end: e.target.value})}
                  className="border border-neutral-300 rounded px-2 py-1 text-xs bg-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Rapor Kapsamı</label>
              <div className="flex gap-1">
                {scopeButtons.map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setReportScope(btn.id);
                      if (btn.id !== 'car') setSelectedCarId('');
                    }}
                    className={`px-2 py-1 rounded font-bold text-[10px] flex items-center gap-1 transition border ${
                      reportScope === btn.id 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <btn.icon size={12}/> {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {reportScope === 'car' && (
            <div className="mt-3 flex gap-2 items-end">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Plaka Ara</label>
                <input
                  type="text"
                  value={plateSearch}
                  onChange={e => {
                    setPlateSearch(e.target.value);
                    setSelectedCarId('');
                  }}
                  placeholder="34 ABC 123"
                  className="border border-neutral-300 rounded px-2 py-1 text-xs bg-white w-32"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Araç Seç</label>
                <select
                  value={selectedCarId}
                  onChange={e => setSelectedCarId(e.target.value)}
                  className="border border-neutral-300 rounded px-2 py-1 text-xs bg-white w-full min-w-[250px]"
                >
                  <option value="">-- Araç Seçiniz ({filteredCars.length} araç) --</option>
                  {filteredCars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.plate?.toLocaleUpperCase('tr-TR')} - {car.brand} {car.model} ({car.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div ref={reportRef} className="max-w-3xl mx-auto text-xs">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-black">
              <div>
                <h2 className="text-sm font-bold text-neutral-700">{getReportTitle()}</h2>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <h1 className="text-base font-black text-black">
                    {userProfile?.name?.toLocaleUpperCase('tr-TR') || 'GALERİ ADI'}
                  </h1>
                  {userProfile?.phone && (
                    <p className="text-[10px] text-neutral-500">{userProfile.phone}</p>
                  )}
                </div>
                {userProfile?.logo && (
                  <img src={userProfile.logo} alt="Logo" className="report-logo" style={{height: '32px', maxWidth: '80px', width: 'auto', objectFit: 'contain'}}/>
                )}
              </div>
            </div>
            
            {/* Summary */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 p-2 border border-neutral-200 rounded text-center">
                <p className="text-[9px] text-neutral-500 uppercase mb-0.5">Toplam Gelir</p>
                <p className="text-sm font-bold text-green-600">{formatCurrency(totals.income)}</p>
              </div>
              <div className="flex-1 p-2 border border-neutral-200 rounded text-center">
                <p className="text-[9px] text-neutral-500 uppercase mb-0.5">Toplam Gider</p>
                <p className="text-sm font-bold text-red-600">{formatCurrency(totals.expense)}</p>
              </div>
              <div className="flex-1 p-2 border border-neutral-200 rounded text-center">
                <p className="text-[9px] text-neutral-500 uppercase mb-0.5">Net Kâr</p>
                <p className={`text-sm font-bold ${totals.net >= 0 ? 'text-black' : 'text-red-600'}`}>
                  {formatCurrency(totals.net)}
                </p>
                <p className={`text-[10px] font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  %{totals.percentage}
                </p>
              </div>
            </div>
            
            {/* Table */}
            <div className="mb-4">
              <h3 className="text-xs font-bold mb-2 pb-1 border-b border-neutral-200">İşlem Dökümü</h3>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-50">
                    <th className="text-left py-1.5 px-1 font-bold">Tarih</th>
                    <th className="text-left py-1.5 px-1 font-bold">Tür</th>
                    <th className="text-left py-1.5 px-1 font-bold">Kategori</th>
                    <th className="text-left py-1.5 px-1 font-bold">Açıklama</th>
                    <th className="text-right py-1.5 px-1 font-bold">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                      <tr key={t.id} className="border-b border-neutral-100">
                        <td className="py-1 px-1 text-neutral-500">{formatDate(t.date)}</td>
                        <td className="py-1 px-1">
                          <span className={`text-[9px] font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? 'GELİR' : 'GİDER'}
                          </span>
                        </td>
                        <td className="py-1 px-1">{t.category}</td>
                        <td className="py-1 px-1 text-neutral-600 max-w-[150px] truncate">{t.description}</td>
                        <td className={`py-1 px-1 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-neutral-400 text-xs">
                        Bu tarih aralığında işlem bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Totals */}
            <div className="border-t border-neutral-300 pt-2">
              <div className="flex justify-end">
                <div className="w-52 text-[10px]">
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-600">Toplam Gelir:</span>
                    <span className="font-bold text-green-600">{formatCurrency(totals.income)}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-neutral-600">Toplam Gider:</span>
                    <span className="font-bold text-red-600">-{formatCurrency(totals.expense)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-t border-neutral-300 mt-1 text-xs">
                    <span className="font-bold">NET SONUÇ:</span>
                    <span className={`font-black ${totals.net >= 0 ? 'text-black' : 'text-red-600'}`}>
                      {formatCurrency(totals.net)} <span className="text-[10px]">(%{totals.percentage})</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Signature */}
            <div className="flex justify-between mt-10 pt-3 border-t border-neutral-200">
              <div className="text-center">
                <p className="font-bold text-[10px] mb-8">Muhasebe / Onay</p>
                <div className="border-t border-black pt-1 w-32">
                  <p className="text-[9px] text-neutral-500">İmza / Kaşe</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-[10px] mb-8">{userProfile?.name || 'Galeri'} Yetkilisi</p>
                <div className="border-t border-black pt-1 w-32">
                  <p className="text-[9px] text-neutral-500">İmza</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
