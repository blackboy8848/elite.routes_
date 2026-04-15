import type { Route } from "./+types/about-us";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us | EliteRoutes_" },
    {
      name: "description",
      content: "Learn about EliteRoutes_, our travel philosophy, and why travelers trust us for curated journeys.",
    },
  ];
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main id="main-content" className="pt-12">
        <About />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
