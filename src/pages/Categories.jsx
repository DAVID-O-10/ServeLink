import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useBusinesses } from '../context/BusinessContext';
import { BUSINESS_CATEGORIES } from '../constants/categories';

const CATEGORY_ICONS = {
  'Tutoring & Education': '📚',
  'Home Repairs': '🔧',
  'Beauty & Wellness': '💇',
  'Catering & Food': '🍽️',
  'Photography': '📸',
  'Logistics & Delivery': '🚚',
  'Tech & Software': '💻',
  'Cleaning Services': '🧹',
  'Legal & Consulting': '⚖️',
  'Health & Fitness': '💪',
  'Fashion & Tailoring': '👗',
  'Other': '📌',
};

export default function Categories() {
  const { businesses } = useBusinesses();

  const counts = useMemo(() => {
    const map = {};
    BUSINESS_CATEGORIES.forEach((c) => { map[c] = 0; });
    businesses.forEach((b) => {
      if (map[b.category] !== undefined) map[b.category]++;
    });
    return map;
  }, [businesses]);

  return (
    <>
      <SEO title="Browse categories" url="/categories" />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 pt-28 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">Browse categories</h1>
          <p className="text-gray-500 mt-2">Find businesses by category.</p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUSINESS_CATEGORIES.map((cat) => {
              const count = counts[cat];
              return (
                <Link
                  key={cat}
                  to={`/marketplace?category=${encodeURIComponent(cat)}`}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:-translate-y-0.5"
                >
                  <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{cat}</p>
                    <p className="text-sm text-gray-400">{count} business{count !== 1 ? 'es' : ''}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
