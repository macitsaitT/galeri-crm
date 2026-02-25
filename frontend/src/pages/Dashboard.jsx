import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { 
  Car, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Wallet,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const isPositive = trend === 'up';
  
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
    destructive: 'from-destructive/20 to-destructive/5 border-destructive/20',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };

  return (
    <div 
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 hover:shadow-lg transition-all duration-300`}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-card ${iconColorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
      <p className="font-heading font-bold text-2xl md:text-3xl tabular-nums">{value}</p>
    </div>
  );
};

const RecentActivityItem = ({ icon: Icon, title, subtitle, time, color }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm truncate">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
    <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
  </div>
);

const Dashboard = () => {
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
  
  // Recent transactions
  const recentTransactions = [...activeTransactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Recent cars
  const recentCars = [...activeCars]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-24 md:pb-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Araç"
          value={stats?.total_cars || 0}
          icon={Car}
          color="primary"
        />
        <StatCard
          title="Stokta"
          value={stats?.stock_cars || 0}
          icon={Package}
          color="primary"
        />
        <StatCard
          title="Satılan"
          value={stats?.sold_cars || 0}
          icon={ShoppingCart}
          color="success"
        />
        <StatCard
          title="Müşteriler"
          value={stats?.total_customers || 0}
          icon={Users}
          color="warning"
        />
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Toplam Gelir"
          value={formatCurrency(stats?.total_income || 0)}
          icon={TrendingUp}
          color="success"
        />
        <StatCard
          title="Toplam Gider"
          value={formatCurrency(stats?.total_expense || 0)}
          icon={TrendingDown}
          color="destructive"
        />
        <StatCard
          title="Net Kar"
          value={formatCurrency(stats?.net_profit || 0)}
          icon={Wallet}
          color={(stats?.net_profit || 0) >= 0 ? 'success' : 'destructive'}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cars */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-lg mb-4">Son Eklenen Araçlar</h3>
          <div className="space-y-2">
            {recentCars.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Henüz araç eklenmemiş
              </p>
            ) : (
              recentCars.map((car) => (
                <RecentActivityItem
                  key={car.id}
                  icon={Car}
                  title={`${car.brand} ${car.model}`}
                  subtitle={car.plate?.toUpperCase() || '-'}
                  time={new Date(car.created_at).toLocaleDateString('tr-TR')}
                  color={car.status === 'Satıldı' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-lg mb-4">Son İşlemler</h3>
          <div className="space-y-2">
            {recentTransactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Henüz işlem yok
              </p>
            ) : (
              recentTransactions.map((tx) => (
                <RecentActivityItem
                  key={tx.id}
                  icon={tx.type === 'income' ? TrendingUp : TrendingDown}
                  title={tx.category}
                  subtitle={formatCurrency(tx.amount)}
                  time={new Date(tx.date).toLocaleDateString('tr-TR')}
                  color={tx.type === 'income' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stock Value Card */}
      <div className="bg-gradient-to-r from-primary/20 via-card to-card border border-primary/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Stok Değeri</p>
            <p className="font-heading font-bold text-3xl md:text-4xl text-gradient-gold">
              {formatCurrency(stats?.stock_value || 0)}
            </p>
          </div>
          <div className="hidden md:block p-4 rounded-full bg-primary/10">
            <Wallet size={40} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
