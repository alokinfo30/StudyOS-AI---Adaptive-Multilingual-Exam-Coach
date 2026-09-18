/**
 * StudyOS AI - Resilient Multi-Tier Client Storage & Cookie Utility
 * 
 * Guarantees cross-device, mobile reload, and iframe persistence for authenticated
 * student sessions by harmonizing localStorage, sessionStorage, and document.cookie.
 * Particularly prevents Safari iOS, WebViews, and mobile browser storage clearing
 * from unexpectedly logging out active students on page reload.
 */

export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    // SameSite=Lax allows cookie to persist across reloads and top-level navigations
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
  } catch (e) {
    console.warn('[CookieUtils] Failed to set cookie:', name, e);
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const cookieString = document.cookie;
    if (!cookieString) return null;
    const match = cookieString.match(new RegExp('(?:^|;\\s*)' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    console.warn('[CookieUtils] Failed to read cookie:', name, e);
    return null;
  }
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  try {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${secureFlag}`;
  } catch (e) {
    console.warn('[CookieUtils] Failed to delete cookie:', name, e);
  }
}

/**
 * Universal Multi-Tier Storage Setter
 * Replicates key-value pairs across localStorage, sessionStorage, and document.cookie
 */
export function setTieredStorage(key: string, value: string, cookieDays = 365): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
  try {
    sessionStorage.setItem(key, value);
  } catch {}
  try {
    setCookie(key, value, cookieDays);
  } catch {}
}

/**
 * Universal Multi-Tier Storage Getter
 * Fallback chain: localStorage -> document.cookie -> sessionStorage
 */
export function getTieredStorage(key: string): string | null {
  try {
    const fromLocal = localStorage.getItem(key);
    if (fromLocal) return fromLocal;
  } catch {}

  try {
    const fromCookie = getCookie(key);
    if (fromCookie) {
      // Re-populate localStorage in case it was purged
      try { localStorage.setItem(key, fromCookie); } catch {}
      return fromCookie;
    }
  } catch {}

  try {
    const fromSession = sessionStorage.getItem(key);
    if (fromSession) {
      try { localStorage.setItem(key, fromSession); } catch {}
      return fromSession;
    }
  } catch {}

  return null;
}

/**
 * Universal Multi-Tier Storage Remover
 */
export function removeTieredStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
  try {
    sessionStorage.removeItem(key);
  } catch {}
  try {
    deleteCookie(key);
  } catch {}
}
