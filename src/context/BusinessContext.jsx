import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { loadBusinesses, saveBusiness, removeBusiness } from '../lib/businessService';
import { getFavorites, toggleFavorite as toggleFav, getBusinesses } from '../lib/storage';

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [businesses, setBusinesses] = useState([]);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await loadBusinesses();
      setBusinesses(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = () => {
      refresh();
      setFavorites(getFavorites());
    };
    window.addEventListener('servelink-storage', onStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('servelink-storage', onStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const upsert = useCallback(async (business) => {
    const saved = await saveBusiness(business);
    setBusinesses(getBusinesses());
    return saved;
  }, []);

  const remove = useCallback(async (id, userId) => {
    const result = await removeBusiness(id, userId);
    await refresh();
    return result;
  }, [refresh]);

  const toggleFavorite = useCallback((id) => {
    const added = toggleFav(id);
    setFavorites(getFavorites());
    return added;
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        favorites,
        loading,
        refresh,
        upsert,
        remove,
        toggleFavorite,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinesses() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusinesses must be used within BusinessProvider');
  return ctx;
}
