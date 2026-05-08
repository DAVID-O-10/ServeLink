import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onEnter = () => setIsVisible(true);
    const onLeave = () => setIsVisible(false);
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onHoverStart = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, select, textarea, label[for], [data-cursor="pointer"]');
      if (el) setIsHovering(true);
    };

    const onHoverEnd = (e) => {
      const el = e.target.closest('a, button, [role="button"], input, select, textarea, label[for], [data-cursor="pointer"]');
      if (el) setIsHovering(false);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onHoverStart);
    document.addEventListener('mouseout', onHoverEnd);

    // Smooth ring animation loop
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

  return (
    <>
      {/* Dot — snaps to cursor position */}
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
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s, background 0.2s, width 0.15s, height 0.15s',
          willChange: 'transform',
          mixBlendMode: 'normal',
        }}
      />

      {/* Ring — lags behind */}
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
          opacity: isVisible ? (isHovering ? 0.8 : 0.5) : 0,
          transition: 'opacity 0.3s, width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s',
          willChange: 'transform',
        }}
      />

      {/* Hide native cursor globally */}
      <style>{`
        * { cursor: none !important; }
        @media (hover: none) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}