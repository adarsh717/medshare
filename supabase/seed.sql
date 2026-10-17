-- ====================================================================
-- MedShare Seed Data
-- Legitimate, verified healthcare resources and directory listings
-- ====================================================================

INSERT INTO public.healthcare_resources (id, name, category, address, city, state, pincode, phone, email, website_url, operational_hours, services_offered, verified)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'All India Institute of Medical Sciences (AIIMS)',
    'hospital',
    'Sri Aurobindo Marg, Ansari Nagar East',
    'New Delhi',
    'Delhi',
    '110029',
    '+91-11-26588500',
    'info@aiims.edu',
    'https://www.aiims.edu',
    '24x7 Emergency and Trauma Services',
    ARRAY['Emergency Medicine', 'Oncology', 'Cardiology', 'Nephrology', 'Organ Transplant', 'Blood Bank'],
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'Indian Red Cross Society National Blood Bank',
    'blood_bank',
    '1, Red Cross Road',
    'New Delhi',
    'Delhi',
    '110001',
    '+91-11-23716441',
    'bloodbank@indianredcross.org',
    'https://www.indianredcross.org',
    '24 Hours Voluntary Blood Banking & Component Separation',
    ARRAY['Whole Blood', 'Packed Red Cells', 'Platelets', 'Fresh Frozen Plasma', 'Apheresis'],
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    'Tata Memorial Hospital & Cancer Center',
    'hospital',
    'Dr. E Borges Road, Parel',
    'Mumbai',
    'Maharashtra',
    '400012',
    '+91-22-24177000',
    'crs@tmc.gov.in',
    'https://tmc.gov.in',
    '24 Hours Oncology Care & Day Care Chemotherapy',
    ARRAY['Oncology Consultation', 'Radiation Therapy', 'Subsidized Medicine Cell', 'Palliative Care', 'Blood Bank'],
    true
),
(
    '00000000-0000-0000-0000-000000000004',
    'Rotary Blood Bank',
    'blood_bank',
    '56-57, Institutional Area, Sector 32',
    'Gurugram',
    'Haryana',
    '122001',
    '+91-124-4061234',
    'contact@rotarybloodbank.org',
    'https://www.rotarybloodbank.org',
    '24x7 Voluntary Blood Donation & Component Delivery',
    ARRAY['Platelet Concentrates', 'Leukodepleted Blood', 'Cryoprecipitate', 'Emergency Delivery Coordination'],
    true
),
(
    '00000000-0000-0000-0000-000000000005',
    'Postgraduate Institute of Medical Education and Research (PGIMER)',
    'transplant_center',
    'Sector 12',
    'Chandigarh',
    'Chandigarh',
    '160012',
    '+91-172-2746018',
    'pgimer-chd@nic.in',
    'https://pgimer.edu.in',
    '24x7 Tertiary Care, ROTTO North Hub',
    ARRAY['Organ Retrieval Banking Organization (ORBO)', 'Cornea Transplant', 'Renal Transplant', 'Liver Transplant'],
    true
),
(
    '00000000-0000-0000-0000-000000000006',
    'Pradhan Mantri Bhartiya Janaushadhi Kendra (Central Dispensary)',
    'authorized_pharmacy',
    'Near Safdarjung Hospital Gate No. 2, Ring Road',
    'New Delhi',
    'Delhi',
    '110029',
    '+91-11-26707444',
    'contact@janaushadhi.gov.in',
    'http://janaushadhi.gov.in',
    '08:00 AM - 10:00 PM Daily',
    ARRAY['Subsidized Generic Medicines', 'Chronic Care Assistance', 'Surgical Consumables', 'Insulin & Diabetes Care'],
    true
),
(
    '00000000-0000-0000-0000-000000000007',
    'Victoria Hospital (Bangalore Medical College and Research Institute)',
    'hospital',
    'Fort Road, near City Market',
    'Bengaluru',
    'Karnataka',
    '560002',
    '+91-80-26701150',
    'deanbmc@gmail.com',
    'https://bmcri.edu.in',
    '24x7 Government Tertiary Care & Emergency',
    ARRAY['General Surgery', 'Burn Center', 'Blood Bank', 'Charitable Medicine Counter', 'Dialysis Unit'],
    true
),
(
    '00000000-0000-0000-0000-000000000008',
    'Jeevan Stem Cell & Blood Bank',
    'blood_bank',
    '22, Ritherdon Road, Vepery',
    'Chennai',
    'Tamil Nadu',
    '600007',
    '+91-44-25322525',
    'jeevan@jeevan.org',
    'https://jeevan.org',
    '24 Hours Component Testing & Distribution',
    ARRAY['Platelets', 'Stem Cell Registry', 'Whole Blood', 'Rare Blood Group Registry'],
    true
)
ON CONFLICT (id) DO NOTHING;
