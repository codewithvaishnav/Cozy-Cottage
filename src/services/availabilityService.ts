/**
 * Real-time Availability Service for Cozy Cottage Shamirpet.
 * Provides live booking dates synced directly from Firebase with persistent local caching and graceful fallback.
 */

export const FIREBASE_PROJECT_ID = 'cozy-429f4';
export const SECONDARY_PROJECT_ID = 'blissful-53cbf';
export const BOOKINGS_COLLECTION = 'bookings';
const LOCAL_STORAGE_KEY = 'cozy_cottage_live_bookings';

/**
 * Known baseline confirmed reservations from the Firebase database
 */
const KNOWN_CONFIRMED_DATES = [
  '2026-10-15',
  '2026-10-06',
  '2026-08-26',
  '2026-07-18',
  '2026-07-10',
  '2026-07-06',
  '2026-07-03',
  '2026-06-29',
  '2026-06-27',
  '2026-06-26',
  '2026-06-22',
  '2026-06-21',
  '2026-06-20',
  '2026-06-19'
];

/**
 * Retrieves cached bookings from localStorage or falls back to known confirmed dates.
 */
export function getCachedBookings(): string[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return KNOWN_CONFIRMED_DATES;
}

/**
 * Saves bookings to localStorage for offline and zero-latency retrieval.
 */
function saveCachedBookings(dates: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dates));
  } catch {
    // Ignore localStorage quota errors
  }
}

/**
 * Expands check-in and check-out ranges into an array of individual dates.
 * Handles same-day reservations properly (e.g., 2026-10-15 to 2026-10-15).
 */
function expandDateRange(startStr: string, endStr?: string): string[] {
  const result: string[] = [];
  if (!startStr) return result;

  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date(startStr);

  const curr = new Date(start);
  while (curr <= end) {
    result.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return result;
}

/**
 * Parses raw Firestore document array into distinct YYYY-MM-DD date strings
 */
function parseFirestoreDocuments(documents: any[]): string[] {
  const dateSet = new Set<string>();

  for (const doc of documents) {
    const f = doc.fields || {};

    // Filter out cancelled or client-deleted bookings
    if (f.status?.stringValue === 'Cancelled') continue;
    if (f.isDeletedByClient?.booleanValue === true) continue;

    const checkIn = f.checkInDate?.stringValue || f.startDate?.stringValue || f.date?.stringValue;
    const checkOut = f.checkOutDate?.stringValue || f.endDate?.stringValue || checkIn;

    if (checkIn) {
      expandDateRange(checkIn, checkOut).forEach((d) => dateSet.add(d));
    }
  }

  return Array.from(dateSet);
}

/**
 * Fetches all active bookings from Firebase.
 * Uses same-origin /api/bookings first for instant, iframe-safe reliability.
 * Gracefully falls back to direct endpoints or local cache.
 */
export async function fetchLiveFirebaseBookings(): Promise<string[]> {
  // Strategy 1: Same-origin API endpoint (bypasses all browser CORS and iframe sandbox blocks)
  try {
    const res = await fetch('/api/bookings', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.bookedDates) && data.bookedDates.length > 0) {
        saveCachedBookings(data.bookedDates);
        return data.bookedDates;
      }
    }
  } catch {
    // Continue to Strategy 2 if /api/bookings is unavailable
  }

  // Strategy 2: Direct Firestore REST query with AbortController timeout
  const projectIds = [FIREBASE_PROJECT_ID, SECONDARY_PROJECT_ID];
  const combinedDates = new Set<string>();

  for (const pid of projectIds) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/${BOOKINGS_COLLECTION}?pageSize=300`;
      const res = await fetch(url, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        const docs = data.documents || [];
        parseFirestoreDocuments(docs).forEach((d) => combinedDates.add(d));
      }
    } catch {
      // Continue to next project
    }
  }

  if (combinedDates.size > 0) {
    const finalDates = Array.from(combinedDates);
    saveCachedBookings(finalDates);
    return finalDates;
  }

  // Strategy 3: Local cached storage
  return getCachedBookings();
}

/**
 * Subscribes to live booking updates.
 * Fires immediately with cached schedule, then synchronizes in background.
 */
export function subscribeToBookings(onUpdate: (bookedDates: string[]) => void): () => void {
  let isCancelled = false;

  // 1. Immediate instant load from cache so UI renders without delay
  const initialDates = getCachedBookings();
  onUpdate(initialDates);

  // 2. Background synchronization
  const refresh = async () => {
    try {
      const dates = await fetchLiveFirebaseBookings();
      if (!isCancelled && dates && dates.length > 0) {
        onUpdate(dates);
      }
    } catch {
      // Silent catch to prevent console errors
    }
  };

  // Run initial sync right away
  refresh();

  // Periodic polling every 15 seconds for real-time live sync
  const intervalId = setInterval(refresh, 15000);

  // Auto-refresh when user refocuses or brings window to foreground
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      refresh();
    }
  };
  window.addEventListener('visibilitychange', handleVisibility);

  return () => {
    isCancelled = true;
    clearInterval(intervalId);
    window.removeEventListener('visibilitychange', handleVisibility);
  };
}
