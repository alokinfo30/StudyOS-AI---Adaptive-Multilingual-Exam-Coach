import { SpacedRevisionItem, UserProfile } from '../types';

const NOTIFICATION_PREF_KEY = 'studyos_browser_notifications_enabled';
const LAST_NOTIFIED_KEY = 'studyos_last_spaced_repetition_notified';

export interface NotificationStatus {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  isEnabled: boolean;
}

export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    if (typeof window.Notification !== 'function') return false;
    const perm = window.Notification.permission;
    if (typeof perm === 'undefined') return false;
    
    // Defensive verification: ensure constructor is callable without "TypeError: Illegal constructor"
    try {
      const testInstance = new (window as any).Notification('');
      if (testInstance && typeof testInstance.close === 'function') {
        testInstance.close();
      }
    } catch {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return window.Notification.permission;
  } catch {
    return 'unsupported';
  }
}

export function isReviewNotificationEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(NOTIFICATION_PREF_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setReviewNotificationEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATION_PREF_KEY, enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    if (typeof window.Notification?.requestPermission !== 'function') return 'unsupported';
    const permission = await window.Notification.requestPermission();
    if (permission === 'granted') {
      setReviewNotificationEnabled(true);
    } else {
      setReviewNotificationEnabled(false);
    }
    return permission;
  } catch (err) {
    console.warn('Failed to request notification permission', err);
    return 'denied';
  }
}

/**
 * Checks the student's spaced repetition queue and dispatches a browser notification
 * if any chapter/concept is due today or overdue.
 */
export function checkAndNotifySpacedRepetitionDue(
  queue: SpacedRevisionItem[],
  profile: UserProfile,
  force = false
): { notified: boolean; count: number; items: SpacedRevisionItem[] } {
  if (!isNotificationSupported()) {
    return { notified: false, count: 0, items: [] };
  }

  try {
    if (window.Notification.permission !== 'granted') {
      return { notified: false, count: 0, items: [] };
    }
  } catch {
    return { notified: false, count: 0, items: [] };
  }

  // Throttle notifications unless forced (at most once every 3 hours)
  const now = Date.now();
  let lastNotified = 0;
  try {
    lastNotified = parseInt(localStorage.getItem(LAST_NOTIFIED_KEY) || '0', 10);
  } catch {
    lastNotified = 0;
  }
  if (!force && now - lastNotified < 3 * 60 * 60 * 1000) {
    return { notified: false, count: 0, items: [] };
  }

  // Filter due concepts
  const dueItems = queue.filter(
    (item) => item.dueStatus === 'due_today' || (item.scheduledDate && item.scheduledDate <= now)
  );

  if (dueItems.length === 0) {
    return { notified: false, count: 0, items: [] };
  }

  const primaryItem = dueItems[0];
  const conceptDisplay = primaryItem.conceptId.replace('concept_', '').replace(/_/g, ' ');
  const title = `📚 StudyOS Revision Due: ${conceptDisplay.toUpperCase()}`;
  const body =
    dueItems.length === 1
      ? `Time for your spaced recall on ${conceptDisplay}! Forgetting risk is at ${primaryItem.forgettingRiskPercent}%. A 2-minute review locks it into long-term memory.`
      : `You have ${dueItems.length} concepts due for review today (including ${conceptDisplay}). Keep your retention curve above 90%!`;

  try {
    const NotificationClass = window.Notification;
    if (typeof NotificationClass !== 'function') {
      return { notified: false, count: dueItems.length, items: dueItems };
    }

    const notification = new NotificationClass(title, {
      body,
      icon: '/vite.svg',
      tag: 'spaced-repetition-reminder',
      badge: '/vite.svg',
    });

    notification.onclick = () => {
      try {
        window.focus();
        notification.close();
      } catch {
        // ignore
      }
    };

    try {
      localStorage.setItem(LAST_NOTIFIED_KEY, now.toString());
    } catch {
      // ignore
    }
    return { notified: true, count: dueItems.length, items: dueItems };
  } catch (e) {
    console.warn('Could not dispatch desktop notification safely', e);
    return { notified: false, count: dueItems.length, items: dueItems };
  }
}

/**
 * Triggers an immediate test notification to verify browser permissions and audio/visual alerts.
 */
export function sendTestReviewNotification(chapterName = "Ohm's Law & Circuit Heating"): boolean {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    if (window.Notification.permission !== 'granted') {
      return false;
    }

    const NotificationClass = window.Notification;
    if (typeof NotificationClass !== 'function') {
      return false;
    }

    const n = new NotificationClass(`🎯 Spaced Repetition Due: ${chapterName}`, {
      body: `Ebbinghaus Retention Alert: It is time to review this concept to prevent memory decay. Tap to begin your interactive flashcard recall!`,
      icon: '/vite.svg',
    });

    n.onclick = () => {
      try {
        window.focus();
        n.close();
      } catch {
        // ignore
      }
    };
    return true;
  } catch (err) {
    console.warn('Test notification failed safely', err);
    return false;
  }
}
