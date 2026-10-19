const fs = require('fs');
const path = require('path');

console.log("Generating comprehensive seed dataset for MedShare (50+ items per category)...");

// Cities list with states
const cities = [
  { city: "Gorakhpur", state: "Uttar Pradesh", localities: ["Golghar", "Medical College Road", "Betiahata", "Mohaddipur", "Rapti Nagar", "Asuran", "Shahpur", "Civil Lines", "Rustampur", "Taramandal", "Basharatpur", "Dharampur"] },
  { city: "Lucknow", state: "Uttar Pradesh", localities: ["Hazratganj", "Gomti Nagar", "Alambagh", "Indira Nagar", "Mahanagar", "Chowk", "Ashiyana", "Vikas Nagar"] },
  { city: "Varanasi", state: "Uttar Pradesh", localities: ["Lanka", "Sigra", "Bhelupur", "Assi Ghat", "Cantonment", "Shivpur", "Pandeypur"] },
  { city: "New Delhi", state: "Delhi", localities: ["Hauz Khas", "Saket", "Dwarka", "Rohini", "Connaught Place", "Lajpat Nagar", "Karol Bagh", "Janakpuri"] },
  { city: "Mumbai", state: "Maharashtra", localities: ["Andheri West", "Bandra", "Parel", "Dadar", "Borivali", "Goregaon", "Colaba", "Thane"] },
  { city: "Bengaluru", state: "Karnataka", localities: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "HSR Layout", "Malleshwaram"] },
  { city: "Kanpur", state: "Uttar Pradesh", localities: ["Swaroop Nagar", "Civil Lines", "Kakadeo", "Kidwai Nagar", "Govind Nagar"] },
  { city: "Patna", state: "Bihar", localities: ["Kankarbagh", "Boring Road", "Rajendra Nagar", "Bailey Road", "Patliputra Colony"] }
];

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const bloodComponents = ["whole_blood", "packed_red_cells", "platelets", "fresh_frozen_plasma", "cryoprecipitate"];
const urgencies = ["critical", "urgent", "standard"];
const organTypes = [
  ["Corneas / Eyes"],
  ["Kidneys", "Liver"],
  ["Heart", "Lungs", "Kidneys", "Liver", "Pancreas", "Corneas / Eyes"],
  ["Kidneys", "Corneas / Eyes"],
  ["Whole Body for Medical Research", "Corneas / Eyes"],
  ["Liver", "Kidneys", "Heart"],
  ["Corneas / Eyes", "Skin Tissue"],
  ["Kidneys", "Pancreas"]
];

const firstNames = [
  "Aarav", "Amit", "Pooja", "Rohan", "Sneha", "Vikram", "Neha", "Dr. Rajesh", "Priya", "Sunil",
  "Ananya", "Deepak", "Kavita", "Aditya", "Ritu", "Alok", "Shweta", "Mohd. Tariq", "Suresh", "Divya",
  "Manoj", "Preeti", "Sanjay", "Meera", "Abhishek", "Rashmi", "Nitin", "Anjali", "Harish", "Swati",
  "Gaurav", "Bhavna", "Ashish", "Jyoti", "Pankaj", "Vandana", "Rahul", "Archana", "Kunal", "Seema",
  "Hemant", "Manju", "Tarun", "Shalini", "Vivek", "Pallavi", "Satish", "Garima", "Prashant", "Kiran",
  "Dharmendra", "Sadhna"
];

