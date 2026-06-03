import { isSupabaseConfigured, supabase } from './supabase';
import {
  getBusinesses as getLocal,
  saveBusinesses,
  getBusinessById as getLocalById,
  upsertBusiness as upsertLocal,
  deleteBusiness as deleteLocal,
  trackAnalytics as trackLocal,
  addReview as addLocalReview,
  reportBusiness as reportLocal,
  normalizeBusiness,
} from './storage';

const TABLE = 'businesses';

async function fetchRemote() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToBusiness);
}

function rowToBusiness(row) {
  return normalizeBusiness({
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    businessType: row.business_type,
    category: row.category,
    description: row.description,
    address: row.address,
    locationLink: row.location_link,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    tiktok: row.tiktok,
    images: row.images,
    verified: row.verified,
    featured: row.featured,
    createdAt: row.created_at,
    reviews: row.reviews,
    reports: row.reports,
    analytics: row.analytics,
  });
}

function businessToRow(b) {
  return {
    id: b.id,
    user_id: b.userId,
    business_name: b.businessName,
    business_type: b.businessType,
    category: b.category,
    description: b.description,
    address: b.address,
    location_link: b.locationLink,
    whatsapp: b.whatsapp,
    instagram: b.instagram,
    tiktok: b.tiktok,
    images: b.images,
    verified: b.verified,
    featured: b.featured,
    created_at: b.createdAt,
    reviews: b.reviews,
    reports: b.reports,
    analytics: b.analytics,
  };
}

/** Merge remote + local; never wipe local with an empty Supabase response */
export async function loadBusinesses() {
  const local = getLocal();

  if (!isSupabaseConfigured) {
    return local;
  }

  try {
    const remote = await fetchRemote();
    if (!remote?.length) {
      return local;
    }

    const merged = [...remote];
    const remoteIds = new Set(remote.map((b) => String(b.id)));
    local.forEach((b) => {
      if (!remoteIds.has(String(b.id))) merged.push(b);
    });
    saveBusinesses(merged);
    return merged;
  } catch (e) {
    console.warn('Supabase fetch failed, using local storage', e);
    return local;
  }
}

export async function getBusinessById(id) {
  return getLocalById(id);
}

export async function saveBusiness(business) {
  const saved = upsertLocal(business);

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from(TABLE).upsert(businessToRow(saved));
      if (error) console.warn('Supabase save failed (saved locally):', error.message);
    } catch (e) {
      console.warn('Supabase save failed (saved locally)', e);
    }
  }

  return saved;
}

export async function removeBusiness(id, userId) {
  const biz = getLocalById(id);
  if (biz?.userId && biz.userId !== userId) {
    throw new Error('You can only delete your own listings');
  }
  deleteLocal(id);
  if (isSupabaseConfigured) {
    try {
      await supabase.from(TABLE).delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed', e);
    }
  }
}

export function trackAnalytics(id, field) {
  trackLocal(id, field);
}

export function addReview(businessId, review) {
  return addLocalReview(businessId, review);
}

export function reportListing(businessId, reason, reporterId) {
  reportLocal(businessId, reason, reporterId);
}

export { isSupabaseConfigured };
