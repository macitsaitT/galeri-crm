import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatCurrency } from '../utils/helpers';
import { 
  Trash2, 
  RotateCcw, 
  Car, 
  Users,
  AlertTriangle
} from 'lucide-react';

const TrashPage = () => {
  const { cars, customers, restoreCar, restoreCustomer, deleteCar, deleteCustomer } = useApp();

  const deletedCars = useMemo(() => 
    cars.filter(c => c.deleted).sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at)),
    [cars]
  );

  const deletedCustomers = useMemo(() => 
    customers.filter(c => c.deleted).sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at)),
    [customers]
  );

  const handleRestore = async (item, type) => {
    if (type === 'car') {
      await restoreCar(item.id);
    } else {
      await restoreCustomer(item.id);
    }
  };

  const handlePermanentDelete = async (item, type) => {
    if (!window.confirm('Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    
    if (type === 'car') {
      await deleteCar(item.id, true);
    } else {
      await deleteCustomer(item.id, true);
    }
  };

  const isEmpty = deletedCars.length === 0 && deletedCustomers.length === 0;

  return (
    <div className="space-y-6 pb-24 md:pb-6 animate-fade-in">
      {/* Warning Banner */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-warning mt-0.5" />
        <div>
          <p className="font-medium text-warning">Çöp Kutusu</p>
          <p className="text-sm text-muted-foreground">
            Silinen öğeler burada görünür. Kalıcı silme işlemi geri alınamaz.
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Trash2 size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">Çöp Kutusu Boş</h3>
          <p className="text-muted-foreground text-sm">Silinen öğe bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Deleted Cars */}
          {deletedCars.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Car size={20} className="text-muted-foreground" />
                <div>
                  <h3 className="font-heading font-semibold">Silinen Araçlar</h3>
                  <p className="text-sm text-muted-foreground">{deletedCars.length} araç</p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {deletedCars.map((car) => (
                  <div key={car.id} className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-sm text-muted-foreground">
                        {car.plate?.toUpperCase()} • {formatCurrency(car.sale_price)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Silinme: {formatDate(car.deleted_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(car, 'car')}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        data-testid={`restore-car-${car.id}`}
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(car, 'car')}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        data-testid={`permanent-delete-car-${car.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deleted Customers */}
          {deletedCustomers.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Users size={20} className="text-muted-foreground" />
                <div>
                  <h3 className="font-heading font-semibold">Silinen Müşteriler</h3>
                  <p className="text-sm text-muted-foreground">{deletedCustomers.length} müşteri</p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {deletedCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone || '-'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Silinme: {formatDate(customer.deleted_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(customer, 'customer')}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        data-testid={`restore-customer-${customer.id}`}
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(customer, 'customer')}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        data-testid={`permanent-delete-customer-${customer.id}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