const lastNames = [
  "Sharma", "Verma", "Tripathi", "Desai", "Gupta", "Kapoor", "Patel", "Mishra", "Chandra", "Yadav",
  "Singh", "Srivastava", "Pandey", "Nair", "Iyer", "Banerjee", "Mukherjee", "Khan", "Malhotra", "Joshi",
  "Agarwal", "Bhatia", "Reddy", "Mehta", "Chopra", "Dutta", "Rao", "Dubey", "Tiwari", "Saxena"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPhone(idx) {
  const prefixes = ["98765", "94150", "91234", "98101", "99351", "97210", "94500", "96215"];
  const prefix = prefixes[idx % prefixes.length];
  const suffix = (10000 + (idx * 137) % 90000).toString();
  return `+91-${prefix}${suffix.slice(0, 5)}`;
}

// ==========================================
// 1. HEALTHCARE RESOURCES (52 FACILITIES)
// ==========================================
const resourceTemplates = [
  // Gorakhpur
  { name: "All India Institute of Medical Sciences (AIIMS) Gorakhpur", category: "hospital", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Kunraghat", phone: "+91-551-2207700", email: "info@aiimsgorakhpur.edu.in", services: ["Emergency Medicine", "Super Specialty OPD", "Trauma Center", "Blood Bank", "Cardiology", "Nephrology"] },
  { name: "Baba Raghav Das (BRD) Medical College & Hospital", category: "hospital", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Asuran, Medical Road", phone: "+91-551-2310101", email: "brdmedical@up.gov.in", services: ["24x7 Emergency", "Trauma ICU", "Regional Blood Bank", "Pediatric Super Specialty", "Jan Aushadhi Store"] },
  { name: "Fatima Hospital & Heart Research Institute", category: "hospital", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Padri Bazar", phone: "+91-551-2282220", email: "fatimahospitalgkp@gmail.com", services: ["Cardiology", "General Surgery", "Dialysis Unit", "Blood Component Unit", "Pharmacy"] },
  { name: "Guru Gorakhnath Hospital & Research Center", category: "hospital", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Gorakhnath", phone: "+91-551-2255455", email: "gorakhnathhospital@gmail.com", services: ["Ayurveda & Modern Care", "General Medicine", "Blood Storage Unit", "Subsidized Pharmacy"] },
  { name: "Red Cross Voluntary Blood Bank Gorakhpur", category: "blood_bank", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Mohaddipur", phone: "+91-551-2201999", email: "redcross.gkp@gmail.com", services: ["Whole Blood", "Packed Red Cells", "Platelets (SDP/RDP)", "Emergency Crossmatching"] },
  { name: "Pradhan Mantri Bhartiya Janaushadhi Kendra - Golghar", category: "authorized_pharmacy", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Golghar, Main Market", phone: "+91-551-2334411", email: "pmbjk.golghar@gmail.com", services: ["Generic Medicines at 50-90% Discount", "Surgical Consumables", "Insulin & Diabetes Supplies"] },
  { name: "Pradhan Mantri Bhartiya Janaushadhi Kendra - Medical Gate", category: "authorized_pharmacy", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Near BRD Medical College Gate", phone: "+91-551-2339922", email: "pmbjk.brdgate@gmail.com", services: ["Subsidized Prescription Medicines", "Orthopedic Braces", "Antibiotics", "Dialysis Consumables"] },
  { name: "City Life Care Trauma & Orthopedic Center", category: "hospital", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Betiahata", phone: "+91-551-2204567", email: "citylifecaregkp@gmail.com", services: ["Trauma Surgery", "Joint Replacement", "Emergency ICU", "Blood Bank Liaison"] },
  { name: "Apex Diagnostics & Charitable Blood Storage", category: "blood_bank", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Rapti Nagar Phase 4", phone: "+91-551-2278901", email: "apexdiagnostics.gkp@gmail.com", services: ["24x7 Blood Availability", "High Precision Pathology", "Component Storage"] },
  { name: "Savitri Hospital & Maternity Center", category: "community_clinic", city: "Gorakhpur", state: "Uttar Pradesh", locality: "Shahpur", phone: "+91-551-2213456", email: "savitrihospital@gmail.com", services: ["Obstetrics & Gynecology", "Neonatal Intensive Care", "Emergency Blood Transfusion"] },
  // Lucknow
  { name: "King George's Medical University (KGMU) Trauma Center", category: "hospital", city: "Lucknow", state: "Uttar Pradesh", locality: "Chowk", phone: "+91-522-2257540", email: "kgmutrauma@kgmu.org", services: ["Level 1 Trauma Center", "State Model Blood Bank", "Organ Retrieval Center", "Neurosurgery"] },
  { name: "Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGI)", category: "transplant_center", city: "Lucknow", state: "Uttar Pradesh", locality: "Raebareli Road", phone: "+91-522-2668004", email: "sgpgi_admin@sgpgi.ac.in", services: ["Renal Transplant", "Liver Transplant", "Cardiology", "Apheresis & Platelet Center"] },
  { name: "Dr. Ram Manohar Lohia Institute of Medical Sciences", category: "hospital", city: "Lucknow", state: "Uttar Pradesh", locality: "Gomti Nagar", phone: "+91-522-6692000", email: "rmlims@up.gov.in", services: ["24x7 Emergency", "Oncology Care", "Blood Bank", "Dialysis Services"] },
  { name: "Samarpan Blood Bank & Component Separation Unit", category: "blood_bank", city: "Lucknow", state: "Uttar Pradesh", locality: "Alambagh", phone: "+91-522-2451234", email: "samarpanbloodbank@gmail.com", services: ["Leukodepleted Blood", "Single Donor Platelets", "Fresh Frozen Plasma"] },
  { name: "Janaushadhi Special Outlet Hazratganj", category: "authorized_pharmacy", city: "Lucknow", state: "Uttar Pradesh", locality: "Hazratganj", phone: "+91-522-2233445", email: "pmbjk.hazratganj@gmail.com", services: ["Generic Oncology & Cardiac Drugs", "Free Sugar/BP Testing"] },
  // Varanasi
  { name: "Institute of Medical Sciences - BHU & Sir Sunderlal Hospital", category: "hospital", city: "Varanasi", state: "Uttar Pradesh", locality: "Lanka, BHU Campus", phone: "+91-542-2367568", email: "ssh@bhu.ac.in", services: ["Regional Apex Hospital", "24x7 Blood Bank", "Organ Transplant Unit", "Cardiothoracic Surgery"] },
  { name: "Heritage Institute of Medical Sciences (HIMS)", category: "hospital", city: "Varanasi", state: "Uttar Pradesh", locality: "Bhadwar, NH-2", phone: "+91-542-2635333", email: "info@heritageims.com", services: ["Trauma ICU", "Component Blood Bank", "Dialysis", "Burn Care Unit"] },
  { name: "Varanasi Blood Center & Apheresis Clinic", category: "blood_bank", city: "Varanasi", state: "Uttar Pradesh", locality: "Sigra", phone: "+91-542-2224567", email: "varanasibloodcenter@gmail.com", services: ["24x7 Blood Bank", "Cryoprecipitate", "Platelet Apheresis", "Home Delivery Service"] },
  { name: "Kashi Charitable Dispensary & Janaushadhi Kendra", category: "authorized_pharmacy", city: "Varanasi", state: "Uttar Pradesh", locality: "Assi Ghat", phone: "+91-542-2311222", email: "kashidispensary@gmail.com", services: ["Subsidized Generic Medicines", "Wheelchair Loan Assistance", "Free Doctor Consultation"] },
  // Delhi
  { name: "All India Institute of Medical Sciences (AIIMS) New Delhi", category: "transplant_center", city: "New Delhi", state: "Delhi", locality: "Ansari Nagar", phone: "+91-11-26588500", email: "aiims.info@aiims.edu", services: ["Heart, Kidney, Cornea & Bone Marrow Transplants", "National Apex Blood Center", "Oncology"] },
  { name: "Safdarjung Hospital & VMMC", category: "hospital", city: "New Delhi", state: "Delhi", locality: "Ring Road", phone: "+91-11-26165060", email: "safdarjunghospital@gov.in", services: ["Largest Emergency Facility", "Trauma Care", "Burn Unit", "Blood Bank"] },
  { name: "Indian Red Cross Society National Headquarters Blood Bank", category: "blood_bank", city: "New Delhi", state: "Delhi", locality: "1, Red Cross Road", phone: "+91-11-23716441", email: "bloodbank@indianredcross.org", services: ["National Blood Stock Monitoring", "Rare Blood Group Registry", "Platelet Apheresis"] },
  { name: "Rotary Blood Bank Delhi NCR", category: "blood_bank", city: "New Delhi", state: "Delhi", locality: "Institutional Area, Tuglakabad", phone: "+91-11-29966666", email: "info@rotarybloodbank.org", services: ["100% Voluntary Blood Banking", "Component Processing", "Mobile Blood Donation Vans"] },
  { name: "Max Super Speciality Hospital Saket", category: "transplant_center", city: "New Delhi", state: "Delhi", locality: "Saket", phone: "+91-11-26515050", email: "contactus@maxhealthcare.com", services: ["Organ Transplant Center", "Robotic Surgery", "Comprehensive Cancer Care", "Blood Bank"] },
  { name: "Pradhan Mantri Jan Aushadhi Central Hub - Connaught Place", category: "authorized_pharmacy", city: "New Delhi", state: "Delhi", locality: "Connaught Place", phone: "+91-11-23348899", email: "pmbjk.delhi@gov.in", services: ["Comprehensive Generic Medicine Formulary", "Insulin Storage", "Surgical Goods"] },
  // Mumbai
  { name: "Tata Memorial Hospital & Cancer Research Center", category: "hospital", city: "Mumbai", state: "Maharashtra", locality: "Parel", phone: "+91-22-24177000", email: "crs@tmc.gov.in", services: ["Subsidized Oncology Treatment", "Dedicated Platelet & Blood Bank", "Charity Medicine Dispensing"] },
  { name: "King Edward Memorial (KEM) Hospital", category: "hospital", city: "Mumbai", state: "Maharashtra", locality: "Parel", phone: "+91-22-24107000", email: "kemhospital@mcgm.gov.in", services: ["Tertiary Public Care", "24x7 Trauma & Blood Bank", "Dialysis Assistance", "Organ Retrieval"] },
  { name: "Think Foundation Voluntary Blood & Thalassemia Care", category: "blood_bank", city: "Mumbai", state: "Maharashtra", locality: "Dadar", phone: "+91-22-24185200", email: "info@thinkfoundation.org", services: ["Thalassemia Major Blood Support", "Rare Blood Donor Registry", "Platelet Support"] },
  { name: "Kokilaben Dhirubhai Ambani Hospital", category: "transplant_center", city: "Mumbai", state: "Maharashtra", locality: "Andheri West", phone: "+91-22-42696969", email: "contact@kdah.com", services: ["Multi-Organ Transplant Unit", "Pediatric Cardiac Center", "Blood Bank"] },
  { name: "Janaushadhi Medical Store Andheri", category: "authorized_pharmacy", city: "Mumbai", state: "Maharashtra", locality: "Andheri East", phone: "+91-22-26834455", email: "pmbjk.andheri@gmail.com", services: ["Affordable High Quality Generics", "Elderly Medicine Delivery", "Asthma Inhalers"] },
  // Bengaluru
  { name: "Narayana Institute of Cardiac Sciences", category: "transplant_center", city: "Bengaluru", state: "Karnataka", locality: "Bommasandra Industrial Area", phone: "+91-80-71222222", email: "info@narayanahealth.org", services: ["Heart & Lung Transplants", "Pediatric Heart Surgery", "Blood Bank & Component Laboratory"] },
  { name: "National Institute of Mental Health & Neurosciences (NIMHANS)", category: "hospital", city: "Bengaluru", state: "Karnataka", locality: "Hosur Road", phone: "+91-80-26995000", email: "director@nimhans.ac.in", services: ["Neurology", "Neurosurgery", "Emergency Trauma & Blood Transfusion"] },
  { name: "Victoria Hospital & Bangalore Medical College", category: "hospital", city: "Bengaluru", state: "Karnataka", locality: "Kalasipalyam", phone: "+91-80-26701150", email: "victoriahospital@karnataka.gov.in", services: ["Public Emergency Care", "Burn Care", "Blood Bank", "Jan Aushadhi Outlet"] },
  { name: "Rashtrotthana Blood Centre", category: "blood_bank", city: "Bengaluru", state: "Karnataka", locality: "Jayanagar", phone: "+91-80-26637993", email: "bloodbank@rashtrotthana.org", services: ["Voluntary Blood Collection", "Component Separation", "Free Blood for Thalassemia Patients"] },
  { name: "Pradhan Mantri Janaushadhi Kendra - Indiranagar", category: "authorized_pharmacy", city: "Bengaluru", state: "Karnataka", locality: "Indiranagar 100ft Road", phone: "+91-80-25251122", email: "pmbjk.blr@gmail.com", services: ["Affordable Chronic Disease Medicines", "Orthopedic Braces & Belts", "Sanitary Supplies"] },
  // Kanpur
  { name: "GSVM Medical College & Lala Lajpat Rai Hospital", category: "hospital", city: "Kanpur", state: "Uttar Pradesh", locality: "Swaroop Nagar", phone: "+91-512-2535483", email: "gsvm@kanpur.nic.in", services: ["24x7 Trauma Care", "Regional Blood Bank", "Cardiology", "Neurology"] },
  { name: "Regency Hospital & Renal Transplant Unit", category: "transplant_center", city: "Kanpur", state: "Uttar Pradesh", locality: "Sarvodaya Nagar", phone: "+91-512-3081111", email: "info@regencyhealthcare.in", services: ["Renal Transplant", "Oncology", "Critical Care", "Blood Bank"] },
  { name: "IMA Blood Bank Kanpur", category: "blood_bank", city: "Kanpur", state: "Uttar Pradesh", locality: "Civil Lines", phone: "+91-512-2304567", email: "imabank.knp@gmail.com", services: ["Voluntary Blood Bank", "Platelet Storage", "Blood Camp Organization"] },
  { name: "Janaushadhi Kendra Kakadeo", category: "authorized_pharmacy", city: "Kanpur", state: "Uttar Pradesh", locality: "Kakadeo Coaching Hub", phone: "+91-512-2299881", email: "pmbjk.kakadeo@gmail.com", services: ["Affordable Student & Public Medicines", "First Aid Supplies", "Vitamins"] },
  // Patna
  { name: "All India Institute of Medical Sciences (AIIMS) Patna", category: "hospital", city: "Patna", state: "Bihar", locality: "Phulwari Sharif", phone: "+91-612-2451000", email: "info@aiimspatna.org", services: ["Super Specialty Services", "24x7 Emergency", "Trauma Center", "Blood Bank"] },
  { name: "Patna Medical College Hospital (PMCH)", category: "hospital", city: "Patna", state: "Bihar", locality: "Ashok Rajpath", phone: "+91-612-2300080", email: "pmch@bihar.gov.in", services: ["State Apex Hospital", "Blood Bank", "Pediatrics", "Emergency Services"] },
  { name: "Maa Blood Bank & Component Center", category: "blood_bank", city: "Patna", state: "Bihar", locality: "Kankarbagh", phone: "+91-612-2356789", email: "maabloodbank@gmail.com", services: ["Platelet Apheresis", "Fresh Frozen Plasma", "Voluntary Blood Banking"] },
  { name: "PMBJ Kendra Boring Road", category: "authorized_pharmacy", city: "Patna", state: "Bihar", locality: "Boring Road", phone: "+91-612-2554433", email: "pmbjk.patna@gmail.com", services: ["High Discount Generic Drugs", "Diabetes Care", "Cardiac Maintenance Drugs"] }
];

// Fill up to 52 resources
const seedResources = [];
for (let i = 0; i < 52; i++) {
  const base = resourceTemplates[i % resourceTemplates.length];
  const id = `res-${String(i + 1).padStart(3, '0')}`;
  const suffix = i >= resourceTemplates.length ? ` - Unit ${Math.floor(i / resourceTemplates.length) + 1}` : "";
  seedResources.push({
    id,
    name: `${base.name}${suffix}`,
    category: base.category,
    address: `${base.locality}, ${base.city}`,
    city: base.city,
    state: base.state,
    pincode: `${273001 + (i * 17) % 500000}`,
    phone: base.phone,
    email: base.email,
    websiteUrl: `https://${base.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15)}.org`,
    operationalHours: base.category === "authorized_pharmacy" ? "08:00 AM - 10:00 PM (Daily)" : "24x7 Emergency & Inpatient Services",
    servicesOffered: base.services,
    verified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  });
}

// ==========================================
// 2. SEED USERS & DONORS (52 VOLUNTARY DONORS)
// ==========================================
const seedUsers = [
  {
    id: "usr-admin-01",
    email: "admin@medshare.org",
    fullName: "MedShare Chief Administrator",
    phoneNumber: "+91-9876543210",
    role: "admin",
    city: "New Delhi",
    state: "Delhi",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    passwordHash: "AdminPass@2026",
  },
  {
    id: "usr-patient-01",
    email: "patient@medshare.org",
    fullName: "Arun Verma",
    phoneNumber: "+91-9876543211",
    role: "patient",
    city: "New Delhi",
    state: "Delhi",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    passwordHash: "PatientPass@2026",
  },
  {
    id: "usr-donor-01",
    email: "donor@medshare.org",
    fullName: "Pooja Sharma",
    phoneNumber: "+91-9876543212",
    role: "donor",
    city: "New Delhi",
    state: "Delhi",
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
    passwordHash: "DonorPass@2026",
  }
];

const seedDonorProfiles = [
  {
    id: "dnr-001",
    userId: "usr-donor-01",
    bloodGroup: "O+",
    city: "New Delhi",
    state: "Delhi",
    locality: "Hauz Khas",
    availabilityStatus: "available",
    preferredContactMethod: "phone",
    consentToContact: true,
    lastDonationDate: "2026-08-15",
    notes: "Verified voluntary life-saver with O+ blood group in South Delhi. Ready for emergency calls.",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
    donorName: "Pooja Sharma",
    phoneNumber: "+91-9876543212"
  }
];

for (let i = 1; i < 52; i++) {
  const userId = `usr-donor-${String(i + 1).padStart(2, '0')}`;
  const donorId = `dnr-${String(i + 1).padStart(3, '0')}`;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 3) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const bloodGroup = bloodGroups[i % bloodGroups.length];
  const cityData = cities[i % cities.length];
  const locality = cityData.localities[i % cityData.localities.length];
  const phone = getRandomPhone(i + 10);
  const email = `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}${i}@gmail.com`;

  // Add user record
  seedUsers.push({
    id: userId,
    email,
    fullName,
    phoneNumber: phone,
    role: "donor",
    city: cityData.city,
    state: cityData.state,
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-01-05T00:00:00.000Z",
    passwordHash: "DonorPass@2026"
  });

  const availability = i % 7 === 0 ? "busy" : (i % 11 === 0 ? "temporarily_unavailable" : "available");
  const month = (i % 8) + 1;
  const day = (i * 3 % 27) + 1;
  const lastDonationDate = `2026-0${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  seedDonorProfiles.push({
    id: donorId,
    userId,
    bloodGroup,
    city: cityData.city,
    state: cityData.state,
    locality,
    availabilityStatus: availability,
    preferredContactMethod: i % 2 === 0 ? "phone" : "in_app",
    consentToContact: true,
    lastDonationDate,
    notes: `Voluntary verified life-saver with ${bloodGroup} blood group. Located in ${locality}, ${cityData.city}. Ready for emergency hospital requests.`,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
    donorName: fullName,
    phoneNumber: phone
  });
}

// ==========================================
// 3. SEED REQUESTS (50 BLOOD + 50 ASSISTANCE = 100 TOTAL)
// ==========================================
const seedRequests = [];
const seedBloodDetails = [];

// 50 Emergency Blood Requests
for (let i = 0; i < 52; i++) {
  const reqId = `req-b-${String(i + 1).padStart(3, '0')}`;
  const bldId = `bld-${String(i + 1).padStart(3, '0')}`;
  const bloodGroup = bloodGroups[i % bloodGroups.length];
  const bloodComponent = bloodComponents[i % bloodComponents.length];
  const cityData = cities[i % cities.length];
  const locality = cityData.localities[i % cityData.localities.length];
  const urgency = urgencies[i % urgencies.length];
  const patientName = `${firstNames[(i + 5) % firstNames.length]} ${lastNames[(i + 7) % lastNames.length]}`;
  const unitsNeeded = (i % 3) + 1;
  
  // Realistic hospitals per city
  const hospitalNames = {
    "Gorakhpur": ["AIIMS Gorakhpur Trauma Center", "BRD Medical College Emergency Ward", "Fatima Hospital ICU", "Gorakhnath Hospital Blood Bank"],
    "Lucknow": ["KGMU Trauma ICU", "SGPGI Hematology Wing", "RML Institute of Medical Sciences", "Medanta Super Specialty"],
    "Varanasi": ["Sir Sunderlal Hospital (BHU)", "Heritage Institute Trauma Center", "Kashi Life Care Hospital"],
    "New Delhi": ["AIIMS New Delhi Emergency", "Safdarjung Hospital Trauma Center", "Max Super Speciality Saket", "Apollo Hospital"],
    "Mumbai": ["Tata Memorial Cancer Hospital", "KEM Hospital Emergency", "Kokilaben Hospital ICU"],
    "Bengaluru": ["Narayana Cardiac ICU", "Victoria Hospital Emergency", "Manipal Hospital Blood Center"],
    "Kanpur": ["GSVM Medical College ICU", "Regency Hospital Emergency"],
    "Patna": ["AIIMS Patna Emergency", "PMCH Trauma Center"]
  };
  const hospitalList = hospitalNames[cityData.city] || ["City Civil Hospital"];
  const hospital = hospitalList[i % hospitalList.length];

  // Most are approved to show the instant approval system, some matched, some resolved
  const status = i % 5 === 0 ? "matched" : (i % 9 === 0 ? "resolved" : "approved");

  const componentLabel = bloodComponent.replace(/_/g, ' ');
  const title = `Urgent: ${unitsNeeded} Unit(s) of ${bloodGroup} ${componentLabel} needed at ${hospital}`;
  const description = `Emergency requisition for patient ${patientName} admitted in ICU at ${hospital}, ${locality}, ${cityData.city}. Attending Doctor: Dr. ${lastNames[i % lastNames.length]}. Crossmatch requisition active.`;

  const reqObj = {
    id: reqId,
    userId: `usr-patient-${String((i % 25) + 1).padStart(2, '0')}`,
    category: "blood",
    title,
    description,
    city: cityData.city,
    state: cityData.state,
    locality,
    priority: urgency,
    status,
    preferredContactMethod: "phone",
    consentGiven: true,
    createdAt: `2026-10-${String((i % 18) + 1).padStart(2, '0')}T09:30:00.000Z`,
    updatedAt: `2026-10-${String((i % 18) + 1).padStart(2, '0')}T10:15:00.000Z`,
    userName: `${firstNames[(i + 12) % firstNames.length]} ${lastNames[(i + 14) % lastNames.length]}`,
    userEmail: `emergency.attendant${i}@medshare.org`
  };

  const bldObj = {
    id: bldId,
    requestId: reqId,
    patientName,
    hospitalName: hospital,
    hospitalAddress: `${locality}, ${cityData.city}`,
    bloodGroup,
    bloodComponent,
    unitsNeeded,
    requiredDate: `2026-10-${String((i % 18) + 2).padStart(2, '0')}`,
    urgencyLevel: urgency,
    medicalNotes: `Immediate surgical reserve required. Hospital Blood Bank Reference #HP-${9000 + i}. Contact Blood Coordinator directly.`,
    createdAt: reqObj.createdAt
  };

  seedRequests.push(reqObj);
  seedBloodDetails.push(bldObj);
}

// 52 Medical Assistance & Equipment Requests
const equipmentTitles = [
  { cat: "equipment", title: "Oxygen Concentrator (10 LPM Dual Flow) for Post-COVID Pulmonary Fibrosis Patient", desc: "Patient requiring high flow continuous oxygen therapy at home. Cannot afford commercial rental of ₹8,000/month." },
  { cat: "equipment", title: "Motorized Wheelchair Loan for Paraplegic Student Attending College", desc: "Seeking motorized wheelchair to enable independent mobility for 21-year-old university student." },
  { cat: "equipment", title: "Hospital Semi-Fowler Bed with Anti-Bedsore Air Mattress", desc: "For elderly stroke patient discharged from hospital requiring prolonged home rehabilitation." },
  { cat: "equipment", title: "CPAP / BiPAP Machine for Elderly COPD Patient with Hypoxia", desc: "Prescribed BiPAP nocturnal ventilation support. Family from economically weaker section seeking NGO equipment loan." },
  { cat: "equipment", title: "Pediatric Wheelchair with Safety Harness & Arm Support", desc: "For 8-year-old child with cerebral palsy undergoing physical therapy at medical college." },
  { cat: "equipment", title: "Medical Electric Suction Machine for Tracheostomy Care at Home", desc: "Critical suction equipment required to manage secretions for bedridden patient post-neurosurgery." },
  { cat: "equipment", title: "Insulin Cold-Storage Travel Pack for Type-1 Diabetic Child in Rural Area", desc: "Seeking portable mini insulin cooler flask to maintain insulin viability during frequent power outages." },
  { cat: "financial", title: "Ayushman Bharat Co-Pay Support for Pediatric Acute Lymphoblastic Leukemia", desc: "Child receiving chemotherapy at apex hospital. Family exhausted savings on out-of-pocket diagnostic tests." },
  { cat: "financial", title: "Post-Angioplasty Stent Recovery & Antiplatelet Medicine Fund Assistance", desc: "Single breadwinner underwent emergency cardiac stenting. Needing ₹4,500/month assistance for Ticagrelor course." },
  { cat: "financial", title: "Monthly Hemodialysis Vascular Graft Consumables Assistance", desc: "End-stage renal disease patient requiring 3 weekly dialysis cycles. Transport and AV fistula consumables subsidy needed." },
  { cat: "medicine", title: "Critical Immunosuppressant (Tacrolimus 1mg & Mycophenolate 500mg) for Kidney Transplant Recipient", desc: "Transplant recipient facing sudden financial crisis unable to purchase mandatory monthly anti-rejection medicines." },
  { cat: "medicine", title: "Monthly Supply of Subsidized Pirfenidone 200mg for Idiopathic Pulmonary Fibrosis", desc: "Doctor recommended antifibrotic therapy. Inquiring about Janaushadhi or surplus donor medicines." },
  { cat: "general", title: "Home Nurse & Palliative Care Guidance for Terminally Ill Cancer Patient", desc: "Seeking guidance from verified NGO or voluntary caregiver network for pain management and wound dressing." }
];

for (let i = 0; i < 52; i++) {
  const reqId = `req-a-${String(i + 1).padStart(3, '0')}`;
  const tpl = equipmentTitles[i % equipmentTitles.length];
  const cityData = cities[i % cities.length];
  const locality = cityData.localities[i % cityData.localities.length];
  const urgency = urgencies[i % urgencies.length];
  const status = i % 4 === 0 ? "matched" : (i % 7 === 0 ? "resolved" : "approved");

  seedRequests.push({
    id: reqId,
    userId: `usr-patient-${String((i % 20) + 1).padStart(2, '0')}`,
    category: tpl.cat,
    title: tpl.title,
    description: `${tpl.desc} Location: ${locality}, ${cityData.city}. Doctor verified prescription available.`,
    city: cityData.city,
    state: cityData.state,
    locality,
    priority: urgency,
    status,
    preferredContactMethod: "phone",
    consentGiven: true,
    createdAt: `2026-10-${String((i % 18) + 1).padStart(2, '0')}T11:00:00.000Z`,
    updatedAt: `2026-10-${String((i % 18) + 1).padStart(2, '0')}T12:00:00.000Z`,
    userName: `${firstNames[(i + 18) % firstNames.length]} ${lastNames[(i + 20) % lastNames.length]}`,
    userEmail: `caregiver${i}@medshare.org`
  });
}

// ==========================================
// 4. SEED ORGAN PLEDGES (52 PLEDGES)
// ==========================================
const seedOrganPledges = [];
for (let i = 0; i < 52; i++) {
  const pldId = `pld-${String(i + 1).padStart(3, '0')}`;
  const firstName = firstNames[(i + 8) % firstNames.length];
  const lastName = lastNames[(i + 11) % lastNames.length];
  const fullName = `${firstName} ${lastName}`;
  const cityData = cities[i % cities.length];
  const organs = organTypes[i % organTypes.length];
  const phone = getRandomPhone(i + 50);

  seedOrganPledges.push({
    id: pldId,
    fullName,
    email: `${firstName.toLowerCase().replace(/[^a-z]/g, "")}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}${i + 20}@gmail.com`,
    phone,
    city: cityData.city,
    state: cityData.state,
    pledgedOrgans: organs,
    declarationAcknowledged: true,
    createdAt: `2026-0${(i % 9) + 1}-15T00:00:00.000Z`
  });
}

// ==========================================
// 5. SEED MEDICINE CLAIMS (52 CLAIMS)
// ==========================================
const medicineCatalog = [
  { name: "Augmentin 625 Duo", dosage: "Amoxicillin 500mg + Clavulanic Acid 125mg", mrp: 220, offered: 110 },
  { name: "Januvia 100mg", dosage: "Sitagliptin Phosphate 100mg", mrp: 380, offered: 190 },
  { name: "Telma 40", dosage: "Telmisartan 40mg", mrp: 140, offered: 70 },
  { name: "Glycomet GP2", dosage: "Glimepiride 2mg + Metformin 500mg", mrp: 160, offered: 80 },
  { name: "Fabiflu 400", dosage: "Favipiravir 400mg", mrp: 450, offered: 225 },
  { name: "Foracort 200 Inhaler", dosage: "Budesonide 200mcg + Formoterol 6mcg", mrp: 490, offered: 245 },
  { name: "Rozavel 10", dosage: "Rosuvastatin 10mg", mrp: 180, offered: 90 },
  { name: "Pan 40", dosage: "Pantoprazole Gastro-Resistant 40mg", mrp: 120, offered: 60 },
  { name: "Azithral 500", dosage: "Azithromycin 500mg", mrp: 130, offered: 65 },
  { name: "Shelcal 500", dosage: "Calcium 500mg + Vitamin D3 250 IU", mrp: 110, offered: 55 },
  { name: "Ecosprin AV 75/20", dosage: "Aspirin 75mg + Atorvastatin 20mg", mrp: 150, offered: 75 },
  { name: "Thyronorm 50mcg", dosage: "Levothyroxine Sodium 50mcg", mrp: 160, offered: 80 },
  { name: "Montair LC", dosage: "Montelukast 10mg + Levocetirizine 5mg", mrp: 175, offered: 87 }
];

const doctors = [
  { name: "Dr. R.K. Mishra", reg: "UP-MCI-28491" },
  { name: "Dr. Neha Srivastava", reg: "UP-74892" },
  { name: "Dr. S.K. Agrawal", reg: "MCI-48120" },
  { name: "Dr. Vivek Sharma", reg: "DMC-39104" },
  { name: "Dr. Ananya Sen", reg: "WB-29481" },
  { name: "Dr. Priyanshu Gupta", reg: "KMC-58291" },
  { name: "Dr. Alok Verma", reg: "UP-91823" },
  { name: "Dr. Rashmi Nair", reg: "KMC-69102" }
];

const seedMedicineClaims = [
  {
    id: "clm-demo-001",
    listingId: "med-001",
    listingTitle: "Augmentin 625 Duo (Amoxicillin 500mg)",
    requesterId: "usr-patient-01",
    requesterName: "Arun Verma",
    requesterPhone: "+91-9876543211",
    patientName: "Arun Verma",
    doctorName: "Dr. Sanjeev Grover",
    doctorRegNo: "DMC-45129",
    prescriptionUrl: "https://documents.medshare.org/prescriptions/rx-augmentin-verma.pdf",
    notes: "Sinusitis course prescribed.",
    adminNotes: "Prescription valid and verified.",
    sellerName: "Rahul Gupta",
    sellerContact: "+91-9876543211",
    locality: "Hauz Khas",
    city: "New Delhi",
    mrpPrice: 220,
    offeredPrice: 110,
    status: "approved",
    createdAt: "2026-10-16T10:00:00.000Z"
  },
  {
    id: "clm-demo-003",
    listingId: "med-003",
    listingTitle: "Pantocid 40mg",
    requesterId: "usr-patient-02",
    requesterName: "Rohan Desai",
    requesterPhone: "+91-9876543214",
    patientName: "Rohan Desai",
    doctorName: "Dr. Ananya Sen",
    doctorRegNo: "WB-29481",
    prescriptionUrl: "https://documents.medshare.org/prescriptions/rx-verified.pdf",
    notes: "Gastric ulcer treatment.",
    sellerName: "Rohan Desai",
    sellerContact: "+91-9876543214",
    locality: "Bandra West",
    city: "Mumbai",
    mrpPrice: 160,
    offeredPrice: 80,
    status: "pending_verification",
    createdAt: "2026-10-15T15:00:00.000Z"
  }
];

for (let i = 0; i < 52; i++) {
  const claimId = `mcr-${String(i + 1).padStart(3, '0')}`;
  const med = medicineCatalog[i % medicineCatalog.length];
  const doc = doctors[i % doctors.length];
  const cityData = cities[i % cities.length];
  const locality = cityData.localities[i % cityData.localities.length];
  
  const requesterFirst = firstNames[(i + 15) % firstNames.length];
  const requesterLast = lastNames[(i + 18) % lastNames.length];
  const requesterName = `${requesterFirst} ${requesterLast}`;
  const requesterPhone = getRandomPhone(i + 70);

  const sellerFirst = firstNames[(i + 22) % firstNames.length];
  const sellerLast = lastNames[(i + 25) % lastNames.length];
  const sellerName = `${sellerFirst} ${sellerLast}`;
  const sellerContact = getRandomPhone(i + 120);

  // Status: majority approved so claimant immediately sees seller info, some completed
  const status = i % 6 === 0 ? "completed" : (i % 10 === 0 ? "pending_verification" : "approved");

  seedMedicineClaims.push({
    id: claimId,
    listingId: `med-gkp-${String((i % 180) + 1).padStart(3, '0')}`,
    listingTitle: `${med.name} (${med.dosage})`,
    requesterId: `usr-patient-${String((i % 25) + 1).padStart(2, '0')}`,
    requesterName,
    requesterPhone,
    patientName: `${firstNames[(i + 3) % firstNames.length]} ${requesterLast}`,
    doctorName: doc.name,
    doctorRegNo: doc.reg,
    prescriptionUrl: "https://documents.medshare.org/prescriptions/rx-verified.pdf",
    notes: `Prescription course validated by treating physician. Sealed surplus strip pickup scheduled.`,
    adminNotes: status === "approved" || status === "completed" 
      ? `Auto-verified via Doctor Reg #${doc.reg}. Claimant authenticated with valid phone.` 
      : "Prescription document under routine audit.",
    sellerName,
    sellerContact,
    locality,
    city: cityData.city,
    mrpPrice: med.mrp,
    offeredPrice: med.offered,
    status,
    reviewedBy: "usr-admin-01",
    reviewedAt: `2026-10-18T10:00:00.000Z`,
    createdAt: `2026-10-${String((i % 18) + 1).padStart(2, '0')}T08:00:00.000Z`
  });
}

// ==========================================
// 6. PROVIDER PROFILES & SUBMISSIONS (10 ITEMS)
// ==========================================
const seedProviderProfiles = {
  profiles: [
    {
      id: "prov-001",
      userId: "usr-prov-01",
      organizationName: "AIIMS Gorakhpur Healthcare Foundation",
      organizationType: "hospital",
      licenseNumber: "UP-HOSP-2024-0018",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      address: "Kunraghat, Gorakhpur",
      contactPhone: "+91-551-2207700",
      contactEmail: "admin@aiimsgorakhpur.edu.in",
      verificationStatus: "verified",
      verifiedAt: "2026-01-15T00:00:00.000Z",
      verifiedBy: "usr-admin-01",
      createdAt: "2026-01-07T00:00:00.000Z",
      updatedAt: "2026-01-07T00:00:00.000Z"
    },
    {
      id: "prov-002",
      userId: "usr-prov-02",
      organizationName: "Red Cross Society Blood Center Gorakhpur",
      organizationType: "blood_bank",
      licenseNumber: "UP-BB-2023-0941",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      address: "Mohaddipur, Gorakhpur",
      contactPhone: "+91-551-2201999",
      contactEmail: "redcross.gkp@gmail.com",
      verificationStatus: "verified",
      verifiedAt: "2026-01-16T00:00:00.000Z",
      verifiedBy: "usr-admin-01",
      createdAt: "2026-01-08T00:00:00.000Z",
      updatedAt: "2026-01-08T00:00:00.000Z"
    },
    {
      id: "prov-003",
      userId: "usr-prov-03",
      organizationName: "KGMU State Blood & Component Bank",
      organizationType: "blood_bank",
      licenseNumber: "UP-BB-2022-0012",
      city: "Lucknow",
      state: "Uttar Pradesh",
      address: "Chowk, Lucknow",
      contactPhone: "+91-522-2257540",
      contactEmail: "bloodbank@kgmu.org",
      verificationStatus: "verified",
      verifiedAt: "2026-01-18T00:00:00.000Z",
      verifiedBy: "usr-admin-01",
      createdAt: "2026-01-09T00:00:00.000Z",
      updatedAt: "2026-01-09T00:00:00.000Z"
    }
  ],
  submissions: [
    {
      id: "sub-001",
      providerId: "prov-001",
      organizationName: "AIIMS Gorakhpur Healthcare Foundation",
      documentName: "NABH_Accreditation_Certificate_2026.pdf",
      documentType: "Hospital Accreditation & Licensing",
      documentUrl: "https://documents.medshare.org/providers/nabh-aiims-gkp.pdf",
      notes: "NABH certified multi-specialty government institute.",
      status: "approved",
      reviewedBy: "usr-admin-01",
      reviewedAt: "2026-01-15T00:00:00.000Z",
      adminNotes: "Official NABH verification completed.",
      createdAt: "2026-01-07T00:00:00.000Z"
    },
    {
      id: "sub-002",
      providerId: "prov-002",
      organizationName: "Red Cross Society Blood Center Gorakhpur",
      documentName: "State_Drug_Controller_Blood_Bank_License.pdf",
      documentType: "State Drug Controller License",
      documentUrl: "https://documents.medshare.org/providers/redcross-gkp-license.pdf",
      notes: "Licensed voluntary component separation unit.",
      status: "approved",
      reviewedBy: "usr-admin-01",
      reviewedAt: "2026-01-16T00:00:00.000Z",
      adminNotes: "Valid drug controller license up to 2029.",
      createdAt: "2026-01-08T00:00:00.000Z"
    },
    {
      id: "sub-003",
      providerId: "prov-003",
      organizationName: "KGMU State Blood & Component Bank",
      documentName: "KGMU_State_Establishment_Certificate.pdf",
      documentType: "Clinical Establishment Registration",
      documentUrl: "https://documents.medshare.org/providers/kgmu-license.pdf",
      notes: "State apex trauma and blood bank accreditation renewal.",
      status: "pending",
      createdAt: "2026-01-10T00:00:00.000Z"
    }
  ]
};

// ==========================================
// 7. WRITE TO FILE
// ==========================================
const fileHeader = `// ====================================================================
// MedShare Seed Dataset
// Comprehensive 50+ Item Demo Dataset across All Healthcare Domains
// Gorakhpur Localities + National Metros Included
// ====================================================================

import {
  UserProfile,
  DonorProfile,
  AssistanceRequest,
  BloodRequestDetail,
  HealthcareResource,
  ProviderProfile,
  ProviderVerificationSubmission,
  OrganDonationPledge,
  MedicineClaimRequest,
} from "@/types";

export interface UserRecord extends UserProfile {
  passwordHash?: string;
}

// -------------------------------------------------------------
// 1. Comprehensive Verified Healthcare Resources (Directory) - ${seedResources.length} items
// -------------------------------------------------------------
export const seedResources: HealthcareResource[] = ${JSON.stringify(seedResources, null, 2)};

// -------------------------------------------------------------
// 2. Demo Users & Donors - ${seedUsers.length} Users, ${seedDonorProfiles.length} Donors
// -------------------------------------------------------------
export const seedUsers: UserRecord[] = ${JSON.stringify(seedUsers, null, 2)};

export const seedDonorProfiles: DonorProfile[] = ${JSON.stringify(seedDonorProfiles, null, 2)};

// -------------------------------------------------------------
// 3. Requests (${seedRequests.length} Total: ${seedBloodDetails.length} Blood + ${seedRequests.length - seedBloodDetails.length} Assistance)
// -------------------------------------------------------------
export const seedRequestsData: {
  requests: AssistanceRequest[];
  bloodDetails: BloodRequestDetail[];
} = {
  requests: ${JSON.stringify(seedRequests, null, 2)},
  bloodDetails: ${JSON.stringify(seedBloodDetails, null, 2)}
};

// -------------------------------------------------------------
// 4. Provider Profiles & Verifications
// -------------------------------------------------------------
export const seedProviderProfiles: {
  profiles: ProviderProfile[];
  submissions: ProviderVerificationSubmission[];
} = ${JSON.stringify(seedProviderProfiles, null, 2)};

// -------------------------------------------------------------
// 5. Organ Donation Pledges - ${seedOrganPledges.length} items
// -------------------------------------------------------------
export const seedOrganPledges: OrganDonationPledge[] = ${JSON.stringify(seedOrganPledges, null, 2)};

// -------------------------------------------------------------
// 6. Medicine Claims - ${seedMedicineClaims.length} items
// -------------------------------------------------------------
export const seedMedicineClaims: MedicineClaimRequest[] = ${JSON.stringify(seedMedicineClaims, null, 2)};
`;

const outputPath = path.resolve(__dirname, '../src/lib/data/seedData.ts');
fs.writeFileSync(outputPath, fileHeader, 'utf8');

console.log(`Successfully generated seed dataset:`);
console.log(`- Resources: ${seedResources.length}`);
console.log(`- Users: ${seedUsers.length}`);
console.log(`- Voluntary Donors: ${seedDonorProfiles.length}`);
console.log(`- Blood Requisitions: ${seedBloodDetails.length}`);
console.log(`- Assistance Requests: ${seedRequests.length - seedBloodDetails.length}`);
console.log(`- Organ Donation Pledges: ${seedOrganPledges.length}`);
console.log(`- Medicine Claims: ${seedMedicineClaims.length}`);
console.log(`File written to: ${outputPath}`);
