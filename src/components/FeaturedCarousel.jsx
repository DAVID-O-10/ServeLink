import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinesses } from '../context/BusinessContext';
import { getAverageRating } from '../lib/storage';

export default function FeaturedCarousel() {
  const { businesses, favorites, toggleFavorite } = useBusinesses();
  const scrollRef = useRef(null);

  const featured = businesses.filter((b) => {
    const avg = getAverageRating(b.id || b._id);
    return (avg >= 4 && b.reviews?.length >= 1);
  });

  if (featured.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-800 dark:text-white">Featured businesses</h2>
            <p className="text-gray-500 mt-1">Top-rated services in your area</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4">
          {featured.map((b) => {
            const avg = getAverageRating(b.id || b._id);
            const isFav = favorites.includes(b.id || b._id);
            return (
              <Link
                key={b.id}
                to={`/marketplace/${b.id}`}
                className="snap-start shrink-0 w-[280px] bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                  {b.images?.[0] || b.image ? (
                    <img src={b.images?.[0] || b.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); toggleFavorite(b.id || b._id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                  >
                    {isFav ? <Star size={14} className="text-yellow-500 fill-yellow-500" /> : <Star size={14} className="text-gray-400" />}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">{b.businessName}</h3>
                  <p className="text-sm text-gray-400 truncate">{b.category}</p>
                  {avg > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{avg.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
