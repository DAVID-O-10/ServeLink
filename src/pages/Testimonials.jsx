import React, { useState, useEffect, useRef, useCallback } from "react";
import p1 from "../assets/aiony-haust-3TLl_97HNJo-unsplash.jpg";
import p2 from "../assets/ayo-ogunseinde-6W4F62sN_yI-unsplash.jpg";
import p3 from "../assets/charles-etoroma-95UF6LXe-Lo-unsplash.jpg";
import p4 from "../assets/christopher-campbell-rDEOVtE7vOs-unsplash.jpg";
import p5 from "../assets/ian-dooley-d1UPkiFd04A-unsplash.jpg";
import p6 from "../assets/michael-dam-mEZ3PoFGs_k-unsplash.jpg";
import p7 from "../assets/philip-martin-5aGUyCW_PJw-unsplash.jpg";
import p8 from "../assets/rafaella-mendes-diniz-et_78QkMMQs-unsplash.jpg";
import p9 from "../assets/rayul-_M6gy9oHgII-unsplash.jpg";

const TESTIMONIALS = [
  { id: 1, image: p1, name: "Aisha",   role: "Freelance Designer",  text: "ServeLink helped me land consistent clients within weeks. The experience feels completely seamless.", rating: 5, accent: "#10b981" },
  { id: 2, image: p2, name: "Daniel",  role: "Software Developer",  text: "The platform is incredibly smooth and intuitive — everything just works without any friction.", rating: 4, accent: "#3b82f6" },
  { id: 3, image: p3, name: "Samuel",  role: "Electrician",         text: "A reliable system that connects you with real opportunities. I highly recommend it.", rating: 5, accent: "#f97316" },
  { id: 4, image: p4, name: "Grace",   role: "Private Tutor",       text: "I got my first serious client faster than expected. The whole process felt very professional.", rating: 5, accent: "#a855f7" },
  { id: 5, image: p5, name: "Michael", role: "Logistics Provider",  text: "Clean interface, dependable connections, and genuinely useful — exactly what I needed.", rating: 4, accent: "#ef4444" },
  { id: 6, image: p6, name: "Sophia",  role: "Beauty Therapist",    text: "The UI is modern and elegant. Finding clients who match my services feels completely effortless.", rating: 5, accent: "#ec4899" },
  { id: 7, image: p7, name: "John",    role: "Plumber",             text: "A solid platform that removes a lot of the usual frustration from finding steady work.", rating: 3, accent: "#6b7280" },
  { id: 8, image: p8, name: "Ella",    role: "Catering Services",   text: "Fast connections with clients who actually respond — that makes a real, tangible difference.", rating: 4, accent: "#22c55e" },
  { id: 9, image: p9, name: "Chris",   role: "Photography",         text: "One of the most practical platforms I've used. Simple to navigate but highly effective.", rating: 5, accent: "#06b6d4" },
];

function Stars({ count, accent }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? accent : "none"}
          stroke={i < count ? accent : "#9ca3af"} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

/* ── Avatar chip ── */
function Avatar({ t, index, inView, onClick }) {
  const delay = index * 80;

  return (
    <button
      onClick={onClick}
      aria-label={`Read ${t.name}'s testimonial`}
      className="group relative focus:outline-none"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1) translateY(0)" : "scale(0.7) translateY(16px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
        animation: inView ? `floatOrbit ${5.5 + (index % 4) * 0.7}s ease-in-out ${index * 0.35}s infinite` : "none",
      }}
    >

      {/* Avatar image */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-cover bg-center
                   ring-2 ring-white/20 group-hover:ring-4 group-active:scale-95
                   transition-all duration-300 shadow-xl"
        style={{
          backgroundImage: `url(${t.image})`,
          boxShadow: `0 8px 32px ${t.accent}33`,
        }}
      />

      {/* Name tooltip — appears on hover */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                   px-2.5 py-1 rounded-lg text-xs font-semibold text-white
                   opacity-0 group-hover:opacity-100 pointer-events-none
                   transition-all duration-200 translate-y-1 group-hover:translate-y-0"
        style={{ background: t.accent }}
      >
        {t.name}
      </div>
    </button>
  );
}

