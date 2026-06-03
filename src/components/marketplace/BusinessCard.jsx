import { Link } from 'react-router-dom';
import { MapPin, Phone, Share2, Heart, BadgeCheck } from 'lucide-react';
import Stars from './Stars';
import { getAverageRating } from '../../lib/storage';

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function BusinessCard({
  business,
  isFavorite,
  onToggleFavorite,
  onShare,
  viewMode = 'grid',
}) {
  const img = business.images?.[0] || business.image || PLACEHOLDER;
  const rating = getAverageRating(business);

  return (
    <Link to={`/marketplace/${business.id}`} className="block">
      <article
        className={`group bg-white dark:bg-gray-800 rounded-[30px] overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${
          viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
        }`}
      >
        <div className={`relative bg-gray-100 dark:bg-gray-900 overflow-hidden ${viewMode === 'list' ? 'sm:w-72 h-48 sm:h-auto shrink-0' : 'h-60'}`}>
          <img
            src={img}
            alt={business.businessName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 min-h-[12rem]"
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              {business.category || business.businessType}
            </span>
            {business.verified && (
              <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <BadgeCheck size={14} /> Verified
              </span>
            )}
            {business.featured && (
              <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(business.id);
              }}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md"
              aria-label="Toggle favorite"
            >
              <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShare(business);
              }}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Share2 size={15} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 flex-1">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-1">
              {business.businessName}
            </h2>
            {rating > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <Stars rating={rating} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {rating.toFixed(1)} ({business.reviews?.length ?? 0})
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 mt-2 text-gray-500 text-sm">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <p className="line-clamp-2">{business.address}</p>
            </div>
            {business.description && (
              <p className="mt-2 text-gray-400 text-sm line-clamp-2">{business.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const number = business.whatsapp.replace(/\D/g, '');
              window.open(`https://wa.me/${number}?text=Hi%2C%20I%20found%20your%20business%20on%20ServeLink%20and%20I%27d%20like%20to%20know%20more.`, '_blank');
            }}
            className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex justify-center items-center gap-2 text-sm mt-auto"
          >
            <Phone size={16} />
            Contact on WhatsApp
          </button>
        </div>
      </article>
    </Link>
  );
}
