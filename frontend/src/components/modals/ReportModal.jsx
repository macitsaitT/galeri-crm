import React, { useState, useMemo, useRef } from 'react';
import { FileText, Download, Printer, Building2, Package, Tag, Key, Car, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const reportTypes = [
  { id: 'general', label: 'Genel', icon: FileText },
  { id: 'business', label: 'İşletme', icon: Building2 },
  { id: 'stock', label: 'Stok', icon: Package },
  { id: 'sold', label: 'Satılan', icon: Tag },
  { id: 'deposit', label: 'Kapora', icon: Key },
  { id: 'car', label: 'Araç', icon: Car },
];

const reportTitles = {
  general: 'Finansal Durum Raporu',
  business: 'İşletme Raporu',
  stock: 'Stok Raporu',
  sold: 'Satış Raporu',
  deposit: 'Kapora Raporu',
  car: 'Araç Raporu',
};

const ReportModal = ({ isOpen, onClose }) => {
  const { user, cars, transactions } = useApp();
  const reportRef = useRef(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('general');
  const [plateSearch, setPlateSearch] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');

  const activeCars = useMemo(() => cars.filter(c => !c.deleted), [cars]);

  const filteredCarsForDropdown = useMemo(() => {
    if (!plateSearch) return activeCars;
    return activeCars.filter(c =>
      c.plate?.toLowerCase().includes(plateSearch.toLowerCase())
    );
  }, [activeCars, plateSearch]);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.deleted) return false;
      const txDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      return txDate >= start && txDate <= end;
    });
  }, [transactions, startDate, endDate]);

  // Calculate totals
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    const txList = reportType === 'car' && selectedCarId
      ? filteredTransactions.filter(t => t.car_id === selectedCarId)
      : filteredTransactions;

    txList.forEach(tx => {
      if (tx.type === 'income') income += tx.amount || 0;
      else expense += tx.amount || 0;
    });

    return { income, expense, net: income - expense };
  }, [filteredTransactions, reportType, selectedCarId]);

  // Filter by report type
  const displayTransactions = useMemo(() => {
    let filtered = [...filteredTransactions];

    switch (reportType) {
      case 'stock':
        filtered = filtered.filter(t => t.category?.includes('Alımı') || t.category?.includes('Alış'));
        break;
      case 'sold':
        filtered = filtered.filter(t => t.category?.includes('Satış'));
        break;
      case 'deposit':
        filtered = filtered.filter(t => t.category?.includes('Kapora'));
        break;
      case 'business':
        filtered = filtered.filter(t =>
          !t.category?.includes('Araç') &&
          !t.category?.includes('Satış') &&
          !t.category?.includes('Kapora')
        );
        break;
      case 'car':
        if (selectedCarId) {
          filtered = filtered.filter(t => t.car_id === selectedCarId);
        }
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredTransactions, reportType, selectedCarId]);

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitles[reportType]} - ${user?.company_name || 'Aslanbaş Oto'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; }
            .stat-box { flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
            .income { color: #16a34a; }
            .expense { color: #dc2626; }
            .signature { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; }
            .sig-line { width: 200px; border-top: 1px solid #000; padding-top: 10px; text-align: center; }
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

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const profitMargin = totals.income > 0 ? ((totals.net / totals.income) * 100).toFixed(0) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="report-modal">
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <FileText size={22} className="text-primary" />
            Rapor Oluşturucu
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-destructive/90 transition-colors"
              data-testid="download-pdf-btn"
            >
              <Download size={16} />
              PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-amber-600 transition-colors"
              data-testid="print-btn"
            >
              <Printer size={16} />
              Yazdır
            </button>
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-3 py-3 border-b border-border">
          {/* Date + Report Scope Row */}
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1">Tarih Aralığı</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 px-3 bg-background border border-border rounded-lg text-sm"
                  data-testid="report-start-date"
                />
                <span className="text-muted-foreground text-sm">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 px-3 bg-background border border-border rounded-lg text-sm"
                  data-testid="report-end-date"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1">Rapor Kapsamı</span>
              <div className="flex gap-1">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setReportType(type.id);
                        if (type.id !== 'car') {
                          setSelectedCarId('');
                          setPlateSearch('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        reportType === type.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border hover:bg-muted text-foreground'
                      }`}
                      data-testid={`report-type-${type.id}`}
                    >
                      <Icon size={14} />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Vehicle Filter Row - only for "Araç" report type */}
          {reportType === 'car' && (
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1">Plaka Ara</span>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={plateSearch}
                    onChange={(e) => setPlateSearch(e.target.value)}
                    placeholder="34 ABC 123"
                    className="h-9 pl-8 pr-3 bg-background border border-border rounded-lg text-sm w-36"
                    data-testid="plate-search-input"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase block mb-1">Araç Seç</span>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="h-9 px-3 bg-background border border-border rounded-lg text-sm w-full"
                  data-testid="car-select-dropdown"
                >
                  <option value="">-- Araç Seçiniz ({filteredCarsForDropdown.length} araç) --</option>
                  {filteredCarsForDropdown.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.plate?.toUpperCase()} - {car.brand} {car.model} ({car.year})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-4" ref={reportRef}>
          {/* Report Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">{reportTitles[reportType]}</h2>
              <p className="text-sm text-muted-foreground">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">{user?.company_name || 'ASLANBAŞ OTO A.Ş.'}</h3>
              <p className="text-sm text-muted-foreground">{user?.phone || '05401250404'}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-border rounded-lg text-center" data-testid="report-total-income">
              <p className="text-xs text-muted-foreground uppercase mb-1">Toplam Gelir</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totals.income)}</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center" data-testid="report-total-expense">
              <p className="text-xs text-muted-foreground uppercase mb-1">Toplam Gider</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center" data-testid="report-net-profit">
              <p className="text-xs text-muted-foreground uppercase mb-1">Net Kâr</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.net)}</p>
              <p className={`text-sm ${totals.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                %{profitMargin}
              </p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 border-b border-border pb-2">İşlem Dökümü</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tarih</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tür</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Kategori</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Açıklama</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-muted-foreground">
                      Bu tarih aralığında işlem bulunamadı.
                    </td>
                  </tr>
                ) : (
                  displayTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3 text-sm">{formatDate(tx.date)}</td>
                      <td className="p-3 text-sm">
                        <span className={tx.type === 'income' ? 'text-success' : 'text-destructive'}>
                          {tx.type === 'income' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{tx.category}</td>
                      <td className="p-3 text-sm text-muted-foreground">{tx.description || '-'}</td>
                      <td className={`p-3 text-sm text-right font-medium ${
                        tx.type === 'income' ? 'text-success' : 'text-destructive'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-72">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Toplam Gelir:</span>
                <span className="text-success font-medium">{formatCurrency(totals.income)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Toplam Gider:</span>
                <span className="text-destructive font-medium">-{formatCurrency(totals.expense)}</span>
              </div>
              <div className="flex justify-between py-3 font-bold">
                <span>NET SONUÇ:</span>
                <span>{formatCurrency(totals.net)} (%{profitMargin})</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between pt-8 border-t border-border mt-8">
            <div className="text-center">
              <p className="font-medium mb-8">Muhasebe / Onay</p>
              <div className="w-48 border-t border-foreground pt-2">
                <p className="text-sm text-muted-foreground">İmza / Kaşe</p>
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium mb-8">{user?.company_name || 'ASLANBAŞ OTO A.Ş.'} Yetkilisi</p>
              <div className="w-48 border-t border-foreground pt-2">
                <p className="text-sm text-muted-foreground">İmza</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
