import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  // Navigate home then scroll — works from any route
  const handleScroll = (id) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const container = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.12, duration: 0.6, ease: "easeOut" },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 pt-24 pb-10 px-6 lg:px-20 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-2xl" />

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
      >
        {/* Brand */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-white mb-4">ServeLink</h1>
          <p className="text-sm leading-relaxed text-gray-400">
            Connecting businesses with customers through a seamless digital marketplace experience. Built for growth, speed, and trust.
          </p>
          {/* WhatsApp */}
          <div className="flex gap-3 mt-6">
            <a
              href="https://wa.me/2347037385692"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366]/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div variants={item}>
          <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Navigation</h2>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Home', id: 'home' },
              { label: 'About Us', id: 'about' },
              { label: 'Testimonials', id: 'testimonials' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <li key={id}
                onClick={() => handleScroll(id)}
                className="hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2 group">
                <span className="w-0 group-hover:w-3 h-px bg-emerald-500 transition-all duration-300 overflow-hidden" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Business */}
        <motion.div variants={item}>
          <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Business</h2>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2 group">
              <span className="w-0 group-hover:w-3 h-px bg-emerald-500 transition-all duration-300" />
              <Link to="/marketplace">Marketplace</Link>
            </li>
            <li
              onClick={() => handleScroll('contact')}
              className="hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2 group">
              <span className="w-0 group-hover:w-3 h-px bg-emerald-500 transition-all duration-300" />
              Partnerships
            </li>
          </ul>
        </motion.div>

        {/* Contact + CTA */}
        <motion.div variants={item}>
          <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Get in Touch</h2>

          <div className="space-y-3 text-sm">
            <a href="mailto:davidjide10@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <Mail size={15} className="text-emerald-500" />
              <span>davidjide10@gmail.com</span>
            </a>
            <a href="tel:07037385692" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
              <Phone size={15} className="text-emerald-500" />
              <span>07037385692</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-emerald-500" />
              <span>Ogun, Nigeria</span>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl transition-colors duration-300 shadow-lg shadow-emerald-500/20 text-sm font-semibold"
              >
                Get Started <ArrowRight size={15} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ServeLink. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer transition-colors duration-200">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors duration-200">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}