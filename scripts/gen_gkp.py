# Script to generate gorakhpurMedicines.ts with 210 realistic surplus medicine listings in Gorakhpur
import os

medicines_data = [
    # Antibiotics (25)
    ('Augmentin 625 Duo', 'Amoxicillin 500mg + Clavulanic Acid 125mg', 'GlaxoSmithKline (GSK)', 'Antibiotics', 220, '1 Full Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Azithral 500', 'Azithromycin 500mg', 'Alembic Pharmaceuticals', 'Antibiotics', 130, '1 Full Sealed Strip (5 Tablets)', 'sealed_blister'),
    ('Cifran 500', 'Ciprofloxacin 500mg', 'Sun Pharma', 'Antibiotics', 45, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Monocef-O 200', 'Cefpodoxime Proxetil 200mg', 'Aristo Pharmaceuticals', 'Antibiotics', 175, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Taxim-O 200', 'Cefixime 200mg', 'Alkem Laboratories', 'Antibiotics', 110, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Clavam 625', 'Amoxicillin 500mg + Potassium Clavulanate 125mg', 'Alkem Laboratories', 'Antibiotics', 215, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Zifi 200', 'Cefixime 200mg', 'FDC Limited', 'Antibiotics', 108, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Moxikind-CV 625', 'Amoxicillin 500mg + Clavulanic Acid 125mg', 'Mankind Pharma', 'Antibiotics', 185, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Doxy-1 L-DR Forte', 'Doxycycline 100mg + Lactic Acid Bacillus', 'USV Private Limited', 'Antibiotics', 98, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Levomac 500', 'Levofloxacin 500mg', 'Macleods Pharmaceuticals', 'Antibiotics', 105, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Oflox 200', 'Ofloxacin 200mg', 'Cipla Ltd', 'Antibiotics', 72, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Mahacef 200', 'Cefixime 200mg', 'Mankind Pharma', 'Antibiotics', 112, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Novamox 500', 'Amoxicillin 500mg', 'Cipla Ltd', 'Antibiotics', 82, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Norflox-TZ', 'Norfloxacin 400mg + Tinidazole 600mg', 'Cipla Ltd', 'Antibiotics', 94, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Zenflox-OZ', 'Ofloxacin 200mg + Ornidazole 500mg', 'Mankind Pharma', 'Antibiotics', 120, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Gudcef 200', 'Cefpodoxime Proxetil 200mg', 'Mankind Pharma', 'Antibiotics', 168, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Cepodem 200', 'Cefpodoxime Proxetil 200mg', 'Sun Pharma', 'Antibiotics', 180, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Avelox 400', 'Moxifloxacin 400mg', 'Bayer Pharmaceuticals', 'Antibiotics', 340, '1 Sealed Strip (5 Tablets)', 'sealed_blister'),
    ('Bactrim DS', 'Trimethoprim 160mg + Sulfamethoxazole 800mg', 'Abbott India', 'Antibiotics', 42, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Flagyl 400', 'Metronidazole 400mg', 'Abbott India', 'Antibiotics', 28, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Ciprobid 500', 'Ciprofloxacin 500mg', 'Zydus Cadila', 'Antibiotics', 48, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Roscillin 500', 'Ampicillin 500mg', 'Ranbaxy / Sun Pharma', 'Antibiotics', 65, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Omnicef 300', 'Cefdinir 300mg', 'Abbott India', 'Antibiotics', 260, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Maclar 500', 'Clarithromycin 500mg', 'Macleods Pharmaceuticals', 'Antibiotics', 280, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Klaricid 250', 'Clarithromycin 250mg', 'Abbott India', 'Antibiotics', 190, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),

    # Cardiology & Blood Pressure (30)
    ('Telma 40', 'Telmisartan 40mg', 'Glenmark Pharmaceuticals', 'Cardiology & Blood Pressure', 240, '2 Sealed Strips (30 Tablets)', 'sealed_blister'),
    ('Telma-H', 'Telmisartan 40mg + Hydrochlorothiazide 12.5mg', 'Glenmark Pharmaceuticals', 'Cardiology & Blood Pressure', 270, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Telma-AM', 'Telmisartan 40mg + Amlodipine 5mg', 'Glenmark Pharmaceuticals', 'Cardiology & Blood Pressure', 285, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Amlong 5', 'Amlodipine Besylate 5mg', 'Micro Labs', 'Cardiology & Blood Pressure', 68, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Amlokind-AT', 'Amlodipine 5mg + Atenolol 50mg', 'Mankind Pharma', 'Cardiology & Blood Pressure', 45, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Concor 5', 'Bisoprolol Fumarate 5mg', 'Merck Specialities', 'Cardiology & Blood Pressure', 125, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Cardivas 6.25', 'Carvedilol 6.25mg', 'Sun Pharma', 'Cardiology & Blood Pressure', 85, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Cardivas 12.5', 'Carvedilol 12.5mg', 'Sun Pharma', 'Cardiology & Blood Pressure', 145, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Nebicard 5', 'Nebivolol Hydrochloride 5mg', 'Torrent Pharmaceuticals', 'Cardiology & Blood Pressure', 160, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Metolar-XR 25', 'Metoprolol Succinate Extended Release 25mg', 'Cipla Ltd', 'Cardiology & Blood Pressure', 95, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Metolar-XR 50', 'Metoprolol Succinate Extended Release 50mg', 'Cipla Ltd', 'Cardiology & Blood Pressure', 165, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Atorva 10', 'Atorvastatin Calcium 10mg', 'Zydus Cadila', 'Cardiology & Blood Pressure', 110, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Atorva 20', 'Atorvastatin Calcium 20mg', 'Zydus Cadila', 'Cardiology & Blood Pressure', 195, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Atorva 40', 'Atorvastatin Calcium 40mg', 'Zydus Cadila', 'Cardiology & Blood Pressure', 310, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Rosuvas 10', 'Rosuvastatin Calcium 10mg', 'Sun Pharma', 'Cardiology & Blood Pressure', 185, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Rosuvas 20', 'Rosuvastatin Calcium 20mg', 'Sun Pharma', 'Cardiology & Blood Pressure', 325, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Tonact 20', 'Atorvastatin 20mg', 'Lupin Ltd', 'Cardiology & Blood Pressure', 190, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Ecosprin 75', 'Enteric Coated Aspirin 75mg', 'USV Private Limited', 'Cardiology & Blood Pressure', 12, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Ecosprin 150', 'Enteric Coated Aspirin 150mg', 'USV Private Limited', 'Cardiology & Blood Pressure', 15, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Clopilet 75', 'Clopidogrel Bisulphate 75mg', 'Sun Pharma', 'Cardiology & Blood Pressure', 135, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Brilinta 90', 'Ticagrelor 90mg', 'AstraZeneca Pharma', 'Cardiology & Blood Pressure', 950, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Minipress XL 2.5', 'Prazosin Hydrochloride 2.5mg', 'Pfizer Limited', 'Cardiology & Blood Pressure', 320, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Cilacar 10', 'Cilnidipine 10mg', 'J.B. Chemicals & Pharma', 'Cardiology & Blood Pressure', 120, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Cilacar 20', 'Cilnidipine 20mg', 'J.B. Chemicals & Pharma', 'Cardiology & Blood Pressure', 215, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Starpress-XL 25', 'Metoprolol Succinate 25mg', 'Lupin Ltd', 'Cardiology & Blood Pressure', 88, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Arkamin 100mcg', 'Clonidine Hydrochloride 100mcg', 'Torrent Pharmaceuticals', 'Cardiology & Blood Pressure', 65, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Dytor 10', 'Torsemide 10mg', 'Cipla Ltd', 'Cardiology & Blood Pressure', 92, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Dytor 20', 'Torsemide 20mg', 'Cipla Ltd', 'Cardiology & Blood Pressure', 155, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Aldactone 25', 'Spironolactone 25mg', 'RPG Life Sciences', 'Cardiology & Blood Pressure', 55, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Lasix 40', 'Furosemide 40mg', 'Sanofi India', 'Cardiology & Blood Pressure', 18, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),

    # Diabetes Care (30)
    ('Januvia 100', 'Sitagliptin Phosphate 100mg', 'MSD Pharmaceuticals', 'Diabetes Care', 380, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Janumet 50/500', 'Sitagliptin 50mg + Metformin 500mg', 'MSD Pharmaceuticals', 'Diabetes Care', 395, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Janumet 50/1000', 'Sitagliptin 50mg + Metformin 1000mg', 'MSD Pharmaceuticals', 'Diabetes Care', 440, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Glycomet 500', 'Metformin Hydrochloride 500mg', 'USV Private Limited', 'Diabetes Care', 32, '2 Sealed Strips (20 Tablets)', 'sealed_blister'),
    ('Glycomet 1000 SR', 'Metformin Hydrochloride 1000mg SR', 'USV Private Limited', 'Diabetes Care', 65, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Glycomet-GP 1', 'Glimepiride 1mg + Metformin 500mg', 'USV Private Limited', 'Diabetes Care', 115, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Glycomet-GP 2', 'Glimepiride 2mg + Metformin 500mg', 'USV Private Limited', 'Diabetes Care', 145, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Galvus 50', 'Vildagliptin 50mg', 'Novartis India', 'Diabetes Care', 320, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Galvus Met 50/500', 'Vildagliptin 50mg + Metformin 500mg', 'Novartis India', 'Diabetes Care', 340, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Jalra 50', 'Vildagliptin 50mg', 'USV Private Limited', 'Diabetes Care', 290, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Forxiga 10', 'Dapagliflozin Propanediol 10mg', 'AstraZeneca Pharma', 'Diabetes Care', 780, '1 Sealed Strip (14 Tablets)', 'sealed_blister'),
    ('Jardiance 10', 'Empagliflozin 10mg', 'Boehringer Ingelheim', 'Diabetes Care', 690, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Jardiance 25', 'Empagliflozin 25mg', 'Boehringer Ingelheim', 'Diabetes Care', 820, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Rybelsus 3mg', 'Semaglutide 3mg', 'Novo Nordisk India', 'Diabetes Care', 3200, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Rybelsus 7mg', 'Semaglutide 7mg', 'Novo Nordisk India', 'Diabetes Care', 3600, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Rybelsus 14mg', 'Semaglutide 14mg', 'Novo Nordisk India', 'Diabetes Care', 4100, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Tenelimac 20', 'Teneligliptin Hydrobromide 20mg', 'Macleods Pharmaceuticals', 'Diabetes Care', 135, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Ziten 20', 'Teneligliptin 20mg', 'Glenmark Pharmaceuticals', 'Diabetes Care', 140, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Trajenta 5', 'Linagliptin 5mg', 'Boehringer Ingelheim', 'Diabetes Care', 890, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Glucobay 50', 'Acarbose 50mg', 'Bayer Pharmaceuticals', 'Diabetes Care', 165, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Amaryl 1mg', 'Glimepiride 1mg', 'Sanofi India', 'Diabetes Care', 95, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Amaryl 2mg', 'Glimepiride 2mg', 'Sanofi India', 'Diabetes Care', 165, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Gluconorm-G 1 Forte', 'Glimepiride 1mg + Metformin 1000mg SR', 'Lupin Ltd', 'Diabetes Care', 130, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Gluconorm-G 2 Forte', 'Glimepiride 2mg + Metformin 1000mg SR', 'Lupin Ltd', 'Diabetes Care', 160, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Voglibose 0.2', 'Voglibose 0.2mg', 'Biocon Limited', 'Diabetes Care', 75, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Voglibose 0.3', 'Voglibose 0.3mg', 'Biocon Limited', 'Diabetes Care', 105, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Euthyrox 25mcg', 'Levothyroxine Sodium 25mcg', 'Merck Specialities', 'Diabetes Care', 120, '1 Unopened Bottle (100 Tablets)', 'unopened_bottle'),
    ('Euthyrox 50mcg', 'Levothyroxine Sodium 50mcg', 'Merck Specialities', 'Diabetes Care', 140, '1 Unopened Bottle (100 Tablets)', 'unopened_bottle'),
    ('Thyronorm 50mcg', 'Levothyroxine Sodium 50mcg', 'Abbott India', 'Diabetes Care', 155, '1 Unopened Bottle (120 Tablets)', 'unopened_bottle'),
    ('Thyronorm 100mcg', 'Levothyroxine Sodium 100mcg', 'Abbott India', 'Diabetes Care', 195, '1 Unopened Bottle (120 Tablets)', 'unopened_bottle'),

    # Gastrointestinal & Hepatic (25)
    ('Pantocid 40', 'Pantoprazole Gastro-resistant 40mg', 'Sun Pharma', 'Gastrointestinal', 160, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Pantocid-DSR', 'Pantoprazole 40mg + Domperidone 30mg SR', 'Sun Pharma', 'Gastrointestinal', 245, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Pan 40', 'Pantoprazole Sodium 40mg', 'Alkem Laboratories', 'Gastrointestinal', 155, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Pan-D', 'Pantoprazole 40mg + Domperidone 30mg SR', 'Alkem Laboratories', 'Gastrointestinal', 230, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Razo 20', 'Rabeprazole Sodium 20mg', 'Dr. Reddy Laboratories', 'Gastrointestinal', 165, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Razo-D', 'Rabeprazole 20mg + Domperidone 30mg SR', 'Dr. Reddy Laboratories', 'Gastrointestinal', 250, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Omez 20', 'Omeprazole 20mg', 'Dr. Reddy Laboratories', 'Gastrointestinal', 75, '1 Sealed Strip (20 Capsules)', 'sealed_blister'),
    ('Omez-D', 'Omeprazole 20mg + Domperidone 10mg', 'Dr. Reddy Laboratories', 'Gastrointestinal', 110, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Rabekind-DSR', 'Rabeprazole 20mg + Domperidone 30mg SR', 'Mankind Pharma', 'Gastrointestinal', 180, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Sompraz 40', 'Esomeprazole Magnesium 40mg', 'Sun Pharma', 'Gastrointestinal', 170, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Sompraz-D', 'Esomeprazole 40mg + Domperidone 30mg SR', 'Sun Pharma', 'Gastrointestinal', 235, '1 Sealed Strip (15 Capsules)', 'sealed_blister'),
    ('Nexpro 40', 'Esomeprazole 40mg', 'Torrent Pharmaceuticals', 'Gastrointestinal', 165, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Aciloc 150', 'Ranitidine Hydrochloride 150mg', 'Cadila Pharmaceuticals', 'Gastrointestinal', 35, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Zinetac 150', 'Ranitidine 150mg', 'GlaxoSmithKline (GSK)', 'Gastrointestinal', 38, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Ganaton 50', 'Itopride Hydrochloride 50mg', 'Abbott India', 'Gastrointestinal', 195, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Cremaffin Plus', 'Liquid Paraffin + Milk of Magnesia', 'Abbott India', 'Gastrointestinal', 260, '1 Unopened Bottle (225ml)', 'unopened_bottle'),
    ('Duphalac Syrup', 'Lactulose Oral Solution 10g/15ml', 'Abbott India', 'Gastrointestinal', 285, '1 Unopened Bottle (150ml)', 'unopened_bottle'),
    ('Udiliv 300', 'Ursodeoxycholic Acid 300mg', 'Abbott India', 'Gastrointestinal', 520, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Hepa-Merz', 'L-Ornithine L-Aspartate Granules 5g', 'Win-Medicare', 'Gastrointestinal', 850, '10 Unopened Sealed Sachets', 'intact_box'),
    ('Ursocol 300', 'Ursodeoxycholic Acid 300mg', 'Sun Pharma', 'Gastrointestinal', 495, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Liv-52 DS', 'Herbal Hepatoprotective Formulation', 'Himalaya Wellness', 'Gastrointestinal', 190, '1 Unopened Sealed Bottle (60 Tabs)', 'unopened_bottle'),
    ('Mucaine Gel', 'Oxetacaine + Aluminium Hydroxide Gel', 'Pfizer Limited', 'Gastrointestinal', 185, '1 Unopened Bottle (200ml)', 'unopened_bottle'),
    ('Sucrafil Suspension', 'Sucralfate Oral Suspension 1000mg/5ml', 'Fourrts India', 'Gastrointestinal', 210, '1 Unopened Bottle (200ml)', 'unopened_bottle'),
    ('Rifagut 400', 'Rifaximin 400mg', 'Sun Pharma', 'Gastrointestinal', 410, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Rifagut 550', 'Rifaximin 550mg', 'Sun Pharma', 'Gastrointestinal', 540, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),

    # Respiratory, Asthma & Allergy (25)
    ('Montair-LC', 'Montelukast Sodium 10mg + Levocetirizine 5mg', 'Cipla Ltd', 'Respiratory & Asthma', 210, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Monticope', 'Montelukast 10mg + Levocetirizine 5mg', 'Mankind Pharma', 'Respiratory & Asthma', 145, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Telekast-L', 'Montelukast 10mg + Levocetirizine 5mg', 'Lupin Ltd', 'Respiratory & Asthma', 195, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Bilashine 20', 'Bilastine 20mg', 'Sun Pharma', 'Respiratory & Asthma', 175, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Allegra 120', 'Fexofenadine Hydrochloride 120mg', 'Sanofi India', 'Respiratory & Asthma', 195, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Allegra 180', 'Fexofenadine Hydrochloride 180mg', 'Sanofi India', 'Respiratory & Asthma', 250, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Cetzine 10', 'Cetirizine Hydrochloride 10mg', 'Dr. Reddy Laboratories', 'Respiratory & Asthma', 45, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Levocet 5', 'Levocetirizine Dihydrochloride 5mg', 'Hetero Healthcare', 'Respiratory & Asthma', 55, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Deriphyllin Retard 150', 'Theophylline 115mg + Etofylline 35mg', 'Zydus Cadila', 'Respiratory & Asthma', 35, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Deriphyllin Retard 300', 'Theophylline 231mg + Etofylline 69mg', 'Zydus Cadila', 'Respiratory & Asthma', 52, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Asthalin 2mg', 'Salbutamol Sulphate 2mg', 'Cipla Ltd', 'Respiratory & Asthma', 18, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Asthalin Inhaler', 'Salbutamol 100mcg (200 MDI Doses)', 'Cipla Ltd', 'Respiratory & Asthma', 165, '1 Unopened Sealed Canister with Actuator', 'intact_box'),
    ('Budecort 200 Inhaler', 'Budesonide 200mcg (200 Inhalation Doses)', 'Cipla Ltd', 'Respiratory & Asthma', 380, '1 Unopened Sealed Inhaler', 'intact_box'),
    ('Budecort 0.5mg Respules', 'Budesonide 0.5mg/2ml (Pack of 5)', 'Cipla Ltd', 'Respiratory & Asthma', 125, '1 Sealed Foil Pack (5 Respules)', 'intact_box'),
    ('Foracort 200 Synchrobreathe', 'Formoterol 6mcg + Budesonide 200mcg', 'Cipla Ltd', 'Respiratory & Asthma', 510, '1 Sealed Inhaler Device (120 Doses)', 'intact_box'),
    ('Foracort 400 Inhaler', 'Formoterol 6mcg + Budesonide 400mcg', 'Cipla Ltd', 'Respiratory & Asthma', 640, '1 Sealed Inhaler (120 Doses)', 'intact_box'),
    ('Seroflo 250 Inhaler', 'Salmeterol 25mcg + Fluticasone 250mcg', 'Cipla Ltd', 'Respiratory & Asthma', 690, '1 Sealed Inhaler (120 Doses)', 'intact_box'),
    ('Duolin Respules', 'Levosalbutamol 1.25mg + Ipratropium 500mcg', 'Cipla Ltd', 'Respiratory & Asthma', 140, '1 Sealed Pack (5 Respules)', 'intact_box'),
    ('Aerocort Inhaler', 'Levosalbutamol 50mcg + Beclomethasone 50mcg', 'Cipla Ltd', 'Respiratory & Asthma', 295, '1 Sealed Inhaler (200 Doses)', 'intact_box'),
    ('Ascoril-D Plus Syrup', 'Dextromethorphan + Phenylephrine + Chlorpheniramine', 'Glenmark Pharmaceuticals', 'Respiratory & Asthma', 135, '1 Unopened Bottle (100ml)', 'unopened_bottle'),
    ('Grilinctus-LS Syrup', 'Levosalbutamol + Ambroxol + Guaiphenesin', 'Franco-Indian Pharma', 'Respiratory & Asthma', 120, '1 Unopened Bottle (100ml)', 'unopened_bottle'),
    ('Benadryl DR', 'Dextromethorphan Hydrobromide Cough Formula', 'Johnson & Johnson', 'Respiratory & Asthma', 130, '1 Unopened Bottle (100ml)', 'unopened_bottle'),
    ('Alex Syrup', 'Dextromethorphan 10mg + Chlorpheniramine 2mg', 'Glenmark Pharmaceuticals', 'Respiratory & Asthma', 128, '1 Unopened Bottle (100ml)', 'unopened_bottle'),
    ('Doxolin 400', 'Doxofylline 400mg', 'Zydus Cadila', 'Respiratory & Asthma', 140, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Montek-AB', 'Montelukast 10mg + Acebrophylline 200mg SR', 'Sun Pharma', 'Respiratory & Asthma', 260, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),

    # Pain Relief & Ortho (25)
    ('Dolo 650', 'Paracetamol 650mg Fast Dissolve', 'Micro Labs', 'Pain Relief & Ortho', 35, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Calpol 500', 'Paracetamol 500mg', 'GlaxoSmithKline (GSK)', 'Pain Relief & Ortho', 20, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Calpol 650', 'Paracetamol 650mg', 'GlaxoSmithKline (GSK)', 'Pain Relief & Ortho', 34, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Zerodol-P', 'Aceclofenac 100mg + Paracetamol 325mg', 'Ipca Laboratories', 'Pain Relief & Ortho', 75, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Zerodol-SP', 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg', 'Ipca Laboratories', 'Pain Relief & Ortho', 135, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Zerodol-TH', 'Aceclofenac 100mg + Thiocolchicoside 4mg', 'Ipca Laboratories', 'Pain Relief & Ortho', 210, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Combiflam', 'Ibuprofen 400mg + Paracetamol 325mg', 'Sanofi India', 'Pain Relief & Ortho', 48, '1 Sealed Strip (20 Tablets)', 'sealed_blister'),
    ('Flexon', 'Ibuprofen 400mg + Paracetamol 325mg', 'Aristo Pharmaceuticals', 'Pain Relief & Ortho', 35, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Hifenac-P', 'Aceclofenac 100mg + Paracetamol 325mg', 'Intas Pharmaceuticals', 'Pain Relief & Ortho', 82, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Hifenac-SP', 'Aceclofenac 100mg + Paracetamol 325mg + Serratiopeptidase 15mg', 'Intas Pharmaceuticals', 'Pain Relief & Ortho', 140, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Ultracet', 'Tramadol Hydrochloride 37.5mg + Paracetamol 325mg', 'Johnson & Johnson', 'Pain Relief & Ortho', 220, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Tramazac 50', 'Tramadol Hydrochloride 50mg', 'Zydus Cadila', 'Pain Relief & Ortho', 95, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Voveran SR 100', 'Diclofenac Sodium Sustained Release 100mg', 'Novartis India', 'Pain Relief & Ortho', 180, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Voveran 50', 'Diclofenac Sodium 50mg', 'Novartis India', 'Pain Relief & Ortho', 75, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Dynapar AQ Injection', 'Diclofenac Sodium 75mg/1ml (Pack of 5 Ampoules)', 'Troikaa Pharmaceuticals', 'Pain Relief & Ortho', 150, '1 Sealed Box (5 Ampoules)', 'intact_box'),
    ('Chymoral Forte', 'Trypsin-Chymotrypsin 100,000 AU Enteric Coated', 'Torrent Pharmaceuticals', 'Pain Relief & Ortho', 480, '1 Sealed Strip (20 Tablets)', 'sealed_blister'),
    ('Enzoflam', 'Diclofenac 50mg + Paracetamol 325mg + Serratiopeptidase 15mg', 'Alkem Laboratories', 'Pain Relief & Ortho', 145, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Myoril 4mg', 'Thiocolchicoside 4mg', 'Sanofi India', 'Pain Relief & Ortho', 230, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Thiospas 4', 'Thiocolchicoside 4mg Muscle Relaxant', 'Torrent Pharmaceuticals', 'Pain Relief & Ortho', 195, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Etoshine 90', 'Etoricoxib 90mg', 'Sun Pharma', 'Pain Relief & Ortho', 185, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Etoshine 120', 'Etoricoxib 120mg', 'Sun Pharma', 'Pain Relief & Ortho', 245, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Nurokind-Gold RF', 'Mecobalamin + Multivitamins & Minerals Capsules', 'Mankind Pharma', 'Pain Relief & Ortho', 135, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Nurokind-Plus RF', 'Mecobalamin 1500mcg + Alpha Lipoic Acid 100mg', 'Mankind Pharma', 'Pain Relief & Ortho', 165, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Gabapin-NT 100', 'Gabapentin 100mg + Nortriptyline 10mg', 'Intas Pharmaceuticals', 'Pain Relief & Ortho', 240, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Pregabalin 75', 'Pregabalin 75mg Nerve Pain Formula', 'Torrent Pharmaceuticals', 'Pain Relief & Ortho', 175, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),

    # Neurology & Mental Health (15)
    ('Nexito 10', 'Escitalopram Oxalate 10mg', 'Sun Pharma', 'Neurology', 115, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Nexito Plus', 'Escitalopram 5mg + Clonazepam 0.5mg', 'Sun Pharma', 'Neurology', 135, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Clonafit 0.5', 'Clonazepam 0.5mg', 'Mankind Pharma', 'Neurology', 55, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Epitril 0.5', 'Clonazepam 0.5mg', 'Novartis India', 'Neurology', 75, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Depsonil 25', 'Imipramine Hydrochloride 25mg', 'Abbott India', 'Neurology', 45, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Sizodon 1', 'Risperidone 1mg', 'Sun Pharma', 'Neurology', 65, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Sizodon 2', 'Risperidone 2mg', 'Sun Pharma', 'Neurology', 98, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Stalopam 10', 'Escitalopram 10mg', 'Lupin Ltd', 'Neurology', 110, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Qutipin 25', 'Quetiapine Fumarate 25mg', 'Sun Pharma', 'Neurology', 85, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Qutipin 50', 'Quetiapine Fumarate 50mg', 'Sun Pharma', 'Neurology', 145, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Torleva 500', 'Levetiracetam 500mg', 'Torrent Pharmaceuticals', 'Neurology', 195, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Tegrital 200', 'Carbamazepine 200mg Controlled Release', 'Novartis India', 'Neurology', 45, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Encorate Chrono 300', 'Sodium Valproate 200mg + Valproic Acid 87mg', 'Sun Pharma', 'Neurology', 120, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Encorate Chrono 500', 'Sodium Valproate 333mg + Valproic Acid 145mg', 'Sun Pharma', 'Neurology', 185, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Pacitane 2mg', 'Trihexyphenidyl Hydrochloride 2mg', 'Pfizer Limited', 'Neurology', 42, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),

    # Vitamins, Minerals & Supplements (15)
    ('Shelcal 500', 'Elemental Calcium 500mg + Vitamin D3 250IU', 'Torrent Pharmaceuticals', 'Vitamins & Supplements', 135, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Shelcal-HD', 'Calcium 500mg + Vitamin D3 500IU High Dose', 'Torrent Pharmaceuticals', 'Vitamins & Supplements', 155, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Becosules Z', 'B-Complex Forte with Vitamin C and Zinc', 'Pfizer Limited', 'Vitamins & Supplements', 52, '1 Sealed Strip (20 Capsules)', 'sealed_blister'),
    ('Neurobion Forte', 'Vitamin B Complex with Cyanocobalamin B12', 'Procter & Gamble Health', 'Vitamins & Supplements', 42, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Evion 400', 'Vitamin E 400mg Soft Gelatin Capsules', 'Procter & Gamble Health', 'Vitamins & Supplements', 38, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),
    ('Supradyn Daily', 'Multivitamin with Minerals & Trace Elements', 'Bayer Pharmaceuticals', 'Vitamins & Supplements', 60, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Autrin', 'Ferrous Fumarate + Folic Acid + B12', 'Pfizer Limited', 'Vitamins & Supplements', 115, '1 Sealed Strip (30 Tablets)', 'sealed_blister'),
    ('Orofer-XT', 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg', 'Emcure Pharmaceuticals', 'Vitamins & Supplements', 195, '1 Sealed Strip (10 Tablets)', 'sealed_blister'),
    ('Chericof Syrup', 'Dextromethorphan + Chlorpheniramine 100ml', 'Sun Pharma', 'Vitamins & Supplements', 118, '1 Unopened Bottle (100ml)', 'unopened_bottle'),
    ('Limcee 500', 'Vitamin C (Ascorbic Acid) 500mg Chewable', 'Abbott India', 'Vitamins & Supplements', 25, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Uprise-D3 60K', 'Cholecalciferol 60,000 IU Softgel Capsules', 'Alkem Laboratories', 'Vitamins & Supplements', 145, '1 Sealed Strip (4 Capsules)', 'sealed_blister'),
    ('Calcirol 60K Sachet', 'Cholecalciferol 60,000 IU Granules 1g', 'Cadila Pharmaceuticals', 'Vitamins & Supplements', 55, '4 Sealed Sachets (1g each)', 'intact_box'),
    ('Folvite 5mg', 'Folic Acid 5mg Pregnancy & Anemia Care', 'Pfizer Limited', 'Vitamins & Supplements', 78, '1 Sealed Strip (45 Tablets)', 'sealed_blister'),
    ('Zincovit', 'Multivitamins, Multiminerals with Grape Seed Extract', 'Apex Laboratories', 'Vitamins & Supplements', 115, '1 Sealed Strip (15 Tablets)', 'sealed_blister'),
    ('Eldoper 2mg', 'Loperamide Hydrochloride 2mg', 'Micro Labs', 'Vitamins & Supplements', 25, '1 Sealed Strip (10 Capsules)', 'sealed_blister'),

    # Dermatology & Topicals (10)
    ('Candid-B Cream', 'Clotrimazole 1% + Beclomethasone 0.025% (20g)', 'Glenmark Pharmaceuticals', 'Dermatology', 155, '1 Unopened Sealed Tube (20g)', 'intact_box'),
    ('Betnovate-C Cream', 'Betamethasone Valerate 0.1% + Clioquinol 3% (30g)', 'GlaxoSmithKline (GSK)', 'Dermatology', 65, '1 Unopened Sealed Tube (30g)', 'intact_box'),
    ('T-Bact Ointment', 'Mupirocin 2% w/w Antibacterial (5g)', 'GlaxoSmithKline (GSK)', 'Dermatology', 140, '1 Unopened Sealed Tube (5g)', 'intact_box'),
    ('Soframycin Skin Cream', 'Framycetin Sulphate 1% w/w (30g)', 'Sanofi India', 'Dermatology', 68, '1 Unopened Sealed Tube (30g)', 'intact_box'),
    ('Silverex Ionic Gel', 'Silver Sulfadiazine + Chlorhexidine Gluconate (20g)', 'Ranbaxy / Sun Pharma', 'Dermatology', 120, '1 Unopened Sealed Tube (20g)', 'intact_box'),
    ('Fourderm Cream', 'Chlorhexidine + Clobetasol + Miconazole + Neomycin (10g)', 'Cipla Ltd', 'Dermatology', 110, '1 Unopened Sealed Tube (10g)', 'intact_box'),
    ('Quadriderm RF Cream', 'Beclomethasone + Clotrimazole + Neomycin (10g)', 'Sun Pharma', 'Dermatology', 125, '1 Unopened Sealed Tube (10g)', 'intact_box'),
    ('Clobetamil-G Cream', 'Clobetasol Propionate 0.05% + Gentamicin 0.1% (25g)', 'Abbott India', 'Dermatology', 48, '1 Unopened Sealed Tube (25g)', 'intact_box'),
    ('Nadibact Cream', 'Nadifloxacin 1% Acne Formula (10g)', 'Cipla Ltd', 'Dermatology', 165, '1 Unopened Sealed Tube (10g)', 'intact_box'),
    ('Burnol Cream', 'Aminacrine Hydrochloride + Cetrimide (20g)', 'Dr. Morepen Laboratories', 'Dermatology', 85, '1 Unopened Sealed Tube (20g)', 'intact_box'),

    # Ophthalmology & ENT (10)
    ('Ciplox Eye/Ear Drops', 'Ciprofloxacin Hydrochloride 0.3% w/v (10ml)', 'Cipla Ltd', 'General Healthcare', 22, '1 Unopened Bottle with Sterile Nozzle', 'unopened_bottle'),
    ('Refresh Tears', 'Carboxymethylcellulose Sodium 0.5% Lubricant (10ml)', 'Allergan India', 'General Healthcare', 165, '1 Unopened Sealed Dropper Bottle', 'unopened_bottle'),
    ('Moxicip Eye Drops', 'Moxifloxacin 0.5% w/v Sterile Drops (5ml)', 'Cipla Ltd', 'General Healthcare', 115, '1 Unopened Sterile Dropper Bottle', 'unopened_bottle'),
    ('Tobastar Eye Drops', 'Tobramycin 0.3% w/v (5ml)', 'Mankind Pharma', 'General Healthcare', 65, '1 Unopened Sterile Dropper Bottle', 'unopened_bottle'),
    ('Otrivin Adult Nasal Spray', 'Xylometazoline Hydrochloride 0.1% w/v (10ml)', 'GlaxoSmithKline (GSK)', 'General Healthcare', 112, '1 Unopened Metered Dose Spray (10ml)', 'unopened_bottle'),
    ('Nasivion Adult Nasal Drops', 'Oxymetazoline Hydrochloride 0.05% (10ml)', 'Procter & Gamble Health', 'General Healthcare', 105, '1 Unopened Sealed Dropper Bottle', 'unopened_bottle'),
    ('Systane Ultra Eye Drops', 'Polyethylene Glycol 400 + Propylene Glycol (10ml)', 'Alcon Laboratories', 'General Healthcare', 440, '1 Unopened Sterile Dropper Bottle', 'unopened_bottle'),
    ('Milflox Eye Drops', 'Moxifloxacin Hydrochloride 0.5% w/v (5ml)', 'Sun Pharma', 'General Healthcare', 120, '1 Unopened Sterile Dropper Bottle', 'unopened_bottle'),
    ('Waxolve Ear Drops', 'Paradichlorobenzene + Benzocaine + Chlorbutol (10ml)', 'Alkem Laboratories', 'General Healthcare', 95, '1 Unopened Bottle with Applicator', 'unopened_bottle'),
    ('Soliwax Ear Drops', 'Ear Wax Softener with Turpentine Oil (10ml)', 'Sun Pharma', 'General Healthcare', 98, '1 Unopened Bottle with Dropper', 'unopened_bottle')
]

localities = [
    'Golghar', 'Betiahata', 'Mohaddipur', 'Medical College Road', 'BRD Medical College Campus',
    'Civil Lines', 'Asuran Chowk', 'Shahpur', 'Taramandal', 'Rustampur',
    'Basharatpur', 'Rapti Nagar Phase 1', 'Rapti Nagar Phase 4', 'Bank Road', 'Khorabar',
    'Kunraghat', 'Daudpur', 'Alinagar', 'Surajkund', 'Gita Vatika',
    'Bichhia', 'Transport Nagar', 'Padri Bazar', 'Gargi Nagar', 'Railway Colony',
    'Subhash Nagar', 'Purdilpur', 'Bilandpur', 'Charfatak', 'Miyan Baza'
]

sellers = [
    ('Amitabh Tripathi', '+91 94500 23145'),
    ('Pooja Srivastava', '+91 98380 56789'),
    ('Rakesh Pandey', '+91 97920 11223'),
    ('Dr. Alok Shukla', '+91 99180 34567'),
    ('Vikas Jaiswal', '+91 91400 78901'),
    ('Sunita Dubey', '+91 73880 45612'),
    ('Sanjay Gupta', '+91 80040 67890'),
    ('Anuradha Singh', '+91 94510 89123'),
    ('Manoj Tiwari', '+91 98390 12345'),
    ('Anjali Verma', '+91 97210 67891'),
    ('Deepak Maurya', '+91 99350 23456'),
    ('Neelam Mishra', '+91 91610 78912'),
    ('Abhishek Yadav', '+91 73760 34567'),
    ('Pradeep Agrawal', '+91 80520 89123'),
    ('Ritu Chauhan', '+91 94150 45678'),
    ('Suresh Chandra', '+91 98381 90123'),
    ('Kavita Sahu', '+91 97921 34567'),
    ('Naveen Srivastava', '+91 99181 78901'),
    ('Ashutosh Rai', '+91 91401 23456'),
    ('Dr. Vandana Pathak', '+91 73881 67890'),
    ('Manish Madheshiya', '+91 80041 12345'),
    ('Shweta Singh', '+91 94501 56789'),
    ('Rajesh Mall', '+91 98391 90123'),
    ('Priyanka Barnwal', '+91 97211 34567'),
    ('Vivek Chaubey', '+91 99351 78901'),
    ('Anita Kashyap', '+91 91611 23456'),
    ('Dharmendra Nishad', '+91 73761 67890'),
    ('Archana Upadhyay', '+91 80521 12345'),
    ('Gaurav Keshari', '+91 94151 56789'),
    ('Meena Sahani', '+91 98382 90123')
]

expiry_dates = [
    '2027-04-15', '2027-05-20', '2027-06-10', '2027-07-25', '2027-08-18',
    '2027-09-30', '2027-10-15', '2027-11-20', '2027-12-10', '2028-01-15',
    '2028-02-28', '2028-03-20', '2028-04-10', '2028-05-15', '2028-06-30',
    '2028-07-22', '2028-08-14', '2028-09-28', '2028-10-18', '2028-11-25'
]

notes_templates = [
    'Prescribed course altered by physician at BRD Medical College. Fully sealed blister pack stored safely.',
    'Treatment completed in Betiahata clinic. 1 unexpired sealed strip remaining, kept in cool dry place.',
    'Doctor switched medication dose at AIIMS Gorakhpur. Original sealed pack available at half price.',
    'Excess strip remaining after full recovery. 100% genuine sealed pack with hologram.',
    'Donating leftover medicine free of cost for any needy patient in Gorakhpur with valid prescription.',
    'Maintenance medication leftover after regime change. Brand new unopened pack.',
    'Sealed packaging intact with clearly legible expiry and batch details from Gorakhpur pharmacy.',
    'Unopened factory sealed pack available for immediate pickup near Golghar.',
    'Excess unexpired strip kept in temperature controlled home storage. Offering at 50% discount to reduce waste.',
    'Donating to economically distressed patients. Prescription mandatory.'
]

out = '''// ====================================================================
// MedShare Seed Data: Curated Surplus Medicines (Gorakhpur, Uttar Pradesh)
// 210 verified, unexpired surplus medicine listings across Gorakhpur localities
// ====================================================================

import { SurplusMedicineListing } from '@/types';

export const gorakhpurSurplusMedicines: SurplusMedicineListing[] = [
'''

for idx, (med_name, dosage, mfg, cat, mrp, qty, pack_cond) in enumerate(medicines_data, 1):
    med_id = f'med-gkp-{idx:03d}'
    loc = localities[(idx - 1) % len(localities)]
    seller_name, seller_phone = sellers[(idx - 1) % len(sellers)]
    exp_date = expiry_dates[(idx - 1) % len(expiry_dates)]
    note_tmpl = notes_templates[(idx - 1) % len(notes_templates)]
    batch = f'GKP26-B{idx:03d}'
    
    # Approx 15% are free donations, 85% are 50% discount
    is_donation = (idx % 7 == 0)
    if is_donation:
        offered = 0
        discount = 100
        notes = f'Free Charitable Donation: {note_tmpl}'
    else:
        offered = round(mrp / 2)
        discount = 50
        notes = f'Flat 50% Off MRP: {note_tmpl}'

    out += f'''  {{
    id: '{med_id}',
    userId: 'usr-gkp-{idx:03d}',
    sellerName: '{seller_name}',
    sellerContact: '{seller_phone}',
    medicineName: '{med_name}',
    dosage: '{dosage}',
    manufacturer: '{mfg}',
    category: '{cat}',
    mrpPrice: {mrp},
    offeredPrice: {offered},
    discountPercentage: {discount},
    quantityRemaining: '{qty}',
    expiryDate: '{exp_date}',
    batchNumber: '{batch}',
    packagingCondition: '{pack_cond}',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    locality: '{loc}',
    notes: '{notes}',
    status: 'available',
    createdAt: '2026-10-17T08:{(idx * 7) % 60:02d}:00.000Z',
    updatedAt: '2026-10-17T08:{(idx * 7) % 60:02d}:00.000Z',
  }},
'''

out += '''];
'''

with open('src/lib/data/gorakhpurMedicines.ts', 'w', encoding='utf-8') as f:
    f.write(out)

print(f'Successfully generated src/lib/data/gorakhpurMedicines.ts with {len(medicines_data)} medicines in Gorakhpur!')
