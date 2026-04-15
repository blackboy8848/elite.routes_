import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router';

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#e5e5ea] py-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-max">
              <img src="/logo.jpg" alt="EliteRoutes logo" className="w-12 h-12 rounded-sm object-cover shadow-sm" />
              <span className="text-2xl font-light tracking-widest uppercase">
                <span className="font-bold text-[#46122d]">Elite</span><span className="text-gray-500 group-hover:text-[#46122d] transition-colors">Routes_</span>
              </span>
            </Link>
            <p className="text-gray-600 font-light text-sm max-w-sm leading-relaxed">
              Curating the ultimate travel and tourism lifestyle. Discover unparalleled experiences, breathtaking destinations, and an exclusive community of globetrotters.
            </p>
          </div>
          
          <div>
            <h4 className="text-[#46122d] font-bold tracking-[0.2em] uppercase text-[10px] mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  About
                </Link>
              </li>
              <li>
                <Link to="/journeys" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  Journeys
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest uppercase">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#46122d] font-bold tracking-[0.2em] uppercase text-[10px] mb-6">Connect</h4>
            <ul className="space-y-5">
              <li>
                <a href="https://instagram.com/elite.routes_" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest flex items-center gap-3">
                  <Instagram size={14} className="text-[#46122d]" /> @ELITE.ROUTES_
                </a>
              </li>
              <li>
                <a href="mailto:book@eliteroutes.com" className="text-gray-600 hover:text-[#46122d] transition-colors text-[11px] font-semibold tracking-widest flex items-center gap-3">
                  <Mail size={14} className="text-[#46122d]" /> BOOK@ELITEROUTES.COM
                </a>
              </li>
              <li className="text-gray-600 text-[11px] font-semibold tracking-widest flex items-center gap-3 select-none">
                <MapPin size={14} className="text-[#46122d]" /> GLOBAL OPERATIONS
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase font-semibold">
            &copy; {new Date().getFullYear()} EliteRoutes Tourism. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-[#46122d] text-[10px] tracking-[0.2em] uppercase transition-colors font-semibold">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-[#46122d] text-[10px] tracking-[0.2em] uppercase transition-colors font-semibold">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
