// Firebase Configuration & Services
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBLHWzRA3YCKnqPY-azW2rk6YBF6RW8rVQ",
  authDomain: "galericrm.firebaseapp.com",
  projectId: "galericrm",
  storageBucket: "galericrm.firebasestorage.app",
  messagingSenderId: "817592744736",
  appId: "1:817592744736:web:ecc3a201c030a3737c7545",
  measurementId: "G-R9TG832BDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// App ID for data path - using a fixed user ID since we're not using auth
const appId = 'galeri-crm-app';

// Get or create a persistent user ID from localStorage
const getLocalUserId = () => {
  let userId = localStorage.getItem('galericrm_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('galericrm_user_id', userId);
  }
  return userId;
};

// Helper to get user data path
const getUserPath = (userId) => `artifacts/${appId}/users/${userId}`;

// Export Firebase instances
export { db, appId, getLocalUserId };

// Firestore helpers
export const subscribeToInventory = (userId, callback) => {
  const path = getUserPath(userId);
  const inventoryRef = collection(db, path, 'inventory');
  
  return onSnapshot(inventoryRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by entryDate descending
    data.sort((a, b) => new Date(b.entryDate || 0) - new Date(a.entryDate || 0));
    callback(data);
  }, (error) => {
    console.error("Inventory snapshot error:", error);
    callback([]);
  });
};

export const subscribeToCustomers = (userId, callback) => {
  const path = getUserPath(userId);
  const customersRef = collection(db, path, 'customers');
  
  return onSnapshot(customersRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by name
    data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    callback(data);
  }, (error) => {
    console.error("Customers snapshot error:", error);
    callback([]);
  });
};

export const subscribeToTransactions = (userId, callback) => {
  const path = getUserPath(userId);
  const transactionsRef = collection(db, path, 'transactions');
  
  return onSnapshot(transactionsRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending
    data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    callback(data);
  }, (error) => {
    console.error("Transactions snapshot error:", error);
    callback([]);
  });
};

export const subscribeToProfile = (userId, callback, defaultProfile) => {
  const path = getUserPath(userId);
  const profileRef = doc(db, path, 'settings', 'profile');
  
  return onSnapshot(profileRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      // Create default profile
      setDoc(profileRef, defaultProfile).catch(err => console.error("Error creating profile:", err));
      callback(defaultProfile);
    }
  }, (error) => {
    console.error("Profile snapshot error:", error);
    callback(defaultProfile);
  });
};

// CRUD Operations
export const addCar = async (userId, carData) => {
  const path = getUserPath(userId);
  const docRef = await addDoc(collection(db, path, 'inventory'), {
    ...carData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateCar = async (userId, carId, carData) => {
  const path = getUserPath(userId);
  await updateDoc(doc(db, path, 'inventory', carId), carData);
};

export const deleteCar = async (userId, carId, permanent = false) => {
  const path = getUserPath(userId);
  if (permanent) {
    await deleteDoc(doc(db, path, 'inventory', carId));
  } else {
    await updateDoc(doc(db, path, 'inventory', carId), {
      deleted: true,
      deletedAt: new Date().toISOString()
    });
  }
};

export const restoreCar = async (userId, carId) => {
  const path = getUserPath(userId);
  await updateDoc(doc(db, path, 'inventory', carId), {
    deleted: false,
    deletedAt: null
  });
};

export const addCustomer = async (userId, customerData) => {
  const path = getUserPath(userId);
  const docRef = await addDoc(collection(db, path, 'customers'), {
    ...customerData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateCustomer = async (userId, customerId, customerData) => {
  const path = getUserPath(userId);
  await updateDoc(doc(db, path, 'customers', customerId), {
    ...customerData,
    updatedAt: new Date().toISOString()
  });
};

export const deleteCustomer = async (userId, customerId, permanent = false) => {
  const path = getUserPath(userId);
  if (permanent) {
    await deleteDoc(doc(db, path, 'customers', customerId));
  } else {
    await updateDoc(doc(db, path, 'customers', customerId), {
      deleted: true,
      deletedAt: new Date().toISOString()
    });
  }
};

export const restoreCustomer = async (userId, customerId) => {
  const path = getUserPath(userId);
  await updateDoc(doc(db, path, 'customers', customerId), {
    deleted: false,
    deletedAt: null
  });
};

export const addTransaction = async (userId, transactionData) => {
  const path = getUserPath(userId);
  const docRef = await addDoc(collection(db, path, 'transactions'), {
    ...transactionData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const deleteTransaction = async (userId, transactionId, permanent = false) => {
  const path = getUserPath(userId);
  if (permanent) {
    await deleteDoc(doc(db, path, 'transactions', transactionId));
  } else {
    await updateDoc(doc(db, path, 'transactions', transactionId), {
      deleted: true,
      deletedAt: new Date().toISOString()
    });
  }
};

export const updateTransaction = async (userId, transactionId, transactionData) => {
  const path = getUserPath(userId);
  await updateDoc(doc(db, path, 'transactions', transactionId), transactionData);
};

export const saveProfile = async (userId, profileData) => {
  const path = getUserPath(userId);
  await setDoc(doc(db, path, 'settings', 'profile'), profileData, { merge: true });
};

