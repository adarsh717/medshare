import { FileText, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Terms of Service & Usage Policies",
  description: "User agreement and terms of service governing participation on MedShare.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Terms of Service & Operational Guidelines"
        description="Conditions governing voluntary participation, assistance coordination, and regulatory compliance on MedShare."
      />

      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">1. Nature of the Service</h2>
          <p>
            MedShare is an informational and voluntary community coordination portal. MedShare is not an emergency dispatch center, hospital, licensed pharmacy, or medical diagnostic facility. If you are facing an immediate medical emergency, you must immediately call National Emergency Services at 112 or Ambulance Services at 108.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">2. Prohibition on Commercial Drug & Organ Transactions</h2>
          <p>
            Users expressly agree that they will NOT use the platform to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Buy, sell, barter, or distribute prescription medicines, expired pharmaceuticals, or scheduled drugs.</li>
            <li>Solicit, negotiate, or offer monetary payment for human organs or tissues, which constitutes a severe offense under the Transplantation of Human Organs and Tissues Act (THOA) 1994.</li>
            <li>Charge patients or caregivers fees for voluntary blood donations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">3. User Responsibility & Requisition Accuracy</h2>
          <p>
            Requesters must ensure that all blood and medical assistance requisitions are genuine, active, and supported by registered medical practitioners. Submitting fabricated, fraudulent, or harassing requisitions is strictly grounds for immediate account suspension and referral to cybercrime authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900">4. Limitation of Medical Liability</h2>
          <p>
            MedShare does not practice medicine and does not guarantee clinical compatibility or donor eligibility. All decisions concerning blood matching, cross-matching, transfusion safety, prescription validation, and medical administration rest exclusively with licensed healthcare professionals at authorized medical facilities.
          </p>
        </section>
      </div>
    </div>
  );
}
