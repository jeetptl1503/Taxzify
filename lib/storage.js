// lib/storage.js
// localStorage wrapper with JSON serialization

const STORAGE_KEY_PREFIX = 'taxzify_';
const HISTORY_KEY = 'taxzify_history';

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

// ─── History Management ─────────────────────────────────────────────

export function addHistory(entry) {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  history.unshift(record);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
  return record;
}

export function getHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteHistoryEntry(id) {
  if (typeof window === 'undefined') return;
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

// ─── PDF Download ───────────────────────────────────────────────────

export function downloadHistoryPDF(entry) {
  const date = new Date(entry.timestamp).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let inputsHTML = '';
  if (entry.inputs && typeof entry.inputs === 'object') {
    inputsHTML = Object.entries(entry.inputs)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#555;">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:500;">${v}</td></tr>`)
      .join('');
  }

  let outputsHTML = '';
  if (entry.outputs && typeof entry.outputs === 'object') {
    outputsHTML = Object.entries(entry.outputs)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#555;">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;font-weight:600;color:#0A84FF;">${v}</td></tr>`)
      .join('');
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Taxzify Report - ${entry.tool}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px; color: #1D1D1F; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .subtitle { color: #6E6E73; font-size: 13px; margin-bottom: 24px; }
  .section-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #0A84FF; margin: 24px 0 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .disclaimer { margin-top: 32px; padding: 12px; background: #FFF8E1; border-radius: 8px; font-size: 11px; color: #856404; }
  .footer { margin-top: 24px; text-align: center; font-size: 11px; color: #98989D; }
  @media print { body { padding: 20px; } }
</style>
</head><body>
  <h1>Taxzify — ${entry.tool}</h1>
  <p class="subtitle">Generated on ${date} by ${entry.user || 'User'}</p>
  ${inputsHTML ? `<p class="section-title">Inputs</p><table>${inputsHTML}</table>` : ''}
  ${outputsHTML ? `<p class="section-title">Results</p><table>${outputsHTML}</table>` : ''}
  ${entry.summary ? `<p class="section-title">Summary</p><p style="font-size:13px;line-height:1.6;">${entry.summary}</p>` : ''}
  <div class="disclaimer">Disclaimer: This report is for informational purposes only and does not constitute financial or tax advice. Consult a qualified Chartered Accountant before making financial decisions.</div>
  <p class="footer">© 2025 Taxzify. All rights reserved. Built for India's taxpayers.</p>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => { win.print(); }, 300);
    });
  }
}
