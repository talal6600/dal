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

const clonePriceConfig = (config: Settings['priceConfig']) => ({
  jawwy: [...config.jawwy],
  sawa: [...config.sawa],
  multi: [...config.multi],
});

const createEmptyUserData = (): UserData => ({
  transactions: [],
  stock: { ...defaultStock },
  damaged: { ...defaultStock },
  stockLogs: [],
  fuelLogs: [],
  settings: { ...defaultSettings, priceConfig: clonePriceConfig(defaultSettings.priceConfig) },
  lastSync: undefined,
});

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
  return createEmptyUserData();
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>(createEmptyUserData());
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
    setUserData(createEmptyUserData());
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

  const getPriceForQuantity = (type: SimType, quantity: number) => {
    const [tier1, tier2, tier3] = userData.settings.priceConfig[type];
    if (quantity >= 10) return tier3;
    if (quantity >= 5) return tier2;
    return tier1;
  };

  const addTransaction = (
    type: TransactionType,
    amount: number,
    quantity: number,
    opts?: { autoPrice?: boolean },
  ) => {
    let result: { ok: boolean; error?: string; chargedAmount?: number } = { ok: false };
    setUserData((prev) => {
      if (quantity <= 0) {
        result = { ok: false, error: 'الكمية يجب أن تكون أكبر من صفر' };
        return prev;
      }

      const isSimType = type === 'jawwy' || type === 'sawa' || type === 'multi';
      const [tier1, tier2, tier3] = isSimType ? prev.settings.priceConfig[type as SimType] : [0, 0, 0];
      const finalAmount =
        opts?.autoPrice && isSimType && amount <= 0
          ? (quantity >= 10 ? tier3 : quantity >= 5 ? tier2 : tier1) * quantity
          : amount;

      if (isSimType && prev.stock[type as SimType] < quantity) {
        result = { ok: false, error: 'المخزون الحالي لا يكفي لهذه العملية' };
        return prev;
      }

      const nextStock = isSimType
        ? { ...prev.stock, [type]: prev.stock[type as SimType] - quantity }
        : prev.stock;
      const nextLogs = isSimType
        ? [
            ...prev.stockLogs,
            {
              id: Date.now(),
              date: new Date().toISOString(),
              type: type as SimType,
              quantity,
              action: 'sale',
            },
          ]
        : prev.stockLogs;

      result = { ok: true, chargedAmount: finalAmount };

      return {
        ...prev,
        stock: nextStock,
        stockLogs: nextLogs,
        transactions: [
          ...prev.transactions,
          {
            id: Date.now(),
            date: new Date().toISOString(),
            type,
            amount: finalAmount,
            quantity,
          },
        ],
      };
    });
    return result;
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
      settings: {
        ...prev.settings,
        ...newSettings,
        priceConfig: newSettings.priceConfig
          ? clonePriceConfig(newSettings.priceConfig)
          : prev.settings.priceConfig,
      },
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
    getPriceForQuantity,
    addFuelLog,
    removeFuelLog,
    updateSettings,
    importData,
    exportData,
    saveNow,
    isSyncing,
    syncToCloud,
    syncFromCloud,
  }), [userData, users, currentUser, isSyncing, getPriceForQuantity]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
