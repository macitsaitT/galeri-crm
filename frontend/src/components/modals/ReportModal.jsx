import React, { useState, useMemo, useRef } from 'react';
import { FileText, Download, Printer, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const reportTypes = [
  { id: 'general', label: 'Genel' },
  { id: 'business', label: 'İşletme' },
  { id: 'stock', label: 'Stok' },
  { id: 'sold', label: 'Satılan' },
  { id: 'deposit', label: 'Kapora' },
  { id: 'car', label: 'Araç' },
];

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

    filteredTransactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount || 0;
      else expense += tx.amount || 0;
    });

    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

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
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredTransactions, reportType]);

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Finansal Rapor - ${user?.company_name || 'Aslanbaş Oto'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; }
            .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; }
            .stat-box { flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
            .income { color: green; }
            .expense { color: red; }
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
    // For now, use print to PDF functionality
    handlePrint();
  };

  const profitMargin = totals.income > 0 ? ((totals.net / totals.income) * 100).toFixed(0) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <FileText size={24} className="text-primary" />
            Rapor Oluşturucu
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-destructive/90 transition-colors"
              data-testid="download-pdf-btn"
            >
              <Download size={16} />
              PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-card border border-border rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-muted transition-colors"
              data-testid="print-btn"
            >
              <Printer size={16} />
              Yazdır
            </button>
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">TARİH ARALIĞI</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 px-3 bg-background border border-border rounded-lg text-sm"
              data-testid="report-start-date"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 px-3 bg-background border border-border rounded-lg text-sm"
              data-testid="report-end-date"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">RAPOR KAPSAMI</span>
            <div className="flex gap-1">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reportType === type.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                  data-testid={`report-type-${type.id}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-4" ref={reportRef}>
          {/* Report Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">Finansal Durum Raporu</h2>
              <p className="text-sm text-muted-foreground">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">{user?.company_name || 'ASLANBAŞ OTO A.Ş.'}</h3>
              <p className="text-sm text-muted-foreground">{user?.phone || ''}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-border rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase mb-1">TOPLAM GELİR</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totals.income)}</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase mb-1">TOPLAM GİDER</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="p-4 border border-border rounded-lg text-center">
              <p className="text-xs text-muted-foreground uppercase mb-1">NET KÂR</p>
              <p className="text-2xl font-bold">{formatCurrency(totals.net)}</p>
              <p className={`text-sm ${totals.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                %{profitMargin}
              </p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">İşlem Dökümü</h3>
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
