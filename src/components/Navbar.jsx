import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { Moon, Sun, Heart, LayoutDashboard, LogOut, User } from 'lucide-react';
import logo from '../assets/ServeLink Logo-Photoroom.png';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SECTION_IDS = ['about', 'testimonials', 'contact'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useScrollSpy(SECTION_IDS);
  const { dark, toggle } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navScrollLinks = [
    { name: 'About Us', id: 'about' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact Us', id: 'contact' },
  ];

  const handleScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const linkClass = (active) =>
    `px-4 py-2 rounded-xl transition duration-300 ${
      active ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white text-gray-800 dark:text-gray-200'
    }`;

  return (
    <div
      data-no-custom-cursor
      className={`fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[96%] rounded-2xl border transition-all duration-500 ${
        scrolled || !onHome
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700 shadow-lg'
          : 'bg-white/25 dark:bg-gray-900/40 backdrop-blur-md border-white/20 dark:border-gray-700/50 shadow-sm'
      }`}
      style={{ height: '5rem' }}
    >
      <div className="w-full h-full flex items-center justify-between px-4 md:px-6">
        <NavLink to="/">
          <img src={logo} alt="ServeLink" style={{ height: '4rem' }} />
        </NavLink>

        <ul className="hidden lg:flex items-center gap-3 text-base font-medium">
          <li>
            <NavLink
              to="/"
              className={() => linkClass(onHome && activeSection === null)}
            >
              Home
            </NavLink>
          </li>
          {navScrollLinks.map(({ name, id }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleScroll(id)}
                className={linkClass(onHome && activeSection === id)}
              >
                {name}
              </button>
            </li>
          ))}
          <li>
            <NavLink to="/marketplace" className={({ isActive }) => linkClass(isActive)}>
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `${linkClass(isActive)} inline-flex items-center gap-1.5`
              }
            >
              <Heart size={18} className="shrink-0" strokeWidth={2} color='white'  />
              Saved
            </NavLink>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              <User size={16} /> Sign in
            </Link>
          )}
          <NavLink to="/marketplace">
            <button type="button" className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all hover:-translate-y-0.5">
              Get Connected
            </button>
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/30 text-gray-800 dark:text-white"
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col items-center py-4 space-y-1 font-medium">
          <li className="w-[90%]">
            <NavLink to="/" className={() => `flex justify-center w-full py-3 rounded-xl ${linkClass(onHome && activeSection === null)}`}>
              Home
            </NavLink>
          </li>
          {navScrollLinks.map(({ name, id }) => (
            <li key={id} className="w-[90%]">
              <button type="button" onClick={() => handleScroll(id)} className={`w-full py-3 rounded-xl text-center ${linkClass(onHome && activeSection === id)}`}>
                {name}
              </button>
            </li>
          ))}
          <li className="w-[90%]">
            <NavLink to="/marketplace" className={({ isActive }) => `flex justify-center w-full py-3 rounded-xl ${linkClass(isActive)}`}>
              Marketplace
            </NavLink>
          </li>
          <li className="w-[90%]">
            <NavLink to="/favorites" className={({ isActive }) => `flex justify-center w-full py-3 rounded-xl ${linkClass(isActive)}`}>
              Saved
            </NavLink>
          </li>
          <li className="w-[90%]">
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex justify-center w-full py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="flex justify-center w-full py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
                Sign in
              </Link>
            )}
          </li>
        </ul>
        <div className="flex justify-center gap-3 pb-4 px-4">
          <button type="button" onClick={toggle} className="p-3 rounded-xl border border-gray-200 dark:border-gray-600">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NavLink to="/marketplace" className="flex-1">
            <button type="button" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold">
              Get Connected
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
