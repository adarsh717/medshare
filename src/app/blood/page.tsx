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
  Users,
  CheckCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { AssistanceRequest, BloodGroup, DonorProfile } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BloodPortalPage() {
  const [activeTab, setActiveTab] = React.useState<"requests" | "donors">("requests");

  // Requests state
  const [requests, setRequests] = React.useState<AssistanceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = React.useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = React.useState<string>("all");
  const [selectedCity, setSelectedCity] = React.useState<string>("all");

  // Donors state
  const [donors, setDonors] = React.useState<DonorProfile[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = React.useState(true);
  const [selectedDonorBloodGroup, setSelectedDonorBloodGroup] = React.useState<string>("all");
  const [selectedDonorAvailability, setSelectedDonorAvailability] = React.useState<string>("all");
  const [selectedDonorCity, setSelectedDonorCity] = React.useState<string>("all");
  const [donorSearch, setDonorSearch] = React.useState("");

  const bloodGroups: (BloodGroup | "all")[] = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const cities = ["all", "Gorakhpur", "Lucknow", "Varanasi", "New Delhi", "Mumbai", "Bengaluru", "Chennai", "Chandigarh", "Gurugram"];

  const fetchBloodRequests = React.useCallback(async () => {
    setIsLoadingRequests(true);
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
      setIsLoadingRequests(false);
    }
  }, [selectedBloodGroup, selectedUrgency, selectedCity, search]);

  const fetchDonors = React.useCallback(async () => {
    setIsLoadingDonors(true);
    try {
      const params = new URLSearchParams();
      if (selectedDonorBloodGroup !== "all") params.append("bloodGroup", selectedDonorBloodGroup);
      if (selectedDonorAvailability !== "all") params.append("availability", selectedDonorAvailability);
      if (selectedDonorCity !== "all") params.append("city", selectedDonorCity);

      const res = await fetch(`/api/blood/donors?${params.toString()}`);
      const data = await res.json();
      if (data.donors) {
        setDonors(data.donors);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingDonors(false);
    }
  }, [selectedDonorBloodGroup, selectedDonorAvailability, selectedDonorCity]);

  React.useEffect(() => {
    fetchBloodRequests();
  }, [fetchBloodRequests]);

  React.useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const filteredDonors = donors.filter((d) => {
    if (!donorSearch.trim()) return true;
    const q = donorSearch.toLowerCase();
    return (
      (d.donorName && d.donorName.toLowerCase().includes(q)) ||
      (d.locality && d.locality.toLowerCase().includes(q)) ||
      d.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Voluntary Blood Assistance Portal"
        description="Search emergency patient blood requisitions and connect directly with verified voluntary donors across all blood groups in licensed hospital blood banks."
        badge={
          <span className="bg-red-50 text-red-800 text-xs px-2.5 py-0.5 rounded border border-red-200 font-semibold inline-flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            Voluntary & Non-Remunerated
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/blood/request">
              <Button variant="primary" size="sm" className="gap-1.5 bg-red-700 hover:bg-red-800 border-red-800 shadow-sm">
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
      <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Responsible Donation Policy:</strong> Blood donation must always be completely voluntary and non-remunerated in compliance with the Supreme Court of India ruling (1996) and National Blood Transfusion Council regulations. Commercial blood collection or paying donors is strictly illegal.
        </p>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === "requests"
              ? "border-red-700 text-red-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="h-4 w-4 text-red-600" />
          <span>🚨 Emergency Blood Requisitions (रक्त आवश्यकताएं)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("donors")}
          className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
            activeTab === "donors"
              ? "border-red-700 text-red-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="h-4 w-4 text-teal-700" />
          <span>🩸 Voluntary Donors Directory (सभी रक्त समूह दाता)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
            {donors.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BLOOD REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  onSubmit={fetchBloodRequests}
                  placeholder="Search by hospital name, patient name, or locality (e.g. BRD, AIIMS, Golghar)..."
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
              Showing <strong className="font-semibold text-slate-800">{requests.length}</strong> active emergency blood requisitions
            </span>
          </div>

          {/* Requests Grid */}
          {isLoadingRequests ? (
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
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <StatusBadge
                        status={req.bloodDetails?.bloodGroup || "O+"}
                        variant="blood"
                        className="text-sm font-bold px-2.5 py-1"
                      />
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge
                          status={req.bloodDetails?.urgencyLevel || req.priority}
                          variant="priority"
                        />
                        <StatusBadge status={req.status} variant="status" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{req.title}</h3>

                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{req.bloodDetails?.hospitalName || "Hospital"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {req.locality ? `${req.locality}, ` : ""}
                          {req.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {req.bloodDetails?.unitsNeeded || 1} Unit(s) &bull;{" "}
                          <span className="capitalize">
                            {req.bloodDetails?.bloodComponent.replace(/_/g, " ") || "Whole Blood"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(req.createdAt)}</span>
                    </div>

                    <Link href={`/blood/requests/${req.id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1 border-slate-300">
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VOLUNTARY DONORS DIRECTORY */}
      {activeTab === "donors" && (
        <div className="space-y-4">
          {/* Donors Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <SearchBar
                  value={donorSearch}
                  onChange={setDonorSearch}
                  placeholder="Search donors by name, locality (e.g. Golghar, Asuran, Kunraghat)..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedDonorBloodGroup}
                  onChange={(e) => setSelectedDonorBloodGroup(e.target.value)}
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
                  value={selectedDonorAvailability}
                  onChange={(e) => setSelectedDonorAvailability(e.target.value)}
                  className="h-9 px-3 rounded-md border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white font-medium"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available to Donate</option>
                  <option value="busy">Temporarily Busy</option>
                  <option value="temporarily_unavailable">Under Recovery Period</option>
                </select>

                <select
                  value={selectedDonorCity}
                  onChange={(e) => setSelectedDonorCity(e.target.value)}
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
                    setDonorSearch("");
                    setSelectedDonorBloodGroup("all");
                    setSelectedDonorAvailability("all");
                    setSelectedDonorCity("all");
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
              Showing <strong className="font-semibold text-slate-800">{filteredDonors.length}</strong> voluntary blood donors across all blood groups
            </span>
          </div>

          {/* Donors Grid */}
          {isLoadingDonors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredDonors.length === 0 ? (
            <EmptyState
              title="No Voluntary Donors Found"
              description="No registered donors matched the selected blood group and city filters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSelectedDonorBloodGroup("all");
                setSelectedDonorAvailability("all");
                setSelectedDonorCity("all");
                setDonorSearch("");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900">{donor.donorName || "Voluntary Donor"}</h3>
                          <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            {donor.locality ? `${donor.locality}, ` : ""}{donor.city}
                          </span>
                        </p>
                      </div>

                      <div className="text-center shrink-0 bg-red-50 border border-red-200 rounded-lg px-3 py-1">
                        <span className="text-base font-extrabold text-red-700 block">
                          {donor.bloodGroup}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-red-600 font-semibold block">
                          Blood Group
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <StatusBadge status={donor.availabilityStatus} variant="status" />
                      {donor.lastDonationDate && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>Last: {formatDate(donor.lastDonationDate)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      In-App Safe Match
                    </span>
                    <Link href={`/blood/request?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&city=${encodeURIComponent(donor.city)}`}>
                      <Button variant="outline" size="sm" className="text-xs text-teal-800 hover:text-teal-900 border-teal-200">
                        <span>Request Match</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
