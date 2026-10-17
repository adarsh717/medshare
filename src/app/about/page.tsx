import Link from "next/link";
import { ShieldCheck, HeartHandshake, FileCheck, AlertCircle, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us — Mission & Responsible Healthcare Model",
  description: "Learn about MedShare's mission, ethical assistance model, and statutory limitations.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="About MedShare"
        description="A community-driven healthcare support platform connecting patients and caregivers with voluntary donors and authorized healthcare resources."
        badge={
          <span className="bg-teal-50 text-teal-800 text-xs px-2.5 py-0.5 rounded border border-teal-200 font-semibold">
            Non-Commercial Initiative
          </span>
        }
      />

      {/* Mission Statement */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900">Our Mission</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Accessing timely healthcare assistance during medical crises is frequently fraught with misinformation, fragmented communication, and dangerous informal channels. MedShare was conceived to bridge this gap by establishing a disciplined, verified, and community-driven healthcare coordination platform.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          We operate on principles of strict legal compliance, voluntary non-remunerated support, and privacy preservation. We do not sell goods, trade medicines, or monetize patient vulnerability.
        </p>
      </section>

      {/* What MedShare Is vs What MedShare Is Not */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Understanding Our Scope & Boundaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* What We Are */}
          <div className="border border-emerald-200 bg-emerald-50/30 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>What MedShare Is</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>A coordination tool for voluntary, non-remunerated blood donors.</li>
              <li>A directory of authorized hospitals, blood banks, and subsidized pharmacies.</li>
              <li>A navigation service to help patients locate legitimate generic medicine programs.</li>
              <li>An educational platform promoting lawful organ donation awareness under THOA 1994.</li>
              <li>A transparent request tracking and status notification system.</li>
            </ul>
          </div>

          {/* What We Are NOT */}
          <div className="border border-red-200 bg-red-50/30 rounded p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>What MedShare Is NOT</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>Not an emergency dispatch or ambulance service (Call 112/108).</li>
              <li>Not a peer-to-peer marketplace for buying or selling prescription drugs.</li>
              <li>Not an organ procurement agency or direct donor-recipient matching service.</li>
              <li>Not a substitute for certified medical advice, clinical diagnosis, or prescriptions.</li>
              <li>Not a commercial fundraiser collecting unvetted financial contributions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Statutory Compliance */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900">Legal & Regulatory Alignment</h2>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Transplantation of Human Organs and Tissues Act (THOA) 1994:</strong> MedShare strictly prohibits any financial transaction or commercial negotiation relating to human organs. Any expression of interest submitted on this website is purely an awareness commitment; legal organ pledge and allocation are exclusively executed through the National Organ and Tissue Transplant Organization (NOTTO) under the Ministry of Health and Family Welfare.
          </p>
          <p>
            <strong>Drugs and Cosmetics Act, 1940 & Pharmacy Act:</strong> We do not facilitate any informal exchange or resale of pharmaceuticals. All medicine inquiries are directed toward licensed clinical dispensaries, Pradhan Mantri Bhartiya Janaushadhi Kendras, and legitimate hospital patient assistance cells.
          </p>
          <p>
            <strong>National Blood Transfusion Council (NBTC):</strong> Voluntary blood donation coordination does not replace mandatory laboratory screening (HIV, Hepatitis B & C, Syphilis, Malaria) performed exclusively by licensed blood centers prior to transfusion.
          </p>
        </div>
      </section>

      {/* Next Actions */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-6 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Ready to participate responsibly?</h4>
          <p className="text-xs text-slate-500">Discover assistance opportunities or register as a voluntary donor.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/blood/donate">
            <Button variant="primary" size="sm">
              Become a Blood Donor
            </Button>
          </Link>
          <Link href="/directory">
            <Button variant="outline" size="sm">
              Search Directory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
