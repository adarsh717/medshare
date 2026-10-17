-- ====================================================================
-- MedShare Core Schema Migration
-- Production PostgreSQL DDL with Constraints, Indexes, and RLS
-- ====================================================================

-- 1. Custom Types / Enums
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('patient', 'donor', 'volunteer', 'provider', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blood_group_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blood_component_type AS ENUM ('whole_blood', 'packed_red_cells', 'platelets', 'fresh_frozen_plasma', 'cryoprecipitate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_category_type AS ENUM ('blood', 'medicine', 'financial', 'equipment', 'general');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_priority_type AS ENUM ('standard', 'urgent', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status_type AS ENUM ('submitted', 'under_review', 'additional_info_required', 'matched', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE provider_verification_status_type AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role user_role_type NOT NULL DEFAULT 'patient',
    city TEXT,
    state TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. User Roles Assignment Table (Explicit Multi-Role / Admin Authorization)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    assigned_by UUID REFERENCES public.profiles(id),
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 4. Voluntary Blood Donor Profiles
CREATE TABLE IF NOT EXISTS public.donor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    blood_group blood_group_type NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    locality TEXT,
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'temporarily_unavailable')),
    preferred_contact_method TEXT NOT NULL DEFAULT 'in_app' CHECK (preferred_contact_method IN ('in_app', 'email', 'phone')),
    consent_to_contact BOOLEAN NOT NULL DEFAULT false,
    last_donation_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Assistance Requests Table
CREATE TABLE IF NOT EXISTS public.assistance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category request_category_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    locality TEXT,
    priority request_priority_type NOT NULL DEFAULT 'standard',
    status request_status_type NOT NULL DEFAULT 'submitted',
    preferred_contact_method TEXT NOT NULL DEFAULT 'in_app',
    consent_given BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Blood Request Specific Details
CREATE TABLE IF NOT EXISTS public.blood_request_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.assistance_requests(id) ON DELETE CASCADE UNIQUE,
    patient_name TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    hospital_address TEXT,
    blood_group blood_group_type NOT NULL,
    blood_component blood_component_type NOT NULL DEFAULT 'whole_blood',
    units_needed INTEGER NOT NULL DEFAULT 1 CHECK (units_needed > 0 AND units_needed <= 10),
    required_date DATE NOT NULL,
    urgency_level request_priority_type NOT NULL DEFAULT 'standard',
    medical_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Authorized Healthcare Provider Profiles
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    organization_name TEXT NOT NULL,
    organization_type TEXT NOT NULL CHECK (organization_type IN ('hospital', 'blood_bank', 'clinic', 'charity_pharmacy', 'diagnostic_center')),
    license_number TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    website_url TEXT,
    verification_status provider_verification_status_type NOT NULL DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Healthcare Resources Directory (Verified Hospitals, Blood Banks, Clinics)
CREATE TABLE IF NOT EXISTS public.healthcare_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hospital', 'blood_bank', 'authorized_pharmacy', 'community_clinic', 'transplant_center')),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    website_url TEXT,
    operational_hours TEXT NOT NULL DEFAULT '24x7 Emergency Services Available',
    services_offered TEXT[] DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT true,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Provider Verification Submissions (For Admin Review)
CREATE TABLE IF NOT EXISTS public.provider_verification_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Request Responses / Volunteer Offers
CREATE TABLE IF NOT EXISTS public.request_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.assistance_requests(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    responder_type TEXT NOT NULL CHECK (responder_type IN ('volunteer', 'provider', 'donor')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'offered' CHECK (status IN ('offered', 'accepted', 'declined', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Persistent In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('request_status', 'match_found', 'verification_update', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Security Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Indexes for High Performance Queries
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_bg_city ON public.donor_profiles(blood_group, city);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_avail ON public.donor_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_requests_cat_status ON public.assistance_requests(category, status);
CREATE INDEX IF NOT EXISTS idx_requests_user ON public.assistance_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_city ON public.assistance_requests(city);
CREATE INDEX IF NOT EXISTS idx_blood_details_bg ON public.blood_request_details(blood_group);
CREATE INDEX IF NOT EXISTS idx_resources_cat_city ON public.healthcare_resources(category, city);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);

-- ====================================================================
-- Row Level Security (RLS) Policies
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_request_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_verification_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin?
CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uid AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles can be viewed by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Donor Profiles Policies (Protect donor privacy: private contact details shielded)
CREATE POLICY "Users can view their own donor profile"
ON public.donor_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own donor profile"
ON public.donor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile"
ON public.donor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Assistance Requests Policies
CREATE POLICY "Public read for non-closed requests"
ON public.assistance_requests FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Authenticated users can create assistance requests"
ON public.assistance_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assistance requests"
ON public.assistance_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Blood Request Details Policies
CREATE POLICY "Public read for blood request details"
ON public.blood_request_details FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Request owners can insert blood request details"
ON public.blood_request_details FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.assistance_requests
        WHERE id = blood_request_details.request_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Request owners or admins can update blood request details"
ON public.blood_request_details FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.assistance_requests
        WHERE id = blood_request_details.request_id AND user_id = auth.uid()
    ) OR public.is_admin(auth.uid())
);

-- Healthcare Resources Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view verified healthcare resources"
ON public.healthcare_resources FOR SELECT
TO authenticated, anon
USING (verified = true OR public.is_admin(auth.uid()));

CREATE POLICY "Only admins can manage healthcare resources"
ON public.healthcare_resources FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Audit Logs Policies
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));
