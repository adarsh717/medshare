import { ShieldCheck, Lock, EyeOff, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Privacy Policy & Healthcare Data Protection",
  description: "MedShare's commitment to patient confidentiality, data minimization, and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Privacy Policy & Healthcare Data Rights"
        description="We treat all healthcare and contact data as sensitive. Learn how MedShare safeguards patient confidentiality."
        badge={
          <span className="bg-teal-50 text-teal-800 text-xs px-2.5 py-0.5 rounded border border-teal-200 font-semibold inline-flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Data Protection
          </span>
        }
      />

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Principle of Data Minimization</h2>
          <p>
            MedShare strictly limits the collection of personal and healthcare data to what is directly necessary to coordinate assistance. We do not store sensitive government identity cards (such as Aadhaar numbers), exhaustive electronic health records (EHRs), or private bank account credentials on our public servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Blood Donor Contact Confidentiality</h2>
          <p>
            Voluntary blood donor phone numbers and email addresses are never published in public directories or exposed to web scrapers. When a donor registers, their contact details remain shielded. Matching donors receive in-app notifications and choose voluntarily whether to respond to a patient requisition.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. Lawful Purpose & No Monetization of Data</h2>
          <p>
            MedShare is a non-commercial healthcare platform. We do not sell, rent, monetize, or disclose user data to pharmaceutical advertisers, insurance companies, or third-party marketing brokers. User information is processed solely for coordinating legitimate medical assistance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. User Rights & Consent Withdrawal</h2>
          <p>
            Users have the complete right to update their profiles, modify voluntary donor availability (e.g. toggle status to temporarily unavailable), mark requests resolved or closed, and request complete account deletion through their Account Settings dashboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">5. Security & Row Level Security (RLS)</h2>
          <p>
            All persistent data is protected by database-level Row Level Security (RLS) policies. Sensitive administrative operations are verified on the server and logged in tamper-evident security audit logs.
          </p>
        </section>
      </div>
    </div>
  );
}
