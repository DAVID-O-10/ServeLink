import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" url="/404" />
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-28 pb-16">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-black text-gray-200 dark:text-gray-700 select-none">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white -mt-4">Page not found</h2>
          <p className="text-gray-500 mt-4">The page you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="inline-block mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl transition-all"
          >
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
