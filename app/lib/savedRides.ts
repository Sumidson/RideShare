export const SAVED_RIDES_KEY = 'rideshare_saved_rides';

export interface SavedRide {
  rideId: string;
  origin: string;
  destination: string;
  departure_time: string;
  price_per_seat: number;
  savedAt: string;
}

export function getSavedRidesFromStorage(): SavedRide[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_RIDES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRide[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRidesToStorage(rides: SavedRide[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVED_RIDES_KEY, JSON.stringify(rides));
}

export function isRideSaved(rideId: string): boolean {
  return getSavedRidesFromStorage().some((s) => s.rideId === rideId);
}

export function addSavedRide(ride: {
  id: string;
  origin: string;
  destination: string;
  departure_time: string;
  price_per_seat: number;
}): boolean {
  const list = getSavedRidesFromStorage();
  if (list.some((s) => s.rideId === ride.id)) return false;
  const newItem: SavedRide = {
    rideId: ride.id,
    origin: ride.origin,
    destination: ride.destination,
    departure_time: ride.departure_time,
    price_per_seat: ride.price_per_seat,
    savedAt: new Date().toISOString(),
  };
  saveRidesToStorage([newItem, ...list]);
  return true;
}

export function removeSavedRide(rideId: string): void {
  const list = getSavedRidesFromStorage().filter((s) => s.rideId !== rideId);
  saveRidesToStorage(list);
}
