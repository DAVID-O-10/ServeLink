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
          {/* Social placeholder icons */}
          <div className="flex gap-3 mt-6">
            {['IG', 'TT', 'X'].map(s => (
              <div key={s} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-500/30 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                {s}
              </div>
            ))}
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