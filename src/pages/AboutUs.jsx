import React, { useEffect, useRef, useState } from 'react'
import { useBusinesses } from '../context/BusinessContext'
import laptop from "../assets/Screenshot 2026-05-13 125901.png"

/* ─── tiny count-up hook ─── */
function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start || target === 0) { setValue(target); return }
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, start, duration])
  return value
}

/* ─── single stat card ─── */
function StatCard({ value, label, delay, inView }) {
  const count = useCountUp(value, 1200, inView)
  return (
    <div
      className="relative flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-4 rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-emerald-100/90 dark:from-gray-800 dark:to-gray-800/80"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-200/60 dark:bg-emerald-500/10" />
      <span
        className="text-5xl sm:text-6xl font-black tabular-nums"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #1d4ed8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}
      >
        {count}
      </span>
      <p className="mt-2 text-gray-600 dark:text-gray-400 text-[10px] sm:text-sm font-semibold text-center tracking-wide uppercase leading-tight">
        {label}
      </p>
    </div>
  )
}

/* ─── main component ─── */
export default function AboutUs() {
  const { businesses } = useBusinesses()
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  /* intersection observer for scroll-triggered animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── FIX: use correct field names matching Marketplace.jsx ── */
  const registeredBusinesses = businesses.length
  const uniqueCategories = new Set(businesses.map(b => b.category || b.businessType).filter(Boolean)).size
  const uniqueLocations = new Set(businesses.map(b => b.address).filter(Boolean)).size

  const stats = [
    { value: registeredBusinesses, label: 'Registered Businesses' },
    { value: uniqueCategories,     label: 'Business Categories'   },
    { value: uniqueLocations,      label: 'Locations Covered'     },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-white dark:bg-gray-900 py-24 px-4 sm:px-8 lg:px-16 overflow-hidden transition-colors duration-300"
      style={{ position: 'relative' }}
    >
      {/* decorative background blobs */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 translate-x-[30%] -translate-y-[30%]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 -translate-x-[30%] translate-y-[30%]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── IMAGE COLUMN ── */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          {/* stacked card effect */}
          <div className="relative">
            {/* back card — decorative */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 rotate-[3deg] translate-x-2.5 translate-y-2.5 z-0" />

            {/* main image card */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl "
              style={{
                zIndex: 1,
                aspectRatio: '4/3',
                boxShadow: '0 32px 64px rgba(0,0,0,0.15), 0 8px 24px rgba(16,185,129,0.15)',
              }}
            >
              <img
                src={laptop}
                alt="ServeLink — connecting businesses and customers"
                className="w-full h-full object-cover object-center"
                style={{ transform: 'scale(1.02)' }}
              />
              {/* subtle gradient overlay on image */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 50%)',
                }}
              />

              {/* floating badge on image */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: '#10b981',
                    boxShadow: '0 0 0 4px rgba(16,185,129,0.25)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                />
                <span className="text-gray-800 dark:text-gray-100 text-sm font-semibold">Live Marketplace</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TEXT COLUMN ── */}
        <div
          className="flex flex-col gap-8"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s',
          }}
        >
          {/* label */}
          <div className="inline-flex items-center gap-2 w-fit">
            <div className="w-8 h-px bg-emerald-500" />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: '#10b981' }}
            >
              Who We Are
            </span>
          </div>

          {/* heading */}
          <h2
            className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Built for Nigeria's&nbsp;
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              growing&nbsp;<br />economy
            </span>
          </h2>

          {/* body */}
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-[1.85] font-normal">
            ServeLink connects people with trusted businesses and service providers —
            quickly, easily, and without the stress. We give SMEs and everyday services
            like repairs, tutoring, and personal care the visibility they deserve, while
            helping users discover, compare, and contact vendors in their area.
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Clean. Mobile-friendly. Built on convenience, reliability, and the belief
            that stronger connections make stronger communities.
          </p>

          {/* stats grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
            {stats.map((s, i) => (
              <StatCard
                key={s.label}
                value={s.value}
                label={s.label}
                delay={350 + i * 120}
                inView={inView}
              />
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.6s ease 800ms',
            }}
          >
            <a
              href="/marketplace"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.35)'
              }}
            >
              Explore the Marketplace
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(16,185,129,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0.1); }
        }
      `}</style>
    </section>
  )
}