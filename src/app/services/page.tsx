import Link from "next/link";
import { Heart, Pill, Activity, FileText, Building2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Healthcare Services & Assistance Pathways",
  description: "Browse MedShare's dedicated healthcare assistance services and workflows.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Voluntary Blood Assistance",
      category: "Critical Care Support",
      icon: Heart,
      color: "text-red-700 bg-red-50 border-red-200",
      description:
        "Emergency and routine blood request coordination. Directly links hospitalized patients with nearby voluntary, non-remunerated donors based on blood group compatibility.",
      actions: [
        { label: "Create Blood Request", href: "/blood/request", primary: true },
        { label: "Browse Active Requests", href: "/blood", primary: false },
        { label: "Register as Donor", href: "/blood/donate", primary: false },
      ],
      safetyNote: "All donor testing and blood unit separation are handled exclusively by licensed blood banks.",
    },
    {
      title: "Lawful Medicine Assistance Navigation",
      category: "Pharmacy Guidance",
      icon: Pill,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      description:
        "Guidance for patients seeking affordable generic medications, oncology subsidies, and access to Pradhan Mantri Bhartiya Janaushadhi Kendras.",
      actions: [
        { label: "Request Medicine Guidance", href: "/medicine/request", primary: true },
        { label: "View Medicine Policy", href: "/medicine", primary: false },
      ],
      safetyNote: "Peer-to-peer medicine distribution or resale is strictly prohibited by law.",
    },
    {
      title: "Medical & Equipment Assistance",
      category: "Patient Support",
      icon: Activity,
      color: "text-blue-700 bg-blue-50 border-blue-200",
      description:
        "Support for wheelchair loans, crutches, hospital bed lending, and connections to charitable healthcare expense organizations.",
      actions: [
        { label: "Request Equipment or Expense Support", href: "/assistance/request", primary: true },
        { label: "Browse Healthcare Needs", href: "/assistance", primary: false },
      ],
      safetyNote: "All equipment must undergo sanitized safety checks prior to transfer.",
    },
    {
      title: "Organ Donation Awareness & Education",
      category: "Statutory Awareness",
      icon: FileText,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      description:
        "Authoritative education on living and deceased organ donation under THOA 1994. Includes links to NOTTO national registry and voluntary awareness pledge forms.",
      actions: [
        { label: "Learn About Organ Donation", href: "/organ-donation", primary: true },
        { label: "Submit Awareness Pledge", href: "/organ-donation#pledge", primary: false },
      ],
      safetyNote: "Commercial organ trade is a punishable criminal offense. MedShare does not match organ recipients.",
    },
    {
      title: "Authorized Healthcare Provider Directory",
      category: "Facility Directory",
      icon: Building2,
      color: "text-teal-700 bg-teal-50 border-teal-200",
      description:
        "Curated database of verified tertiary hospitals, 24x7 blood banks, subsidized dispensaries, and transplant coordination centers across India.",
      actions: [
        { label: "Explore Directory", href: "/directory", primary: true },
      ],
      safetyNote: "Provider records are verified against state clinical establishment licensing registers.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Assistance Pathways & Services"
        description="Explore MedShare's lawful, community-driven healthcare coordination modules."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-md border ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>

                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[11px] text-slate-600">
                  <strong className="font-semibold text-slate-800">Compliance standard: </strong>
                  {s.safetyNote}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-100">
                {s.actions.map((act, aIdx) => (
                  <Link key={aIdx} href={act.href}>
                    <Button
                      variant={act.primary ? "primary" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {act.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
