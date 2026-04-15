import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#f5f5f7] border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">Start Planning</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#46122d]">Book Your Journey</h2>
          <p className="text-gray-600 font-light text-sm max-w-lg mx-auto pt-4 leading-relaxed">
            Connect with our travel specialists to start crafting your bespoke tourism experience or to inquire about upcoming group departures.
          </p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-[#46122d] font-semibold pl-1">Full Name</label>
              <input type="text" id="name" className="w-full bg-[#f5f5f7] border border-transparent px-5 py-4 text-[#46122d] font-light focus:outline-none focus:border-gray-300 focus:bg-white transition-all rounded-sm placeholder:text-gray-400" placeholder="John Doe" />
            </div>
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-[#46122d] font-semibold pl-1">Email Address</label>
              <input type="email" id="email" className="w-full bg-[#f5f5f7] border border-transparent px-5 py-4 text-[#46122d] font-light focus:outline-none focus:border-gray-300 focus:bg-white transition-all rounded-sm placeholder:text-gray-400" placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor="interest" className="text-[10px] uppercase tracking-[0.2em] text-[#46122d] font-semibold pl-1">Destination Interest</label>
            <div className="relative">
              <select id="interest" className="w-full bg-[#f5f5f7] border border-transparent px-5 py-4 text-gray-700 font-light focus:outline-none focus:border-gray-300 focus:bg-white transition-all rounded-sm appearance-none cursor-pointer">
                <option value="europe">European Escapes</option>
                <option value="asia">Asian Cultural Tours</option>
                <option value="americas">Americas & Caribbean</option>
                <option value="custom">Custom Itinerary Inquiry</option>
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-[#46122d] font-semibold pl-1">Message</label>
            <textarea id="message" rows={5} className="w-full bg-[#f5f5f7] border border-transparent px-5 py-4 text-[#46122d] font-light focus:outline-none focus:border-gray-300 focus:bg-white transition-all rounded-sm resize-none placeholder:text-gray-400" placeholder="Tell us about your dream trip..."></textarea>
          </div>
          
          <button type="submit" className="w-full bg-[#46122d] text-white font-bold tracking-[0.2em] uppercase text-[11px] py-6 hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mt-4 active:scale-[0.99] rounded-sm">
            Send Inquiry <Send size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
