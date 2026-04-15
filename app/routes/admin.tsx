import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/admin";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Loader2,
  PlusCircle,
  ListOrdered,
  RefreshCcw,
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Users,
  Settings,
  LifeBuoy,
  LogOut,
  Search,
  PackageCheck,
  Pencil,
  Trash2,
  X,
  Upload,
  Tag,
  IndianRupee,
} from "lucide-react";
import { createTour, deleteTour, getAllTours, updateTour, type Tour } from "../lib/tours";
import { storage } from "../lib/firebase";
import { adminSignIn, adminSignOut, isAdminUser, observeAdminAuth } from "../lib/admin-auth";

type SidebarSection = "dashboard" | "tours";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard | EliteRoutes_" },
    { name: "description", content: "Manage tour packages, pricing, itinerary content, and listings for EliteRoutes_." },
    { name: "robots", content: "noindex,nofollow" },
  ];
}

const initialForm = {
  title: "",
  location: "",
  description: "",
  category: "",
  duration: "",
  price: "",
  originalPrice: "",
  image: "",
  images: "",
  badge: "",
  highlights: "",
  inclusions: "",
  exclusions: "",
  itinerary: "",
  mealPlan: "",
  bestTimeToVisit: "",
  groupSize: "",
  departureCityOptions: "",
  cancellationPolicy: "",
  dateChangePolicy: "",
  terms: "",
  faqs: "",
  stayHotelName: "",
  stayNights: "",
  stayRoomType: "",
};

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseItinerary(value: string): { day: number; title: string; desc: string }[] {
  return parseLines(value).map((line, index) => {
    const [title, desc] = line.split("::");
    return {
      day: index + 1,
      title: title?.trim() || `Day ${index + 1}`,
      desc: desc?.trim() || "",
    };
  });
}

