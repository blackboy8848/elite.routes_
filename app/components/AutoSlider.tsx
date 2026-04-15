import { motion } from 'framer-motion';

const sliderImages = [
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&h=400&q=80',
];

export default function AutoSlider() {
  const repeatedImages = [...sliderImages, ...sliderImages];

  return (
    <div className="w-full overflow-hidden bg-[#e5e5ea] py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase font-semibold">Visual Escape</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#46122d] mt-4">Places We've Explored</h2>
      </div>
      <motion.div 
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
      >
        {repeatedImages.map((src, index) => (
          <div key={index} className="w-[300px] h-[200px] md:w-[450px] md:h-[300px] flex-shrink-0 relative rounded-sm overflow-hidden shadow-sm border border-gray-200">
            <img src={src} alt="Travel Destination" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
