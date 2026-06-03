import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds, offset = 120) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const home = document.getElementById('home');
      if (home) {
        const homeBottom = home.getBoundingClientRect().bottom;
        if (homeBottom > offset) {
          setActiveId(null);
          return;
        }
      }

      let current = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds, offset]);

  return activeId;
}
