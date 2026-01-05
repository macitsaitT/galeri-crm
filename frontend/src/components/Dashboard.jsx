import React from 'react';
import {
  Car,
  CreditCard,
  TrendingUp,
  Wallet,
  Handshake
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-neutral-200 flex items-start justify-between h-full">
    <div className="flex-1">
      <p className="text-neutral-500 text-xs font-bold uppercase mb-2 tracking-wide">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-black break-words leading-tight">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 shrink-0 ml-4`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
  </div>
);

export default function Dashboard({ inventory, transactions }) {
  // Hesaplamalar
  const stockCars = inventory.filter(c => !c.deleted && c.ownership === 'stock' && c.status !== 'Satıldı').length;
  const consignmentCars = inventory.filter(c => !c.deleted && c.ownership === 'consignment' && c.status !== 'Satıldı').length;
  const depositCars = inventory.filter(c => !c.deleted && c.status === 'Kapora Alındı').length;
  
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlySales = transactions.filter(t => 
    !t.deleted && 
    t.type === 'income' && 
    t.category === 'Araç Satışı' && 
    t.date.startsWith(currentMonth)
  ).length;
  
  const totalBalance = transactions.filter(t => !t.deleted).reduce((acc, t) => 
    acc + (t.type === 'income' ? (Number(t.amount) || 0) : -(Number(t.amount) || 0)), 0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard 
          title="Stok Araç Sayısı" 
          value={stockCars} 
          icon={Car} 
          colorClass="bg-black text-white"
        />
        <StatCard 
          title="Konsinye Araç Sayısı" 
          value={consignmentCars} 
          icon={Handshake} 
          colorClass="bg-purple-600 text-white"
        />
        <StatCard 
          title="Kaporası Alınan" 
          value={depositCars} 
          icon={CreditCard} 
          colorClass="bg-orange-500 text-white"
        />
        <StatCard 
          title="Bu Ay Satış" 
          value={monthlySales} 
          icon={TrendingUp} 
          colorClass="bg-green-600 text-white"
        />
        <StatCard 
          title="Kasa Durumu" 
          value={formatCurrency(totalBalance)} 
          icon={Wallet} 
          colorClass="bg-amber-500 text-black"
        />
      </div>
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son İşlemler */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50">
            <h3 className="font-bold text-black">Son İşlemler</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {transactions.filter(t => !t.deleted).slice(0, 5).map(t => (
              <div key={t.id} className="p-4 flex justify-between items-center hover:bg-neutral-50">
                <div>
                  <p className="text-sm font-medium text-black">{t.category}</p>
                  <p className="text-xs text-neutral-500">{t.description}</p>
                </div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stok Durumu */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50">
            <h3 className="font-bold text-black">Stok Durumu</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {inventory.filter(c => !c.deleted && c.status !== 'Satıldı').slice(0, 5).map(car => (
              <div key={car.id} className="p-4 flex justify-between items-center hover:bg-neutral-50">
                <div>
                  <p className="text-sm font-bold text-black">{car.brand} {car.model}</p>
                  <p className="text-xs text-neutral-500">{car.plate?.toLocaleUpperCase('tr-TR')} - {car.year}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  car.status === 'Kapora Alındı' 
                    ? 'bg-orange-100 text-orange-700' 
                    : car.ownership === 'consignment'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {car.status === 'Kapora Alındı' ? 'Kapora' : car.ownership === 'consignment' ? 'Konsinye' : 'Stokta'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
