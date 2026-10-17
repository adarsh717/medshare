import Link from "next/link";
import { HeartHandshake, ShieldCheck, AlertCircle, ExternalLink, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      {/* Statutory & Ethical Standards Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-teal-400 font-medium">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Statutory Non-Commercial Healthcare Platform</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed max-w-3xl">
            MedShare strictly operates in accordance with the <strong>Transplantation of Human Organs and Tissues Act (THOA) 1994</strong> and <strong>National Blood Transfusion Council (NBTC)</strong> safety regulations. We prohibit any monetary compensation, organ trading, or unlawful distribution of prescription medicines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="h-6 w-6 rounded bg-teal-600 flex items-center justify-center text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <span>MedShare</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              A community-driven healthcare assistance initiative connecting patients and caregivers with voluntary blood donors, authorized providers, medicine navigation, and lawful organ donation awareness.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              National Organ Helpline: <span className="text-teal-400 font-medium">1800-11-4770</span>
            </div>
          </div>

          {/* Assistance Pathways */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Assistance Pathways
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blood" className="hover:text-white transition-colors">
                  Blood Donation Requests
                </Link>
              </li>
              <li>
                <Link href="/blood/donate" className="hover:text-white transition-colors">
                  Become a Voluntary Donor
                </Link>
              </li>
              <li>
                <Link href="/medicine" className="hover:text-white transition-colors">
                  Affordable Medicine Navigation
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="hover:text-white transition-colors">
                  Equipment & Medical Expense Support
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-white transition-colors">
                  Authorized Healthcare Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Official Resources */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Official Registries & Health Hubs
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://notto.mohfw.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  NOTTO National Registry <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://eraktkosh.mohfw.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  e-RaktKosh Blood Portal <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://janaushadhi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  Pradhan Mantri Jan Aushadhi <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link href="/organ-donation" className="hover:text-white transition-colors">
                  Organ Donation Awareness & Facts
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  Safety & Verification Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Trust & Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Mission & Limitations
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  Medical Safety Guidelines
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="/MedShare_User_Guide_and_Documentation.pdf"
                  target="_blank"
                  download="MedShare_User_Guide_and_Documentation.pdf"
                  className="inline-flex items-center gap-1.5 text-teal-400 font-semibold hover:text-teal-300 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Download Platform PDF Manual</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <p>
            &copy; {new Date().getFullYear()} MedShare Platform. Built for public healthcare assistance and voluntary community support.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Not an emergency dispatch center
            </span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
