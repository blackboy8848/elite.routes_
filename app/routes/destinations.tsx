import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import type { Route } from './+types/destinations';
import { getAllTours, getTourPathSlug, type Tour } from '../lib/tours';
import { buildTourWhatsAppUrl } from '../lib/whatsapp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Star, 
  MapPin, 
  Clock, 
  Bed, 
  Utensils, 
  Bus, 
  Camera,
  Heart,
  ChevronDown,
  Percent,
  Loader2
} from 'lucide-react';

const CATEGORIES = ["All", "Domestic", "International", "Family", "Honeymoon", "Adventure"];
const TOURS_PER_PAGE = 8;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Destinations | EliteRoutes_" },
    {
      name: "description",
      content:
        "Browse premium domestic and international tour packages with pricing, itinerary highlights, and instant booking options.",
    },
    { name: "keywords", content: "destinations, tour packages, domestic tours, international holidays, book tour" },
    { property: "og:title", content: "Destinations | EliteRoutes_" },
    {
      property: "og:description",
      content:
        "Browse premium domestic and international tour packages with pricing, itinerary highlights, and instant booking options.",
    },
    { property: "og:url", content: "https://eliteroutes.com/destinations" },
  ];
}

export default function Destinations() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchTours() {
      try {
        const data = await getAllTours();
        setTours(data);
      } catch (err) {
        console.error("Failed to fetch tours", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const filteredTours = tours
    .filter(tour => activeCategory === "All" || tour.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Price Low to High") return a.price - b.price;
      if (sortBy === "Price High to Low") return b.price - a.price;
      // Duration sorting (rough estimate)
      if (sortBy === "Duration") return parseInt(a.duration || "0") - parseInt(b.duration || "0");
      return 0; // Default Popularity
    });

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / TOURS_PER_PAGE));
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * TOURS_PER_PAGE,
    currentPage * TOURS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 font-sans">
      <Navbar />
      {/* Header Banner */}
      <div className="bg-[#46122d] text-white pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2000" alt="bg" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Explore Our Premium Packages</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">Discover unforgettable experiences tailored for your perfect holiday.</p>
        </div>
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Filters and Sorting Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 border border-gray-100">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
             {CATEGORIES.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                   activeCategory === cat 
                    ? 'bg-[#46122d] text-white shadow-md shadow-[#46122d]/30' 
                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-4 lg:border-l border-gray-200">
             <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort By:</span>
             <div className="relative group w-full lg:w-48">
               <select 
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#46122d] font-medium text-sm cursor-pointer transition-shadow hover:shadow-sm"
               >
                 <option>Popularity</option>
                 <option>Price Low to High</option>
                 <option>Price High to Low</option>
                 <option>Duration</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
             <Loader2 size={48} className="animate-spin mb-4 text-[#46122d]" />
             <p className="text-lg">Fetching latest tour packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedTours.map((tour, index) => (
              (() => {
                const tourSlug = getTourPathSlug(tour);
                const whatsappBookingUrl = buildTourWhatsAppUrl(tour);
                return (
              <motion.div 
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full relative group"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={tour.image || tour.images?.[0] || 'https://via.placeholder.com/600'} 
                    alt={tour.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <button 
                    onClick={() => toggleWishlist(tour.id)}
                    className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-md rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors z-10 shadow-sm"
                  >
                    <Heart size={18} fill={wishlist.includes(tour.id) ? "currentColor" : "none"} className={wishlist.includes(tour.id) ? "text-red-500" : ""} />
                  </button>

                  {tour.badge && (
                    <div className="absolute top-4 left-4 bg-[#46122d] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md flex items-center gap-1 z-10">
                      <Percent size={12} />
                      {tour.badge}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 text-white flex items-center gap-1.5 text-sm font-medium">
                     <Clock size={14} className="text-gray-200" />
                     {tour.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#46122d] transition-colors line-clamp-1">{tour.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-800">{tour.rating?.toFixed(1) || "4.8"}</span>
                    <span className="text-xs text-gray-500">({tour.reviews || 0} reviews)</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      {tour.originalPrice > tour.price && <div className="text-xs text-gray-500 line-through mb-0.5">₹{tour.originalPrice?.toLocaleString('en-IN')}</div>}
                      <div className="text-2xl font-black text-[#46122d]">
                        ₹{tour.price?.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-gray-500 font-medium">Per Person</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link 
                      to={`/destinations/${tourSlug}`} 
                      className="flex-1 text-center py-2.5 rounded-lg border border-[#46122d] text-[#46122d] font-semibold text-sm hover:bg-[#f7f3f6] transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={whatsappBookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-2.5 rounded-lg bg-[#46122d] hover:bg-[#5b2040] text-white font-semibold text-sm transition-colors shadow-md shadow-[#46122d]/20"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </motion.div>
                );
              })()
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 py-2 rounded-lg text-sm font-semibold border ${
                  currentPage === page
                    ? "bg-[#46122d] text-white border-[#46122d]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {!loading && filteredTours.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Packages Found</h3>
            <p>Try adjusting your search filters, or no tours exist in database.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
