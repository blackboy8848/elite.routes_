import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "EliteRoutes_ completely transformed our perception of travel. Every detail was meticulously planned, allowing us to simply absorb the culture.",
    author: "Elena Rodriguez",
    role: "Avid Traveler",
  },
  {
    quote: "Finding true tranquility is rare, but the destinations curated by this team are hidden gems. The seamless logistics made the trip feel effortless.",
    author: "David Chen",
    role: "Photographer",
  },
  {
    quote: "A perfectly balanced itinerary that paired breathtaking nature with refined luxury. We can't wait to book our next adventure.",
    author: "Sophie Laurent",
    role: "Travel Enthusiast",
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 bg-[#e5e5ea] border-t border-white/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">Client Stories</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#46122d]">Traveler Reviews</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              className="p-10 bg-[#f5f5f7] border border-gray-200 relative group hover:border-gray-300 hover:shadow-lg transition-all duration-500 rounded-sm"
            >
              <Quote size={40} className="text-gray-300 mb-8 transform -scale-x-100 group-hover:text-gray-400 transition-colors duration-500" />
              <p className="text-gray-600 font-light text-sm leading-loose mb-10 min-h-[120px]">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold tracking-wider text-[#46122d]">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#46122d] tracking-wide">{testimonial.author}</h4>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
