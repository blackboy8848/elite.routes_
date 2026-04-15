import { motion } from 'framer-motion';

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const images = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&h=800&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&h=800&q=80',
  'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=800&h=800&q=80',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&h=800&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&h=800&q=80',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&h=800&q=80',
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-[#f5f5f7] border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">The Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#46122d]">Captivating Destinations</h2>
          </div>
          <a href="https://instagram.com/elite.routes_" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#46122d] uppercase pb-2 border-b border-[#46122d] hover:text-gray-500 hover:border-gray-500 transition-all">
            <Instagram size={14} /> Follow @elite.routes_
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square group overflow-hidden bg-white cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <Instagram size={32} className="text-[#46122d] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
