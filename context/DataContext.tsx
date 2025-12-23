import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DATA_PREFIX,
  SESSION_KEY,
  USERS_KEY,
} from '../constants';
import {
  DataContextType,
  FuelLog,
  Settings,
  SimType,
  StockLog,
  StockState,
  Transaction,
  TransactionType,
  User,
  UserData,
} from '../types';

const defaultStock: StockState = { jawwy: 0, sawa: 0, multi: 0 };

const defaultSettings: Settings = {
  name: 'المستخدم',
  weeklyTarget: 1500,
  theme: 'light',
  preferredFuelType: '91',
  priceConfig: {
    jawwy: [16, 18, 20],
    sawa: [17, 19, 21],
    multi: [18, 20, 22],
  },
};

const defaultUserData: UserData = {
  transactions: [],
  stock: defaultStock,
  damaged: defaultStock,
  stockLogs: [],
  fuelLogs: [],
  settings: defaultSettings,
  lastSync: undefined,
};

const defaultUsers: User[] = [
  { id: 1, username: 'admin', password: 'admin', name: 'Talal', role: 'admin' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as User[];
    } catch (err) {
      console.warn('Failed to parse users', err);
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function loadUserData(username: string): UserData {
  const stored = localStorage.getItem(`${DATA_PREFIX}${username}`);
  if (stored) {
    try {
      return JSON.parse(stored) as UserData;
    } catch (err) {
      console.warn('Failed to parse user data', err);
    }
  }
  return defaultUserData;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const user = users.find((u) => u.username === session);
      if (user) {
        setCurrentUser(user);
        setUserData(loadUserData(user.username));
      }
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${DATA_PREFIX}${currentUser.username}`, JSON.stringify(userData));
    }
  }, [userData, currentUser]);

  const login = async (username: string, pass: string) => {
    const user = users.find((u) => u.username === username && u.password === pass);
    if (!user) return false;
    setCurrentUser(user);
    setUserData(loadUserData(user.username));
    localStorage.setItem(SESSION_KEY, user.username);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserData(defaultUserData);
    localStorage.removeItem(SESSION_KEY);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    setUsers((prev) => {
      const next = [...prev, { ...user, id: Date.now() }];
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== id);
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const addTransaction = (type: TransactionType, amount: number, quantity: number) => {
    setUserData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, {
        id: Date.now(),
        date: new Date().toISOString(),
        type,
        amount,
        quantity,
      }],
    }));
  };

  const removeTransaction = (id: number) => {
    setUserData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const updateStock = (type: SimType, quantity: number, action: StockLog['action']) => {
    setUserData((prev) => {
      const delta = action === 'add' || action === 'recover' ? quantity : -quantity;
      const damagedDelta = action === 'to_damaged' ? quantity : action === 'recover' ? -quantity : 0;
      const newStock = { ...prev.stock, [type]: Math.max(0, prev.stock[type] + delta) };
      const newDamaged = { ...prev.damaged, [type]: Math.max(0, prev.damaged[type] + damagedDelta) };
      return {
        ...prev,
        stock: newStock,
        damaged: newDamaged,
        stockLogs: [...prev.stockLogs, {
          id: Date.now(),
          date: new Date().toISOString(),
          type,
          quantity,
          action,
        }],
      };
    });
  };

  const addFuelLog = (log: Omit<FuelLog, 'id'>) => {
    setUserData((prev) => ({
      ...prev,
      fuelLogs: [...prev.fuelLogs, { ...log, id: Date.now() }],
    }));
  };

  const removeFuelLog = (id: number) => {
    setUserData((prev) => ({
      ...prev,
      fuelLogs: prev.fuelLogs.filter((f) => f.id !== id),
    }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setUserData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json) as UserData;
      setUserData(parsed);
      return true;
    } catch (err) {
      console.error('Failed to import data', err);
      return false;
    }
  };

  const exportData = () => JSON.stringify(userData, null, 2);

  const saveNow = () => {
    if (currentUser) {
      localStorage.setItem(`${DATA_PREFIX}${currentUser.username}`, JSON.stringify(userData));
    }
  };

  const syncToCloud = async () => {
    setIsSyncing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsSyncing(false);
    return false;
  };

  const syncFromCloud = async () => {
    setIsSyncing(true);
    await new Promise((res) => setTimeout(res, 500));
    setIsSyncing(false);
    return false;
  };

  const value = useMemo<DataContextType>(() => ({
    ...userData,
    users,
    currentUser,
    login,
    logout,
    addUser,
    deleteUser,
    addTransaction,
    removeTransaction,
    updateStock,
    addFuelLog,
    removeFuelLog,
    updateSettings,
    importData,
    exportData,
    saveNow,
    isSyncing,
    syncToCloud,
    syncFromCloud,
  }), [userData, users, currentUser, isSyncing]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
