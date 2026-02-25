import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import './index.css';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import FinancePage from './pages/FinancePage';
import TrashPage from './pages/TrashPage';
import SettingsPage from './pages/SettingsPage';

// Modals
import AddCarModal from './components/modals/AddCarModal';
import AddCustomerModal from './components/modals/AddCustomerModal';
import SaleModal from './components/modals/SaleModal';
import DepositModal from './components/modals/DepositModal';

const getViewTitle = (view) => {
  switch (view) {
    case 'dashboard': return 'Genel Bakış';
    case 'inventory': return 'Stok Araçlar';
    case 'consignment': return 'Konsinye';
    case 'sold': return 'Satılan Araçlar';
    case 'customers': return 'Müşteriler';
    case 'finance': return 'Finans';
    case 'trash': return 'Çöp Kutusu';
    case 'settings': return 'Ayarlar';
    default: return 'Dashboard';
  }
};

const AppContent = () => {
  const { 
    isAuthenticated, 
    loading,
    addCar,
    updateCar,
    patchCar,
    deleteCar,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTransaction
  } = useApp();

  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal states
  const [carModal, setCarModal] = useState({ open: false, car: null });
  const [customerModal, setCustomerModal] = useState({ open: false, customer: null });
  const [saleModal, setSaleModal] = useState({ open: false, car: null });
  const [depositModal, setDepositModal] = useState({ open: false, car: null });

  // Show loading
  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen gradient-asphalt flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Car handlers
  const handleSaveCar = async (carData) => {
    if (carModal.car) {
      await updateCar(carModal.car.id, carData);
      
      // Update purchase transaction if stock car
      if (carData.ownership === 'stock' && carData.purchase_price > 0) {
        // Transaction will be handled by backend or we can add here
      }
    } else {
      const newCar = await addCar(carData);
      
      // Add purchase transaction for stock cars
      if (carData.ownership === 'stock' && carData.purchase_price > 0) {
        await addTransaction({
          type: 'expense',
          category: 'Araç Alımı',
          amount: carData.purchase_price,
          date: carData.entry_date || new Date().toISOString().split('T')[0],
          description: `${carData.plate?.toUpperCase()} - ${carData.brand} Alışı`,
          car_id: newCar.id
        });
      }
    }
    setCarModal({ open: false, car: null });
  };

  const handleDeleteCar = async (car) => {
    if (window.confirm(`${car.brand} ${car.model} aracını silmek istediğinize emin misiniz?`)) {
      await deleteCar(car.id, false);
    }
  };

  // Customer handlers
  const handleSaveCustomer = async (customerData) => {
    if (customerModal.customer) {
      await updateCustomer(customerModal.customer.id, customerData);
    } else {
      await addCustomer(customerData);
    }
    setCustomerModal({ open: false, customer: null });
  };

  const handleDeleteCustomer = async (customer) => {
    if (window.confirm(`${customer.name} müşterisini silmek istediğinize emin misiniz?`)) {
      await deleteCustomer(customer.id, false);
    }
  };

  // Sale handler
  const handleConfirmSale = async ({ carId, price, employeeShare, customerId, saleDate }) => {
    const car = saleModal.car;
    if (!car) return;

    // Update car status
    await patchCar(carId, {
      status: 'Satıldı',
      sale_price: price,
      sold_date: saleDate,
      employee_share: employeeShare,
      customer_id: customerId || ''
    });

    const deposit = car.deposit_amount || 0;
    const finalIncome = price - deposit;

    // Add sale income transaction
    if (finalIncome > 0) {
      await addTransaction({
        type: 'income',
        category: 'Araç Satışı',
        amount: finalIncome,
        date: saleDate,
        description: `Satış - ${car.plate?.toUpperCase()} ${car.brand} ${car.model}${deposit > 0 ? ' (Kalan Tutar)' : ''}`,
        car_id: carId
      });
    }

    // Add employee share expense
    if (employeeShare > 0) {
      await addTransaction({
        type: 'expense',
        category: 'Çalışan Payı',
        amount: employeeShare,
        date: saleDate,
        description: `Çalışan Payı - ${car.plate?.toUpperCase()}`,
        car_id: carId
      });
    }

    // Add owner payment for consignment
    if (car.ownership === 'consignment' && car.purchase_price > 0) {
      await addTransaction({
        type: 'expense',
        category: 'Araç Sahibine Ödeme',
        amount: car.purchase_price,
        date: saleDate,
        description: `Araç Sahibine Ödeme - ${car.plate?.toUpperCase()} - ${car.owner_name || 'Konsinye'}`,
        car_id: carId
      });
    }

    // Update customer type if selected
    if (customerId) {
      await updateCustomer(customerId, { type: 'Satış Yapıldı' });
    }

    setSaleModal({ open: false, car: null });
  };

  // Deposit handler
  const handleConfirmDeposit = async ({ carId, amount, existingAmount }) => {
    const car = depositModal.car;
    if (!car) return;

    const diff = amount - existingAmount;

    // Update car
    await patchCar(carId, {
      status: 'Kapora Alındı',
      deposit_amount: amount
    });

    // Add transaction
    if (diff !== 0) {
      await addTransaction({
        type: diff > 0 ? 'income' : 'expense',
        category: diff > 0 ? (existingAmount === 0 ? 'Kapora' : 'Kapora Eklemesi') : 'Kapora İadesi',
        amount: Math.abs(diff),
        date: new Date().toISOString().split('T')[0],
        description: `Kapora - ${car.plate?.toUpperCase()}`,
        car_id: carId
      });
    }

    setDepositModal({ open: false, car: null });
  };

  const handleCancelDeposit = async (carId) => {
    const car = depositModal.car;
    if (!car) return;

    // Update car
    await patchCar(carId, {
      status: 'Stokta',
      deposit_amount: 0
    });

    // Add refund transaction
    if (car.deposit_amount > 0) {
      await addTransaction({
        type: 'expense',
        category: 'Kapora İadesi',
        amount: car.deposit_amount,
        date: new Date().toISOString().split('T')[0],
        description: `İade - ${car.plate?.toUpperCase()}`,
        car_id: carId
      });
    }

    setDepositModal({ open: false, car: null });
  };

  // FAB handler
  const handleFabClick = () => {
    if (activeView === 'customers') {
      setCustomerModal({ open: true, customer: null });
    } else {
      setCarModal({ 
        open: true, 
        car: null,
        defaultOwnership: activeView === 'consignment' ? 'consignment' : 'stock'
      });
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header 
          title={getViewTitle(activeView)} 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeView === 'dashboard' && <Dashboard />}
          
          {(activeView === 'inventory' || activeView === 'consignment' || activeView === 'sold') && (
            <InventoryPage
              viewType={activeView}
              onEditCar={(car) => setCarModal({ open: true, car })}
              onViewCar={(car) => console.log('View car:', car)}
              onExpenses={(car) => console.log('Expenses:', car)}
              onDeposit={(car) => setDepositModal({ open: true, car })}
              onSale={(car) => setSaleModal({ open: true, car })}
              onDeleteCar={handleDeleteCar}
            />
          )}
          
          {activeView === 'customers' && (
            <CustomersPage
              onAddCustomer={() => setCustomerModal({ open: true, customer: null })}
              onEditCustomer={(customer) => setCustomerModal({ open: true, customer })}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}
          
          {activeView === 'finance' && <FinancePage />}
          
          {activeView === 'trash' && <TrashPage />}
          
          {activeView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Bottom Nav - Mobile */}
      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        onAddClick={handleFabClick}
      />

      {/* Modals */}
      <AddCarModal
        isOpen={carModal.open}
        onClose={() => setCarModal({ open: false, car: null })}
        onSave={handleSaveCar}
        editingCar={carModal.car}
      />

      <AddCustomerModal
        isOpen={customerModal.open}
        onClose={() => setCustomerModal({ open: false, customer: null })}
        onSave={handleSaveCustomer}
        editingCustomer={customerModal.customer}
      />

      <SaleModal
        isOpen={saleModal.open}
        onClose={() => setSaleModal({ open: false, car: null })}
        car={saleModal.car}
        onConfirmSale={handleConfirmSale}
      />

      <DepositModal
        isOpen={depositModal.open}
        onClose={() => setDepositModal({ open: false, car: null })}
        car={depositModal.car}
        onConfirmDeposit={handleConfirmDeposit}
        onCancelDeposit={handleCancelDeposit}
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
