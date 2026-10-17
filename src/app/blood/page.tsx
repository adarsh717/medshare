"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  PlusCircle,
  UserCheck,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { AssistanceRequest, BloodGroup } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BloodPortalPage() {
  const [requests, setRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = React.useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = React.useState<string>("all");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");

  const bloodGroups: (BloodGroup | "all")[] = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = ["all", "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Chandigarh", "Gurugram"];

  const fetchBloodRequests = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBloodGroup !== "all") params.append("bloodGroup", selectedBloodGroup);
      if (selectedUrgency !== "all") params.append("urgency", selectedUrgency);
      if (selectedCity !== "all") params.append("city", selectedCity);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/blood/requests?${params.toString()}`);
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedBloodGroup, selectedUrgency, selectedCity, search]);

  React.useEffect(() => {
    fetchBloodRequests();
  }, [fetchBloodRequests]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Voluntary Blood Assistance Portal"
        description="Search active patient blood requirements and coordinate voluntary, non-remunerated donations directly through licensed hospital blood banks."
        badge={
          <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded border border-red-200 font-semibold inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Voluntary Donations
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <Link href="/blood/request">
              <Button variant="primary" size="sm" className="gap-1.5 bg-red-700 hover:bg-red-800 border-red-800">
                <PlusCircle className="h-4 w-4" />
                <span>Create Blood Request</span>
              </Button>
            </Link>
            <Link href="/blood/donate">
              <Button variant="outline" size="sm" className="gap-1.5">
                <UserCheck className="h-4 w-4" />
                <span>Register as Donor</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Safety Notice Capsule */}
      <div className="border border-slate-200 bg-slate-50/70 rounded-md p-3 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Responsible Donation Policy:</strong> Blood donation must always be completely voluntary and non-remunerated in compliance with the Supreme Court of India ruling (1996) and National Blood Transfusion Council regulations. Commercial blood collection or paying donors is illegal.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={fetchBloodRequests}
              placeholder="Search by hospital name, patient name, or locality..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white font-medium"
            >
              <option value="all">All Blood Groups</option>
              {bloodGroups
                .filter((g) => g !== "all")
                .map((bg) => (
                  <option key={bg} value={bg}>
                    Blood Group {bg}
                  </option>
                ))}
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
            >
              <option value="all">All Urgency Levels</option>
              <option value="critical">Critical Urgency</option>
              <option value="urgent">Urgent</option>
              <option value="standard">Standard Priority</option>
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
                setSelectedBloodGroup("all");
                setSelectedUrgency("all");
                setSelectedCity("all");
              }}
              className="h-9 text-xs"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="font-semibold text-slate-800">{requests.length}</strong> active blood assistance requests
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
          title="No Active Blood Requests"
          description="There are currently no open blood requests matching your search or filter parameters."
          actionLabel="Post a Blood Request"
          onAction={() => (window.location.href = "/blood/request")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge
                    status={req.bloodDetails?.bloodGroup || "O+"}
                    variant="blood"
                    className="text-sm px-2.5 py-0.5"
                  />
                  <StatusBadge status={req.priority} variant="priority" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{req.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">
                      {req.bloodDetails?.hospitalName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {req.city}, {req.state}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded p-2.5 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Component:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {req.bloodDetails?.bloodComponent.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Units Needed:</span>
                    <span className="font-semibold text-slate-800">
                      {req.bloodDetails?.unitsNeeded} Unit(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Required Date:</span>
                    <span className="font-medium text-slate-700">
                      {formatDate(req.bloodDetails?.requiredDate || req.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={req.status} variant="status" />
                <Link href={`/blood/requests/${req.id}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <span>View & Respond</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
