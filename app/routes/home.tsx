import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import AutoSlider from "../components/AutoSlider";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EliteRoutes_ | Curated Travel Experiences" },
    {
      name: "description",
      content:
        "Discover breathtaking destinations, curated travel packages, and exclusive tourism experiences with EliteRoutes_.",
    },
    { name: "keywords", content: "travel packages, luxury tours, holiday booking, curated trips, EliteRoutes" },
    { property: "og:title", content: "EliteRoutes_ | Curated Travel Experiences" },
    {
      property: "og:description",
      content:
        "Discover breathtaking destinations, curated travel packages, and exclusive tourism experiences with EliteRoutes_.",
    },
    { property: "og:url", content: "https://eliteroutes.com/" },
    { name: "twitter:title", content: "EliteRoutes_ | Curated Travel Experiences" },
    {
      name: "twitter:description",
      content:
        "Discover breathtaking destinations, curated travel packages, and exclusive tourism experiences with EliteRoutes_.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main id="main-content">
        <Hero />
        <AutoSlider />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
