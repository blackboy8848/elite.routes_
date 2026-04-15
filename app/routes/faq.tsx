import type { Route } from "./+types/faq";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    q: "How do I book a package?",
    a: "Open a destination, click Book Now, and submit your preferred date, guests, and trip details.",
  },
  {
    q: "Can I customize my itinerary?",
    a: "Yes. We can tailor hotel category, sightseeing pace, transfers, and activities based on your preferences.",
  },
  {
    q: "Do you offer group and honeymoon packages?",
    a: "Yes. We offer family, honeymoon, adventure, and group-friendly packages for domestic and international trips.",
  },
  {
    q: "Are flights included in all packages?",
    a: "Flight inclusion depends on package type. Each itinerary clearly mentions inclusions and exclusions.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellation terms vary by package and supplier rules. You can review policy details on each tour detail page.",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FAQ | EliteRoutes_" },
    {
      name: "description",
      content: "Find quick answers on bookings, inclusions, customization, and cancellation policies at EliteRoutes_.",
    },
  ];
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <Navbar />
      <main id="main-content" className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#46122d] mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-10">
          Everything you need to know before booking your next trip with EliteRoutes_.
        </p>
        <div className="space-y-4">
          {faqs.map((item) => (
            <section key={item.q} className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
