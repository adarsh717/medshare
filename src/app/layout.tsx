import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/toast";
import { getCurrentUser } from "@/lib/auth/session";
import { dataStore } from "@/lib/data/store";

export const metadata: Metadata = {
  title: {
    template: "%s | MedShare Healthcare Assistance",
    default: "MedShare — Community Healthcare Assistance Platform",
  },
  description:
    "A community-driven healthcare support platform connecting patients with voluntary blood donors, authorized providers, affordable medicine navigation, and lawful organ donation awareness.",
  keywords: [
    "healthcare assistance",
    "voluntary blood donation",
    "blood donors India",
    "medicine assistance",
    "organ donation awareness NOTTO",
    "medical equipment lending",
    "healthcare resources directory",
  ],
  authors: [{ name: "MedShare Engineering Team" }],
  openGraph: {
    title: "MedShare — Community Healthcare Assistance Platform",
    description:
      "Connecting assistance requests with voluntary blood donors, verified healthcare providers, and lawful medical support channels.",
    siteName: "MedShare",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  let unreadCount = 0;

  if (currentUser) {
    const notifs = await dataStore.getUserNotifications(currentUser.id);
    unreadCount = notifs.filter((n) => !n.isRead).length;
  }

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-white text-slate-900 font-sans antialiased">
        <ToastProvider>
          <Navbar currentUser={currentUser} unreadCount={unreadCount} />
          <div className="flex-1">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
