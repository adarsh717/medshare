"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, HeartHandshake } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 rounded-md bg-teal-700 items-center justify-center text-white">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-none">
          {submitted ? (
            <div className="text-center space-y-3 py-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-slate-900">Check Your Email</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-800">{email}</strong>, we have sent password reset instructions to your inbox.
              </p>
              <div className="pt-3">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full text-sm"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <div className="pt-2 text-center text-xs">
                <Link href="/auth/login" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
