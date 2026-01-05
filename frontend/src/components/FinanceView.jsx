import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Car,
  Wallet,
  Building2,
  Trash2,
  Handshake,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const FinanceGroupRow = ({ title, subtext, amount, percentage, children, defaultExpanded = false, type = 'neutral' }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white mb-3 shadow-sm">
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
          isExpanded ? 'bg-neutral-50' : 'bg-white hover:bg-neutral-50'
        }`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            type === 'car' ? 'bg-amber-100 text-amber-700' 
            : type === 'capital' ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-700'
          }`}>
            {type === 'car' ? <Car size={20} /> : type === 'capital' ? <Wallet size={20}/> : <Building2 size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-black">{title}</h4>
            <p className="text-xs text-neutral-500">{subtext}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`font-bold ${amount > 0 ? 'text-green-600' : amount < 0 ? 'text-red-600' : 'text-neutral-400'}`}>
              {amount > 0 ? '+' : ''}{formatCurrency(amount)}
            </p>
            {percentage && (
              <p className={`text-[10px] font-bold ${parseFloat(percentage) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {parseFloat(percentage) > 0 ? '+' : ''}%{percentage}
              </p>
            )}
            <p className="text-[10px] text-neutral-400 uppercase font-bold">NET DURUM</p>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
        </div>
      </div>
      {isExpanded && <div className="border-t border-neutral-100 bg-neutral-50/50">{children}</div>}
    </div>
  );
};

export default function FinanceView({ inventory, transactions, onDeleteTransaction }) {
  // Genel işletme işlemleri (araçsız)
  const generalTransactions = transactions.filter(t => !t.deleted && !t.carId && t.category !== 'Araç Alımı');
  const generalNet = generalTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  
  // Araç portföyü işlemleri
  const carTransactions = transactions.filter(t => !t.deleted && !!t.carId);
  const carNet = carTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Gelir & Gider Yönetimi</h2>
      </div>
      
      {/* Genel İşletme */}
      <FinanceGroupRow 
        title="Genel İşletme (Net)" 
        subtext="Kira, Fatura, Maaş vb. İşlemleri" 
        amount={generalNet} 
        type='capital'
      >
        <div className="space-y-2 p-2">
          {generalTransactions.length > 0 ? generalTransactions.map(t => (
            <div key={t.id} className="flex justify-between items-center text-sm p-2 border-b hover:bg-neutral-100">
              <span className="text-neutral-500 flex-1">
                {formatDate(t.date)} - {t.category} ({t.description})
              </span>
              <span className={`mr-3 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <button 
                onClick={() => onDeleteTransaction(t.id)} 
                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          )) : (
            <p className="text-center text-neutral-400 text-sm py-4">Henüz genel işletme işlemi yok.</p>
          )}
        </div>
      </FinanceGroupRow>
      
      {/* Araç Portföyü */}
      <FinanceGroupRow 
        title="Araç Portföyü (Net)" 
        subtext="Tüm Araçların Alım, Satım ve Masraf Durumu" 
        amount={carNet} 
        type='car'
      >
        <div className="space-y-2 p-2">
          {carTransactions.length > 0 ? carTransactions.map(t => (
            <div key={t.id} className="flex justify-between items-center text-sm p-2 border-b hover:bg-neutral-100">
              <span className="text-neutral-500 flex-1">
                {formatDate(t.date)} - {t.description}
              </span>
              <span className={`mr-3 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
              <button 
                onClick={() => onDeleteTransaction(t.id)} 
                className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          )) : (
            <p className="text-center text-neutral-400 text-sm py-4">Henüz araç işlemi yok.</p>
          )}
        </div>
      </FinanceGroupRow>

      {/* Araç Bazlı Finans */}
      <h3 className="font-bold text-lg text-black mt-8 mb-2">Araç Bazlı Finans</h3>
      {inventory.filter(c => !c.deleted).map(car => {
        const carTrans = transactions.filter(t => !t.deleted && (t.carId === car.id || t.description.includes(car.plate)));
        const totalCarIncome = carTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
        const totalCarExpense = carTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
        const netStatus = totalCarIncome - totalCarExpense;
        
        let profitPercent = null;
        if (totalCarIncome > 0 && car.status === 'Satıldı') {
          profitPercent = ((netStatus / totalCarIncome) * 100).toFixed(1);
        }
        
        // Konsinye hesaplamaları
        const isConsignment = car.ownership === 'consignment';
        const commissionRate = car.commissionRate || 5;
        const saleAmount = carTrans.find(t => t.category === 'Araç Satışı')?.amount || car.salePrice || 0;
        const ownerShare = isConsignment ? Math.round(saleAmount * (100 - commissionRate) / 100) : 0;
        const galleryCommission = isConsignment ? saleAmount - ownerShare : 0;
        const paidToOwner = carTrans.filter(t => t.category === 'Araç Sahibine Ödeme').reduce((a, c) => a + c.amount, 0);
        const remainingToOwner = ownerShare - paidToOwner;
        
        return (
          <FinanceGroupRow 
            key={car.id} 
            type="car" 
            title={`${car.brand} ${car.model}`} 
            subtext={`${car.plate?.toLocaleUpperCase('tr-TR')} ${isConsignment ? '(Konsinye)' : ''}`} 
            amount={netStatus} 
            percentage={profitPercent} 
            defaultExpanded={false}
          >
            <div className="p-4 bg-neutral-50">
              {/* Stok Araç */}
              {!isConsignment && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <p className="text-[10px] text-neutral-500 uppercase">Alış Fiyatı</p>
                    <p className="font-bold text-sm">{formatCurrency(car.purchasePrice || 0)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-neutral-200">
                    <p className="text-[10px] text-neutral-500 uppercase">Satış Fiyatı</p>
                    <p className="font-bold text-sm">{formatCurrency(car.salePrice || 0)}</p>
                  </div>
                </div>
              )}
              
              {/* Konsinye Araç */}
              {isConsignment && (
                <div className="mb-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Handshake size={18} className="text-purple-600"/>
                      <h5 className="font-bold text-purple-800">Konsinye Detayları</h5>
                      {car.ownerName && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-auto">
                          Sahibi: {car.ownerName}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded border border-purple-100">
                        <p className="text-[10px] text-neutral-500 uppercase">Satış Fiyatı</p>
                        <p className="font-bold text-sm">{formatCurrency(saleAmount)}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-purple-100">
                        <p className="text-[10px] text-neutral-500 uppercase">Komisyon (%{commissionRate})</p>
                        <p className="font-bold text-sm text-green-600">+{formatCurrency(galleryCommission)}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-purple-100">
                        <p className="text-[10px] text-neutral-500 uppercase">Sahibine Verilecek</p>
                        <p className="font-bold text-sm text-purple-700">{formatCurrency(ownerShare)}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-purple-100">
                        <p className="text-[10px] text-neutral-500 uppercase">Sahibine Ödenen</p>
                        <p className="font-bold text-sm text-blue-600">{formatCurrency(paidToOwner)}</p>
                      </div>
                    </div>
                    
                    {car.status === 'Satıldı' && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        remainingToOwner > 0 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-green-50 border border-green-200'
                      }`}>
                        {remainingToOwner > 0 ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={18} className="text-red-500"/>
                              <span className="text-sm font-bold text-red-700">Sahibine Verilmesi Gereken:</span>
                            </div>
                            <span className="text-lg font-bold text-red-600">{formatCurrency(remainingToOwner)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500"/>
                            <span className="text-sm font-bold text-green-700">Araç sahibine ödeme tamamlandı!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* İşlem Geçmişi */}
              <h5 className="text-xs font-bold text-neutral-500 mb-2 uppercase">İşlem Geçmişi</h5>
              {carTrans.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="text-neutral-400 border-b border-neutral-200">
                    <tr>
                      <th className="pb-2">Tarih</th>
                      <th className="pb-2">İşlem</th>
                      <th className="pb-2 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {carTrans.map(t => (
                      <tr key={t.id}>
                        <td className="py-2 text-neutral-500">{formatDate(t.date)}</td>
                        <td className="py-2">{t.category} <span className="text-neutral-400">({t.description})</span></td>
                        <td className={`py-2 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-neutral-400">Henüz işlem yok.</p>
              )}
            </div>
          </FinanceGroupRow>
        );
      })}
    </div>
  );
}
