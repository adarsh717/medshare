"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  Heart,
  CheckCircle,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function OrganDonationPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [selectedOrgans, setSelectedOrgans] = React.useState<string[]>([
    "Corneas (Eyes)",
    "Kidneys",
  ]);
  const [statutoryAcknowledged, setStatutoryAcknowledged] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedPledge, setSubmittedPledge] = React.useState(false);

  const availableOrgans = [
    "Corneas (Eyes)",
    "Kidneys",
    "Liver",
    "Heart",
    "Lungs",
    "Pancreas",
    "Skin Tissue",
    "Heart Valves",
  ];

  const handleToggleOrgan = (organ: string) => {
    setSelectedOrgans((prev) =>
      prev.includes(organ) ? prev.filter((o) => o !== organ) : [...prev, organ]
    );
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statutoryAcknowledged) {
      toast({
        type: "error",
        title: "Acknowledgment Required",
        description: "You must acknowledge the statutory declaration before submitting.",
      });
      return;
    }
    if (selectedOrgans.length === 0) {
      toast({
        type: "error",
        title: "Selection Required",
        description: "Please select at least one organ/tissue for your awareness pledge.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/organ/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          city,
          state,
          pledgedOrgans: selectedOrgans,
          statutoryDeclaration: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record pledge.");

      setSubmittedPledge(true);
      toast({
        type: "success",
        title: "Awareness Pledge Recorded",
        description: data.message,
        duration: 6000,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting pledge.";
      toast({ type: "error", title: "Error", description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "What is the difference between living and deceased organ donation?",
      a: "Living donation occurs when a healthy person donates one kidney or a portion of their liver, strictly to an immediate near-relative (or with authorization committee approval) under Section 9 of the THOA 1994. Deceased (cadaveric) donation occurs after brain-stem death has been certified by an authorized panel of four doctors in an approved hospital, with legal consent from the next-of-kin.",
    },
    {
      q: "Can anyone buy, sell, or pay for an organ in India?",
      a: "NO. Under Section 18 and 19 of the Transplantation of Human Organs and Tissues Act (THOA) 1994, buying, selling, or offering commercial consideration for human organs is a non-bailable criminal offense punishable by rigorous imprisonment up to 10 years and heavy fines. MedShare strictly prohibits any commercial organ inquiries.",
    },
    {
      q: "Does submitting a pledge on MedShare make me legally registered to donate?",
      a: "No. This pledge is an educational expression of intent and moral commitment. Official, legally binding donor registration in India is managed exclusively by the National Organ and Tissue Transplant Organization (NOTTO) under the Ministry of Health and Family Welfare (notto.mohfw.gov.in). We provide direct links to complete your NOTTO registration.",
    },
    {
      q: "Who determines whether organs are medically suitable for transplant?",
      a: "Eligibility is assessed exclusively by qualified medical teams and authorized transplant coordinators at accredited retrieval centers based on organ function, tissue typing, cross-matching, and infection screening.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <PageHeader
        title="Lawful Organ Donation Awareness & Guidance"
        description="Responsible educational information on living and deceased donation in accordance with the Transplantation of Human Organs and Tissues Act (THOA) 1994."
        badge={
          <span className="bg-purple-50 text-purple-800 text-xs px-2.5 py-0.5 rounded border border-purple-200 font-semibold inline-flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            Statutory Awareness
          </span>
        }
      />

      {/* CRIMINAL PROHIBITION ON ORGAN TRADING BANNER */}
      <div className="border border-red-300 bg-red-50/50 rounded-lg p-5 space-y-2">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <span>Statutory Warning: Strict Prohibition on Commercial Organ Transactions</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          The <strong>Transplantation of Human Organs and Tissues Act (THOA), 1994</strong> strictly prohibits commercial dealings in human organs. Offering, soliciting, brokering, or accepting financial compensation for any organ is a severe punishable criminal offense.
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>MedShare does not operate an organ marketplace, does not match organ recipients with private individuals, and does not assess transplant compatibility.</strong> Allocation of deceased donor organs in India is managed exclusively by NOTTO, ROTTO, and SOTTO through transparent state waitlists.
        </p>
      </div>

      {/* Official Registry Resource Links */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Official Government Registries & Hubs</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized portals for official donor pledging and waitlist information.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Helpline: 1800-11-4770
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">NOTTO National Registry</h3>
            <p className="text-slate-600 leading-relaxed">
              National Organ and Tissue Transplant Organization, Directorate General of Health Services (MoHFW).
            </p>
            <a
              href="https://notto.mohfw.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>notto.mohfw.gov.in</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Regional & State Bodies (ROTTO/SOTTO)</h3>
            <p className="text-slate-600 leading-relaxed">
              Regional hubs at PGIMER Chandigarh, KEM Mumbai, IPGMER Kolkata, and state transplant bodies.
            </p>
            <span className="text-slate-500 block pt-1">
              Coordinated via regional government hubs
            </span>
          </div>

          <div className="border border-slate-200 rounded p-4 space-y-2 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Transplant Coordinators Network</h3>
            <p className="text-slate-600 leading-relaxed">
              Authorized hospital social workers and transplant coordinators guide grieving families with empathy.
            </p>
            <Link href="/directory?category=transplant_center" className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1 pt-1">
              <span>View Transplant Centers</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Living vs Deceased Donation Educational Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Heart className="h-4 w-4" />
            <span>Living Organ Donation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A healthy adult can voluntarily donate one kidney or a segment of liver during their lifetime. Under Indian law:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Permitted primarily between near-relatives (spouse, parents, children, siblings, grandparents, grandchildren).</li>
            <li>Donations from other individuals require prior statutory scrutiny and clearance by a government-mandated Authorization Committee to eliminate any financial coercion.</li>
            <li>No intermediary, broker, or payment is legally tolerated.</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
            <FileText className="h-4 w-4" />
            <span>Deceased (Cadaveric) Donation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Organs donated following brain-stem death in an ICU setting can save up to 8 lives and heal over 50 through tissue donation:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Brain-stem death must be certified twice by an authorized panel of four doctors, 6 hours apart.</li>
            <li>Requires formal legal consent from the next-of-kin or legal guardian.</li>
            <li>Organs (heart, lungs, liver, kidneys, pancreas) are allocated through NOTTO state waitlists based on medical urgency.</li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-teal-700" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <h3 className="font-bold text-slate-900">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voluntary Awareness Pledge Form */}
      <div id="pledge" className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Express Your Intent: Voluntary Awareness Pledge
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Express your personal commitment to organ donation awareness. Note: This is an expression of interest. To officially register your legal pledge, you must register at NOTTO (notto.mohfw.gov.in).
          </p>
        </div>

        {submittedPledge ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-md text-center space-y-3">
            <CheckCircle className="h-8 w-8 text-emerald-700 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-950">
              Thank You for Your Awareness Commitment
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
              Your pledge of awareness has been recorded. Discuss your wish with your family — in India, family consent is mandatory at the time of deceased donation.
            </p>
            <div className="pt-2">
              <a
                href="https://notto.mohfw.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded hover:bg-emerald-800"
              >
                <span>Complete Official NOTTO Registration</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePledgeSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Legal Name" required>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arun Sharma"
                  required
                />
              </FormField>

              <FormField label="Email Address" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arun@example.com"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Phone Number" required>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                />
              </FormField>

              <FormField label="City" required>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  required
                />
              </FormField>

              <FormField label="State" required>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Delhi"
                  required
                />
              </FormField>
            </div>

            {/* Organs Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Organs & Tissues You Wish to Pledge
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {availableOrgans.map((organ) => {
                  const isChecked = selectedOrgans.includes(organ);
                  return (
                    <button
                      key={organ}
                      type="button"
                      onClick={() => handleToggleOrgan(organ)}
                      className={`p-2.5 rounded border text-xs text-left transition-colors font-medium ${
                        isChecked
                          ? "bg-purple-50 border-purple-300 text-purple-900"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {organ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statutory Declaration */}
            <div className="pt-2 border-t border-slate-100">
              <Checkbox
                id="statutoryAcknowledged"
                checked={statutoryAcknowledged}
                onChange={(e) => setStatutoryAcknowledged(e.target.checked)}
                label={
                  <span>
                    I understand that this form is an educational awareness pledge and <strong>NOT</strong> an official legal organ registry, medical consent, or commercial transaction. I agree to inform my family of my wishes and visit NOTTO (notto.mohfw.gov.in) for statutory donor card issuance.
                  </span>
                }
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="bg-purple-800 hover:bg-purple-900 border-purple-900"
              >
                Record Awareness Pledge
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
