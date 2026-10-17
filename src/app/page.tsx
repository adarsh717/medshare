import Link from "next/link";
import {
  Heart,
  Pill,
  Activity,
  Building2,
  ShieldCheck,
  Search,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { dataStore } from "@/lib/data/store";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function HomePage() {
  const { requests: bloodRequests } = await dataStore.getBloodRequests({ limit: 3 });
  const { resources: featuredResources } = await dataStore.getResources({ limit: 4 });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section - Restrained & Content-First */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Public Healthcare Assistance & Donor Coordination</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Responsible, community-driven healthcare assistance when it matters most.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              MedShare helps patients and caregivers discover verified healthcare resources, connect with voluntary blood donors, locate affordable medicine channels, and learn about lawful organ donation.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/blood">
                <Button variant="primary" size="md" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Find Blood Requests</span>
                </Button>
              </Link>
              <Link href="/blood/donate">
                <Button variant="outline" size="md" className="gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Register as Blood Donor</span>
                </Button>
              </Link>
              <Link href="/directory">
                <Button variant="ghost" size="md" className="gap-1.5 text-slate-700">
                  <Search className="h-4 w-4" />
                  <span>Search Healthcare Directory</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Blood Requests Highlight */}
      {bloodRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-red-200 bg-red-50/30 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-red-100 gap-2 mb-4">
              <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>Urgent Blood Requests Requiring Voluntary Donors</span>
              </div>
              <Link
                href="/blood"
                className="text-xs font-semibold text-red-800 hover:text-red-950 inline-flex items-center gap-1"
              >
                <span>View All Requests</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bloodRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-md p-4 space-y-2.5 shadow-none"
                >
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
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {req.bloodDetails?.hospitalName}, {req.city}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Component:</span>
                      <span className="font-medium capitalize">
                        {req.bloodDetails?.bloodComponent.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Units Needed:</span>
                      <span className="font-medium">{req.bloodDetails?.unitsNeeded} Unit(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Required Date:</span>
                      <span className="font-medium">
                        {formatDate(req.bloodDetails?.requiredDate || req.createdAt)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/blood/requests/${req.id}`} className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Request & Respond
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Assistance Pathways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assistance Modules & Healthcare Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Built for transparent community assistance without commercial incentives or illegal intermediaries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Blood Assistance */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-md bg-red-50 text-red-700 flex items-center justify-center border border-red-100">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Voluntary Blood Coordination</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Publish urgent blood requirements and match with voluntary, non-remunerated donors in your area. Protects donor contact details.
              </p>
            </div>
            <Link href="/blood" className="pt-2">
              <span className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Explore Blood Module <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Card 2: Medicine Navigation */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Lawful Medicine Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assistance locating affordable generic alternatives and Jan Aushadhi kendras. Strict prohibition on unregulated peer-to-peer drug redistribution.
              </p>
            </div>
            <Link href="/medicine" className="pt-2">
              <span className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Medicine Navigation <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Card 3: Medical Equipment & Expenses */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Equipment & Expense Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with verified volunteer groups for wheelchair loans, mobility equipment, and charitable healthcare expense guidance.
              </p>
            </div>
            <Link href="/assistance" className="pt-2">
              <span className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Support Requests <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Card 4: Organ Donation Awareness */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-9 w-9 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Organ Donation Awareness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Responsible education on living and deceased organ donation under THOA 1994, with direct links to NOTTO national registry.
              </p>
            </div>
            <Link href="/organ-donation" className="pt-2">
              <span className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1">
                Learn About Donation <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* How MedShare Works */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              How the Assistance Model Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Engineered with privacy protection, statutory compliance, and transparent request tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-2">
              <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-fit">
                Step 1
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Submit Request</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients or caregivers submit a structured request detailing required blood group, hospital, or medicine guidance.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-2">
              <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-fit">
                Step 2
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Safety & Privacy Screening</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Requests are validated against safety requirements. Sensitive medical documents and donor contact numbers remain shielded.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-2">
              <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-fit">
                Step 3
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Targeted Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nearby registered voluntary donors and verified providers receive in-app notifications and choose to respond voluntarily.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-md p-4 space-y-2">
              <div className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded w-fit">
                Step 4
              </div>
              <h4 className="text-sm font-semibold text-slate-900">Track & Resolve</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Both parties coordinate through consent-based channels. Status updates are recorded permanently with audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Healthcare Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Verified Healthcare Centers & Blood Banks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized government hospitals, blood banks, and subsidized dispensaries.
            </p>
          </div>
          <Link
            href="/directory"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{res.name}</h3>
                  <StatusBadge status="verified" variant="verification" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {res.address}, {res.city}, {res.state}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {res.servicesOffered.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                  {res.servicesOffered.length > 3 && (
                    <span className="text-[10px] text-slate-400 py-0.5">
                      +{res.servicesOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">{res.phone}</span>
                <span className="text-[11px] text-slate-400">{res.operationalHours}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Compliance Pledge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 bg-white rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-teal-50 text-teal-700 shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ethical & Responsible Healthcare Standard
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                MedShare does not engage in commercial transactions, private prescription drug sales, or unauthorized organ matchmaking. Blood donation must be voluntary, non-remunerated, and processed exclusively through licensed blood centers complying with the Drugs and Cosmetics Act.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
