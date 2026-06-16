import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Building2, X, LayoutGrid, List, Map } from 'lucide-react';
import SEO from '../components/SEO';
import MapView from '../components/MapView';
import BusinessCard from '../components/marketplace/BusinessCard';
import BusinessFormModal from '../components/marketplace/BusinessFormModal';
import { useBusinesses } from '../context/BusinessContext';
import { BUSINESS_CATEGORIES, SORT_OPTIONS } from '../constants/categories';
import { getAverageRating, StorageError } from '../lib/storage';
import { trackAnalytics } from '../lib/businessService';
import { useDebounce } from '../hooks/useDebounce';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-[30px] overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-60 bg-gray-200 dark:bg-gray-700" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const { businesses, favorites, loading, upsert, toggleFavorite } = useBusinesses();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filtered = useMemo(() => {
    let list = businesses.filter((b) => {
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        !q ||
        b.businessName?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.businessName.localeCompare(b.businessName);
      if (sortBy === 'rating') return getAverageRating(b) - getAverageRating(a);
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return list;
  }, [businesses, searchTerm, categoryFilter, sortBy]);

  const handleShare = async (business) => {
    const url = `${window.location.origin}/marketplace/${business.id}`;
    const text = `Check out ${business.businessName} on ServeLink! ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: business.businessName, text, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      showToast('Link copied!');
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await upsert({
        ...data,
        id: data.id ?? Date.now(),
        createdAt: data.createdAt ?? new Date().toISOString(),
      });
      setShowModal(false);
      showToast('Business saved!');
    } catch (err) {
      const msg =
        err instanceof StorageError
          ? err.message
          : err?.message || 'Could not save. Try a smaller image.';
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setSortBy('newest');
  };

  return (
    <>
      <SEO title="Marketplace" description="Discover trusted local businesses on ServeLink." url="/marketplace" />
      <section className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 px-4 lg:px-10 pt-36 pb-28">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-gray-800 dark:text-white">Marketplace</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Discover trusted professionals and local businesses.</p>
            </div>
            <div className="hidden lg:flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-4 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
              <Building2 className="text-emerald-500" size={28} />
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{businesses.length} Registered</h3>
                <p className="text-sm text-gray-500">Growing marketplace</p>
              </div>
            </div>
          </div>

          <div className="sticky top-24 z-30 w-full bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-gray-700 p-4 lg:p-5 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-4 h-14 border border-gray-200 dark:border-gray-700">
                <Search className="text-gray-500 shrink-0" size={20} />
                <input
                  type="search"
                  placeholder="Search businesses, services, address..."
                  className="bg-transparent outline-none w-full text-gray-700 dark:text-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm('')} className="text-gray-400">
                    <X size={16} />
                  </button>
                )}
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-14 px-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 lg:w-56"
              >
                <option value="All">All categories</option>
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-14 px-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 lg:w-44"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <Link
                to="/categories"
                className="hidden lg:inline-flex items-center gap-2 h-14 px-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all"
              >
                Browse categories
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}
                >
                  <List size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className={`p-2 rounded-xl flex items-center gap-2 px-4 ${showMap ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600'}`}
                >
                  <Map size={20} /> Map
                </button>
              </div>
              <Link to="/categories" className="lg:hidden text-sm text-emerald-600 font-semibold">
                Browse categories
              </Link>
              {(searchTerm || categoryFilter !== 'All') && (
                <button type="button" onClick={clearFilters} className="text-sm text-emerald-600 font-semibold">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {showMap && filtered.length > 0 && (
            <MapView
              businesses={filtered}
              height="360px"
              onSelect={(b) => {
                trackAnalytics(b.id, 'views');
                navigate(`/marketplace/${b.id}`);
              }}
            />
          )}

          {(searchTerm || categoryFilter !== 'All') && (
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800 dark:text-white">{filtered.length}</span> results
            </p>
          )}
        </div>

        <div className={`grid gap-8 mt-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {loading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : filtered.length > 0
              ? filtered.map((b) => (
                  <BusinessCard
                    key={b.id}
                    business={b}
                    viewMode={viewMode}
                    isFavorite={favorites.some((f) => f === b.id || String(f) === String(b.id))}
                    onToggleFavorite={toggleFavorite}
                    onShare={handleShare}
                  />
                ))
              : (
                <div className="col-span-full flex flex-col items-center py-24 text-center">
                  <Building2 className="text-gray-400 mb-4" size={48} />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No businesses found</h2>
                  <p className="text-gray-500 mt-3 max-w-md">
                    {searchTerm || categoryFilter !== 'All'
                      ? 'Try adjusting your filters.'
                      : 'Be the first to register your business!'}
                  </p>
                  <button
                    type="button"
                    onClick={() => (searchTerm || categoryFilter !== 'All' ? clearFilters() : setShowModal(true))}
                    className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-semibold"
                  >
                    {searchTerm || categoryFilter !== 'All' ? 'Clear filters' : 'Register your business'}
                  </button>
                </div>
              )}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="fixed bottom-7 right-7 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-2xl flex items-center justify-center text-white z-50 hover:scale-110 transition-transform"
        title="Register business"
      >
        <Plus size={26} />
      </button>

      <BusinessFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {toastMsg && (
        <div className="fixed bottom-4 sm:bottom-24 left-1/2 -translate-x-1/2 z-[300] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl text-sm whitespace-nowrap">
          {toastMsg}
        </div>
      )}
    </>
  );
}
