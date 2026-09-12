/**
 * StudyOS AI - Defensive Browser API Polyfills & Sandbox Guards
 * 
 * Prevents "TypeError: Illegal constructor" in restricted browser environments
 * such as sandboxed iframes, Android WebViews, and automated test runners.
 */

if (typeof window !== 'undefined') {
  // 1. Install immediate top-level error interceptor to catch and quarantine Illegal constructor errors
  const prevOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msg = String(message || error?.message || '');
    if (msg.includes('Illegal constructor')) {
      console.warn('[StudyOS Polyfill] Handled and neutralized browser sandbox restriction:', msg);
      return true; // Suppress uncaught error reporting to window/parent container
    }
    if (typeof prevOnError === 'function') {
      return prevOnError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '');
    if (msg.includes('Illegal constructor')) {
      console.warn('[StudyOS Polyfill] Handled and neutralized unhandled rejection:', msg);
      event.preventDefault();
    }
  });

  // 2. Safely guard Notification constructor
  if ('Notification' in window) {
    try {
      // Test if Notification constructor is constructible in this environment
      new (window as any).Notification('');
    } catch (e: any) {
      if (String(e).includes('Illegal constructor') || e?.name === 'TypeError') {
        const originalPerm = (window as any).Notification?.permission || 'default';
        const originalReq = (window as any).Notification?.requestPermission;

        function SafeNotification(this: any, title: string, options?: any) {
          this.title = title || '';
          this.body = options?.body || '';
          this.icon = options?.icon || '';
          this.tag = options?.tag || '';
          this.badge = options?.badge || '';
          this.onclick = null;
          this.onclose = null;
          this.onerror = null;
          this.onshow = null;
          this.close = function () {};
          this.addEventListener = function () {};
          this.removeEventListener = function () {};
          this.dispatchEvent = function () {
            return true;
          };
        }

        SafeNotification.permission = originalPerm;
        SafeNotification.requestPermission = async function () {
          if (typeof originalReq === 'function') {
            try {
              return await originalReq.call(window.Notification);
            } catch {
              return 'denied';
            }
          }
          return 'denied';
        };

        try {
          Object.defineProperty(window, 'Notification', {
            value: SafeNotification,
            writable: true,
            configurable: true,
          });
        } catch {
          try {
            (window as any).Notification = SafeNotification;
          } catch {
            // ignore
          }
        }
      }
    }
  }

  // 3. Safely guard SpeechSynthesisUtterance constructor
  if ('SpeechSynthesisUtterance' in window) {
    try {
      new (window as any).SpeechSynthesisUtterance('');
    } catch (e: any) {
      if (String(e).includes('Illegal constructor') || e?.name === 'TypeError') {
        function SafeUtterance(this: any, text?: string) {
          this.text = text || '';
          this.lang = 'en-IN';
          this.voice = null;
          this.volume = 1;
          this.rate = 1;
          this.pitch = 1;
          this.onstart = null;
          this.onend = null;
          this.onerror = null;
          this.onpause = null;
          this.onresume = null;
          this.onmark = null;
          this.onboundary = null;
          this.addEventListener = function () {};
          this.removeEventListener = function () {};
          this.dispatchEvent = function () {
            return true;
          };
        }

        try {
          Object.defineProperty(window, 'SpeechSynthesisUtterance', {
            value: SafeUtterance,
            writable: true,
            configurable: true,
          });
        } catch {
          try {
            (window as any).SpeechSynthesisUtterance = SafeUtterance;
          } catch {
            // ignore
          }
        }
      }
    }
  }

  // 4. Safely guard SpeechRecognition constructor
  for (const srKey of ['SpeechRecognition', 'webkitSpeechRecognition'] as const) {
    const SR = (window as any)[srKey];
    if (SR && typeof SR === 'function') {
      try {
        new SR();
      } catch (e: any) {
        if (String(e).includes('Illegal constructor') || e?.name === 'TypeError') {
          function SafeSpeechRecognition(this: any) {
            this.continuous = false;
            this.interimResults = false;
            this.lang = 'en-IN';
            this.maxAlternatives = 1;
            this.onstart = null;
            this.onresult = null;
            this.onerror = null;
            this.onend = null;
            this.start = function () {};
            this.stop = function () {};
            this.abort = function () {};
            this.addEventListener = function () {};
            this.removeEventListener = function () {};
            this.dispatchEvent = function () {
              return true;
            };
          }

          try {
            Object.defineProperty(window, srKey, {
              value: SafeSpeechRecognition,
              writable: true,
              configurable: true,
            });
          } catch {
            try {
              (window as any)[srKey] = SafeSpeechRecognition;
            } catch {
              // ignore
            }
          }
        }
      }
    }
  }

  // 5. Safely guard AudioContext constructor
  for (const acKey of ['AudioContext', 'webkitAudioContext'] as const) {
    const AC = (window as any)[acKey];
    if (AC && typeof AC === 'function') {
      try {
        const testCtx = new AC();
        if (testCtx && typeof testCtx.close === 'function') {
          testCtx.close().catch(() => {});
        }
      } catch (e: any) {
        if (String(e).includes('Illegal constructor') || e?.name === 'TypeError') {
          try {
            Object.defineProperty(window, acKey, {
              value: undefined,
              writable: true,
              configurable: true,
            });
          } catch {
            // ignore
          }
        }
      }
    }
  }

  // 6. Safely guard Lock constructor against "TypeError: Illegal constructor"
  if ('Lock' in window) {
    try {
      new (window as any).Lock();
    } catch (e: any) {
      if (String(e).includes('Illegal constructor') || e?.name === 'TypeError') {
        function SafeLock(this: any) {
          this.name = '';
          this.mode = 'exclusive';
        }
        try {
          Object.defineProperty(window, 'Lock', {
            value: SafeLock,
            writable: true,
            configurable: true,
          });
        } catch {
          try {
            (window as any).Lock = SafeLock;
          } catch {
            // ignore
          }
        }
      }
    }
  }
}

export {};

