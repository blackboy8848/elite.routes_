import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-32 md:py-48 bg-[#f5f5f7] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto group">
              {/* Soft shadow instead of border */}
              <div className="absolute inset-0 bg-[#e0e0e0] rounded-sm transform rotate-3 scale-[1.02] opacity-80 transition-transform group-hover:rotate-6 duration-700 shadow-xl" />
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80" 
                alt="Scenic travel destination" 
                className="relative z-10 w-full h-full object-cover object-center transition-all duration-700 shadow-md"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2 space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-[#46122d]/40" />
                <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">Our Philosophy</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-[#46122d]">
                Curating <br />
                <span className="font-light text-gray-500">Unforgettable</span> Returns.
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-sm md:text-base">
              <p>
                EliteRoutes_ is built on the belief that travel is more than simply visiting new places; it is about profound experiences that resonate with the soul. We meticulously design escapes to the world's most serene and breathtaking destinations.
              </p>
              <p>
                From hidden coastal villas to awe-inspiring mountain retreats, we ensure every detail is tailored for the modern explorer who seeks minimal, elegant, and peaceful journeys.
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 gap-12 border-t border-gray-200 pb-4">
              <div>
                <motion.h4 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-light text-[#46122d] mb-3"
                >
                  100k+
                </motion.h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Travelers Inspired</p>
              </div>
              <div>
                <motion.h4 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-light text-[#46122d] mb-3"
                >
                  50+
                </motion.h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Curated Destinations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
