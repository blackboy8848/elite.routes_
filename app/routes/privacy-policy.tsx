import type { Route } from "./+types/privacy-policy";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy | EliteRoutes_" },
    {
      name: "description",
      content: "Read how EliteRoutes_ collects, uses, stores, and protects customer and website visitor information.",
    },
    { property: "og:title", content: "Privacy Policy | EliteRoutes_" },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-black tracking-tight text-[#46122d] mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          This policy explains how EliteRoutes_ handles your data when you browse our website or submit travel inquiries.
        </p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Information We Collect</h2>
            <p>
              We may collect contact details, itinerary preferences, booking information, and technical usage data that
              helps us improve website performance.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">How We Use Information</h2>
            <p>
              We use submitted data to respond to inquiries, prepare travel proposals, process bookings, and provide
              customer support.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Data Security</h2>
            <p>
              We use commercially reasonable safeguards to protect your data from unauthorized access, disclosure, or
              misuse.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
            <p>
              For privacy questions, contact us at <a className="text-[#46122d] font-semibold" href="mailto:book@eliteroutes.com">book@eliteroutes.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
