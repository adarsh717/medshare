"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake, ShieldAlert, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { loginSchema } from "@/lib/validations";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Login failed. Please check your credentials.");
      }

      toast({
        type: "success",
        title: "Signed In Successfully",
        description: `Welcome back, ${json.user.fullName}!`,
      });

      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error.";
      setServerError(msg);
      toast({
        type: "error",
        title: "Sign In Failed",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo accounts helper for instant testing
  const setDemoCredentials = (email: string, pass: string) => {
    setValue("email", email);
    setValue("password", pass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-md bg-teal-700 items-center justify-center text-white">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to MedShare</h1>
          <p className="text-xs text-slate-500">
            Access your healthcare assistance requests, donor matches, or management dashboard.
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Demo Fast-Login Pill Tray for Evaluators */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
          <span className="font-semibold text-slate-700 block">Instant Demo Logins:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("patient@medshare.org", "PatientPass@2026")}
              className="text-left px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-[11px]"
            >
              <strong className="block text-slate-900">Patient User</strong>
              <span className="text-slate-500 text-[10px]">patient@medshare.org</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("donor@medshare.org", "DonorPass@2026")}
              className="text-left px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-[11px]"
            >
              <strong className="block text-slate-900">Voluntary Donor</strong>
              <span className="text-slate-500 text-[10px]">donor@medshare.org</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("provider@medshare.org", "ProviderPass@2026")}
              className="text-left px-2.5 py-1.5 rounded border border-slate-200 hover:bg-slate-50 text-[11px]"
            >
              <strong className="block text-slate-900">Healthcare Provider</strong>
              <span className="text-slate-500 text-[10px]">provider@medshare.org</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@medshare.org", "AdminPass@2026")}
              className="text-left px-2.5 py-1.5 rounded border border-purple-200 bg-purple-50/40 hover:bg-purple-50 text-[11px]"
            >
              <strong className="block text-purple-950">Administrator</strong>
              <span className="text-purple-700 text-[10px]">admin@medshare.org</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email Address" required error={errors.email?.message}>
              <Input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" required error={errors.password?.message}>
              <div className="space-y-1">
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  error={!!errors.password}
                />
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full text-sm"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/auth/register" className="font-semibold text-teal-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