function parseFaqs(value: string): { q: string; a: string }[] {
  return parseLines(value)
    .map((line) => {
      const [q, a] = line.split("::");
      if (!q || !a) return null;
      return { q: q.trim(), a: a.trim() };
    })
    .filter((item): item is { q: string; a: string } => Boolean(item));
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<SidebarSection>("tours");
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [loadingTours, setLoadingTours] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [uploadingEditGallery, setUploadingEditGallery] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    originalPrice: "",
    image: "",
    images: "",
    badge: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    itinerary: "",
    mealPlan: "",
    bestTimeToVisit: "",
    groupSize: "",
    departureCityOptions: "",
    cancellationPolicy: "",
    dateChangePolicy: "",
    terms: "",
    faqs: "",
    stayHotelName: "",
    stayNights: "",
    stayRoomType: "",
  });

  async function loadTours() {
    setLoadingTours(true);
    try {
      const data = await getAllTours();
      setTours(data);
    } catch (error) {
      console.error("Error loading tours", error);
      setMessage("Failed to load tours from Firebase.");
    } finally {
      setLoadingTours(false);
    }
  }

  useEffect(() => {
    const unsubscribe = observeAdminAuth((user) => {
      const isAllowed = isAdminUser(user);
      setIsAuthenticated(isAllowed);
      setAuthLoading(false);
      if (!isAllowed) {
        setTours([]);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void loadTours();
    }
  }, [isAuthenticated]);

  const isFormValid = useMemo(() => {
    return (
      form.title.trim() &&
      form.location.trim() &&
      form.description.trim() &&
      form.duration.trim() &&
      form.image.trim() &&
      Number(form.price) > 0
    );
  }, [form]);

  const dashboardStats = useMemo(() => {
    const totalTours = tours.length;
    const avgPrice =
      totalTours > 0
        ? Math.round(tours.reduce((sum, tour) => sum + (tour.price || 0), 0) / totalTours)
        : 0;
    const categories = new Set(tours.map((tour) => tour.category).filter(Boolean)).size;
    const taggedTours = tours.filter((tour) => Boolean(tour.badge)).length;
    return { totalTours, avgPrice, categories, taggedTours };
  }, [tours]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid) return;

    setSaving(true);
    setMessage("");

    try {
      await createTour({
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        category: form.category.trim() || "International",
        duration: form.duration.trim(),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || form.price),
        image: form.image.trim(),
        images: parseLines(form.images),
        badge: form.badge.trim(),
        highlights: parseLines(form.highlights),
        inclusions: parseLines(form.inclusions),
        exclusions: parseLines(form.exclusions),
        itinerary: parseItinerary(form.itinerary),
        mealPlan: parseLines(form.mealPlan),
        bestTimeToVisit: form.bestTimeToVisit.trim(),
        groupSize: form.groupSize.trim(),
        departureCityOptions: parseLines(form.departureCityOptions),
        cancellationPolicy: parseLines(form.cancellationPolicy),
        dateChangePolicy: parseLines(form.dateChangePolicy),
        terms: parseLines(form.terms),
        faqs: parseFaqs(form.faqs),
        stay: {
          hotelName: form.stayHotelName.trim(),
          nights: form.stayNights.trim(),
          roomType: form.stayRoomType.trim(),
        },
      });

      setMessage("Tour added successfully.");
      setForm(initialForm);
      setIsAddModalOpen(false);
      await loadTours();
    } catch (error) {
      console.error("Failed to create tour", error);
      setMessage("Could not add tour. Check Firebase rules and try again.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(tour: Tour) {
    setEditingTourId(tour.id);
    setEditForm({
      title: tour.title,
      location: tour.location,
      description: tour.description,
      category: tour.category,
      duration: tour.duration,
      price: String(tour.price),
      originalPrice: String(tour.originalPrice),
      badge: tour.badge || "",
      image: tour.image || "",
      images: (tour.images || []).join("\n"),
      highlights: (tour.highlights || []).join("\n"),
      inclusions: (tour.inclusions || []).join("\n"),
      exclusions: (tour.exclusions || []).join("\n"),
      itinerary: (tour.itinerary || [])
        .map((day) => `${day.title}::${day.desc}`)
        .join("\n"),
      mealPlan: (tour.mealPlan || []).join("\n"),
      bestTimeToVisit: tour.bestTimeToVisit || "",
      groupSize: tour.groupSize || "",
      departureCityOptions: (tour.departureCityOptions || []).join("\n"),
      cancellationPolicy: (tour.cancellationPolicy || []).join("\n"),
      dateChangePolicy: (tour.dateChangePolicy || []).join("\n"),
      terms: (tour.terms || []).join("\n"),
      faqs: (tour.faqs || []).map((f) => `${f.q}::${f.a}`).join("\n"),
      stayHotelName: tour.stay?.hotelName || "",
      stayNights: tour.stay?.nights || "",
      stayRoomType: tour.stay?.roomType || "",
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setEditingTourId(null);
  }

  async function saveEdit() {
    if (!editingTourId) return;
    try {
      await updateTour(editingTourId, {
        title: editForm.title.trim(),
        location: editForm.location.trim(),
        category: editForm.category.trim(),
        duration: editForm.duration.trim(),
        price: Number(editForm.price || 0),
        originalPrice: Number(editForm.originalPrice || editForm.price || 0),
        badge: editForm.badge.trim(),
        image: editForm.image.trim(),
        images: parseLines(editForm.images),
        description: editForm.description.trim(),
        highlights: parseLines(editForm.highlights),
        inclusions: parseLines(editForm.inclusions),
        exclusions: parseLines(editForm.exclusions),
        itinerary: parseItinerary(editForm.itinerary),
        mealPlan: parseLines(editForm.mealPlan),
        bestTimeToVisit: editForm.bestTimeToVisit.trim(),
        groupSize: editForm.groupSize.trim(),
        departureCityOptions: parseLines(editForm.departureCityOptions),
        cancellationPolicy: parseLines(editForm.cancellationPolicy),
        dateChangePolicy: parseLines(editForm.dateChangePolicy),
        terms: parseLines(editForm.terms),
        faqs: parseFaqs(editForm.faqs),
        stay: {
          hotelName: editForm.stayHotelName.trim(),
          nights: editForm.stayNights.trim(),
          roomType: editForm.stayRoomType.trim(),
        },
      });
      setMessage("Tour updated successfully.");
      closeEditModal();
      await loadTours();
    } catch (error) {
      console.error("Failed to update tour", error);
      setMessage("Could not update tour.");
    }
  }

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await deleteTour(id);
      setMessage("Tour deleted successfully.");
      await loadTours();
    } catch (error) {
      console.error("Failed to delete tour", error);
      setMessage("Could not delete tour.");
    }
  }

  async function handlePrimaryImageUpload(file: File) {
    setUploadingImage(true);
    setMessage("");
    try {
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const storageRef = ref(storage, `tours/${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm((prev) => ({ ...prev, image: url }));
      setMessage("Image uploaded successfully and URL added.");
    } catch (error) {
      console.error("Image upload failed", error);
      setMessage("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleGalleryImageUpload(files: FileList) {
    setUploadingGallery(true);
    setMessage("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/\s+/g, "-")}`;
        const storageRef = ref(storage, `tours/gallery/${safeName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }
      setForm((prev) => {
        const existing = prev.images.trim();
        const appended = [...(existing ? [existing] : []), ...uploadedUrls].join("\n");
        return { ...prev, images: appended };
      });
      setMessage("Gallery images uploaded and added successfully.");
    } catch (error) {
      console.error("Gallery upload failed", error);
      setMessage("Gallery image upload failed. Please try again.");
    } finally {
      setUploadingGallery(false);
    }
  }

  async function handleEditPrimaryImageUpload(file: File) {
    setUploadingEditImage(true);
    setMessage("");
    try {
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const storageRef = ref(storage, `tours/${safeName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditForm((prev) => ({ ...prev, image: url }));
      setMessage("Edit image uploaded successfully.");
    } catch (error) {
      console.error("Edit image upload failed", error);
      setMessage("Edit image upload failed. Please try again.");
    } finally {
      setUploadingEditImage(false);
    }
  }

  async function handleEditGalleryImageUpload(files: FileList) {
    setUploadingEditGallery(true);
    setMessage("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/\s+/g, "-")}`;
        const storageRef = ref(storage, `tours/gallery/${safeName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }
      setEditForm((prev) => {
        const existing = prev.images.trim();
        const appended = [...(existing ? [existing] : []), ...uploadedUrls].join("\n");
        return { ...prev, images: appended };
      });
      setMessage("Edit gallery images uploaded successfully.");
    } catch (error) {
      console.error("Edit gallery upload failed", error);
      setMessage("Edit gallery image upload failed. Please try again.");
    } finally {
      setUploadingEditGallery(false);
    }
  }

  function handleRemoveEditPrimaryImage() {
    setEditForm((prev) => ({ ...prev, image: "" }));
    setMessage("Primary image removed from this tour draft.");
  }

  function handleRemoveEditGalleryImage(urlToRemove: string) {
    setEditForm((prev) => {
      const updated = parseLines(prev.images).filter((url) => url !== urlToRemove);
      return { ...prev, images: updated.join("\n") };
    });
    setMessage("Gallery image removed from this tour draft.");
  }

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("");
    setLoggingIn(true);
    try {
      await adminSignIn(loginEmail.trim(), loginPassword);
      setLoginPassword("");
    } catch (error) {
      console.error("Admin login failed", error);
      setAuthMessage("Login failed. Check credentials or admin access.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleAdminLogout() {
    setMessage("");
    setAuthMessage("");
    try {
      await adminSignOut();
    } catch (error) {
      console.error("Admin logout failed", error);
      setAuthMessage("Logout failed. Please refresh and try again.");
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-[#e9dde5] bg-white px-8 py-10 text-center shadow-sm">
          <Loader2 size={24} className="mx-auto mb-3 animate-spin text-[#46122d]" />
          <p className="text-sm text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e9dde5] bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-black text-[#46122d] mb-2">Admin Login</h1>
          <p className="text-sm text-gray-600 mb-5">Sign in to access the admin dashboard.</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="Admin email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            {authMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {authMessage}
              </div>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#46122d] hover:bg-[#5b2040] disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg"
            >
              {loggingIn ? <Loader2 size={18} className="animate-spin" /> : null}
              {loggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex">
      <aside className="hidden lg:flex w-72 border-r border-[#e9dde5] bg-white flex-col p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#46122d]">EliteRoutes_</h2>
          <p className="text-sm text-gray-500">Admin Workspace</p>
        </div>
        <nav className="space-y-2 text-sm">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              activeSection === "dashboard" ? "bg-[#46122d] text-white" : "text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d]"
            }`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("tours")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
              activeSection === "tours" ? "bg-[#46122d] text-white" : "text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d]"
            }`}
          >
            <Briefcase size={16} />
            Tours
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d] transition-colors">
            <BarChart3 size={16} />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d] transition-colors">
            <Users size={16} />
            Customers
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d] transition-colors">
            <Settings size={16} />
            Settings
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-600 hover:bg-[#f7f3f6] hover:text-[#46122d] transition-colors">
            <LifeBuoy size={16} />
            Help Desk
          </button>
        </nav>
        <button
          onClick={() => void handleAdminLogout()}
          className="mt-auto flex items-center gap-2 text-red-500 text-sm font-semibold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main id="main-content" className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#46122d]">
                {activeSection === "tours" ? "Tours Management" : "Dashboard"}
              </h1>
              <p className="text-gray-600">
                {activeSection === "tours"
                  ? "Manage tours, add new packages, edit and delete inventory."
                  : "Live operational summary from your actual tour data."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2 min-w-72">
                <Search size={16} className="text-gray-400" />
                <input className="outline-none text-sm w-full" placeholder="Search tours..." />
              </div>
              <Link to="/destinations" className="bg-[#46122d] text-white text-sm font-semibold rounded-xl px-4 py-2">
                View Frontend
              </Link>
            </div>
          </div>

          {message && (
            <div className="mb-4 rounded-lg border border-[#ddc8d5] bg-[#f7f3f6] text-[#46122d] px-4 py-3 text-sm">
              {message}
            </div>
          )}

          {activeSection === "dashboard" ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-[#e9dde5] p-5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">Total Tours</p>
                    <PackageCheck size={16} className="text-[#46122d]" />
                  </div>
                  <div className="text-2xl font-black text-[#46122d]">{dashboardStats.totalTours}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e9dde5] p-5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">Average Price</p>
                    <IndianRupee size={16} className="text-[#46122d]" />
                  </div>
                  <div className="text-2xl font-black text-[#46122d]">
                    {dashboardStats.avgPrice ? `₹${dashboardStats.avgPrice.toLocaleString("en-IN")}` : "—"}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e9dde5] p-5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">Categories</p>
                    <ListOrdered size={16} className="text-[#46122d]" />
                  </div>
                  <div className="text-2xl font-black text-[#46122d]">{dashboardStats.categories}</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#e9dde5] p-5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">Tagged Tours</p>
                    <Tag size={16} className="text-[#46122d]" />
                  </div>
                  <div className="text-2xl font-black text-[#46122d]">{dashboardStats.taggedTours}</div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tours</h2>
                {loadingTours ? (
                  <div className="py-10 text-center text-gray-500">
                    <Loader2 size={22} className="mx-auto mb-2 animate-spin text-[#46122d]" />
                    Loading tours...
                  </div>
                ) : tours.length === 0 ? (
                  <p className="text-gray-500">No tours available yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200 text-gray-500">
                          <th className="py-3">Title</th>
                          <th className="py-3">Category</th>
                          <th className="py-3">Location</th>
                          <th className="py-3">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tours.slice(0, 8).map((tour) => (
                          <tr key={tour.id} className="border-b border-gray-100">
                            <td className="py-3 font-semibold text-gray-900">{tour.title}</td>
                            <td className="py-3">{tour.category}</td>
                            <td className="py-3">{tour.location}</td>
                            <td className="py-3 text-[#46122d] font-bold">₹{tour.price.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Tour List ({tours.length})</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void loadTours()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#46122d] hover:underline"
                  >
                    <RefreshCcw size={15} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#46122d] text-white hover:bg-[#5b2040]"
                  >
                    <PlusCircle size={16} />
                    Add Tour
                  </button>
                </div>
              </div>

              {loadingTours ? (
                <div className="py-10 text-center text-gray-500">
                  <Loader2 size={22} className="mx-auto mb-2 animate-spin text-[#46122d]" />
                  Loading tours...
                </div>
              ) : tours.length === 0 ? (
                <p className="text-gray-500">No tours found yet. Add your first tour.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200 text-gray-500">
                        <th className="py-3">Tour</th>
                        <th className="py-3">Category</th>
                        <th className="py-3">Duration</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Badge</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tours.map((tour) => (
                        <tr key={tour.id} className="border-b border-gray-100">
                          <td className="py-3 font-semibold text-gray-900">{tour.title}</td>
                          <td className="py-3">{tour.category}</td>
                          <td className="py-3">{tour.duration}</td>
                          <td className="py-3 text-[#46122d] font-bold">₹{tour.price.toLocaleString("en-IN")}</td>
                          <td className="py-3">{tour.badge || "—"}</td>
                          <td className="py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEdit(tour)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#f7f3f6] text-[#46122d]"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => void handleDelete(tour.id, tour.title)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-red-50 text-red-600"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-[#e9dde5] p-6 md:p-8 my-6">
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-2xl font-black text-[#46122d]">Add Tour</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tour title" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.duration} onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))} placeholder="Duration (e.g. 6 Days / 5 Nights)" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} type="number" min={0} placeholder="Price" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.originalPrice} onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: e.target.value }))} type="number" min={0} placeholder="Original Price" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <input value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Primary image URL" className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
                  <label className={`inline-flex items-center gap-2 px-3 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap ${uploadingImage ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none" : "bg-[#f7f3f6] text-[#46122d] border-[#ddc8d5] hover:bg-[#efe3ea]"}`}>
                    {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {uploadingImage ? "Uploading" : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handlePrimaryImageUpload(file);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <input value={form.badge} onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))} placeholder="Badge (optional)" className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              </div>

              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Tour description" rows={4} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <textarea value={form.images} onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))} placeholder={"Gallery image URLs (one per line)"} rows={5} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
                  <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap ${uploadingGallery ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none" : "bg-[#f7f3f6] text-[#46122d] border-[#ddc8d5] hover:bg-[#efe3ea]"}`}>
                    {uploadingGallery ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {uploadingGallery ? "Uploading Gallery..." : "Upload Gallery Images"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) void handleGalleryImageUpload(files);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <textarea value={form.highlights} onChange={(e) => setForm((prev) => ({ ...prev, highlights: e.target.value }))} placeholder={"Highlights (one per line)"} rows={5} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={form.inclusions} onChange={(e) => setForm((prev) => ({ ...prev, inclusions: e.target.value }))} placeholder={"Inclusions (one per line)"} rows={5} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={form.exclusions} onChange={(e) => setForm((prev) => ({ ...prev, exclusions: e.target.value }))} placeholder={"Exclusions (one per line)"} rows={5} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <textarea
                value={form.itinerary}
                onChange={(e) => setForm((prev) => ({ ...prev, itinerary: e.target.value }))}
                placeholder={"Itinerary format:\nArrival & hotel check-in::Private transfer and evening leisure"}
                rows={5}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={form.mealPlan} onChange={(e) => setForm((prev) => ({ ...prev, mealPlan: e.target.value }))} placeholder={"Meal plan (one per line)"} rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={form.departureCityOptions} onChange={(e) => setForm((prev) => ({ ...prev, departureCityOptions: e.target.value }))} placeholder={"Departure cities (one per line)"} rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input value={form.bestTimeToVisit} onChange={(e) => setForm((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))} placeholder="Best time to visit" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.groupSize} onChange={(e) => setForm((prev) => ({ ...prev, groupSize: e.target.value }))} placeholder="Group size" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.stayHotelName} onChange={(e) => setForm((prev) => ({ ...prev, stayHotelName: e.target.value }))} placeholder="Hotel name" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input value={form.stayNights} onChange={(e) => setForm((prev) => ({ ...prev, stayNights: e.target.value }))} placeholder="Stay nights" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={form.stayRoomType} onChange={(e) => setForm((prev) => ({ ...prev, stayRoomType: e.target.value }))} placeholder="Room type" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={form.cancellationPolicy} onChange={(e) => setForm((prev) => ({ ...prev, cancellationPolicy: e.target.value }))} placeholder={"Cancellation policy (one per line)"} rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={form.dateChangePolicy} onChange={(e) => setForm((prev) => ({ ...prev, dateChangePolicy: e.target.value }))} placeholder={"Date change policy (one per line)"} rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>

              <textarea value={form.terms} onChange={(e) => setForm((prev) => ({ ...prev, terms: e.target.value }))} placeholder={"Terms (one per line)"} rows={3} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              <textarea value={form.faqs} onChange={(e) => setForm((prev) => ({ ...prev, faqs: e.target.value }))} placeholder={"FAQ format:\nIs visa included?::Yes"} rows={4} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />

              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
                  Cancel
                </button>
                <button type="submit" disabled={!isFormValid || saving} className="bg-[#46122d] hover:bg-[#5b2040] disabled:opacity-60 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                  Save Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-[#e9dde5] p-6 md:p-8 my-6">
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-2xl font-black text-[#46122d]">Edit Tour</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveEdit();
              }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <input value={editForm.title} onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tour title" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.location} onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="Location" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.category} onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))} placeholder="Category" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.duration} onChange={(e) => setEditForm((prev) => ({ ...prev, duration: e.target.value }))} placeholder="Duration" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="number" value={editForm.price} onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input type="number" value={editForm.originalPrice} onChange={(e) => setEditForm((prev) => ({ ...prev, originalPrice: e.target.value }))} placeholder="Original price" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={editForm.badge} onChange={(e) => setEditForm((prev) => ({ ...prev, badge: e.target.value }))} placeholder="Badge" className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Primary Image</p>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  {editForm.image ? (
                    <img
                      src={editForm.image}
                      alt="Primary tour preview"
                      className="w-full max-h-56 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
                      No image selected
                    </div>
                  )}
                </div>
                <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap ${uploadingEditImage ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none" : "bg-[#f7f3f6] text-[#46122d] border-[#ddc8d5] hover:bg-[#efe3ea]"}`}>
                  {uploadingEditImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploadingEditImage ? "Uploading..." : "Upload Primary Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleEditPrimaryImageUpload(file);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                {editForm.image && (
                  <button
                    type="button"
                    onClick={handleRemoveEditPrimaryImage}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                    Remove Primary Image
                  </button>
                )}
              </div>
              <textarea value={editForm.description} onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Tour description" rows={3} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Gallery Images</p>
                  {(() => {
                    const galleryImages = parseLines(editForm.images);
                    return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImages.slice(0, 6).map((url) => (
                      <div key={url} className="relative group">
                        <img
                          src={url}
                          alt="Gallery preview"
                          className="h-24 w-full rounded-lg border border-gray-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditGalleryImage(url)}
                          className="absolute top-1 right-1 hidden group-hover:inline-flex items-center justify-center rounded-full bg-black/70 text-white p-1 hover:bg-black"
                          aria-label="Remove gallery image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {galleryImages.length === 0 && (
                      <div className="col-span-full h-24 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
                        No gallery images
                      </div>
                    )}
                  </div>
                    );
                  })()}
                  <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold cursor-pointer whitespace-nowrap ${uploadingEditGallery ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none" : "bg-[#f7f3f6] text-[#46122d] border-[#ddc8d5] hover:bg-[#efe3ea]"}`}>
                    {uploadingEditGallery ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {uploadingEditGallery ? "Uploading Gallery..." : "Upload Gallery Images"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) void handleEditGalleryImageUpload(files);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
                <textarea value={editForm.highlights} onChange={(e) => setEditForm((prev) => ({ ...prev, highlights: e.target.value }))} placeholder="Highlights (one per line)" rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={editForm.inclusions} onChange={(e) => setEditForm((prev) => ({ ...prev, inclusions: e.target.value }))} placeholder="Inclusions (one per line)" rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={editForm.exclusions} onChange={(e) => setEditForm((prev) => ({ ...prev, exclusions: e.target.value }))} placeholder="Exclusions (one per line)" rows={4} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <textarea value={editForm.itinerary} onChange={(e) => setEditForm((prev) => ({ ...prev, itinerary: e.target.value }))} placeholder="Itinerary lines (title::description)" rows={4} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={editForm.mealPlan} onChange={(e) => setEditForm((prev) => ({ ...prev, mealPlan: e.target.value }))} placeholder="Meal plan (one per line)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={editForm.departureCityOptions} onChange={(e) => setEditForm((prev) => ({ ...prev, departureCityOptions: e.target.value }))} placeholder="Departure cities (one per line)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <input value={editForm.bestTimeToVisit} onChange={(e) => setEditForm((prev) => ({ ...prev, bestTimeToVisit: e.target.value }))} placeholder="Best time to visit" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.groupSize} onChange={(e) => setEditForm((prev) => ({ ...prev, groupSize: e.target.value }))} placeholder="Group size" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.stayHotelName} onChange={(e) => setEditForm((prev) => ({ ...prev, stayHotelName: e.target.value }))} placeholder="Hotel name" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input value={editForm.stayNights} onChange={(e) => setEditForm((prev) => ({ ...prev, stayNights: e.target.value }))} placeholder="Stay nights" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input value={editForm.stayRoomType} onChange={(e) => setEditForm((prev) => ({ ...prev, stayRoomType: e.target.value }))} placeholder="Room type" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <textarea value={editForm.cancellationPolicy} onChange={(e) => setEditForm((prev) => ({ ...prev, cancellationPolicy: e.target.value }))} placeholder="Cancellation policy (one per line)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3" />
                <textarea value={editForm.dateChangePolicy} onChange={(e) => setEditForm((prev) => ({ ...prev, dateChangePolicy: e.target.value }))} placeholder="Date change policy (one per line)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <textarea value={editForm.terms} onChange={(e) => setEditForm((prev) => ({ ...prev, terms: e.target.value }))} placeholder="Terms (one per line)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />
              <textarea value={editForm.faqs} onChange={(e) => setEditForm((prev) => ({ ...prev, faqs: e.target.value }))} placeholder="FAQ lines (question::answer)" rows={3} className="border border-gray-300 rounded-lg px-4 py-3 w-full" />

              <div className="flex items-center justify-end gap-2 mt-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
                  Cancel
                </button>
                <button type="submit" className="bg-[#46122d] hover:bg-[#5b2040] text-white font-bold px-6 py-2 rounded-lg inline-flex items-center gap-2">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
