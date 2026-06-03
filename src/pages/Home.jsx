import React, { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import image1 from '../assets/carlos-muza-hpjSkU2UYSU-unsplash.jpg'
import image2 from '../assets/emmanuel-ikwuegbu-_2AlIm-F6pw-unsplash.jpg'
import image3 from '../assets/john-karlo-mendoza-idzUojjazCg-unsplash.jpg'
import image4 from '../assets/linkedin-sales-solutions-YDVdprpgHv4-unsplash.jpg'
 
function Home() {
  const images = [image1, image2, image3, image4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
 
  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
 
  const handleScrollDown = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
 
  return (
    <>
      {/* HERO SECTION — id="home" for navbar scroll */}
      <section id="home" className="relative w-full h-[100vh] overflow-hidden">
 
        {/* Background images */}
        {images.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'scale(1.08)' : 'scale(1)',
              transition: 'opacity 1.2s ease-in-out, transform 6s ease-in-out',
            }}
          />
        ))}
 
        {/* Gradient overlay — richer than plain black */}
        <div className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.75) 100%)' }} />
 
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
 
          {/* Badge */}
          <div
            className="mt-10 mb-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium tracking-widest uppercase"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            }}
          >
            Businesses Marketplace
          </div>
 
          {/* Main heading */}
          <h1
            className="text-7xl md:text-8xl lg:text-[clamp(5rem,15vw,14rem)] font-black text-white leading-none tracking-tight cursor-default select-none"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 30%, #34d399 70%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ServeLink
            </span>
          </h1>
 
          {/* Tagline */}
          <p
            className="mt-6 text-lg md:text-2xl text-gray-200 tracking-widest font-light"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s',
            }}
          >
            <span className="hover:text-white transition duration-300 cursor-default">Find</span>
            <span className="mx-4 text-emerald-400">•</span>
            <span className="hover:text-white transition duration-300 cursor-default">Connect</span>
            <span className="mx-4 text-emerald-400">•</span>
            <span className="hover:text-white transition duration-300 cursor-default">Get It Done</span>
          </p>
 
          {/* CTA Buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 1s, transform 0.8s ease 1s',
            }}
          >
            <a
              href="/marketplace"
              data-cursor="pointer"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] hover:-translate-y-1"
            >
              Explore Marketplace
            </a>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
 
          {/* Slide indicators */}
          <div
            className="flex gap-2 mt-12"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease 1.2s',
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === currentIndex ? '2rem' : '0.5rem',
                  background: i === currentIndex ? '#34d399' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>
 
        {/* Scroll down indicator */}
        <button
          onClick={handleScrollDown}
          className="absolute bottom-10 left-55 md:left-115 lg:left-248 -translate-x-1/2 z-20 text-white/60 hover:text-white transition-all duration-300 flex flex-col items-center gap-1"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 1.5s',
            animation: 'bounceY 2s ease-in-out infinite',
          }}
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <ChevronDown size={20} />
        </button>
 
        <style>{`
          @keyframes bounceY {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
        `}</style>
      </section>
    </>
  );
}
 
export default Home;