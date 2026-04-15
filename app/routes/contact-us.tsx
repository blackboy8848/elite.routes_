import type { Route } from "./+types/contact-us";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us | EliteRoutes_" },
    {
      name: "description",
      content: "Get in touch with EliteRoutes_ travel specialists to plan your next domestic or international trip.",
    },
  ];
}

export default function ContactUsPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main id="main-content" className="pt-24">
        <section className="max-w-4xl mx-auto px-6 pb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#46122d] mb-3">Contact EliteRoutes_</h1>
          <p className="text-gray-600">
            Share your travel goals and our team will help you build a smooth, personalized itinerary.
          </p>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
