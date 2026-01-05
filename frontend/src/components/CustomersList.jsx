import React from 'react';
import {
  Plus,
  Phone,
  Car,
  Edit,
  Trash2,
  User
} from 'lucide-react';
import { formatPhoneNumber, formatCurrency } from '../utils/helpers';

export default function CustomersList({ 
  customers, 
  inventory,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewCarDetail
}) {
  const activeCustomers = customers.filter(c => !c.deleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Müşteri Listesi</h2>
        <button 
          onClick={onAddCustomer}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-neutral-800"
        >
          <Plus size={18}/> Müşteri Ekle
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeCustomers.length > 0 ? activeCustomers.map(c => {
          const interestedCar = c.interestedCarId 
            ? inventory.find(car => car.id === c.interestedCarId && !car.deleted) 
            : null;
          
          return (
            <div key={c.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition relative">
              <div className="flex justify-between mb-2">
                <h4 className="font-bold text-black flex items-center gap-2">
                  <User size={16} className="text-neutral-400"/>
                  {c.name}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  c.type === 'Alıcı' 
                    ? 'bg-green-100 text-green-700' 
                    : c.type === 'Satıcı' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {c.type}
                </span>
              </div>
              <p className="text-sm text-neutral-500 flex items-center gap-2 mb-2">
                <Phone size={14}/> {formatPhoneNumber(c.phone)}
              </p>
              {interestedCar && (
                <div 
                  className="text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded mb-2 cursor-pointer hover:bg-amber-100 transition flex items-center gap-1"
                  onClick={() => onViewCarDetail(interestedCar)}
                >
                  <Car size={12}/> 
                  <span className="font-bold">İlgilendiği Araç:</span> {interestedCar.brand} {interestedCar.model} - {interestedCar.plate?.toLocaleUpperCase('tr-TR')}
                </div>
              )}
              <p className="text-xs text-neutral-600 bg-neutral-50 p-2 rounded min-h-[40px]">
                {c.notes || 'Not yok.'}
              </p>
              <div className="absolute top-2 right-2 flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditCustomer(c); }} 
                  className="p-1 text-neutral-400 hover:text-amber-600 rounded-full hover:bg-amber-50"
                >
                  <Edit size={16}/>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCustomer(c.id); }} 
                  className="p-1 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          );
        }) : (
          <p className="text-neutral-400 text-sm py-4 col-span-full text-center">Henüz müşteri kaydı yok.</p>
        )}
      </div>
    </div>
  );
}
