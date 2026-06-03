import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [overExcluded, setOverExcluded] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const isExcluded = (target) =>
    Boolean(target?.closest?.('[data-no-custom-cursor]'));

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const excluded = isExcluded(e.target);
      setOverExcluded(excluded);
      setIsVisible(!excluded);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e) => {
      if (isExcluded(e.target)) {
        setIsHovering(false);
        return;
      }
      const el = e.target.closest(
        'a, button, [role="button"], input, select, textarea, label[for], [data-cursor="pointer"]'
      );
      if (el && !isExcluded(el)) setIsHovering(true);
    };

    const onHoverEnd = (e) => {
      const el = e.target.closest(
        'a, button, [role="button"], input, select, textarea, label[for], [data-cursor="pointer"]'
      );
      if (el) setIsHovering(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onHoverStart);
    document.addEventListener('mouseout', onHoverEnd);

    const animate = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onHoverStart);
      document.removeEventListener('mouseout', onHoverEnd);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const showCursor = isVisible && !overExcluded;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isClicking ? '16px' : '18px',
          height: isClicking ? '16px' : '18px',
          borderRadius: '50%',
          background: isHovering ? '#10b981' : '#1d4ed8',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.3s, background 0.2s, width 0.15s, height 0.15s',
          willChange: 'transform',
        }}
      />

      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '44px' : isClicking ? '28px' : '36px',
          height: isHovering ? '44px' : isClicking ? '28px' : '36px',
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? '#10b981' : '#1d4ed8'}`,
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: showCursor ? (isHovering ? 0.8 : 0.5) : 0,
          transition:
            'opacity 0.3s, width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s',
          willChange: 'transform',
        }}
      />

      <style>{`
        * { cursor: none !important; }
        [data-no-custom-cursor],
        [data-no-custom-cursor] * {
          cursor: auto !important;
        }
        [data-no-custom-cursor] a,
        [data-no-custom-cursor] button {
          cursor: pointer !important;
        }
        @media not all and (pointer: fine) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}
