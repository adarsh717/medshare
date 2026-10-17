import { ShieldCheck, Heart, Pill, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Safety & Verification Guidelines",
  description: "Medical safety protocols, donor eligibility guidelines, and verification standards.",
};

export default function SafetyGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Medical Safety & Verification Guidelines"
        description="Our clinical protocols, mandatory donor screening requirements, and prescription safety measures."
        badge={
          <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200 font-semibold inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Safety First
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
        {/* Blood Safety */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
            <Heart className="h-4 w-4" />
            <span>Blood Donation Safety Protocols</span>
          </div>
          <p>
            Under National Blood Transfusion Council (NBTC) regulations:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Donors must be between 18 and 65 years of age with a minimum weight of 45 kg.</li>
            <li>Hemoglobin must be &ge; 12.5 g/dl, verified by hemoglobinometer before phlebotomy.</li>
            <li>Donations must be separated by at least 90 days for whole blood donations.</li>
            <li>Every unit is tested for Transfusion Transmissible Infections (TTIs): HIV 1 & 2, Hepatitis B (HBsAg), Hepatitis C (HCV), Syphilis (VDRL), and Malaria.</li>
            <li>All phlebotomies use single-use, sterile, pyrogen-free collection blood bags.</li>
          </ul>
        </div>

        {/* Medicine Safety */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Pill className="h-4 w-4" />
            <span>Prescription & Drug Dispensing Safety</span>
          </div>
          <p>
            To prevent severe medication errors and toxic contamination:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>Medicines must only be dispensed by a registered pharmacist against a valid doctor’s prescription.</li>
            <li>Cold-chain medications (such as Insulin, monoclonal antibodies, and biologics) must maintain uninterrupted 2&deg;C - 8&deg;C storage. Informal handover destroys drug efficacy.</li>
            <li>Never accept unsealed, damaged, expired, or repackaged tablets.</li>
            <li>Always check batch numbers and expiry dates printed on the original manufacturer blister or vial.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
