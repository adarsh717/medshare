import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-3 rounded-full bg-slate-100 text-slate-500 mb-3">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">404 - Page Not Found</h1>
      <p className="text-xs text-slate-600 max-w-sm mt-1 mb-6 leading-relaxed">
        The healthcare resource, assistance request, or portal page you are looking for does not exist or has been relocated.
      </p>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="primary" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Button>
        </Link>
        <Link href="/directory">
          <Button variant="outline" size="sm">
            Search Directory
          </Button>
        </Link>
      </div>
    </div>
  );
}
