"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  PlusCircle,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { AssistanceRequest } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AssistancePortalPage() {
  const [requests, setRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");

  const cities = ["all", "Gorakhpur", "Lucknow", "Varanasi", "New Delhi", "Mumbai", "Bengaluru"];

  const fetchRequests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedCity !== "all") params.append("city", selectedCity);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/requests?${params.toString()}`);
      const data = await res.json();
      if (data.requests) {
        // Exclude blood requests here (handled in dedicated blood module)
        setRequests(data.requests.filter((r: AssistanceRequest) => r.category !== "blood"));
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedStatus, selectedCity, search]);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Medical & Equipment Assistance"
        description="Community assistance requests for wheelchair loans, mobility aids, hospital equipment, and charitable healthcare expense navigation."
        badge={
          <span className="bg-sky-50 text-sky-800 text-xs px-2.5 py-0.5 rounded border border-sky-200 font-semibold inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5 text-sky-600" />
            Medical & Mobility Assistance
          </span>
        }
        action={
          <Link href="/assistance/request">
            <Button variant="primary" size="sm" className="gap-1.5 bg-sky-600 hover:bg-sky-700 border-sky-600 text-white shadow-2xs">
              <PlusCircle className="h-4 w-4" />
              <span>Submit Assistance Request</span>
            </Button>
          </Link>
        }
      />

      {/* Financial Guidelines Notice */}
      <div className="border border-slate-200 bg-slate-50 rounded-md p-3 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Commercial Policy:</strong> MedShare facilitates connections with registered charitable trusts and hospital welfare programs. We do not collect money or operate speculative crowdfunding campaigns directly on the platform.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={fetchRequests}
              placeholder="Search by equipment type, description, or locality..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="equipment">Mobility & Medical Equipment</option>
              <option value="financial">Medical Expense Guidance</option>
              <option value="general">General Healthcare Support</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="matched">Matched</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white font-medium"
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
                setSelectedStatus("all");
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
          Showing <strong className="font-semibold text-slate-800">{requests.length}</strong> assistance requests
        </span>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No Assistance Requests Found"
          description="There are currently no open support requests matching your filter criteria."
          actionLabel="Submit a Support Request"
          onAction={() => (window.location.href = "/assistance/request")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    {req.category}
                  </span>
                  <StatusBadge status={req.priority} variant="priority" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{req.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {req.city}, {req.state}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={req.status} variant="status" />
                <span className="text-[11px] text-slate-400">{formatDate(req.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
