import { SimType, TransactionType } from "./types";

// Storage Keys
export const USERS_KEY = 'mister_mandob_users_v2'; // Stores the list of users
export const SESSION_KEY = 'mister_mandob_session_v2'; // Stores currently logged in username
export const DATA_PREFIX = 'mister_mandob_data_'; // Prefix for individual user data (e.g. mister_mandob_data_talal)

// Google Sheet API
export const API_URL = 'https://script.google.com/macros/s/AKfycbzzWtwatHK2h9yaOfOs1TgfUPN8_fEY309RjqXT7MOdO6rpUZIC4CcrTsojHyc2K8Du/exec';

export const SIM_LABELS: Record<TransactionType, string> = {
  jawwy: 'جوي',
  sawa: 'سوا',
  multi: 'متعدد',
  issue: 'لم يكتمل',
  device: 'جهاز',
};

// Rebranded Colors
export const SIM_COLORS: Record<TransactionType, string> = {
  jawwy: '#ef4444', // Red 500
  sawa: '#0ea5e9',  // Sky 500 (Primary Blue)
  multi: '#f59e0b', // Amber 500
  issue: '#64748b', // Slate 500
  device: '#8b5cf6', // Violet 500
};

export const FUEL_PRICES = {
  '91': 2.18,
  '95': 2.33,
  'diesel': 1.15,
};

export const FUEL_LABELS = {
  '91': 'أخضر 91',
  '95': 'أحمر 95',
  'diesel': 'ديزل',
};