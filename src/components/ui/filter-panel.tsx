import * as React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "./button";

interface FilterPanelProps {
  title?: string;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FilterPanel({
  title = "Filter Directory",
  onReset,
  children,
  className,
}: FilterPanelProps) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-4 space-y-4 ${className || ""}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Filter className="h-4 w-4 text-teal-700" />
          <span>{title}</span>
        </div>
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs text-slate-500 hover:text-slate-800">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}
