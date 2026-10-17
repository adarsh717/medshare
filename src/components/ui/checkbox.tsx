import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string | React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-start space-x-2.5">
          <div className="relative flex items-center pt-0.5">
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              checked={checked}
              className={cn(
                "h-4 w-4 rounded border border-slate-300 text-teal-700 accent-teal-700 focus:ring-1 focus:ring-teal-700 disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500",
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <label
              htmlFor={inputId}
              className="text-sm font-normal text-slate-800 leading-snug cursor-pointer select-none"
            >
              {label}
              {description && <span className="block text-xs text-slate-500 mt-0.5">{description}</span>}
            </label>
          )}
        </div>
        {error && <p className="text-xs text-red-600 pl-6">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
