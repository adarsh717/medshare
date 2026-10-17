import Link from "next/link";
import { Pill, ShieldAlert, CheckCircle, ExternalLink, ArrowRight, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Lawful Medicine Assistance & Generic Navigation",
  description: "Navigate affordable generic medicines, Janaushadhi Kendras, and hospital assistance programs legally.",
};

export default function MedicinePortalPage() {
  const authorizedChannels = [
    {
      name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
      type: "Government Generic Initiative",
      description:
        "Provides high-quality generic medicines at 50% to 90% lower prices compared to branded formulations across 10,000+ kendras nationwide.",
      link: "https://janaushadhi.gov.in",
      linkText: "Find Nearest Janaushadhi Kendra",
    },
    {
      name: "Tertiary Hospital Patient Assistance Cells",
      type: "Hospital Subsidy Programs",
      description:
        "Government and charitable cancer institutes (such as AIIMS and Tata Memorial) maintain dedicated patient welfare funds and subsidized oncology pharmacies.",
      link: "/directory?category=hospital",
      linkText: "View Hospital Resource Directory",
    },
    {
      name: "State Drug Assistance & Ayushman Bharat (PM-JAY)",
      type: "Health Insurance & Drug Benefit",
      description:
        "Empanelled hospitals provide secondary and tertiary hospitalization medicines covered up to Rs. 5 Lakhs per eligible family annually.",
      link: "https://pmjay.gov.in",
      linkText: "PM-JAY Portal",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Lawful Medicine Assistance & Navigation"
        description="Connect with authorized channels for affordable generic medicines and hospital subsidy assistance programs."
        badge={
          <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
            <Pill className="h-3.5 w-3.5" />
            Statutory Compliance
          </span>
        }
        action={
          <Link href="/medicine/request">
            <Button variant="primary" size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800 border-emerald-800">
              <span>Request Medicine Guidance</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {/* STRICT STATUTORY SAFETY BANNER */}
      <div className="border border-red-200 bg-red-50/40 rounded-lg p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
          <span>Strict Regulatory Prohibition on Peer-to-Peer Medicine Distribution</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Under the <strong>Drugs and Cosmetics Act, 1940</strong> and <strong>Pharmacy Act, 1948</strong>, the sale, exchange, transfer, or redistribution of prescription drugs by unlicensed individuals or peer-to-peer websites is strictly prohibited. Improperly stored, unsealed, or second-hand medicines present grave clinical risks of degradation and contamination.
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>MedShare does not operate an unregulated medicine marketplace.</strong> We do not hold physical drug stock or arrange direct medicine handovers. Our platform assists patients exclusively through referrals to licensed pharmacies, authorized government kendras, and verified hospital patient assistance schemes.
        </p>
      </div>

      {/* Legitimate Channels Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Authorized Channels for Affordable Medications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Reliable, legally recognized avenues to reduce chronic care and essential medicine expenses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {authorizedChannels.map((ch, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  {ch.type}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{ch.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <a
                  href={ch.link}
                  target={ch.link.startsWith("http") ? "_blank" : undefined}
                  rel={ch.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                >
                  <span>{ch.linkText}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How MedShare Assists Patients */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          How Our Medicine Assistance Workflow Operates
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5 p-3 rounded bg-slate-50 border border-slate-100">
            <strong className="text-slate-900 font-bold block">1. Prescription Verification</strong>
            <p className="text-slate-600 leading-relaxed">
              Applicants must confirm having an active, valid prescription from a registered medical practitioner (RMP). We cannot assist without a legitimate doctor’s order.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded bg-slate-50 border border-slate-100">
            <strong className="text-slate-900 font-bold block">2. Generic Formulation Search</strong>
            <p className="text-slate-600 leading-relaxed">
              Our coordinators locate corresponding affordable INN/generic formulations available at authorized government dispensaries in the patient’s district.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded bg-slate-50 border border-slate-100">
            <strong className="text-slate-900 font-bold block">3. Authorized Pharmacy Referral</strong>
            <p className="text-slate-600 leading-relaxed">
              The patient receives official contact details and stock coordination guidance for verified hospital pharmacies or subsidy trust offices.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Need personalized guidance for expensive specialty or oncology medication?
          </span>
          <Link href="/medicine/request">
            <Button variant="primary" size="sm">
              Submit Assistance Inquiry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
