"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error cleanly to console in dev
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-3 rounded-full bg-red-50 text-red-600 mb-3 border border-red-100">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Application Error</h1>
      <p className="text-xs text-slate-600 max-w-sm mt-1 mb-6 leading-relaxed">
        An unexpected error occurred while loading this healthcare assistance service. Please try again or return to the main directory.
      </p>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => reset()} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/")}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
