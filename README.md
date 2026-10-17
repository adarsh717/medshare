# MedShare — Community-Driven Healthcare Assistance Platform

MedShare is a production-oriented, full-stack healthcare assistance web application engineered to connect patients, caregivers, voluntary blood donors, and authorized healthcare providers.

The platform provides coordination for urgent voluntary blood requests, lawful generic medicine navigation, medical equipment and expense support, and lawful organ donation awareness in full compliance with Indian healthcare statutes.

---

## 1. Core Architecture & Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers, Strict Server-Side Authorization)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a restrained medical design system (subtle borders, clean neutrals, `#0f766e` medical teal accents, zero gradients, zero neon colors)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (RLS) & Supabase Auth (with a resilient in-app fallback layer for instant local zero-config evaluation)
- **Testing**: [Vitest](https://vitest.dev/) for unit and business logic tests
- **Deployment**: Vercel-ready with zero machine-specific dependencies

---

## 2. Key Modules & Functional Workflows

### 🩸 Voluntary Blood Assistance Module
- **Requisition Workflow**: Patients/caregivers submit hospital-verified blood requisitions with required blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), component (`whole_blood`, `platelets`, `packed_red_cells`, `fresh_frozen_plasma`, `cryoprecipitate`), hospital name, units needed (1-10 max), and required date.
- **Privacy-Preserving Donor Matching**: Matches nearby compatible voluntary donors. Donor contact details (phone and email) remain shielded until the donor actively responds to the requisition.
- **Regulatory Safety**: All phlebotomy, infectious disease screening (HIV, Hepatitis B/C, Syphilis, Malaria), and compatibility cross-matching are conducted exclusively by licensed hospital blood banks in accordance with National Blood Transfusion Council (NBTC) regulations.

### 💊 Lawful Medicine Assistance Module
- **Generic Formulation Navigation**: Connects patients with subsidized Pradhan Mantri Bhartiya Janaushadhi Kendras (PMBJP) offering generic medicines at 50%–90% lower cost.
- **Strict Anti-Redistribution Rule**: In compliance with the Drugs and Cosmetics Act 1940 and Pharmacy Act 1948, **MedShare strictly prohibits peer-to-peer buying, selling, or redistribution of prescription medicines**. All inquiries require confirmation of a valid doctor's prescription.

### 🫀 Organ Donation Awareness & Education Module
- **Statutory Education**: Clear guidance on the differences between living donation (strictly near-relatives or Authorization Committee approved under THOA 1994) and deceased cadaveric donation (certified brain-stem death with family consent).
- **Prohibition on Commercial Organ Trade**: Clear warnings that commercial organ dealing is a severe criminal offense under the Transplantation of Human Organs and Tissues Act (THOA) 1994.
- **Official Registry Integration**: Direct links to the National Organ and Tissue Transplant Organization (NOTTO - [notto.mohfw.gov.in](https://notto.mohfw.gov.in)) for statutory legal donor registration.
- **Voluntary Awareness Pledge**: An expression of intent with explicit disclaimers that it is an awareness pledge, not a legal procurement registration or commercial transaction.

### 🏥 Authorized Healthcare Directory
- Curated, searchable directory of verified government hospitals, licensed blood banks, Janaushadhi Kendras, and regional transplant coordination hubs (AIIMS, Tata Memorial, Indian Red Cross, PGIMER, Victoria Hospital, etc.).
- Instant filtering by facility category, city, and specialized services.

### 📋 User & Admin Dashboards
- **Role-Aware Dashboards**: Role-tailored views for Patients, Voluntary Donors, Healthcare Providers, and Platform Administrators.
- **Request Tracking**: Real-time 6-stage status transitions (`submitted` &rarr; `under_review` &rarr; `additional_info_required` &rarr; `matched` &rarr; `resolved` &rarr; `closed`).
- **Persistent In-App Notifications**: Real database-backed unread counts, mark-as-read actions, and direct links to updated requisitions.
- **Administrator Hub**: Review pending healthcare provider verification licenses (approve/reject with admin notes), moderate assistance requests, and inspect immutable system audit logs.

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js 18.18+ or 20+ (Node v22.x supported)
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/medshare.git
cd medshare

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> MedShare includes an intelligent in-app data persistence layer pre-seeded with 8 verified healthcare institutions, voluntary donors, and active requisitions. The application is **100% functional immediately upon launch**, even without external database credentials configured!

---

## 4. Pre-Configured Test Accounts

For instant local evaluation, click the demo buttons on the [Sign In Page](http://localhost:3000/auth/login) or use:

| Role | Email | Password |
|---|---|---|
| **Platform Administrator** | `admin@medshare.org` | `AdminPass@2026` |
| **Patient / Caregiver** | `patient@medshare.org` | `PatientPass@2026` |
| **Voluntary Blood Donor** | `donor@medshare.org` | `DonorPass@2026` |
| **Healthcare Provider** | `provider@medshare.org` | `ProviderPass@2026` |

---

## 5. Supabase Production Database Setup

When deploying to production with a managed Supabase backend:

1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase project.
3. Run the schema migration script located at:
   ```
   supabase/migrations/20261017000000_medshare_schema.sql
   ```
   *(This provisions all 11 relational tables, constraints, indexes, custom ENUM types, and Row Level Security policies).*
4. Run the seed data script:
   ```
   supabase/seed.sql
   ```
5. Copy your project API credentials into `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Populate:
   - `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key`
   - `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key` *(Server only — never prefix with NEXT_PUBLIC)*

### Provisioning the First Administrator
To assign the first administrator account securely without hardcoding credentials:
1. Register an account through `/auth/register`.
2. In the Supabase SQL Editor, run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@domain.com';

   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM public.profiles WHERE email = 'your-email@domain.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

## 6. Testing & Quality Verification

MedShare includes comprehensive automated test suites:

```bash
# Run unit tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Run production build
npm run build
```

---

## 7. Deployment to Vercel

1. Push your MedShare repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), select **Add New Project** and import the `medshare` repository.
3. In **Settings -> Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://medshare.yourdomain.com`)
4. Click **Deploy**. Vercel will build and deploy the Next.js application automatically.

---

## 8. Git & Repository Readiness

To initialize and push this project to a new GitHub repository:

```bash
# Initialize git repository
git init

# Check status
git status

# Add all files (node_modules and secrets are safely ignored via .gitignore)
git add .

# Create initial commit
git commit -m "feat: complete production-ready MedShare healthcare assistance platform"

# Link to your remote GitHub repository
git remote add origin https://github.com/your-username/medshare.git
git branch -M main
git push -u origin main
```

---

## 9. Statutory Disclaimers

- **Emergency Notice**: MedShare is not an emergency dispatch center or ambulance service. In medical emergencies, immediately call **112** (National Emergency Helpline) or **108** (Ambulance).
- **Transplantation of Human Organs and Tissues Act (THOA) 1994**: MedShare prohibits organ trading, monetary consideration, or private organ matching.
- **Drugs and Cosmetics Act 1940**: Prescription medicines require valid RMP prescriptions and can only be dispensed by licensed pharmacies. Informal drug redistribution is illegal.
- **National Blood Transfusion Council (NBTC)**: Blood donation is voluntary and non-remunerated. Testing and safety screening are performed exclusively by licensed blood banks.
