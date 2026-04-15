import type { Route } from "./+types/journeys";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import AutoSlider from "../components/AutoSlider";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Journeys | EliteRoutes_" },
    {
      name: "description",
      content: "Explore EliteRoutes_ travel services, curated journey styles, and immersive destination experiences.",
    },
  ];
}

export default function JourneysPage() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main id="main-content" className="pt-12">
        <Services />
        <AutoSlider />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
