import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const Marketplace = lazy(() => import('../pages/Marketplace'));
const BusinessProfile = lazy(() => import('../pages/BusinessProfile'));
const OwnerDashboard = lazy(() => import('../pages/OwnerDashboard'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Auth = lazy(() => import('../pages/Auth'));
const Categories = lazy(() => import('../pages/Categories'));
const NotFound = lazy(() => import('../pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function PageTransition() {
  const location = useLocation();
  const reduced = useReducedMotion();

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<BusinessProfile />} />
      <Route path="/dashboard" element={<OwnerDashboard />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/login" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (reduced) {
    return <Suspense fallback={<PageFallback />}>{routes}</Suspense>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <Suspense fallback={<PageFallback />}>{routes}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
