import type { Route } from "./+types/terms-of-service";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service | EliteRoutes_" },
    {
      name: "description",
      content: "Review EliteRoutes_ booking terms, payment expectations, cancellation policies, and traveler responsibilities.",
    },
    { property: "og:title", content: "Terms of Service | EliteRoutes_" },
  ];
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main id="main-content" className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-black tracking-tight text-[#46122d] mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          These terms govern bookings, website usage, and services provided by EliteRoutes_.
        </p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bookings and Payments</h2>
            <p>
              Bookings are confirmed only after payment is received and confirmation is issued by our team. Prices are
              subject to availability and supplier changes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Changes and Cancellations</h2>
            <p>
              Date changes and cancellations are subject to package terms, airline/hotel conditions, and applicable
              charges at the time of change.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Traveler Responsibilities</h2>
            <p>
              Travelers are responsible for valid travel documents, visa compliance, and adherence to local laws and
              destination safety guidelines.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Support</h2>
            <p>
              For terms clarification, contact us at <a className="text-[#46122d] font-semibold" href="mailto:book@eliteroutes.com">book@eliteroutes.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
