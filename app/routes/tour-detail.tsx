import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import type { Route } from './+types/tour-detail';
import { getTourBySlug, type Tour } from '../lib/tours';
import { buildTourWhatsAppUrl } from '../lib/whatsapp';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  CalendarDays,
  Users,
  Shield,
  ChevronRight,
  Info,
  Loader2,
  BadgeCheck,
  Plane,
  Hotel,
  Soup,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function TourDetail() {
  const { id: slug } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [guests, setGuests] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [selectedDepartureCity, setSelectedDepartureCity] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'policies' | 'summary' | 'faq'>('itinerary');

  useEffect(() => {
    async function fetchTour() {
      if (!slug) return;
      try {
        const data = await getTourBySlug(slug);
        if (!data) return;
        setTour(data);
        setActiveImage(data.images?.[0] || data.image || '');
        setSelectedDepartureCity((data.departureCityOptions?.length ? data.departureCityOptions[0] : "Delhi") || "Delhi");
        setSelectedRoomType(data.stay?.roomType || "Deluxe Room");
      } catch (err) {
        console.error("Failed to fetch tour details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTour();
  }, [slug]);

  const handleBooking = () => {
    if (!tour) return;
    const whatsappUrl = buildTourWhatsAppUrl(tour, {
      guests,
      travelDate,
      departureCity: selectedDepartureCity,
      roomType: selectedRoomType,
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 size={48} className="animate-spin text-[#46122d]" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] text-gray-500">
        <h2 className="text-2xl font-bold">Tour not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex text-sm text-gray-500 items-center gap-2">
          <Link to="/" className="hover:text-[#46122d] transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/destinations" className="hover:text-[#46122d] transition-colors">Packages</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate">{tour.title}</span>
        </div>
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
               <span className="bg-[#f7f3f6] text-[#46122d] font-black text-xs uppercase tracking-widest px-3 py-1 rounded-full">{tour.category || 'Tour'}</span>
               <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"><Clock size={14} /> {tour.duration}</span>
               {tour.badge && <span className="bg-red-100 text-red-600 font-bold text-xs uppercase px-3 py-1 rounded-full">{tour.badge}</span>}
               <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"><Users size={14} /> {tour.groupSize || "2-12 Travelers"}</span>
               <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"><CalendarDays size={14} /> Best: {tour.bestTimeToVisit || "Year-round"}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{tour.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-800">{tour.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-gray-500">({tour.reviews || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={16} className="text-[#46122d]" />
                {tour.location}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-end border-l-4 border-[#46122d] pl-4 py-1">
             {tour.originalPrice > tour.price && <span className="text-gray-500 line-through text-sm">₹{tour.originalPrice?.toLocaleString('en-IN')}</span>}
             <span className="text-3xl font-black text-[#46122d]">₹{tour.price?.toLocaleString('en-IN')}</span>
             <span className="text-xs text-gray-500">Price per person</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="h-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <img src={activeImage} className="w-full h-full object-cover" alt="Main" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {(tour.images || [tour.image]).map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`h-24 w-36 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-[#f37022] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Info className="text-[#46122d]" /> Tour Overview
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {tour.description}
              </p>
              {!!tour.highlights?.length && (
                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  {tour.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#f7f3f6] border border-[#e8dbe3] rounded-lg px-3 py-2 text-sm">
                      <BadgeCheck size={16} className="text-[#46122d] mt-0.5 shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[#faf7f9] border-b border-[#e8dbe3]">
                {[
                  { id: 'itinerary', label: 'Itinerary' },
                  { id: 'inclusions', label: 'Inclusions' },
                  { id: 'policies', label: 'Policies' },
                  { id: 'summary', label: 'Summary' },
                  { id: 'faq', label: 'FAQ' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-[#46122d] text-white' : 'text-gray-600 hover:bg-[#f0e8ee]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">
                {activeTab === 'itinerary' && (
                  <>
                    {tour.itinerary?.length > 0 ? (
                      <div className="space-y-6">
                        {tour.itinerary.map((day, i: number) => (
                          <div key={i} className="relative pl-8 md:pl-10 pb-2 border-l-2 border-[#ddc8d5] last:border-l-0 last:pb-0">
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#46122d] shadow-[0_0_0_4px_#fff,0_0_0_6px_#e8dbe3]"></div>
                            <span className="text-[#46122d] font-black text-xs uppercase tracking-wider block mb-1">Day {day.day}</span>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{day.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{day.desc}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Detailed itinerary will be shared after booking confirmation.</p>
                    )}
                  </>
                )}

                {activeTab === 'inclusions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" /> What's Included
                      </h3>
                      <ul className="space-y-3">
                        {(tour.inclusions?.length ? tour.inclusions : [
                          'Airport transfers',
                          'Premium accommodation',
                          'Daily breakfast',
                          'Guided sightseeing tours',
                        ]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <XCircle className="text-red-500" /> What's Excluded
                      </h3>
                      <ul className="space-y-3">
                        {(tour.exclusions?.length ? tour.exclusions : [
                          'Personal expenses',
                          'Travel insurance',
                          'Optional activities',
                          'Meals not mentioned in itinerary',
                        ]).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                            <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'policies' && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Cancellation Policy</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {(tour.cancellationPolicy?.length ? tour.cancellationPolicy : [
                          'Free cancellation till 30 days before departure.',
                          '25% charge applies for cancellation 15-29 days before departure.',
                          'No refund within 14 days of departure.',
                        ]).map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#46122d]" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Date Change Policy</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {(tour.dateChangePolicy?.length ? tour.dateChangePolicy : [
                          'One complimentary date change up to 20 days before departure.',
                          'Date changes are subject to airline and hotel fare difference.',
                        ]).map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#46122d]" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2">Terms & Conditions</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {(tour.terms?.length ? tour.terms : [
                          'Passport validity must be at least 6 months.',
                          'Rates are dynamic and subject to availability.',
                          'Any force majeure event may impact schedule.',
                        ]).map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#46122d]" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Plane size={16} className="text-[#46122d]" /> Departure Cities</h4>
                      <p className="text-sm text-gray-600">
                        {(tour.departureCityOptions?.length ? tour.departureCityOptions : ['Delhi', 'Mumbai', 'Bengaluru']).join(', ')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Hotel size={16} className="text-[#46122d]" /> Hotel Stay</h4>
                      <p className="text-sm text-gray-600">{tour.stay?.hotelName || 'Premium Hotel Collection'} • {tour.stay?.nights || '5 Nights'} • {tour.stay?.roomType || 'Deluxe Room'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Soup size={16} className="text-[#46122d]" /> Meal Plan</h4>
                      <p className="text-sm text-gray-600">
                        {(tour.mealPlan?.length ? tour.mealPlan : ['Daily breakfast', '2 premium dinners']).join(', ')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><FileText size={16} className="text-[#46122d]" /> Trip Type</h4>
                      <p className="text-sm text-gray-600">{tour.category} • {tour.duration} • {tour.groupSize || '2-12 Travelers'}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    {(tour.faqs?.length ? tour.faqs : [
                      { q: 'Is airport transfer included?', a: 'Yes, both pick-up and drop-off airport transfers are included.' },
                      { q: 'Can itinerary be customized?', a: 'Yes, for private departures your trip planner can customize activities.' },
                      { q: 'Do I need travel insurance?', a: 'Travel insurance is strongly recommended for international trips.' },
                    ]).map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-gray-200 p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                          <HelpCircle size={16} className="text-[#46122d] mt-0.5" />
                          {item.q}
                        </h4>
                        <p className="text-sm text-gray-600">{item.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Booking Form */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" id="book">
                <div className="bg-[#46122d] text-white p-6 text-center">
                   {tour.originalPrice > tour.price && <div className="text-sm line-through opacity-70">₹{tour.originalPrice.toLocaleString('en-IN')}</div>}
                   <div className="text-4xl font-black mb-1">₹{tour.price.toLocaleString('en-IN')}</div>
                   <div className="text-sm font-medium">Per Person (Taxes included)</div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Book Your Tour</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(event) => setTravelDate(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#46122d]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1 flex items-center gap-1"><Users size={14}/> Guests</label>
                      <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                         <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition-colors">-</button>
                         <span className="font-bold text-gray-800">{guests}</span>
                         <button type="button" onClick={() => setGuests(guests + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200 transition-colors">+</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Departure City</label>
                      <select
                        value={selectedDepartureCity}
                        onChange={(event) => setSelectedDepartureCity(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#46122d]"
                      >
                        {(tour.departureCityOptions?.length ? tour.departureCityOptions : ['Delhi', 'Mumbai', 'Bengaluru']).map((city, idx) => (
                          <option key={idx} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room Preference</label>
                      <select
                        value={selectedRoomType}
                        onChange={(event) => setSelectedRoomType(event.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#46122d]"
                      >
                        <option>{tour.stay?.roomType || 'Deluxe Room'}</option>
                        <option>Premium Room</option>
                        <option>Suite</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mt-6">
                       <div className="flex justify-between text-sm text-gray-600 mb-2">
                         <span>₹{tour.price.toLocaleString('en-IN')} x {guests} Adults</span>
                         <span>₹{(tour.price * guests).toLocaleString('en-IN')}</span>
                       </div>
                       <div className="border-t border-gray-200 my-2"></div>
                       <div className="flex justify-between font-bold text-lg text-gray-900">
                         <span>Total Base Price</span>
                         <span>₹{(tour.price * guests).toLocaleString('en-IN')}</span>
                       </div>
                    </div>

                    <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1 mt-4 mb-4">
                       <Shield size={12} className="text-green-500" /> Your details will be sent on WhatsApp
                    </p>

                    <button onClick={handleBooking} className="w-full bg-[#46122d] hover:bg-[#5b2040] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#46122d]/30 transition-all text-lg hover:-translate-y-0.5 flex justify-center items-center">
                       Proceed on WhatsApp
                    </button>
                    
                    <Link to="/" className="block w-full text-center border border-[#46122d] text-[#46122d] hover:bg-[#f7f3f6] font-bold py-3 rounded-xl transition-all">
                       Enquire Now
                    </Link>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tour Details | EliteRoutes_" },
    {
      name: "description",
      content:
        "View complete tour details including itinerary, inclusions, pricing, policies, and secure booking options.",
    },
    { property: "og:title", content: "Tour Details | EliteRoutes_" },
    {
      property: "og:description",
      content:
        "View complete tour details including itinerary, inclusions, pricing, policies, and secure booking options.",
    },
  ];
}
