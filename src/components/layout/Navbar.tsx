"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandshake,
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserProfile } from "@/types";

interface NavbarProps {
  currentUser?: UserProfile | null;
  unreadCount?: number;
}

export function Navbar({ currentUser, unreadCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const navLinks = [
    { href: "/blood", label: "Blood Requests" },
    { href: "/medicine", label: "Medicine Assistance" },
    { href: "/organ-donation", label: "Organ Donation" },
    { href: "/directory", label: "Healthcare Directory" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-none">
      {/* Top Emergency Advisory Bar */}
      <div className="bg-slate-900 text-slate-100 text-[11px] py-1 px-4 text-center font-medium">
        <span>Emergency Medical Assistance? Call National Emergency Helpline at </span>
        <strong className="text-white underline font-semibold">112</strong>
        <span> or Ambulance Services at </span>
        <strong className="text-white underline font-semibold">108</strong>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 focus:outline-none">
            <div className="h-8 w-8 rounded-md bg-teal-700 flex items-center justify-center text-white">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">MedShare</span>
              <span className="block text-[10px] text-teal-800 font-semibold tracking-wide uppercase -mt-1">
                Healthcare Support
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-900 bg-teal-50/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Action Items */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Notifications Link */}
                <Link
                  href="/dashboard/notifications"
                  className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  aria-label="View notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Dashboard Shortcut */}
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <LayoutDashboard className="h-3.5 w-3.5 text-teal-700" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
                    aria-expanded={userDropdownOpen}
                  >
                    <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="max-w-[110px] truncate">{currentUser.fullName}</span>
                    <StatusBadge status={currentUser.role} variant="role" className="text-[10px] py-0 px-1.5" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-md py-1 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 truncate">{currentUser.fullName}</p>
                        <p className="text-slate-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/requests"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                      >
                        <span>My Assistance Requests</span>
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          href="/dashboard/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-purple-700 font-medium hover:bg-purple-50"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && unreadCount > 0 && (
              <Link
                href="/dashboard/notifications"
                className="relative p-1.5 text-slate-600"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname.startsWith(link.href)
                  ? "bg-teal-50 text-teal-800 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-semibold text-slate-800">{currentUser.fullName}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-teal-700 font-medium hover:bg-slate-50 rounded"
                >
                  Dashboard
                </Link>
                {currentUser.role === "admin" && (
                  <Link
                    href="/dashboard/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50 rounded"
                  >
                    Admin Control Center
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
