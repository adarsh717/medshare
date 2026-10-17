"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake, ShieldAlert, CheckCircle } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { registerSchema } from "@/lib/validations";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "patient",
      city: "New Delhi",
      state: "Delhi",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Registration failed.");
      }

      toast({
        type: "success",
        title: "Account Created Successfully",
        description: `Welcome to MedShare, ${json.user.fullName}!`,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration error.";
      setServerError(msg);
      toast({
        type: "error",
        title: "Registration Failed",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-md bg-teal-700 items-center justify-center text-white">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Join MedShare</h1>
          <p className="text-xs text-slate-500">
            Create an account to access healthcare assistance, offer voluntary blood donation, or coordinate resources.
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full Name" required error={errors.fullName?.message}>
              <Input
                {...register("fullName")}
                placeholder="e.g. Arun Verma"
                error={!!errors.fullName}
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message}>
              <Input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" required error={errors.password?.message}>
              <Input
                type="password"
                {...register("password")}
                placeholder="At least 8 characters"
                error={!!errors.password}
              />
            </FormField>

            <FormField label="Primary Role on Platform" required error={errors.role?.message}>
              <Select {...register("role")} error={!!errors.role}>
                <option value="patient">Patient / Family Caregiver</option>
                <option value="donor">Voluntary Blood Donor</option>
                <option value="volunteer">Healthcare Volunteer</option>
                <option value="provider">Healthcare Provider (Clinic / Hospital / Blood Bank)</option>
              </Select>
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="City" required error={errors.city?.message}>
                <Input {...register("city")} placeholder="e.g. New Delhi" error={!!errors.city} />
              </FormField>

              <FormField label="State" required error={errors.state?.message}>
                <Input {...register("state")} placeholder="e.g. Delhi" error={!!errors.state} />
              </FormField>
            </div>

            <FormField label="Contact Phone (Optional)" error={errors.phoneNumber?.message}>
              <Input
                type="tel"
                {...register("phoneNumber")}
                placeholder="10-digit mobile number"
              />
            </FormField>

            {/* Terms Consent */}
            <div className="pt-2 border-t border-slate-100">
              <Checkbox
                id="termsConsent"
                {...register("termsConsent")}
                error={errors.termsConsent?.message}
                label={
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="text-teal-700 underline" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-teal-700 underline" target="_blank">
                      Privacy Policy
                    </Link>
                    , and agree to participate in lawful, non-commercial healthcare assistance.
                  </span>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full text-sm"
              isLoading={isLoading}
            >
              Register Account
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-teal-700 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
