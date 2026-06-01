// lib/auth.js
// Simple hardcoded authentication for 4 users

const USERS = [
  { id: 'user_02', username: 'het', password: 'het@2025', displayName: 'Het' },
  { id: 'user_03', username: 'jeet', password: 'jeet@2025', displayName: 'Jeet' },
  { id: 'user_04', username: 'diansh', password: 'diansh@2025', displayName: 'Diansh' },
  { id: 'user_05', username: 'kaustubh', password: 'kaustubh@2025', displayName: 'Kaustubh' },
];

const AUTH_KEY = 'taxzify_auth';

export function login(username, password) {
  const user = USERS.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!user) return null;
  const session = { id: user.id, username: user.username, displayName: user.displayName, loginAt: Date.now() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  }
  return session;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return getSession() !== null;
}
