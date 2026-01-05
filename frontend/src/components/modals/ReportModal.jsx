import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Car,
  Wallet,
  Users,
  PieChart
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function ReportModal({ 
  isOpen, 
  onClose, 
  inventory, 
  transactions, 
  customers 
}) {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.deleted) return false;
      const tDate = new Date(t.date);
      return tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
    });
  }, [transactions, dateRange]);

  // Calculate summaries
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const carSales = filteredTransactions
      .filter(t => t.category === 'Araç Satışı')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const carPurchases = filteredTransactions
      .filter(t => t.category === 'Araç Alımı')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const generalExpenses = filteredTransactions
      .filter(t => t.type === 'expense' && !t.carId)
      .reduce((acc, t) => acc + t.amount, 0);

    const carExpenses = filteredTransactions
      .filter(t => t.type === 'expense' && t.carId && t.category !== 'Araç Alımı')
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      income,
      expense,
      net: income - expense,
      carSales,
      carPurchases,
      generalExpenses,
      carExpenses,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredTransactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        breakdown[t.category].income += t.amount;
      } else {
        breakdown[t.category].expense += t.amount;
      }
    });
    return Object.entries(breakdown).sort((a, b) => 
      (b[1].income + b[1].expense) - (a[1].income + a[1].expense)
    );
  }, [filteredTransactions]);

  // Inventory stats
  const inventoryStats = useMemo(() => {
    const active = inventory.filter(c => !c.deleted);
    return {
      total: active.length,
      stock: active.filter(c => c.ownership === 'stock' && c.status !== 'Satıldı').length,
      consignment: active.filter(c => c.ownership === 'consignment' && c.status !== 'Satıldı').length,
      sold: active.filter(c => c.status === 'Satıldı').length,
      deposit: active.filter(c => c.status === 'Kapora Alındı').length,
      totalValue: active.filter(c => c.status !== 'Satıldı').reduce((acc, c) => acc + (c.salePrice || 0), 0)
    };
  }, [inventory]);

  // Print report
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden border border-neutral-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h3 className="font-bold text-lg text-black flex items-center gap-2">
            <FileText size={20} className="text-blue-600"/> Raporlar
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Download size={16}/> Yazdır / PDF
            </button>
            <button onClick={onClose} className="text-neutral-400 hover:text-black">
              <X size={24}/>
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="px-6 py-4 border-b border-neutral-100 flex flex-wrap gap-4 items-center">
          {/* Report Type */}
          <div className="flex gap-2">
            {[
              { id: 'summary', label: 'Özet', icon: PieChart },
              { id: 'transactions', label: 'İşlemler', icon: Wallet },
              { id: 'inventory', label: 'Envanter', icon: Car },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition ${
                  reportType === type.id 
                    ? 'bg-black text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <type.icon size={16}/> {type.label}
              </button>
            ))}
          </div>
          
          {/* Date Range */}
          <div className="flex items-center gap-2 ml-auto">
            <Calendar size={16} className="text-neutral-400"/>
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange({...dateRange, start: e.target.value})}
              className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-neutral-400">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange({...dateRange, end: e.target.value})}
              className="border border-neutral-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 print:p-0" id="report-content">
          {/* Summary Report */}
          {reportType === 'summary' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-green-600"/>
                    <span className="text-xs font-bold text-green-600 uppercase">Toplam Gelir</span>
                  </div>
                  <p className="text-2xl font-black text-green-700">{formatCurrency(summary.income)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={18} className="text-red-600"/>
                    <span className="text-xs font-bold text-red-600 uppercase">Toplam Gider</span>
                  </div>
                  <p className="text-2xl font-black text-red-700">{formatCurrency(summary.expense)}</p>
                </div>
                <div className={`border rounded-xl p-4 ${summary.net >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={18} className={summary.net >= 0 ? 'text-blue-600' : 'text-orange-600'}/>
                    <span className={`text-xs font-bold uppercase ${summary.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Net Durum</span>
                  </div>
                  <p className={`text-2xl font-black ${summary.net >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    {formatCurrency(summary.net)}
                  </p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-neutral-600"/>
                    <span className="text-xs font-bold text-neutral-600 uppercase">İşlem Sayısı</span>
                  </div>
                  <p className="text-2xl font-black text-neutral-700">{summary.transactionCount}</p>
                </div>
              </div>
              
              {/* Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                  <h4 className="font-bold text-sm mb-3 text-neutral-600 uppercase">Araç İşlemleri</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Araç Satışları</span>
                      <span className="font-bold text-green-600">+{formatCurrency(summary.carSales)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Araç Alımları</span>
                      <span className="font-bold text-red-600">-{formatCurrency(summary.carPurchases)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Araç Masrafları</span>
                      <span className="font-bold text-red-600">-{formatCurrency(summary.carExpenses)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-sm font-bold">Net Araç Kârı</span>
                      <span className={`font-bold ${summary.carSales - summary.carPurchases - summary.carExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.carSales - summary.carPurchases - summary.carExpenses)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-4">
                  <h4 className="font-bold text-sm mb-3 text-neutral-600 uppercase">Genel İşletme</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-500">Genel Giderler</span>
                      <span className="font-bold text-red-600">-{formatCurrency(summary.generalExpenses)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category Breakdown */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h4 className="font-bold text-sm mb-3 text-neutral-600 uppercase">Kategori Bazlı Dağılım</h4>
                <div className="space-y-2">
                  {categoryBreakdown.map(([category, amounts]) => (
                    <div key={category} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-sm">{category}</span>
                      <div className="flex gap-4">
                        {amounts.income > 0 && (
                          <span className="text-green-600 font-bold text-sm">+{formatCurrency(amounts.income)}</span>
                        )}
                        {amounts.expense > 0 && (
                          <span className="text-red-600 font-bold text-sm">-{formatCurrency(amounts.expense)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Transactions Report */}
          {reportType === 'transactions' && (
            <div className="space-y-4">
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-3 font-bold text-neutral-600">Tarih</th>
                      <th className="text-left p-3 font-bold text-neutral-600">Kategori</th>
                      <th className="text-left p-3 font-bold text-neutral-600">Açıklama</th>
                      <th className="text-right p-3 font-bold text-neutral-600">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                      <tr key={t.id} className="hover:bg-neutral-50">
                        <td className="p-3 text-neutral-500">{formatDate(t.date)}</td>
                        <td className="p-3">{t.category}</td>
                        <td className="p-3 text-neutral-600">{t.description}</td>
                        <td className={`p-3 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-neutral-400">
                          Bu tarih aralığında işlem bulunamadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Inventory Report */}
          {reportType === 'inventory' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black">{inventoryStats.total}</p>
                  <p className="text-xs text-neutral-500 uppercase font-bold">Toplam Araç</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-green-700">{inventoryStats.stock}</p>
                  <p className="text-xs text-green-600 uppercase font-bold">Stok</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-purple-700">{inventoryStats.consignment}</p>
                  <p className="text-xs text-purple-600 uppercase font-bold">Konsinye</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-amber-700">{inventoryStats.deposit}</p>
                  <p className="text-xs text-amber-600 uppercase font-bold">Kapora</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-3xl font-black text-blue-700">{inventoryStats.sold}</p>
                  <p className="text-xs text-blue-600 uppercase font-bold">Satıldı</p>
                </div>
              </div>
              
              {/* Total Value */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-600 uppercase font-bold mb-1">Stoktaki Araçların Toplam Değeri</p>
                <p className="text-3xl font-black text-amber-700">{formatCurrency(inventoryStats.totalValue)}</p>
              </div>
              
              {/* Inventory Table */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left p-3 font-bold text-neutral-600">Araç</th>
                      <th className="text-left p-3 font-bold text-neutral-600">Plaka</th>
                      <th className="text-left p-3 font-bold text-neutral-600">Durum</th>
                      <th className="text-left p-3 font-bold text-neutral-600">Tip</th>
                      <th className="text-right p-3 font-bold text-neutral-600">Alış</th>
                      <th className="text-right p-3 font-bold text-neutral-600">Satış</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {inventory.filter(c => !c.deleted).map(car => (
                      <tr key={car.id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold">{car.brand} {car.model} ({car.year})</td>
                        <td className="p-3">{car.plate?.toLocaleUpperCase('tr-TR')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            car.status === 'Satıldı' ? 'bg-blue-100 text-blue-700'
                            : car.status === 'Kapora Alındı' ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            car.ownership === 'consignment' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {car.ownership === 'consignment' ? 'Konsinye' : 'Stok'}
                          </span>
                        </td>
                        <td className="p-3 text-right">{formatCurrency(car.purchasePrice || 0)}</td>
                        <td className="p-3 text-right font-bold">{formatCurrency(car.salePrice || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
