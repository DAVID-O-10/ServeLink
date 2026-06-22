import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import favicon from '../assets/ServeLink Favicon.svg';

export default function LoadingScreen({ children }) {
  const [phase, setPhase] = useState('loading');
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  const finish = useCallback(() => setPhase('gone'), []);

  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const step = 100 / (duration / interval);

    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(t);
          setTimeout(() => setPhase('ready'), 400);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(t);
  }, []);

  if (phase === 'gone') return children;

  if (reduced) {
    return (
      <>
        <AnimatePresence>
          {phase !== 'gone' && (
            <motion.div
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
              style={{ backgroundColor: '#ececec' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => {
                if (phase === 'ready') finish();
              }}
            >
              <img src={favicon} alt="" className="w-32 h-32 object-contain" />
              <div className="w-48 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-[width] duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-mono text-gray-400">{Math.round(progress)}%</span>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {phase !== 'gone' && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 overflow-hidden"
            style={{ backgroundColor: '#ececec' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <motion.div
              className="w-40 h-40 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
              animate={
                phase === 'ready'
                  ? { scale: 28, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }
                  : { scale: 1 }
              }
              onAnimationComplete={() => {
                if (phase === 'ready') finish();
              }}
            >
              <motion.img
                src={favicon}
                alt=""
                className="w-28 h-28 object-contain"
                animate={
                  phase === 'ready'
                    ? {
                        scale: 0.55,
                        x: -(window.innerWidth / 2) + 56,
                        y: -(window.innerHeight / 2) + 50,
                        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      }
                    : { scale: 1, x: 0, y: 0 }
                }
              />
            </motion.div>

            <div className="absolute bottom-[30vh] flex flex-col items-center gap-3">
              <div className="w-48 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.03, ease: 'linear' }}
                />
              </div>
              <motion.span
                className="text-sm font-mono text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
