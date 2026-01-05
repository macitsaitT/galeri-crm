import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Menu } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import FinanceView from './components/FinanceView';
import CustomersList from './components/CustomersList';
import TrashView from './components/TrashView';
import Toast from './components/Toast';
import LoginScreen from './components/LoginScreen';

// Modals
import AddCarModal from './components/modals/AddCarModal';
import AddCustomerModal from './components/modals/AddCustomerModal';
import AddTransactionModal from './components/modals/AddTransactionModal';
import AddGeneralExpenseModal from './components/modals/AddGeneralExpenseModal';
import DepositModal from './components/modals/DepositModal';
import SaleModal from './components/modals/SaleModal';
import CarExpensesModal from './components/modals/CarExpensesModal';
import SettingsModal from './components/modals/SettingsModal';
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal';
import CarDetailModal from './components/modals/CarDetailModal';

// Firebase Services
import {
  initAuth,
  subscribeToAuth,
  subscribeToInventory,
  subscribeToCustomers,
  subscribeToTransactions,
  subscribeToProfile,
  addCar,
  updateCar,
  deleteCar,
  restoreCar,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  saveProfile
} from './services/firebase';

// Data & Utils
import { DEFAULT_PROFILE } from './data/mock';
import { 
  formatNumberInput, 
  parseFormattedNumber 
} from './utils/helpers';

