import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from "../assets/ServeLink Logo-Photoroom.png"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Darken navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navScrollLinks = [
    { name: 'About Us', id: 'about' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact Us', id: 'contact' },
  ];

  // If we're not on home, navigate home first then scroll
  const handleScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed z-50 top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[96%]
                  rounded-2xl border transition-all duration-500
                  ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-white/40 shadow-lg shadow-black/10'
                    : 'bg-white/25 backdrop-blur-md border-white/20 shadow-sm'
                  }`}
      style={{ height: '5rem' }}
    >
      <div className="w-full h-full flex items-center justify-between px-4 md:px-8">

        {/* Logo */}
        <NavLink to='/' onClick={() => setMenuOpen(false)}>
          <img
            src={logo}
            alt="ServeLink Logo"
            style={{ height: '4.5rem' }}
          />
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center space-x-2 text-base text-gray-800 font-medium">

          {/* Home */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition duration-300 ${
                  isActive && location.pathname === '/'
                    ? 'bg-emerald-500 text-white'
                    : 'hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {/* Scroll-based links */}
          {navScrollLinks.map(({ name, id }) => (
            <li key={id}>
              <button
                onClick={() => handleScroll(id)}
                className="px-4 py-2 rounded-xl transition duration-300 hover:bg-gray-100 hover:text-gray-900"
              >
                {name}
              </button>
            </li>
          ))}

          {/* Marketplace page */}
          <li>
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition duration-300 ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              Marketplace
            </NavLink>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <NavLink to='/marketplace'>
            <button className='px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5'>
              Get Started
            </button>
          </NavLink>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/30 transition duration-300 text-gray-800"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full rounded-2xl
                    bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl
                    transition-all duration-300 overflow-hidden origin-top`}
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'scaleY(1)' : 'scaleY(0.95)',
        }}
      >
        <ul className="flex flex-col items-center py-5 space-y-1 text-gray-800 font-medium">

          <li className="w-[90%]">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-center w-full px-4 py-3 rounded-xl transition duration-300 ${
                  isActive ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {navScrollLinks.map(({ name, id }) => (
            <li key={id} className="w-[90%]">
              <button
                onClick={() => handleScroll(id)}
                className="w-full px-4 py-3 rounded-xl text-center hover:bg-gray-100 transition duration-300"
              >
                {name}
              </button>
            </li>
          ))}

          <li className="w-[90%]">
            <NavLink
              to="/marketplace"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-center w-full px-4 py-3 rounded-xl transition duration-300 ${
                  isActive ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100'
                }`
              }
            >
              Marketplace
            </NavLink>
          </li>
        </ul>

        <div className="flex justify-center pb-5 px-4">
          <NavLink to='/marketplace' className="w-[90%]" onClick={() => setMenuOpen(false)}>
            <button className='w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition duration-300'>
              Get Started
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;