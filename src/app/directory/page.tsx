"use client";

import * as React from "react";
import {
  Building2,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { HealthcareResource, ResourceCategory } from "@/types";

export default function DirectoryPage() {
  const [resources, setResources] = React.useState<HealthcareResource[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "hospital", label: "Hospitals" },
    { value: "blood_bank", label: "Blood Banks" },
    { value: "authorized_pharmacy", label: "Subsidized Pharmacies" },
    { value: "transplant_center", label: "Transplant Hubs" },
    { value: "community_clinic", label: "Community Clinics" },
  ];

  const cities = ["all", "Gorakhpur", "Lucknow", "Varanasi", "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Chandigarh", "Gurugram"];

  const fetchResources = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedCity !== "all") params.append("city", selectedCity);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      if (data.resources) {
        setResources(data.resources);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedCity, search]);

  React.useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Authorized Healthcare Resource Directory"
        description="Search verified hospitals, 24x7 blood banks, subsidized generic dispensaries (Janaushadhi), and authorized transplant centers."
        badge={
          <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Records Only
          </span>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-none">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={fetchResources}
              placeholder="Search by facility name, address, or specialized services..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
            >
              <option value="all">All Cities</option>
              {cities
                .filter((c) => c !== "all")
                .map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setSelectedCity("all");
              }}
              className="h-9 text-xs"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="font-semibold text-slate-800">{resources.length}</strong> verified healthcare resources
        </span>
      </div>

      {/* Resource Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          title="No Healthcare Resources Found"
          description="No verified healthcare facilities match your current filter criteria. Try adjusting the category, city, or search terms."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setSelectedCategory("all");
            setSelectedCity("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        {res.address}, {res.city}, {res.state} {res.pincode ? `- ${res.pincode}` : ""}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status="verified" variant="verification" />
                </div>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {res.servicesOffered.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Hours */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                  <Clock className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                  <span className="font-medium">{res.operationalHours}</span>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${res.phone}`}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>{res.phone}</span>
                  </a>

                  {res.email && (
                    <a
                      href={`mailto:${res.email}`}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[140px]">{res.email}</span>
                    </a>
                  )}
                </div>

                {res.websiteUrl && (
                  <a
                    href={res.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-teal-700"
                  >
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
