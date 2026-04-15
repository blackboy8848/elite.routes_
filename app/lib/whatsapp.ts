import type { Tour } from "./tours";
import { getTourPathSlug } from "./tours";

type BookingWhatsAppOptions = {
  guests?: number;
  travelDate?: string;
  departureCity?: string;
  roomType?: string;
};

const DEFAULT_COUNTRY_CODE_NUMBER = "919999999999";

function getWhatsappNumber(): string {
  const raw = String(import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_COUNTRY_CODE_NUMBER);
  return raw.replace(/[^\d]/g, "");
}

export function buildTourWhatsAppUrl(
  tour: Pick<Tour, "id" | "slug" | "title" | "location" | "duration" | "price">,
  options: BookingWhatsAppOptions = {}
): string {
  const guests = options.guests || 2;
  const baseUrl = String(import.meta.env.VITE_SITE_URL || "https://eliteroutes.com").replace(/\/+$/, "");
  const tourUrl = `${baseUrl}/destinations/${getTourPathSlug(tour)}`;
  const total = tour.price * guests;

  const lines = [
    "Hello EliteRoutes, I want to book this tour:",
    `Tour: ${tour.title}`,
    `Location: ${tour.location}`,
    `Duration: ${tour.duration}`,
    `Price per person: INR ${tour.price.toLocaleString("en-IN")}`,
    `Guests: ${guests}`,
    `Total price: INR ${total.toLocaleString("en-IN")}`,
    `Travel date: ${options.travelDate || "Not selected"}`,
    `Departure city: ${options.departureCity || "Not selected"}`,
    `Room type: ${options.roomType || "Not selected"}`,
    `Tour link: ${tourUrl}`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${getWhatsappNumber()}?text=${message}`;
}
