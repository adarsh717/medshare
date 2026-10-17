import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://medshare.org";
  const now = new Date();

  const publicRoutes = [
    "",
    "/about",
    "/services",
    "/directory",
    "/blood",
    "/blood/donate",
    "/medicine",
    "/organ-donation",
    "/assistance",
    "/privacy",
    "/terms",
    "/safety",
    "/auth/login",
    "/auth/register",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/blood" || route === "/directory" ? "hourly" : "weekly",
    priority: route === "" ? 1.0 : route === "/blood" || route === "/directory" ? 0.9 : 0.7,
  }));
}
