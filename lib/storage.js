// lib/storage.js
// localStorage wrapper with JSON serialization

const STORAGE_KEY_PREFIX = 'taxzify_';

export function saveData(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}

export function loadData(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('Failed to load data:', e);
    return fallback;
  }
}

export function removeData(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_PREFIX + key);
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith(STORAGE_KEY_PREFIX)
  );
  keys.forEach((k) => localStorage.removeItem(k));
}

export function hasData(key) {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_PREFIX + key) !== null;
}
