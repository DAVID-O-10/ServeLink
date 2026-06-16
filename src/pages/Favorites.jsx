import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SEO from '../components/SEO';
import BusinessCard from '../components/marketplace/BusinessCard';
import { useBusinesses } from '../context/BusinessContext';

export default function Favorites() {
  const { businesses, favorites, toggleFavorite } = useBusinesses();

  const saved = businesses.filter((b) =>
    favorites.some((f) => f === b.id || String(f) === String(b.id))
  );

  const handleShare = async (business) => {
    const url = `${window.location.origin}/marketplace/${business.id}`;
    await navigator.clipboard.writeText(`Check out ${business.businessName}: ${url}`);
  };

  return (
    <>
      <SEO title="Saved businesses" url="/favorites" />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4 lg:px-10">
        <h1 className="text-4xl font-black text-gray-800 dark:text-white flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={36} /> Saved
        </h1>
        <p className="text-gray-500 mt-2">{saved.length} businesses saved</p>

        {saved.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500">No favorites yet. Browse the marketplace and tap the heart icon.</p>
            <Link to="/marketplace" className="inline-block mt-6 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-semibold">
              Explore marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
            {saved.map((b) => (
              <BusinessCard
                key={b.id}
                business={b}
                isFavorite
                onToggleFavorite={toggleFavorite}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
