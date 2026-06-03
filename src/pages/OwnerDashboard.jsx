import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Eye, Phone, MapPin, Building2, Pencil } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { useBusinesses } from '../context/BusinessContext';
import { getBookingsForOwner } from '../lib/storage';

export default function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { businesses } = useBusinesses();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen pt-36 px-4 text-center">
        <p className="text-gray-600 mb-4">Sign in to view your dashboard.</p>
        <Link to="/login" className="text-emerald-600 font-semibold">Sign in</Link>
      </section>
    );
  }

  const myBusinesses = businesses.filter((b) => b.userId === user.userId);
  const bookings = getBookingsForOwner(user.userId);
  const totals = myBusinesses.reduce(
    (acc, b) => ({
      views: acc.views + (b.analytics?.views ?? 0),
      whatsapp: acc.whatsapp + (b.analytics?.whatsappClicks ?? 0),
      maps: acc.maps + (b.analytics?.mapsClicks ?? 0),
    }),
    { views: 0, whatsapp: 0, maps: 0 }
  );

  return (
    <>
      <SEO title="Dashboard" />
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4 lg:px-10">
        <h1 className="text-4xl font-black text-gray-800 dark:text-white">Owner dashboard</h1>
        <p className="text-gray-500 mt-2">Hello, {user.name}</p>

        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Eye, label: 'Profile views', value: totals.views, color: 'text-blue-500' },
            { icon: Phone, label: 'WhatsApp clicks', value: totals.whatsapp, color: 'text-emerald-500' },
            { icon: MapPin, label: 'Maps clicks', value: totals.maps, color: 'text-amber-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
              <Icon className={color} size={28} />
              <p className="text-3xl font-black mt-3 text-gray-800 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Building2 size={22} /> Your listings ({myBusinesses.length})
            </h2>
            {myBusinesses.length === 0 ? (
              <p className="text-gray-500 text-sm">No listings yet.</p>
            ) : (
              <ul className="space-y-3">
                {myBusinesses.map((b) => (
                  <li key={b.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-white">{b.businessName}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/marketplace/${b.id}`)}
                      className="text-emerald-600 flex items-center gap-1 text-sm font-semibold"
                    >
                      <Pencil size={14} /> View
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/marketplace" className="inline-block mt-4 text-emerald-600 font-semibold text-sm">
              + Add listing on marketplace
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={22} /> Quote requests ({bookings.length})
            </h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No quote requests yet.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {bookings.map((q) => (
                  <li key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 text-sm">
                    <p className="font-semibold text-gray-800 dark:text-white">{q.businessName}</p>
                    <p className="text-gray-500">{q.name} · {q.email}</p>
                    {q.date && <p className="text-gray-400 text-xs mt-1">Preferred: {q.date}</p>}
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{q.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