/* ── Popup card (fixed-positioned, portal-like) ── */
function TestimonialPopup({ t, anchorRect, onClose }) {
  const popupRef = useRef(null);
  const POPUP_W = 300;
  const POPUP_H = 210; // approximate
  const PAD = 16;

  // Close on outside click or Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    // slight delay so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", onOutside), 100);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [onClose]);

  // Compute best position relative to viewport
  const getPos = () => {
    if (!anchorRect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };

    const midY = anchorRect.top + anchorRect.height / 2;
    let left = anchorRect.right + 14;
    let top = midY - POPUP_H / 2;

    // Flip left if overflows right
    if (left + POPUP_W > window.innerWidth - PAD) {
      left = anchorRect.left - POPUP_W - 14;
    }
    // Clamp horizontally (mobile fallback to center)
    if (left < PAD) {
      left = (window.innerWidth - POPUP_W) / 2;
    }
    // Clamp vertically
    top = Math.max(PAD, Math.min(top, window.innerHeight - POPUP_H - PAD));

    return { top: `${top}px`, left: `${left}px`, transform: "none" };
  };

  const pos = getPos();

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.name}'s testimonial`}
      style={{
        position: "fixed",
        zIndex: 9999,
        width: `${POPUP_W}px`,
        ...pos,
        background: "rgba(15, 23, 42, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${t.accent}44`,
        borderRadius: "20px",
        padding: "20px",
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)`,
        animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center ring-2 shrink-0"
          style={{ backgroundImage: `url(${t.image})`, ringColor: t.accent }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-sm leading-tight truncate">{t.name}</p>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0"
              style={{ background: `${t.accent}22`, color: t.accent, border: `1px solid ${t.accent}44` }}
            >
              Verified
            </span>
          </div>
          <p className="text-xs mt-0.5 truncate" style={{ color: `${t.accent}cc` }}>{t.role}</p>
        </div>
      </div>

      {/* Quote mark */}
      <div className="text-4xl leading-none font-serif mb-1" style={{ color: `${t.accent}55` }}>"</div>

      <p className="text-gray-300 text-sm leading-relaxed -mt-2">{t.text}</p>

      <div className="flex items-center justify-between mt-4">
        <Stars count={t.rating} accent={t.accent} />
        <button
          onClick={onClose}
          className="text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 hover:opacity-80"
          style={{ background: `${t.accent}22`, color: t.accent }}
        >
          Close
        </button>
      </div>

      {/* Accent glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${t.accent}88, transparent)` }}
      />
    </div>
  );
}

/* ── Main section ── */
export default function Testimonials() {
  const [active, setActive] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleOpen = useCallback((e, t) => {
    setAnchorRect(e.currentTarget.getBoundingClientRect());
    setActive(t);
  }, []);

  const handleClose = useCallback(() => {
    setActive(null);
    setAnchorRect(null);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatOrbit {
          0%   { transform: translateY(0px) rotate(0deg); }
          30%  { transform: translateY(-10px) rotate(0.8deg); }
          60%  { transform: translateY(-5px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <section
        id="testimonials"
        ref={sectionRef}
        className="relative w-full overflow-hidden py-24 px-4 sm:px-10 lg:px-20"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #111827 55%, #0f172a 100%)",
        }}
      >
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 60%)" }} />
        </div>

        {/* Section header */}
        <div
          className="relative text-center mb-16 sm:mb-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-emerald-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-400">
              Real Voices
            </span>
            <div className="w-8 h-px bg-emerald-500" />
          </div>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-white">What people </span>
            <span
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              are saying
            </span>
          </h2>

          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Tap any face to read their story. Real users, real results.
          </p>
        </div>

        {/* Avatar constellation grid */}
        <div className="relative max-w-4xl mx-auto">
          {/* Subtle connecting line grid — purely decorative */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.06 }}
            aria-hidden="true"
          >
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* 3×3 grid of avatars */}
          <div className="grid grid-cols-3 gap-y-16 sm:gap-y-20 gap-x-4 sm:gap-x-8 px-4 sm:px-0">
            {TESTIMONIALS.map((t, i) => {
              // Varied vertical offsets for organic feel — safe Tailwind classes
              const offsets = [
                "mt-0", "mt-8", "mt-4",
                "mt-12", "mt-2", "mt-10",
                "mt-6",  "mt-16", "mt-0",
              ];
              // Alignment per cell — alternating to create visual rhythm
              const aligns = [
                "flex justify-start", "flex justify-center", "flex justify-end",
                "flex justify-end",   "flex justify-center", "flex justify-start",
                "flex justify-start", "flex justify-center", "flex justify-end",
              ];

              return (
                <div key={t.id} className={`${aligns[i]} ${offsets[i]} pb-8`}>
                  <Avatar
                    t={t}
                    index={i}
                    inView={inView}
                    onClick={(e) => handleOpen(e, t)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Instruction hint */}
        <div
          className="text-center mt-10"
          style={{
            opacity: inView ? 0.5 : 0,
            transition: "opacity 0.8s ease 1s",
          }}
        >
          <p className="text-gray-500 text-xs tracking-widest uppercase">
            Click any avatar to read their testimonial
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
          style={{ background: "linear-gradient(to top, #0f172a, transparent)" }}
        />
      </section>

      {/* Popup — rendered outside section, effectively fixed to viewport */}
      {active && (
        <TestimonialPopup
          t={active}
          anchorRect={anchorRect}
          onClose={handleClose}
        />
      )}
    </>
  );
}