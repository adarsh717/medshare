"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Shield, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = React.useState("Arun Verma");
  const [phoneNumber, setPhoneNumber] = React.useState("+91-9876543211");
  const [city, setCity] = React.useState("New Delhi");
  const [state, setState] = React.useState("Delhi");
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("patient");
  const [isSaving, setIsSaving] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        type: "success",
        title: "Settings Saved",
        description: "Your profile information has been updated successfully.",
      });
    }, 500);
  };

  const handleDeleteAccount = () => {
    toast({
      type: "info",
      title: "Account Deletion Requested",
      description: "Your data minimization and deletion request has been submitted.",
    });
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        title="Account & Security Settings"
        description="Manage your profile information, contact preferences, and data privacy options."
      />

      {/* Profile Information Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="h-4 w-4 text-teal-700" />
          <span>Profile Details</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <FormField label="Full Name" required>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact Phone">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormField>

            <FormField label="Active Platform Role">
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              >
                <option value="patient">Patient / Caregiver</option>
                <option value="donor">Voluntary Blood Donor</option>
                <option value="volunteer">Healthcare Volunteer</option>
                <option value="provider">Healthcare Provider</option>
                <option value="admin">Platform Administrator (Test)</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="City" required>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required />
            </FormField>

            <FormField label="State" required>
              <Input value={state} onChange={(e) => setState(e.target.value)} required />
            </FormField>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="sm" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Sessions */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Shield className="h-4 w-4 text-teal-700" />
          <span>Security & Authentication</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your account is secured via encrypted session tokens. Passwords and credentials are validated with strict cryptographic hashing.
        </p>
        <div className="pt-2">
          <Link href="/auth/forgot-password">
            <Button variant="outline" size="sm" className="text-xs">
              Change Account Password
            </Button>
          </Link>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-red-50/40 border border-red-200 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span>Data Privacy & Account Deletion</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Under our data minimization policy, you can request the permanent removal of your account, contact details, and open assistance requests.
        </p>
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
            className="text-xs gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Request Account Deletion</span>
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Confirm Account Deletion Request"
        message="Are you sure you want to delete your account? All your active assistance requests and voluntary donor preferences will be unlisted."
        confirmLabel="Yes, Request Deletion"
        variant="danger"
      />
    </div>
  );
}
