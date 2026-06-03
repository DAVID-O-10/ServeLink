import { BUSINESS_CATEGORIES } from '../constants/categories';

const KEYS = {
  businesses: 'servelink_businesses_v2',
  users: 'servelink_users',
  session: 'servelink_session',
  favorites: 'servelink_favorites',
  contactMessages: 'servelink_contact_messages',
  bookings: 'servelink_bookings',
};

export class StorageError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('servelink-storage'));
    return true;
  } catch (err) {
    if (err?.name === 'QuotaExceededError') {
      throw new StorageError(
        'Storage is full. Try using a smaller image (under 1MB) or remove old listings.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new StorageError('Could not save data. Please try again.', 'WRITE_FAILED');
  }
}

function migrateLegacyBusinesses() {
  const current = read(KEYS.businesses, null);
  if (Array.isArray(current)) return current;

  try {
    const legacy = localStorage.getItem('marketplaceBusinesses');
    if (!legacy) return [];
    const parsed = JSON.parse(legacy);
    const migrated = parsed.map((b) => normalizeBusiness(b, b.userId));
    write(KEYS.businesses, migrated);
    return migrated;
  } catch {
    return [];
  }
}

export function normalizeBusiness(raw, userId = null) {
  const images = raw.images?.length
    ? raw.images
    : raw.image
      ? [raw.image]
      : [];

  const category = BUSINESS_CATEGORIES.includes(raw.category)
    ? raw.category
    : BUSINESS_CATEGORIES.includes(raw.businessType)
      ? raw.businessType
      : raw.category || raw.businessType || 'Other';

  return {
    id: raw.id ?? Date.now(),
    userId: raw.userId ?? userId ?? null,
    businessName: raw.businessName ?? '',
    businessType: raw.businessType ?? category,
    category,
    description: raw.description ?? '',
    address: raw.address ?? '',
    locationLink: raw.locationLink ?? '',
    whatsapp: raw.whatsapp ?? '',
    instagram: raw.instagram ?? '',
    tiktok: raw.tiktok ?? '',
    images,
    image: images[0] ?? '',
    verified: Boolean(raw.verified),
    featured: Boolean(raw.featured),
    createdAt: raw.createdAt ?? new Date().toISOString(),
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    reports: Array.isArray(raw.reports) ? raw.reports : [],
    analytics: {
      views: raw.analytics?.views ?? raw.views ?? 0,
      whatsappClicks: raw.analytics?.whatsappClicks ?? 0,
      mapsClicks: raw.analytics?.mapsClicks ?? 0,
    },
  };
}

export function getBusinesses() {
  return migrateLegacyBusinesses();
}

export function saveBusinesses(list) {
  write(KEYS.businesses, list);
  try {
    localStorage.setItem('marketplaceBusinesses', JSON.stringify(list));
  } catch {
    /* legacy key optional */
  }
}

export function getBusinessById(id) {
  const numId = Number(id);
  return getBusinesses().find((b) => b.id === numId || String(b.id) === String(id));
}

export function upsertBusiness(business) {
  const list = getBusinesses();
  const normalized = normalizeBusiness(business);
  const idx = list.findIndex((b) => b.id === normalized.id);
  if (idx >= 0) list[idx] = normalized;
  else list.unshift(normalized);
  saveBusinesses(list);
  return normalized;
}

export function deleteBusiness(id) {
  const numId = Number(id);
  saveBusinesses(getBusinesses().filter((b) => b.id !== numId && String(b.id) !== String(id)));
}

export function trackAnalytics(id, field) {
  const list = getBusinesses();
  const idx = list.findIndex((b) => b.id === Number(id) || String(b.id) === String(id));
  if (idx < 0) return;
  list[idx].analytics = {
    ...list[idx].analytics,
    [field]: (list[idx].analytics?.[field] ?? 0) + 1,
  };
  saveBusinesses(list);
}

export function addReview(businessId, review) {
  const list = getBusinesses();
  const idx = list.findIndex((b) => b.id === Number(businessId) || String(b.id) === String(businessId));
  if (idx < 0) return null;
  const newReview = {
    id: Date.now(),
    ...review,
    createdAt: new Date().toISOString(),
  };
  list[idx].reviews = [newReview, ...(list[idx].reviews ?? [])];
  saveBusinesses(list);
  return newReview;
}

export function reportBusiness(businessId, reason, reporterId = 'anonymous') {
  const list = getBusinesses();
  const idx = list.findIndex((b) => b.id === Number(businessId) || String(b.id) === String(businessId));
  if (idx < 0) return;
  list[idx].reports = [
    ...(list[idx].reports ?? []),
    { id: Date.now(), reason, reporterId, createdAt: new Date().toISOString() },
  ];
  saveBusinesses(list);
}

export function getAverageRating(business) {
  const reviews = business?.reviews ?? [];
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length;
}

export function getUsers() {
  return read(KEYS.users, []);
}

export function saveUsers(users) {
  write(KEYS.users, users);
}

export function getSession() {
  return read(KEYS.session, null);
}

export function setSession(session) {
  if (session) write(KEYS.session, session);
  else localStorage.removeItem(KEYS.session);
  window.dispatchEvent(new Event('servelink-auth'));
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const user = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  setSession({ userId: user.id, email: user.email, name: user.name });
  return user;
}

export function loginUser(email, password) {
  const user = getUsers().find(
    (u) => u.email === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error('Invalid email or password');
  setSession({ userId: user.id, email: user.email, name: user.name });
  return user;
}

export function getFavorites() {
  return read(KEYS.favorites, []);
}

export function toggleFavorite(businessId) {
  const id = Number(businessId);
  const favs = getFavorites();
  const has = favs.some((f) => f === id || String(f) === String(businessId));
  const next = has
    ? favs.filter((f) => f !== id && String(f) !== String(businessId))
    : [...favs, id];
  write(KEYS.favorites, next);
  return !has;
}

export function isFavorite(businessId) {
  return getFavorites().some(
    (f) => f === Number(businessId) || String(f) === String(businessId)
  );
}

export function saveContactMessage(msg) {
  const list = read(KEYS.contactMessages, []);
  write(KEYS.contactMessages, [
    { id: Date.now(), ...msg, createdAt: new Date().toISOString() },
    ...list,
  ]);
}

export function saveBooking(booking) {
  const list = read(KEYS.bookings, []);
  write(KEYS.bookings, [
    { id: Date.now(), ...booking, createdAt: new Date().toISOString() },
    ...list,
  ]);
}

export function getBookingsForOwner(userId) {
  return read(KEYS.bookings, []).filter((b) => b.ownerId === userId);
}

export function getBookingsForBusiness(businessId) {
  return read(KEYS.bookings, []).filter(
    (b) => b.businessId === Number(businessId) || String(b.businessId) === String(businessId)
  );
}

export function getBusinessesByUser(userId) {
  return getBusinesses().filter((b) => b.userId === userId);
}
