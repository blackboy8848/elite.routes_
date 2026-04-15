import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use Link component for React Router properly.
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'About', href: '/about-us' },
    { name: 'Journeys', href: '/journeys' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact-us' },
  ];

  // Adjust style logic depending on page type
  const isDarkNav = !isHomePage || scrolled;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isDarkNav ? 'bg-white/80 backdrop-blur-xl py-4 border-b border-gray-200/50 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className={`flex items-center gap-3 group ${isDarkNav ? 'text-[#46122d]' : 'text-white'}`}>
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-sm object-cover shadow-sm" />
          <span className="text-xl font-light tracking-widest uppercase hidden sm:block">
            <span className="font-bold">Elite</span><span className={`transition-colors ${isDarkNav ? 'text-gray-500 group-hover:text-[#46122d]' : 'text-gray-300 group-hover:text-white'}`}>Routes_</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className={`text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-px after:transition-all hover:after:w-full ${isDarkNav ? 'text-gray-500 hover:text-black after:bg-black' : 'text-gray-300 hover:text-white after:bg-white'}`}>
              {link.name}
            </Link>
          ))}
          <div className={`w-px h-4 hidden lg:block ${isDarkNav ? 'bg-gray-300' : 'bg-gray-400'}`}></div>
          <a href="https://instagram.com/elite.routes_" target="_blank" rel="noreferrer" className={`transition-colors ${isDarkNav ? 'text-gray-500 hover:text-black' : 'text-gray-300 hover:text-white'}`}>
            <Instagram size={18} />
          </a>
        </nav>
        
        <button className={`md:hidden transition-colors ${isDarkNav ? 'text-[#46122d]' : 'text-white'}`} onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 border-b border-gray-200"
          >
            <button className="absolute top-8 right-6 text-gray-500 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <X size={28} />
            </button>
            <div className="flex flex-col gap-10 items-center mt-10">
              {navLinks.map((link, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  key={link.name}
                >
                  <Link 
                    to={link.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-3xl font-light tracking-widest uppercase text-[#46122d] hover:text-gray-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.a 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                href="https://instagram.com/elite.routes_" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-8 p-4 border border-gray-200 rounded-full text-[#46122d] hover:bg-black hover:text-white transition-all duration-300"
              >
                <Instagram size={24} />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
