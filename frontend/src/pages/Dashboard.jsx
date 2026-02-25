import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Package,
  ShoppingCart,
  CreditCard,
  FileText,
  Calendar
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color = 'default', className = '' }) => {
  const colorClasses = {
    default: 'bg-card border-border',
    primary: 'bg-primary/10 border-primary/30',
    success: 'bg-success/10 border-success/30',
    warning: 'bg-warning/10 border-warning/30',
    destructive: 'bg-destructive/10 border-destructive/30',
  };

  const iconColors = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <div 
      className={`border rounded-xl p-4 ${colorClasses[color]} ${className}`}
      data-testid={`stat-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">{title}</p>
          <p className="font-heading font-bold text-2xl tabular-nums">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-background/50 ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-card border-border hover:bg-muted',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all active:scale-95 ${variants[variant]}`}
      data-testid={`quick-action-${label.toLowerCase().replace(/\s/g, '-')}`}
    >
      <Icon size={24} className="mb-2" />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
};

// Stock Status Item
const StockStatusItem = ({ car }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{car.brand} {car.model} {car.vehicle_type}</p>
      <p className="text-xs text-muted-foreground">{car.plate?.toUpperCase()} - {car.year}</p>
    </div>
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
      car.status === 'Stokta' ? 'bg-primary/20 text-primary' :
      car.status === 'Kapora Alındı' ? 'bg-warning/20 text-warning' :
      'bg-success/20 text-success'
    }`}>
      {car.status === 'Stokta' ? 'Stokta' : car.status === 'Kapora Alındı' ? 'Kapora' : 'Satıldı'}
    </span>
  </div>
);

// Transaction Item
const TransactionItem = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{transaction.category}</p>
        <p className="text-xs text-muted-foreground truncate">{transaction.description}</p>
      </div>
      <span className={`font-heading font-bold tabular-nums ${isIncome ? 'text-success' : 'text-destructive'}`}>
        {isIncome ? '+' : '-'}₺{formatCurrency(transaction.amount).replace('₺', '')}
      </span>
    </div>
  );
};

const Dashboard = ({ onOpenReport }) => {
  const { stats, cars, transactions, loading } = useApp();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter active data
  const activeCars = cars.filter(c => !c.deleted);
  const activeTransactions = transactions.filter(t => !t.deleted);
  
  // Stats calculations
  const stockCars = activeCars.filter(c => c.ownership === 'stock' && c.status !== 'Satıldı');
  const consignmentCars = activeCars.filter(c => c.ownership === 'consignment' && c.status !== 'Satıldı');
  const depositCars = activeCars.filter(c => c.status === 'Kapora Alındı');
  
  // This month sales
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthSales = activeCars.filter(c => 
    c.status === 'Satıldı' && 
    c.sold_date && 
    new Date(c.sold_date) >= thisMonthStart
  ).length;

  // Kasa Durumu (Net Cash Position)
  const totalIncome = activeTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpense = activeTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (t.amount || 0), 0);
  const kasaDurumu = totalIncome - totalExpense;

  // Recent transactions
  const recentTransactions = [...activeTransactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Stock status (recent cars)
  const stockStatusCars = [...activeCars]
    .filter(c => c.status !== 'Satıldı')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-24 md:pb-6 animate-fade-in">
      {/* Stats Grid - 5 columns like original */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="STOK ARAÇ SAYISI"
          value={stockCars.length}
          icon={Car}
          color="default"
        />
        <StatCard
          title="KONSİNYE ARAÇ SAYISI"
          value={consignmentCars.length}
          icon={Package}
          color="default"
        />
        <StatCard
          title="KAPORASI ALINAN"
          value={depositCars.length}
          icon={CreditCard}
          color="warning"
        />
        <StatCard
          title="BU AY SATIŞ"
          value={thisMonthSales}
          icon={ShoppingCart}
          color="success"
        />
        <StatCard
          title="KASA DURUMU"
          value={formatCurrency(kasaDurumu)}
          icon={Wallet}
          color={kasaDurumu >= 0 ? 'success' : 'destructive'}
          className="col-span-2 md:col-span-1"
        />
      </div>

      {/* Content Grid - Son İşlemler & Stok Durumu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son İşlemler */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-semibold text-lg">Son İşlemler</h3>
          </div>
          <div className="p-2">
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Henüz işlem yok
              </p>
            ) : (
              recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            )}
          </div>
        </div>

        {/* Stok Durumu */}
        <div className="bg-card border border-border rounded-xl">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading font-semibold text-lg">Stok Durumu</h3>
          </div>
          <div className="p-2">
            {stockStatusCars.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Henüz araç eklenmemiş
              </p>
            ) : (
              stockStatusCars.map((car) => (
                <StockStatusItem key={car.id} car={car} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reports Button */}
      <button
        onClick={onOpenReport}
        className="w-full p-4 bg-card border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors"
        data-testid="open-reports-btn"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText size={24} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Raporlar</p>
            <p className="text-sm text-muted-foreground">Finansal raporlar ve döküm oluştur</p>
          </div>
        </div>
        <Calendar size={20} className="text-muted-foreground" />
      </button>
    </div>
  );
};

export default Dashboard;
