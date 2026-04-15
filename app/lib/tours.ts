import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Tour = {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; desc: string }[];
  highlights: string[];
  mealPlan: string[];
  bestTimeToVisit: string;
  groupSize: string;
  departureCityOptions: string[];
  cancellationPolicy: string[];
  dateChangePolicy: string[];
  terms: string[];
  faqs: { q: string; a: string }[];
  stay: { hotelName: string; nights: string; roomType: string };
  createdAt?: Timestamp | null;
};

export function slugifyTourTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTourPathSlug(tour: Pick<Tour, "title" | "id" | "slug">): string {
  return tour.slug || slugifyTourTitle(tour.title) || tour.id;
}

export type CreateTourInput = {
  title: string;
  location: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  badge?: string;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: { day: number; title: string; desc: string }[];
  highlights?: string[];
  mealPlan?: string[];
  bestTimeToVisit?: string;
  groupSize?: string;
  departureCityOptions?: string[];
  cancellationPolicy?: string[];
  dateChangePolicy?: string[];
  terms?: string[];
  faqs?: { q: string; a: string }[];
  stay?: { hotelName: string; nights: string; roomType: string };
};

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === "string");
}

function normalizeTour(id: string, raw: Record<string, unknown>): Tour {
  const faqsRaw = Array.isArray(raw.faqs) ? raw.faqs : [];
  const normalizedFaqs = faqsRaw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        q: String(row.q || row.question || ""),
        a: String(row.a || row.answer || ""),
      };
    })
    .filter((item): item is { q: string; a: string } => Boolean(item && item.q && item.a));

  const stayRaw = raw.stay && typeof raw.stay === "object" ? (raw.stay as Record<string, unknown>) : {};

  return {
    id,
    slug: String(raw.slug || slugifyTourTitle(String(raw.title || "")) || id),
    title: String(raw.title || "Untitled Tour"),
    location: String(raw.location || "Unknown"),
    description: String(raw.description || ""),
    category: String(raw.category || "International"),
    duration: String(raw.duration || "0 Days"),
    price: Number(raw.price || 0),
    originalPrice: Number(raw.originalPrice || raw.price || 0),
    rating: Number(raw.rating || 4.8),
    reviews: Number(raw.reviews || 0),
    image: String(raw.image || ""),
    images: toStringArray(raw.images),
    badge: String(raw.badge || ""),
    inclusions: toStringArray(raw.inclusions),
    exclusions: toStringArray(raw.exclusions),
    itinerary: Array.isArray(raw.itinerary)
      ? raw.itinerary
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const row = item as Record<string, unknown>;
            return {
              day: Number(row.day || 1),
              title: String(row.title || "Day Plan"),
              desc: String(row.desc || row.description || ""),
            };
          })
          .filter(Boolean) as { day: number; title: string; desc: string }[]
      : [],
    highlights: toStringArray(raw.highlights),
    mealPlan: toStringArray(raw.mealPlan),
    bestTimeToVisit: String(raw.bestTimeToVisit || "Year-round"),
    groupSize: String(raw.groupSize || "2-12 Travelers"),
    departureCityOptions: toStringArray(raw.departureCityOptions),
    cancellationPolicy: toStringArray(raw.cancellationPolicy),
    dateChangePolicy: toStringArray(raw.dateChangePolicy),
    terms: toStringArray(raw.terms),
    faqs: normalizedFaqs,
    stay: {
      hotelName: String(stayRaw.hotelName || "Premium Hotel Collection"),
      nights: String(stayRaw.nights || "5 Nights"),
      roomType: String(stayRaw.roomType || "Deluxe Room"),
    },
    createdAt: raw.createdAt instanceof Timestamp ? raw.createdAt : null,
  };
}

export async function getAllTours(): Promise<Tour[]> {
  const q = query(collection(db, "tours"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) =>
    normalizeTour(docSnap.id, docSnap.data() as Record<string, unknown>)
  );
}

export async function getTourById(id: string): Promise<Tour | null> {
  const docRef = doc(db, "tours", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return normalizeTour(docSnap.id, docSnap.data() as Record<string, unknown>);
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const slugQuery = query(
    collection(db, "tours"),
    where("slug", "==", normalizedSlug),
    limit(1)
  );
  const slugSnapshot = await getDocs(slugQuery);
  if (!slugSnapshot.empty) {
    const first = slugSnapshot.docs[0];
    return normalizeTour(first.id, first.data() as Record<string, unknown>);
  }

  // Backward compatibility for existing documents without a slug field.
  const allTours = await getAllTours();
  return (
    allTours.find((tour) => tour.id === normalizedSlug || slugifyTourTitle(tour.title) === normalizedSlug) ||
    null
  );
}

export async function createTour(input: CreateTourInput): Promise<void> {
  const baseImage = input.image;
  await addDoc(collection(db, "tours"), {
    ...input,
    slug: slugifyTourTitle(input.title),
    images: input.images?.length ? input.images : [baseImage],
    badge: input.badge || "New",
    rating: 4.8,
    reviews: 0,
    inclusions: input.inclusions || [],
    exclusions: input.exclusions || [],
    itinerary: input.itinerary || [],
    highlights: input.highlights || [],
    mealPlan: input.mealPlan || [],
    bestTimeToVisit: input.bestTimeToVisit || "Year-round",
    groupSize: input.groupSize || "2-12 Travelers",
    departureCityOptions: input.departureCityOptions || [],
    cancellationPolicy: input.cancellationPolicy || [],
    dateChangePolicy: input.dateChangePolicy || [],
    terms: input.terms || [],
    faqs: input.faqs || [],
    stay: input.stay || {
      hotelName: "Premium Hotel Collection",
      nights: "5 Nights",
      roomType: "Deluxe Room",
    },
    createdAt: serverTimestamp(),
  });
}

export type UpdateTourInput = Partial<CreateTourInput> & {
  title?: string;
  location?: string;
  category?: string;
  duration?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
};

export async function updateTour(id: string, input: UpdateTourInput): Promise<void> {
  const docRef = doc(db, "tours", id);
  const payload: Record<string, unknown> = { ...input } as Record<string, unknown>;
  if (typeof input.title === "string" && input.title.trim()) {
    payload.slug = slugifyTourTitle(input.title);
  }
  await updateDoc(docRef, payload);
}

export async function deleteTour(id: string): Promise<void> {
  const docRef = doc(db, "tours", id);
  await deleteDoc(docRef);
}
