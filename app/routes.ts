import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("destinations", "routes/destinations.tsx"),
  route("destinations/:id", "routes/tour-detail.tsx"),
  route("about-us", "routes/about-us.tsx"),
  route("journeys", "routes/journeys.tsx"),
  route("contact-us", "routes/contact-us.tsx"),
  route("faq", "routes/faq.tsx"),
  route("admin", "routes/admin.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-service", "routes/terms-of-service.tsx"),
] satisfies RouteConfig;
