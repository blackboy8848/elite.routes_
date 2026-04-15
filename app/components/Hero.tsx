import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#e5e5ea]">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          {/* A serene nature/travel video */}
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Soft overlay rather than harsh black */}
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="w-px h-16 bg-white/50 mb-8"
          />
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-6 block font-medium">
            Curated Escapes & Journeys
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] drop-shadow-lg">
            DISCOVER<br />
            <span className="block mt-2 font-light">
              THE WORLD
            </span>
          </h1>
          <p className="text-base md:text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed opacity-90 drop-shadow-md">
            Unforgettable travel experiences tailored to the modern explorer. From hidden gems to iconic luxury stays.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <a href="#services" className="px-10 py-4 bg-white text-[#46122d] text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors shadow-lg">
              Our Journeys
            </a>
            <a href="#gallery" className="px-10 py-4 bg-transparent border border-white text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors backdrop-blur-sm">
              Explore Destinations
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-white">
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-2 drop-shadow-sm">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
