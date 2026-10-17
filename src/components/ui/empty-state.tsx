import * as React from "react";
import { FolderOpen, AlertCircle } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-lg">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
        {icon || <FolderOpen className="h-6 w-6 text-slate-400" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50/50 border border-red-200 rounded-lg text-red-900">
      <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
      <h3 className="text-sm font-semibold text-red-950">{title}</h3>
      <p className="text-xs text-red-700 max-w-sm mt-1 mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="bg-white border-red-200 text-red-800 hover:bg-red-50">
          Try Again
        </Button>
      )}
    </div>
  );
}
