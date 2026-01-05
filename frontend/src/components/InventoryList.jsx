import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Check,
  CreditCard,
  Edit,
  Trash2,
  Receipt,
  Handshake,
  User,
  RotateCcw,
  Coins
} from 'lucide-react';
import { formatCurrency, formatDate, calculateDaysDifference } from '../utils/helpers';

export default function InventoryList({ 
  inventory, 
  transactions,
  viewType, // 'inventory' | 'consignment' | 'sold'
  onEditCar,
  onDeleteCar,
  onViewDetail,
  onOpenExpenses,
  onInitiateSale,
  onInitiateDeposit,
  onCancelSale,
  onChangeSalePrice
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filtreleme
  const filteredInventory = inventory.filter(car => {
    // Silinen araçları hariç tut
    if (car.deleted) return false;
    
    // View tipine göre filtrele
    if (viewType === 'inventory' && (car.ownership === 'consignment' || car.status === 'Satıldı')) return false;
    if (viewType === 'consignment' && (car.ownership !== 'consignment' || car.status === 'Satıldı')) return false;
    if (viewType === 'sold' && car.status !== 'Satıldı') return false;
    
    // Arama filtresi
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        car.plate?.toLowerCase().includes(search) ||
        car.brand?.toLowerCase().includes(search) ||
        car.model?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Kâr/Zarar hesaplama
  const calculateProfit = (car) => {
    const carTrans = transactions.filter(t => !t.deleted && t.carId === car.id);
    const totalIncome = carTrans.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
    const totalExpense = carTrans.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
    return totalIncome - totalExpense;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-visible">
        {/* Search */}
        <div className="p-4 border-b border-neutral-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={18}/>
            <input 
              type="text" 
              placeholder="Plaka, Marka veya Model ile Ara..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table */}
        {filteredInventory.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 font-medium">
              <tr>
                <th className="p-4">Araç</th>
                <th className="p-4">{viewType === 'sold' ? 'Satış Fiyatı' : 'Fiyat'}</th>
                <th className="p-4">Durum</th>
                <th className="p-4">{viewType === 'sold' ? 'Kâr/Zarar' : 'Stok Gün Sayısı'}</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInventory.map(car => {
                const profit = calculateProfit(car);
                const daysInStock = calculateDaysDifference(car.entryDate);
                
                return (
                  <tr 
                    key={car.id} 
                    className="hover:bg-neutral-50 cursor-pointer" 
                    onClick={() => onViewDetail(car)}
                  >
                    <td className="p-4">
                      <div className="font-bold text-black">{car.brand} {car.model}</div>
                      <div className="text-neutral-500 text-xs">
                        {car.year} • {car.km} KM • {car.plate?.toLocaleUpperCase('tr-TR')}
                      </div>
                      {car.ownership === 'consignment' && car.ownerName && (
                        <div className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
                          <Handshake size={12}/> Sahibi: {car.ownerName}
                        </div>
                      )}
                      {viewType === 'sold' && car.customerName && (
                        <div className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                          <User size={12}/> Alıcı: {car.customerName}
                        </div>
                      )}
                      {viewType === 'sold' && car.soldDate && (
                        <div className="text-xs text-neutral-400 mt-1">
                          Satış: {formatDate(car.soldDate)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold">{formatCurrency(car.salePrice)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        car.status === 'Satıldı' 
                          ? 'bg-green-100 text-green-700' 
                          : car.status === 'Kapora Alındı' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {viewType === 'sold' ? (
                        <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </span>
                      ) : (
                        <span className={`text-xs font-bold ${
                          daysInStock >= 60 ? 'text-red-500' 
                          : daysInStock >= 30 ? 'text-amber-600' 
                          : 'text-green-600'
                        }`}>
                          {daysInStock} gün
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === car.id ? null : car.id)} 
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical size={16}/>
                        </button>
                        {activeMenuId === car.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-neutral-100 py-1 text-left origin-top-right">
                            {car.status !== 'Satıldı' && (
                              <>
                                <button 
                                  onClick={() => { onInitiateSale(car); setActiveMenuId(null); }} 
                                  className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"
                                >
                                  <Check size={14} className="mr-2"/> Satıldı
                                </button>
                                <button 
                                  onClick={() => { onInitiateDeposit(car.id); setActiveMenuId(null); }} 
                                  className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"
                                >
                                  <CreditCard size={14} className="mr-2"/> Kapora İşlemi
                                </button>
                              </>
                            )}
                            {car.status === 'Satıldı' && (
                              <>
                                <button 
                                  onClick={() => { onChangeSalePrice(car); setActiveMenuId(null); }} 
                                  className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center text-blue-600"
                                >
                                  <Coins size={14} className="mr-2"/> Fiyat Değiştir
                                </button>
                                <button 
                                  onClick={() => { onCancelSale(car); setActiveMenuId(null); }} 
                                  className="w-full px-4 py-2 text-sm hover:bg-orange-50 flex items-center text-orange-600"
                                >
                                  <RotateCcw size={14} className="mr-2"/> Satışı İptal Et
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => { onOpenExpenses(car); setActiveMenuId(null); }} 
                              className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"
                            >
                              <Receipt size={14} className="mr-2"/> Finans & Masraf
                            </button>
                            <button 
                              onClick={() => { onEditCar(car); setActiveMenuId(null); }} 
                              className="w-full px-4 py-2 text-sm hover:bg-neutral-50 flex items-center"
                            >
                              <Edit size={14} className="mr-2"/> Düzenle
                            </button>
                            <div className="border-t border-neutral-100 my-1"></div>
                            <button 
                              onClick={() => { onDeleteCar(car.id); setActiveMenuId(null); }} 
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 size={14} className="mr-2"/> Sil
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center text-neutral-400">
            {viewType === 'sold' 
              ? 'Henüz satılan araç yok.' 
              : searchTerm 
              ? 'Aramanıza uygun araç bulunamadı.' 
              : 'Bu kategoride araç bulunamadı.'
            }
          </div>
        )}
      </div>
    </div>
  );
}
