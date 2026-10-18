"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Heart,
  Building2,
  Bell,
  Settings,
  ShieldAlert,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { UserProfile } from "@/types";
import { StatusBadge } from "@/components/ui/status-badge";

interface DashboardLayoutProps {
  currentUser: UserProfile;
  unreadCount?: number;
  children: React.ReactNode;
}

export function DashboardLayout({
  currentUser,
  unreadCount = 0,
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Requests & Claims",
      href: "/dashboard/requests",
      icon: FileText,
    },
    {
      label: "Donor Profile",
      href: "/dashboard/donor",
      icon: Heart,
    },
    ...(currentUser.role === "provider" || currentUser.role === "admin"
      ? [
          {
            label: "Provider Management",
            href: "/dashboard/provider",
            icon: Building2,
          },
        ]
      : []),
    {
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Account Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    ...(currentUser.role === "admin"
      ? [
          {
            label: "Admin Moderation",
            href: "/dashboard/admin",
            icon: ShieldAlert,
            highlight: true,
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-none">
            {/* User Info Capsule */}
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {currentUser.fullName}
                </span>
                <StatusBadge status={currentUser.role} variant="role" className="text-[10px] py-0 px-1.5" />
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{currentUser.email}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {currentUser.city}, {currentUser.state}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                New Action
              </span>
              <Link
                href="/blood/request"
                className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create Blood Request</span>
              </Link>
              <Link
                href="/assistance/request"
                className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Request Medical Support</span>
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                Navigation
              </span>
              {navigationItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                      isActive
                        ? "bg-teal-50 text-teal-900 font-semibold border-l-2 border-teal-700"
                        : item.highlight
                        ? "text-purple-700 hover:bg-purple-50 font-medium"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-red-600 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Help & Helpline */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <HelpCircle className="h-3.5 w-3.5 text-teal-700" />
                <span>Assistance Helpline</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Need urgent blood coordinator support? Call 1800-11-4770 (Toll Free).
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
