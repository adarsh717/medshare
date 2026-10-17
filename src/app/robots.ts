import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://medshare.org";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/services",
        "/directory",
        "/organ-donation",
        "/safety",
        "/privacy",
        "/terms",
        "/auth/login",
        "/auth/register",
      ],
      disallow: [
        "/dashboard/",
        "/api/",
        "/blood/requests/*", // Protect personal requisition details from public search crawlers
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
