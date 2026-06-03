import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import LandingPage from '../pages/LandingPage';
import Marketplace from '../pages/Marketplace';
import BusinessProfile from '../pages/BusinessProfile';
import OwnerDashboard from '../pages/OwnerDashboard';
import Favorites from '../pages/Favorites';
import Auth from '../pages/Auth';

export default function PageTransition() {
  const location = useLocation();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<BusinessProfile />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    );
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
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<BusinessProfile />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
