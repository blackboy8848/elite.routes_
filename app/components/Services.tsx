import { motion } from 'framer-motion';
import { Compass, Map, Plane, Tent } from 'lucide-react';

const services = [
  {
    icon: <Compass size={28} className="text-[#46122d]" />,
    title: 'Custom Itineraries',
    description: 'Personalized travel plans tailored to your exact preferences and pace.',
  },
  {
    icon: <Map size={28} className="text-[#46122d]" />,
    title: 'Guided Experiences',
    description: 'Explore deep into new cultures with our hand-selected local expert guides.',
  },
  {
    icon: <Plane size={28} className="text-[#46122d]" />,
    title: 'Flights & Transfers',
    description: 'Seamless logistics from your doorstep to your destination and back.',
  },
  {
    icon: <Tent size={28} className="text-[#46122d]" />,
    title: 'Exclusive Stays',
    description: 'Access to hidden villas, luxury remote cabins, and premium boutique hotels.',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-[#e5e5ea] relative border-t border-white/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#46122d]">Travel Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group p-10 bg-[#f5f5f7] border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center cursor-default relative overflow-hidden rounded-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-8 group-hover:bg-[#46122d] transition-colors duration-500 z-10">
                <div className="text-[#46122d] group-hover:invert transition-all duration-500">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold tracking-widest text-[#46122d] mb-4 uppercase z-10">{service.title}</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed z-10">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
