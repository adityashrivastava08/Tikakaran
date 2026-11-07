import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Tikakaran HMIS initial reference data...');

  // 1. Primary Health Centres & Sub-Centres
  const healthCentrePipariya = await prisma.healthCentre.upsert({
    where: { code: 'SC-49201' },
    update: {},
    create: {
      code: 'SC-49201',
      name: 'Sub-Centre Pipariya',
      type: 'SUB_CENTRE',
      block: 'Rampur Block',
      district: 'Jabalpur',
      state: 'Madhya Pradesh',
      phcName: 'Rampur PHC'
    }
  });

  const healthCentreKhera = await prisma.healthCentre.upsert({
    where: { code: 'SC-49202' },
    update: {},
    create: {
      code: 'SC-49202',
      name: 'Sub-Centre Khera Basti',
      type: 'SUB_CENTRE',
      block: 'Rampur Block',
      district: 'Jabalpur',
      state: 'Madhya Pradesh',
      phcName: 'Rampur PHC'
    }
  });

  // 2. Administrators, MOIC and ANMs
  const adminHash = await bcrypt.hash('Admin@12345', 10);
  await prisma.user.upsert({
    where: { email: 'admin.jabalpur@mphealth.gov.in' },
    update: {},
    create: {
      email: 'admin.jabalpur@mphealth.gov.in',
      passwordHash: adminHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  const moicHash = await bcrypt.hash('Moic@12345', 10);
  await prisma.user.upsert({
    where: { email: 'moic.rampur@mphealth.gov.in' },
    update: {},
    create: {
      email: 'moic.rampur@mphealth.gov.in',
      passwordHash: moicHash,
      role: 'PHC_MOIC',
      isActive: true
    }
  });

  const anmHash = await bcrypt.hash('ANM@12345', 10);
  // ANM 1: Pipariya
  await prisma.user.upsert({
    where: { email: 'anm.pipariya@mphealth.gov.in' },
    update: {},
    create: {
      email: 'anm.pipariya@mphealth.gov.in',
      passwordHash: anmHash,
      role: 'ANM',
      isActive: true,
      anmProfile: {
        create: {
          healthCentreId: healthCentrePipariya.id,
          fullName: 'Smt. Sunita Sharma',
          designation: 'Auxiliary Nurse Midwife (ANM)',
          mobile: '9826144521',
          hmisPortalId: 'MP-JBL-RMP-SC49201',
          rchPortalId: 'RCH-2026-99214',
          anmolId: 'ANMOL-MP-492'
        }
      }
    }
  });

  // ANM 2: Khera Basti (for testing data isolation)
  await prisma.user.upsert({
    where: { email: 'anm.khera@mphealth.gov.in' },
    update: {},
    create: {
      email: 'anm.khera@mphealth.gov.in',
      passwordHash: anmHash,
      role: 'ANM',
      isActive: true,
      anmProfile: {
        create: {
          healthCentreId: healthCentreKhera.id,
          fullName: 'Smt. Rekha Patel',
          designation: 'Auxiliary Nurse Midwife (ANM)',
          mobile: '9826188334',
          hmisPortalId: 'MP-JBL-RMP-SC49202',
          rchPortalId: 'RCH-2026-99215',
          anmolId: 'ANMOL-MP-493'
        }
      }
    }
  });

  // 3. Immunization Sites (AWCs)
  const sites = [
    { code: 'AWC-04', name: 'Anganwadi Kendra Pipariya Ward-04', village: 'Pipariya', ashaName: 'Sunita Malviya', ashaPhone: '+91 98261 44521', targetPopulation: 450, sessionDay: '1st Wednesday', healthCentreId: healthCentrePipariya.id },
    { code: 'AWC-07', name: 'Anganwadi Kendra Khera Basti', village: 'Khera Basti', ashaName: 'Meena Bai', ashaPhone: '+91 98263 11200', targetPopulation: 380, sessionDay: '2nd Wednesday', healthCentreId: healthCentreKhera.id },
    { code: 'AWC-02', name: 'Anganwadi Kendra Ward-02', village: 'Pipariya Ward 2', ashaName: 'Geeta Lodhi', ashaPhone: '+91 98265 99014', targetPopulation: 420, sessionDay: '3rd Wednesday', healthCentreId: healthCentrePipariya.id },
    { code: 'SC-MAIN', name: 'Sub-Centre Pipariya Clinic', village: 'Pipariya Central', ashaName: 'Radha Sharma', ashaPhone: '+91 94250 88912', targetPopulation: 850, sessionDay: 'Every Saturday', healthCentreId: healthCentrePipariya.id }
  ];

  for (const site of sites) {
    await prisma.site.upsert({
      where: { code: site.code },
      update: {},
      create: site
    });
  }

  // 4. National Universal Immunization Programme (UIP) Vaccine Master
  const vaccines = [
    { code: 'BCG', name: 'Bacillus Calmette–Guérin (BCG)', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'At Birth', recommendedAgeDays: 0, route: 'Intradermal', siteOfInjection: 'Left Upper Arm' },
    { code: 'HEP_B_0', name: 'Hepatitis B Birth Dose', targetGroup: 'CHILD', doseNumber: 0, doseLabel: 'Birth Dose', recommendedAgeDays: 0, route: 'Intramuscular', siteOfInjection: 'Anterolateral mid-thigh' },
    { code: 'OPV_0', name: 'Oral Polio Vaccine 0', targetGroup: 'CHILD', doseNumber: 0, doseLabel: 'Birth Dose', recommendedAgeDays: 0, route: 'Oral', siteOfInjection: 'Mouth (2 drops)' },
    { code: 'PENTA_1', name: 'Pentavalent 1 (DPT+HepB+Hib)', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (6 Weeks)', recommendedAgeDays: 42, route: 'Intramuscular', siteOfInjection: 'Anterolateral mid-thigh' },
    { code: 'ROTA_1', name: 'Rotavirus Vaccine 1', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (6 Weeks)', recommendedAgeDays: 42, route: 'Oral', siteOfInjection: 'Mouth (5 drops)' },
    { code: 'FIPV_1', name: 'Fractional IPV 1', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (6 Weeks)', recommendedAgeDays: 42, route: 'Intradermal', siteOfInjection: 'Right Upper Arm' },
    { code: 'OPV_1', name: 'bOPV 1', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (6 Weeks)', recommendedAgeDays: 42, route: 'Oral', siteOfInjection: 'Mouth (2 drops)' },
    { code: 'PENTA_2', name: 'Pentavalent 2', targetGroup: 'CHILD', doseNumber: 2, doseLabel: 'Dose 2 (10 Weeks)', recommendedAgeDays: 70, route: 'Intramuscular', siteOfInjection: 'Anterolateral mid-thigh' },
    { code: 'ROTA_2', name: 'Rotavirus Vaccine 2', targetGroup: 'CHILD', doseNumber: 2, doseLabel: 'Dose 2 (10 Weeks)', recommendedAgeDays: 70, route: 'Oral', siteOfInjection: 'Mouth (5 drops)' },
    { code: 'OPV_2', name: 'bOPV 2', targetGroup: 'CHILD', doseNumber: 2, doseLabel: 'Dose 2 (10 Weeks)', recommendedAgeDays: 70, route: 'Oral', siteOfInjection: 'Mouth (2 drops)' },
    { code: 'PENTA_3', name: 'Pentavalent 3', targetGroup: 'CHILD', doseNumber: 3, doseLabel: 'Dose 3 (14 Weeks)', recommendedAgeDays: 98, route: 'Intramuscular', siteOfInjection: 'Anterolateral mid-thigh' },
    { code: 'FIPV_2', name: 'Fractional IPV 2', targetGroup: 'CHILD', doseNumber: 2, doseLabel: 'Dose 2 (14 Weeks)', recommendedAgeDays: 98, route: 'Intradermal', siteOfInjection: 'Right Upper Arm' },
    { code: 'MR_1', name: 'Measles & Rubella 1 (MR-1)', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (9 Months)', recommendedAgeDays: 270, route: 'Subcutaneous', siteOfInjection: 'Right Upper Arm' },
    { code: 'JE_1', name: 'Japanese Encephalitis 1', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Dose 1 (9 Months)', recommendedAgeDays: 270, route: 'Subcutaneous', siteOfInjection: 'Left Upper Arm' },
    { code: 'DPT_BOOSTER_1', name: 'DPT Booster 1', targetGroup: 'CHILD', doseNumber: 1, doseLabel: 'Booster 1 (16-24 Months)', recommendedAgeDays: 480, route: 'Intramuscular', siteOfInjection: 'Anterolateral mid-thigh' },
    { code: 'MR_2', name: 'Measles & Rubella 2 (MR-2)', targetGroup: 'CHILD', doseNumber: 2, doseLabel: 'Booster 2 (16-24 Months)', recommendedAgeDays: 480, route: 'Subcutaneous', siteOfInjection: 'Right Upper Arm' },
    { code: 'TD_PREG_1', name: 'Tetanus & adult Diphtheria (Td-1)', targetGroup: 'PREGNANT_WOMAN', doseNumber: 1, doseLabel: 'Early Pregnancy', recommendedAgeDays: 0, route: 'Intramuscular', siteOfInjection: 'Upper Arm' },
    { code: 'TD_PREG_2', name: 'Tetanus & adult Diphtheria (Td-2)', targetGroup: 'PREGNANT_WOMAN', doseNumber: 2, doseLabel: '4 Weeks after Td-1', recommendedAgeDays: 28, route: 'Intramuscular', siteOfInjection: 'Upper Arm' }
  ];

  for (const v of vaccines) {
    await prisma.vaccineMaster.upsert({
      where: { code: v.code },
      update: {},
      create: v
    });
  }

  // 5. HMIS Indicator Items
  const hmisItems = [
    { itemCode: '1.1', section: 'MATERNAL_HEALTH', indicatorName: 'Total Pregnant Women registered for ANC', displayOrder: 1 },
    { itemCode: '1.2', section: 'MATERNAL_HEALTH', indicatorName: 'Number of PW registered within 1st Trimester (12 weeks)', displayOrder: 2 },
    { itemCode: '2.1', section: 'IMMUNIZATION', indicatorName: 'Infants given BCG vaccine', displayOrder: 10 },
    { itemCode: '2.2', section: 'IMMUNIZATION', indicatorName: 'Infants given Pentavalent-1 and bOPV-1', displayOrder: 11 },
    { itemCode: '2.3', section: 'IMMUNIZATION', indicatorName: 'Infants given Pentavalent-3 and fIPV-2', displayOrder: 12 },
    { itemCode: '2.4', section: 'IMMUNIZATION', indicatorName: 'Children (9-11 months) given MR-1 & Vitamin A Dose 1', displayOrder: 13 },
    { itemCode: '2.5', section: 'IMMUNIZATION', indicatorName: 'Fully Immunized Children (FIC, 9-11 months)', displayOrder: 14 }
  ];

  for (const item of hmisItems) {
    await prisma.hMISItem.upsert({
      where: { itemCode: item.itemCode },
      update: {},
      create: item
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
