import React from 'react';
import {
  Trash2,
  Car,
  User,
  Users,
  RotateCcw
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function TrashView({ 
  inventory, 
  customers, 
  onRestore, 
  onPermanentDelete 
}) {
  const deletedCars = inventory.filter(c => c.deleted);
  const deletedCustomers = customers.filter(c => c.deleted);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <Trash2 size={24} className="text-red-500"/> Çöp Kutusu
        </h2>
        <p className="text-sm text-neutral-500">
          Silinen öğeler burada listelenir. Geri yükleyebilir veya kalıcı olarak silebilirsiniz.
        </p>
      </div>
      
      {/* Silinen Araçlar */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
          <h3 className="font-bold text-black flex items-center gap-2">
            <Car size={18}/> Silinen Araçlar ({deletedCars.length})
          </h3>
        </div>
        {deletedCars.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {deletedCars.map(car => (
              <div key={car.id} className="flex items-center justify-between p-4 hover:bg-neutral-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-neutral-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {car.photos && car.photos.length > 0 ? (
                      <img src={car.photos[0]} alt={car.model} className="w-full h-full object-cover"/>
                    ) : (
                      <Car size={24} className="text-neutral-400"/>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-black">{car.brand} {car.model}</p>
                    <p className="text-sm text-neutral-500">{car.plate?.toLocaleUpperCase('tr-TR')} - {car.year}</p>
                    <p className="text-xs text-red-400">
                      Silinme: {car.deletedAt ? formatDate(car.deletedAt.split('T')[0]) : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onRestore(car.id, 'inventory')} 
                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1"
                  >
                    <RotateCcw size={14}/> Geri Yükle
                  </button>
                  <button 
                    onClick={() => onPermanentDelete(car.id, 'inventory')} 
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-1"
                  >
                    <Trash2 size={14}/> Kalıcı Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-400">
            <Car size={40} className="mx-auto mb-2 opacity-30"/>
            <p>Çöp kutusunda araç yok.</p>
          </div>
        )}
      </div>

      {/* Silinen Müşteriler */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
          <h3 className="font-bold text-black flex items-center gap-2">
            <Users size={18}/> Silinen Müşteriler ({deletedCustomers.length})
          </h3>
        </div>
        {deletedCustomers.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {deletedCustomers.map(customer => (
              <div key={customer.id} className="flex items-center justify-between p-4 hover:bg-neutral-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-neutral-400"/>
                  </div>
                  <div>
                    <p className="font-bold text-black">{customer.name}</p>
                    <p className="text-sm text-neutral-500">{customer.phone} - {customer.type}</p>
                    <p className="text-xs text-red-400">
                      Silinme: {customer.deletedAt ? formatDate(customer.deletedAt.split('T')[0]) : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onRestore(customer.id, 'customer')} 
                    className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-200 flex items-center gap-1"
                  >
                    <RotateCcw size={14}/> Geri Yükle
                  </button>
                  <button 
                    onClick={() => onPermanentDelete(customer.id, 'customer')} 
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200 flex items-center gap-1"
                  >
                    <Trash2 size={14}/> Kalıcı Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-400">
            <Users size={40} className="mx-auto mb-2 opacity-30"/>
            <p>Çöp kutusunda müşteri yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