function App() {
  // Firebase user state
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('galericrm_auth') === 'true'
  );
  const [loginError, setLoginError] = useState('');

  // UI state
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Data state (from Firebase)
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState(DEFAULT_PROFILE);
  const [dataLoading, setDataLoading] = useState(true);

  // Initialize Firebase Auth
  useEffect(() => {
    initAuth();
    const unsubscribe = subscribeToAuth((user) => {
      setFirebaseUser(user);
      setIsFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore data when user is authenticated
  useEffect(() => {
    if (!firebaseUser) {
      setDataLoading(false);
      return;
    }

    const userId = firebaseUser.uid;
    setDataLoading(true);

    // Subscribe to all collections
    const unsubInventory = subscribeToInventory(userId, (data) => {
      setInventory(data);
      setDataLoading(false);
    });

    const unsubCustomers = subscribeToCustomers(userId, (data) => {
      setCustomers(data);
    });

    const unsubTransactions = subscribeToTransactions(userId, (data) => {
      setTransactions(data);
    });

    const unsubProfile = subscribeToProfile(userId, (data) => {
      setUserProfile(data);
    }, DEFAULT_PROFILE);

    return () => {
      unsubInventory();
      unsubCustomers();
      unsubTransactions();
      unsubProfile();
    };
  }, [firebaseUser]);

  // Modal states
  const [modals, setModals] = useState({
    addCar: false,
    addCustomer: false,
    addTransaction: false,
    settings: false,
    delete: false,
    carExpenses: false,
    addGeneralExpense: false,
    carDetail: false,
    deposit: false,
    sale: false
  });

  // Form states
  const currentYear = new Date().getFullYear();
  const defaultCar = { 
    brand: '', model: '', year: currentYear, plate: '', km: '', 
    vehicleType: 'Sedan', purchasePrice: '', salePrice: '', 
    description: '', status: 'Stokta', 
    entryDate: new Date().toISOString().split('T')[0], 
    inspectionDate: '', fuelType: 'Dizel', gear: 'Otomatik', 
    ownership: 'stock', ownerName: '', ownerPhone: '', 
    commissionRate: '', photos: [], expertise: {}, 
    packageInfo: '', engineType: '' 
  };
  
  const [newCar, setNewCar] = useState(defaultCar);
  const [editingCarId, setEditingCarId] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' 
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [newTransaction, setNewTransaction] = useState({ 
    type: 'expense', category: '', description: '', amount: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  // Active items for operations
  const [activeCarDetail, setActiveCarDetail] = useState(null);
  const [activeExpenseCar, setActiveExpenseCar] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemType, setActiveItemType] = useState(null);

  // Deposit & Sale states
  const [depositModal, setDepositModal] = useState({ 
    isOpen: false, carId: null, currentAmount: 0 
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [saleModal, setSaleModal] = useState({ 
    isOpen: false, carId: null, price: '', employeeShare: '', customerId: '' 
  });

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper to get userId
  const getUserId = useCallback(() => {
    return firebaseUser?.uid || null;
  }, [firebaseUser]);

  // =============== AUTHENTICATION ===============
  const handleLogin = (password) => {
    if (password === userProfile.password) {
      setIsAuthenticated(true);
      localStorage.setItem('galericrm_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Hatalı şifre.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('galericrm_auth');
    setModals({ ...modals, settings: false });
  };

  const handlePasswordReset = async (code) => {
    if (code === '123456') {
      const userId = getUserId();
      if (userId) {
        const newProfile = { ...userProfile, password: 'admin' };
        await saveProfile(userId, newProfile);
      }
      return true;
    }
    return false;
  };

  // =============== CAR OPERATIONS ===============
  const handleSaveCar = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) {
      showToast("Oturum hatası. Lütfen sayfayı yenileyin.", "error");
      return;
    }
    
    if (newCar.ownership === 'stock' && (!newCar.purchasePrice || parseFormattedNumber(newCar.purchasePrice) <= 0)) {
      showToast("Stok araç için Alış Fiyatı gereklidir.", "error");
      return;
    }
    if (!newCar.salePrice || parseFormattedNumber(newCar.salePrice) <= 0) {
      showToast("Lütfen Satış Fiyatı giriniz.", "error");
      return;
    }

    const parsedYear = parseInt(newCar.year);
    const carData = {
      ...newCar,
      year: isNaN(parsedYear) ? currentYear : parsedYear,
      km: formatNumberInput(newCar.km),
      purchasePrice: parseFormattedNumber(newCar.purchasePrice),
      salePrice: parseFormattedNumber(newCar.salePrice),
      commissionRate: parseInt(newCar.commissionRate) || (newCar.ownership === 'consignment' ? 5 : 0),
    };

    try {
      if (editingCarId) {
        await updateCar(userId, editingCarId, carData);
        showToast("Araç güncellendi.");
      } else {
        const newCarId = await addCar(userId, carData);
        
        // Stok araç için otomatik alış gideri
        if (carData.ownership === 'stock' && carData.purchasePrice > 0) {
          const purchaseTransaction = {
            type: 'expense',
            category: 'Araç Alımı',
            amount: carData.purchasePrice,
            date: carData.entryDate,
            description: `${carData.plate?.toLocaleUpperCase('tr-TR')} - ${carData.brand} Alışı`,
            carId: newCarId
          };
          await addTransaction(userId, purchaseTransaction);
        }
        showToast("Araç eklendi.");
      }
      
      setModals({ ...modals, addCar: false });
      setNewCar(defaultCar);
      setEditingCarId(null);
    } catch (error) {
      console.error("Error saving car:", error);
      showToast("Araç kaydedilirken hata oluştu.", "error");
    }
  };

  const handleEditCar = (car) => {
    setEditingCarId(car.id);
    setNewCar({
      ...car,
      km: formatNumberInput(car.km),
      purchasePrice: formatNumberInput(car.purchasePrice),
      salePrice: formatNumberInput(car.salePrice)
    });
    setModals({ ...modals, addCar: true });
  };

  // =============== SALE OPERATIONS ===============
  const initiateSale = (car) => {
    setSaleModal({ 
      isOpen: true, 
      carId: car.id, 
      price: formatNumberInput(car.salePrice), 
      employeeShare: '', 
      customerId: '' 
    });
  };

  const handleConfirmSale = async (e) => {
    e.preventDefault();
    if (!saleModal.carId) return;
    
    const userId = getUserId();
    if (!userId) return;
    
    const car = inventory.find(c => c.id === saleModal.carId);
    if (!car) return;
    
    const finalPrice = parseFormattedNumber(saleModal.price);
    const employeeShareAmount = parseFormattedNumber(saleModal.employeeShare) || 0;
    const selectedCustomer = customers.find(c => c.id === saleModal.customerId);
    
    try {
      // Aracı güncelle
      await updateCar(userId, car.id, {
        status: 'Satıldı',
        salePrice: finalPrice,
        soldDate: new Date().toISOString().split('T')[0],
        employeeShare: employeeShareAmount,
        customerId: saleModal.customerId || '',
        customerName: selectedCustomer?.name || ''
      });
      
      const deposit = car.depositAmount || 0;
      const finalIncome = finalPrice - deposit;
      
      // Satış geliri ekle
      if (finalIncome > 0) {
        await addTransaction(userId, {
          type: 'income',
          category: 'Araç Satışı',
          description: `Satış - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model} ${deposit > 0 ? '(Kalan Tutar)' : ''}`,
          amount: finalIncome,
          carId: car.id,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      // Çalışan payı gideri
      if (employeeShareAmount > 0) {
        await addTransaction(userId, {
          type: 'expense',
          category: 'Çalışan Payı',
          description: `Çalışan Payı - ${car.plate?.toLocaleUpperCase('tr-TR')} ${car.brand} ${car.model}`,
          amount: employeeShareAmount,
          carId: car.id,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      // Konsinye için araç sahibine ödeme
      if (car.ownership === 'consignment' && car.purchasePrice > 0) {
        await addTransaction(userId, {
          type: 'expense',
          category: 'Araç Sahibine Ödeme',
          description: `Araç Sahibine Ödeme - ${car.plate?.toLocaleUpperCase('tr-TR')} - ${car.ownerName || 'Konsinye'}`,
          amount: car.purchasePrice,
          carId: car.id,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      showToast(`Araç satışı ${formatNumberInput(finalPrice)} TL bedelle tamamlandı.`);
      setSaleModal({ isOpen: false, carId: null, price: '', employeeShare: '', customerId: '' });
    } catch (error) {
      console.error("Sale error:", error);
      showToast("Satış işlemi sırasında hata oluştu.", "error");
    }
  };

  const handleCancelSale = async (car) => {
    if (!window.confirm(`${car.brand} ${car.model} satışını iptal etmek istediğinize emin misiniz?`)) return;
    
    const userId = getUserId();
    if (!userId) return;
    
    try {
      // Aracı stoka al
      await updateCar(userId, car.id, {
        status: 'Stokta',
        soldDate: null,
        customerId: null,
        customerName: null,
        employeeShare: null
      });
      
      // Satış işlemlerini soft-delete yap
      const saleCategories = ['Araç Satışı', 'Çalışan Payı', 'Araç Sahibine Ödeme'];
      const relatedTransactions = transactions.filter(
        t => t.carId === car.id && saleCategories.includes(t.category) && !t.deleted
      );
      
      for (const t of relatedTransactions) {
        await updateTransaction(userId, t.id, {
          deleted: true,
          deletedAt: new Date().toISOString()
        });
      }
      
      showToast(`${car.brand} ${car.model} satışı iptal edildi.`);
    } catch (error) {
      console.error("Cancel sale error:", error);
      showToast("Satış iptal edilirken hata oluştu.", "error");
    }
  };

  const handleChangeSalePrice = async (car) => {
    const newPriceStr = window.prompt(
      `Yeni satış fiyatını girin:\nMevcut: ${formatNumberInput(car.salePrice)} TL`,
      car.salePrice.toString()
    );
    if (!newPriceStr) return;
    
    const newPrice = parseFloat(newPriceStr.replace(/[^\d]/g, '')) || 0;
    if (newPrice <= 0) {
      showToast("Geçerli bir fiyat girin.", "error");
      return;
    }
    
    const userId = getUserId();
    if (!userId) return;
    
    try {
      await updateCar(userId, car.id, { salePrice: newPrice });
      showToast(`Satış fiyatı güncellendi.`);
    } catch (error) {
      console.error("Price update error:", error);
      showToast("Fiyat güncellenirken hata oluştu.", "error");
    }
  };

  // =============== DEPOSIT OPERATIONS ===============
  const initiateDeposit = (carId) => {
    const car = inventory.find(c => c.id === carId);
    const existingDeposit = car?.depositAmount || 0;
    setDepositModal({ isOpen: true, carId, currentAmount: existingDeposit });
    setDepositAmount(existingDeposit > 0 ? formatNumberInput(existingDeposit.toString()) : '');
  };

  const confirmDeposit = (e) => {
    e.preventDefault();
    if (!depositModal.carId) return;
    
    const amt = parseFormattedNumber(depositAmount);
    const car = inventory.find(c => c.id === depositModal.carId);
    const diff = amt - (depositModal.currentAmount || 0);
    
    // Aracı güncelle
    setInventory(prev => prev.map(c => 
      c.id === depositModal.carId ? { ...c, status: 'Kapora Alındı', depositAmount: amt } : c
    ));
    
    // İşlem ekle
    if (diff !== 0) {
      const depositTransaction = {
        id: generateId(),
        type: diff > 0 ? 'income' : 'expense',
        category: diff > 0 ? (depositModal.currentAmount === 0 ? 'Kapora' : 'Kapora Eklemesi') : 'Kapora İadesi',
        description: `Kapora - ${car.plate?.toLocaleUpperCase('tr-TR')}`,
        amount: Math.abs(diff),
        carId: car.id,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [depositTransaction, ...prev]);
    }
    
    setDepositModal({ isOpen: false, carId: null, currentAmount: 0 });
    showToast("Kapora işlemi kaydedildi.");
  };

  const cancelDeposit = () => {
    if (!depositModal.carId) return;
    
    const car = inventory.find(c => c.id === depositModal.carId);
    
    // Aracı stoka al
    setInventory(prev => prev.map(c => 
      c.id === depositModal.carId ? { ...c, status: 'Stokta', depositAmount: 0 } : c
    ));
    
    // İade işlemi
    if (car?.depositAmount > 0) {
      const refundTransaction = {
        id: generateId(),
        type: 'expense',
        category: 'Kapora İadesi',
        description: `İade - ${car.plate?.toLocaleUpperCase('tr-TR')}`,
        amount: car.depositAmount,
        carId: car.id,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      setTransactions(prev => [refundTransaction, ...prev]);
    }
    
    setDepositModal({ isOpen: false, carId: null, currentAmount: 0 });
    showToast("Kapora iade edildi.");
  };

  // =============== DELETE OPERATIONS ===============
  const handleSoftDelete = (id, type) => {
    setActiveItem(id);
    setActiveItemType(type);
    setModals({ ...modals, delete: true });
  };

  const confirmDelete = () => {
    if (!activeItem || !activeItemType) return;
    
    if (activeItemType === 'inventory') {
      setInventory(prev => prev.map(c => 
        c.id === activeItem ? { ...c, deleted: true, deletedAt: new Date().toISOString() } : c
      ));
      // İlgili işlemleri de soft-delete yap
      setTransactions(prev => prev.map(t => 
        t.carId === activeItem ? { ...t, deleted: true, deletedAt: new Date().toISOString() } : t
      ));
    } else {
      setCustomers(prev => prev.map(c => 
        c.id === activeItem ? { ...c, deleted: true, deletedAt: new Date().toISOString() } : c
      ));
    }
    
    setModals({ ...modals, delete: false });
    setActiveItem(null);
    setActiveItemType(null);
    showToast("Çöp kutusuna taşındı.");
  };

  const handleRestore = (id, type) => {
    if (type === 'inventory') {
      setInventory(prev => prev.map(c => 
        c.id === id ? { ...c, deleted: false, deletedAt: null } : c
      ));
      setTransactions(prev => prev.map(t => 
        t.carId === id ? { ...t, deleted: false, deletedAt: null } : t
      ));
    } else {
      setCustomers(prev => prev.map(c => 
        c.id === id ? { ...c, deleted: false, deletedAt: null } : c
      ));
    }
    showToast("Geri yüklendi.");
  };

  const handlePermanentDelete = (id, type) => {
    if (!window.confirm("Kalıcı olarak silmek istediğinize emin misiniz?")) return;
    
    if (type === 'inventory') {
      setInventory(prev => prev.filter(c => c.id !== id));
      setTransactions(prev => prev.filter(t => t.carId !== id));
    } else {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
    showToast("Kalıcı olarak silindi.");
  };

  // =============== CUSTOMER OPERATIONS ===============
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    
    if (editingCustomerId) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomerId ? { ...c, ...newCustomer, updatedAt: new Date().toISOString() } : c
      ));
      showToast("Müşteri güncellendi.");
    } else {
      const newCustomerWithId = {
        ...newCustomer,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [newCustomerWithId, ...prev]);
      showToast("Müşteri eklendi.");
    }
    
    setModals({ ...modals, addCustomer: false });
    setNewCustomer({ name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' });
    setEditingCustomerId(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomerId(customer.id);
    setNewCustomer({
      name: customer.name,
      phone: customer.phone,
      type: customer.type,
      notes: customer.notes || '',
      interestedCarId: customer.interestedCarId || ''
    });
    setModals({ ...modals, addCustomer: true });
  };

  // =============== TRANSACTION OPERATIONS ===============
  const handleAddTransaction = (e) => {
    e.preventDefault();
    
    const amount = parseFormattedNumber(newTransaction.amount);
    if (amount <= 0) {
      showToast("Tutar 0'dan büyük olmalıdır.", "error");
      return;
    }
    
    const transactionWithId = {
      ...newTransaction,
      id: generateId(),
      amount,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [transactionWithId, ...prev]);
    
    setModals({ ...modals, addTransaction: false });
    setNewTransaction({ 
      type: 'expense', category: '', description: '', amount: '', 
      date: new Date().toISOString().split('T')[0] 
    });
    showToast("İşlem eklendi.");
  };

  const handleAddGeneralExpense = (formData) => {
    const expenseTransaction = {
      id: generateId(),
      type: 'expense',
      category: formData.category,
      description: formData.description,
      amount: parseFormattedNumber(formData.amount),
      date: formData.date,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [expenseTransaction, ...prev]);
    setModals({ ...modals, addGeneralExpense: false });
    showToast("Genel gider kaydedildi.");
  };

  const handleAddCarExpense = (expenseData) => {
    if (!activeExpenseCar) return;
    
    const expenseTransaction = {
      id: generateId(),
      type: 'expense',
      category: expenseData.category,
      description: `${expenseData.category} - ${activeExpenseCar.plate?.toLocaleUpperCase('tr-TR')} ${expenseData.description ? `(${expenseData.description})` : ''}`,
      amount: expenseData.amount,
      carId: activeExpenseCar.id,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [expenseTransaction, ...prev]);
    showToast("Araç masrafı eklendi.");
  };

  const handleDeleteTransaction = (transactionId) => {
    if (!window.confirm("Bu işlem kaydını silmek istediğinize emin misiniz?")) return;
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
    showToast("İşlem kaydı silindi.");
  };

  // =============== VIEW DETAIL ===============
  const handleViewCarDetail = (car) => {
    setActiveCarDetail(car);
    setModals({ ...modals, carDetail: true });
  };

  // =============== RENDER ===============
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} onReset={handlePasswordReset} error={loginError} />;
  }

  // Aktif view'a göre başlık
  const getViewTitle = () => {
    switch (activeView) {
      case 'consignment': return 'Konsinye Portföyü';
      case 'inventory': return 'Stok Araçlar';
      case 'dashboard': return 'Genel Bakış';
      case 'finance': return 'Finans Yönetimi';
      case 'customers': return 'Müşteriler';
      case 'sold': return 'Satılan Araçlar';
      case 'trash': return 'Çöp Kutusu';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-neutral-900 overflow-hidden">
      {/* Toast */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />
      
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        userProfile={userProfile}
        onOpenAddCar={() => {
          setNewCar({ ...defaultCar, ownership: activeView === 'consignment' ? 'consignment' : 'stock' });
          setEditingCarId(null);
          setModals({ ...modals, addCar: true });
        }}
        onOpenPromoCard={() => showToast("Tanıtım kartı özelliği yakında aktif olacak!", "info")}
        onOpenGeneralExpense={() => setModals({ ...modals, addGeneralExpense: true })}
        onOpenTransaction={() => setModals({ ...modals, addTransaction: true })}
        onOpenSettings={() => setModals({ ...modals, settings: true })}
        onOpenReport={() => showToast("Rapor özelliği yakında aktif olacak!", "info")}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden mr-4 text-neutral-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-xl text-black capitalize">
              {getViewTitle()}
            </h2>
          </div>
        </header>
        
        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          {activeView === 'dashboard' && (
            <Dashboard inventory={inventory} transactions={transactions} />
          )}
          
          {(activeView === 'inventory' || activeView === 'consignment' || activeView === 'sold') && (
            <InventoryList
              inventory={inventory}
              transactions={transactions}
              viewType={activeView}
              onEditCar={handleEditCar}
              onDeleteCar={(id) => handleSoftDelete(id, 'inventory')}
              onViewDetail={handleViewCarDetail}
              onOpenExpenses={(car) => {
                setActiveExpenseCar(car);
                setModals({ ...modals, carExpenses: true });
              }}
              onInitiateSale={initiateSale}
              onInitiateDeposit={initiateDeposit}
              onCancelSale={handleCancelSale}
              onChangeSalePrice={handleChangeSalePrice}
            />
          )}
          
          {activeView === 'finance' && (
            <FinanceView
              inventory={inventory}
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          
          {activeView === 'customers' && (
            <CustomersList
              customers={customers}
              inventory={inventory}
              onAddCustomer={() => setModals({ ...modals, addCustomer: true })}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={(id) => handleSoftDelete(id, 'customer')}
              onViewCarDetail={handleViewCarDetail}
            />
          )}
          
          {activeView === 'trash' && (
            <TrashView
              inventory={inventory}
              customers={customers}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          )}
        </main>
      </div>
      
      {/* =============== MODALS =============== */}
      <AddCarModal
        isOpen={modals.addCar}
        onClose={() => {
          setModals({ ...modals, addCar: false });
          setNewCar(defaultCar);
          setEditingCarId(null);
        }}
        newCar={newCar}
        setNewCar={setNewCar}
        onSave={handleSaveCar}
        isEditing={!!editingCarId}
        showToast={showToast}
      />
      
      <AddCustomerModal
        isOpen={modals.addCustomer}
        onClose={() => {
          setModals({ ...modals, addCustomer: false });
          setEditingCustomerId(null);
          setNewCustomer({ name: '', phone: '', type: 'Potansiyel', notes: '', interestedCarId: '' });
        }}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        onSave={handleSaveCustomer}
        inventory={inventory}
        isEditing={!!editingCustomerId}
      />
      
      <AddTransactionModal
        isOpen={modals.addTransaction}
        onClose={() => setModals({ ...modals, addTransaction: false })}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        onSave={handleAddTransaction}
      />
      
      <AddGeneralExpenseModal
        isOpen={modals.addGeneralExpense}
        onClose={() => setModals({ ...modals, addGeneralExpense: false })}
        onSave={handleAddGeneralExpense}
      />
      
      <DepositModal
        isOpen={depositModal.isOpen}
        onClose={() => setDepositModal({ ...depositModal, isOpen: false })}
        onSave={confirmDeposit}
        onCancel={cancelDeposit}
        amount={depositAmount}
        setAmount={setDepositAmount}
        existingAmount={depositModal.currentAmount}
      />
      
      <SaleModal
        isOpen={saleModal.isOpen}
        onClose={() => setSaleModal({ ...saleModal, isOpen: false })}
        onConfirm={handleConfirmSale}
        price={saleModal.price}
        setPrice={(val) => setSaleModal({ ...saleModal, price: val })}
        employeeShare={saleModal.employeeShare}
        setEmployeeShare={(val) => setSaleModal({ ...saleModal, employeeShare: val })}
        car={inventory.find(c => c.id === saleModal.carId)}
        customers={customers}
        selectedCustomerId={saleModal.customerId}
        setSelectedCustomerId={(val) => setSaleModal({ ...saleModal, customerId: val })}
      />
      
      <CarExpensesModal
        isOpen={modals.carExpenses}
        onClose={() => {
          setModals({ ...modals, carExpenses: false });
          setActiveExpenseCar(null);
        }}
        car={activeExpenseCar}
        carTransactions={transactions.filter(t => t.carId === activeExpenseCar?.id).sort((a, b) => new Date(b.date) - new Date(a.date))}
        onAddExpense={handleAddCarExpense}
        onDeleteTransaction={handleDeleteTransaction}
      />
      
      <SettingsModal
        isOpen={modals.settings}
        onClose={() => setModals({ ...modals, settings: false })}
        profile={userProfile}
        setProfile={setUserProfile}
        onLogout={handleLogout}
      />
      
      <CarDetailModal
        isOpen={modals.carDetail}
        onClose={() => setModals({ ...modals, carDetail: false })}
        car={activeCarDetail}
        showToast={showToast}
      />
      
      <DeleteConfirmationModal
        isOpen={modals.delete}
        onClose={() => setModals({ ...modals, delete: false })}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default App;
