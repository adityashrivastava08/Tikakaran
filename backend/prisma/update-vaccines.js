import prisma from '../src/services/prisma.service.js';

export const approvedUIPVaccines = [
  // 1. Birth Doses
  {
    code: 'BCG',
    name: 'Bacillus Calmette–Guérin (BCG)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'At Birth',
    recommendedAgeDays: 0,
    minAgeDays: 0,
    maxAgeDays: 365,
    route: 'Intradermal',
    siteOfInjection: 'Left Upper Arm'
  },
  {
    code: 'HEP_B_0',
    name: 'Hepatitis B Birth Dose',
    targetGroup: 'CHILD',
    doseNumber: 0,
    doseLabel: 'Birth Dose (within 24h)',
    recommendedAgeDays: 0,
    minAgeDays: 0,
    maxAgeDays: 1,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'OPV_0',
    name: 'Oral Polio Vaccine 0 (OPV-0)',
    targetGroup: 'CHILD',
    doseNumber: 0,
    doseLabel: 'Birth Dose (within 15 days)',
    recommendedAgeDays: 0,
    minAgeDays: 0,
    maxAgeDays: 15,
    route: 'Oral',
    siteOfInjection: 'Oral (2 drops)'
  },

  // 2. 6 Weeks Primary Doses (42 Days)
  {
    code: 'PENTA_1',
    name: 'Pentavalent 1 (DPT+HepB+Hib)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (6 Weeks)',
    recommendedAgeDays: 42,
    minAgeDays: 42,
    maxAgeDays: 365,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'OPV_1',
    name: 'bOPV 1',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (6 Weeks)',
    recommendedAgeDays: 42,
    minAgeDays: 42,
    maxAgeDays: 1825,
    route: 'Oral',
    siteOfInjection: 'Oral (2 drops)'
  },
  {
    code: 'ROTA_1',
    name: 'Rotavirus Vaccine 1 (RVV-1)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (6 Weeks)',
    recommendedAgeDays: 42,
    minAgeDays: 42,
    maxAgeDays: 365,
    route: 'Oral',
    siteOfInjection: 'Oral (5 drops)'
  },
  {
    code: 'FIPV_1',
    name: 'Fractional IPV 1 (fIPV-1)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (6 Weeks)',
    recommendedAgeDays: 42,
    minAgeDays: 42,
    maxAgeDays: 365,
    route: 'Intradermal',
    siteOfInjection: 'Right Upper Arm'
  },
  {
    code: 'PCV_1',
    name: 'Pneumococcal Conjugate Vaccine 1 (PCV-1)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (6 Weeks)',
    recommendedAgeDays: 42,
    minAgeDays: 42,
    maxAgeDays: 365,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },

  // 3. 10 Weeks Primary Doses (70 Days - Min 28 days after Dose 1)
  {
    code: 'PENTA_2',
    name: 'Pentavalent 2',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (10 Weeks)',
    recommendedAgeDays: 70,
    minAgeDays: 70,
    maxAgeDays: 365,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'OPV_2',
    name: 'bOPV 2',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (10 Weeks)',
    recommendedAgeDays: 70,
    minAgeDays: 70,
    maxAgeDays: 1825,
    route: 'Oral',
    siteOfInjection: 'Oral (2 drops)'
  },
  {
    code: 'ROTA_2',
    name: 'Rotavirus Vaccine 2 (RVV-2)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (10 Weeks)',
    recommendedAgeDays: 70,
    minAgeDays: 70,
    maxAgeDays: 365,
    route: 'Oral',
    siteOfInjection: 'Oral (5 drops)'
  },

  // 4. 14 Weeks Primary Doses (98 Days - Min 28 days after Dose 2)
  {
    code: 'PENTA_3',
    name: 'Pentavalent 3',
    targetGroup: 'CHILD',
    doseNumber: 3,
    doseLabel: 'Dose 3 (14 Weeks)',
    recommendedAgeDays: 98,
    minAgeDays: 98,
    maxAgeDays: 365,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'OPV_3',
    name: 'bOPV 3',
    targetGroup: 'CHILD',
    doseNumber: 3,
    doseLabel: 'Dose 3 (14 Weeks)',
    recommendedAgeDays: 98,
    minAgeDays: 98,
    maxAgeDays: 1825,
    route: 'Oral',
    siteOfInjection: 'Oral (2 drops)'
  },
  {
    code: 'ROTA_3',
    name: 'Rotavirus Vaccine 3 (RVV-3)',
    targetGroup: 'CHILD',
    doseNumber: 3,
    doseLabel: 'Dose 3 (14 Weeks)',
    recommendedAgeDays: 98,
    minAgeDays: 98,
    maxAgeDays: 365,
    route: 'Oral',
    siteOfInjection: 'Oral (5 drops)'
  },
  {
    code: 'FIPV_2',
    name: 'Fractional IPV 2 (fIPV-2)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (14 Weeks)',
    recommendedAgeDays: 98,
    minAgeDays: 98,
    maxAgeDays: 365,
    route: 'Intradermal',
    siteOfInjection: 'Right Upper Arm'
  },
  {
    code: 'PCV_2',
    name: 'Pneumococcal Conjugate Vaccine 2 (PCV-2)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (14 Weeks)',
    recommendedAgeDays: 98,
    minAgeDays: 98,
    maxAgeDays: 365,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },

  // 5. 9 to 12 Months (270 Days)
  {
    code: 'MR_1',
    name: 'Measles & Rubella 1 (MR-1)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (9-12 Months)',
    recommendedAgeDays: 270,
    minAgeDays: 270,
    maxAgeDays: 1825,
    route: 'Subcutaneous',
    siteOfInjection: 'Right Upper Arm'
  },
  {
    code: 'JE_1',
    name: 'Japanese Encephalitis 1 (JE-1)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (9-12 Months)',
    recommendedAgeDays: 270,
    minAgeDays: 270,
    maxAgeDays: 1825,
    route: 'Subcutaneous',
    siteOfInjection: 'Left Upper Arm'
  },
  {
    code: 'PCV_BOOSTER',
    name: 'PCV Booster',
    targetGroup: 'CHILD',
    doseNumber: 3,
    doseLabel: 'Booster (9-12 Months)',
    recommendedAgeDays: 270,
    minAgeDays: 270,
    maxAgeDays: 730,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'VITA_1',
    name: 'Vitamin A (1st Dose - 1 Lakh IU)',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Dose 1 (9 Months)',
    recommendedAgeDays: 270,
    minAgeDays: 270,
    maxAgeDays: 365,
    route: 'Oral',
    siteOfInjection: 'Oral (1 ml)'
  },

  // 6. 16 to 24 Months (480-720 Days)
  {
    code: 'MR_2',
    name: 'Measles & Rubella 2 (MR-2)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (16-24 Months)',
    recommendedAgeDays: 480,
    minAgeDays: 480,
    maxAgeDays: 1825,
    route: 'Subcutaneous',
    siteOfInjection: 'Right Upper Arm'
  },
  {
    code: 'JE_2',
    name: 'Japanese Encephalitis 2 (JE-2)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (16-24 Months)',
    recommendedAgeDays: 480,
    minAgeDays: 480,
    maxAgeDays: 1825,
    route: 'Subcutaneous',
    siteOfInjection: 'Left Upper Arm'
  },
  {
    code: 'DPT_BOOSTER_1',
    name: 'DPT Booster 1',
    targetGroup: 'CHILD',
    doseNumber: 1,
    doseLabel: 'Booster 1 (16-24 Months)',
    recommendedAgeDays: 480,
    minAgeDays: 480,
    maxAgeDays: 2555,
    route: 'Intramuscular',
    siteOfInjection: 'Anterolateral mid-thigh'
  },
  {
    code: 'OPV_BOOSTER',
    name: 'OPV Booster',
    targetGroup: 'CHILD',
    doseNumber: 4,
    doseLabel: 'Booster (16-24 Months)',
    recommendedAgeDays: 480,
    minAgeDays: 480,
    maxAgeDays: 1825,
    route: 'Oral',
    siteOfInjection: 'Oral (2 drops)'
  },
  {
    code: 'VITA_2',
    name: 'Vitamin A (2nd Dose - 2 Lakh IU)',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Dose 2 (16-24 Months)',
    recommendedAgeDays: 480,
    minAgeDays: 480,
    maxAgeDays: 730,
    route: 'Oral',
    siteOfInjection: 'Oral (2 ml)'
  },

  // 7. 5 to 6 Years (2190 Days)
  {
    code: 'DPT_BOOSTER_2',
    name: 'DPT Booster 2',
    targetGroup: 'CHILD',
    doseNumber: 2,
    doseLabel: 'Booster 2 (5-6 Years)',
    recommendedAgeDays: 2190,
    minAgeDays: 1825,
    maxAgeDays: 2555,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  },

  // 8. 10 & 16 Years
  {
    code: 'TD_10Y',
    name: 'Tetanus & adult Diphtheria (Td 10 Years)',
    targetGroup: 'ADOLESCENT',
    doseNumber: 1,
    doseLabel: 'Age 10 Years',
    recommendedAgeDays: 3650,
    minAgeDays: 3650,
    maxAgeDays: 4000,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  },
  {
    code: 'TD_16Y',
    name: 'Tetanus & adult Diphtheria (Td 16 Years)',
    targetGroup: 'ADOLESCENT',
    doseNumber: 2,
    doseLabel: 'Age 16 Years',
    recommendedAgeDays: 5840,
    minAgeDays: 5840,
    maxAgeDays: 6200,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  },

  // 9. Pregnant Women
  {
    code: 'TD_PREG_1',
    name: 'Tetanus & adult Diphtheria (Td-1 Early Pregnancy)',
    targetGroup: 'PREGNANT_WOMAN',
    doseNumber: 1,
    doseLabel: 'Early Pregnancy',
    recommendedAgeDays: 0,
    minAgeDays: 0,
    maxAgeDays: 280,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  },
  {
    code: 'TD_PREG_2',
    name: 'Tetanus & adult Diphtheria (Td-2)',
    targetGroup: 'PREGNANT_WOMAN',
    doseNumber: 2,
    doseLabel: '4 Weeks after Td-1',
    recommendedAgeDays: 28,
    minAgeDays: 28,
    maxAgeDays: 280,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  },
  {
    code: 'TD_PREG_BOOSTER',
    name: 'Tetanus & adult Diphtheria (Td Booster Pregnancy)',
    targetGroup: 'PREGNANT_WOMAN',
    doseNumber: 3,
    doseLabel: 'Td Booster (if 2 Td doses in last 3 yrs)',
    recommendedAgeDays: 0,
    minAgeDays: 0,
    maxAgeDays: 280,
    route: 'Intramuscular',
    siteOfInjection: 'Upper Arm'
  }
];

async function seedVaccines() {
  console.log('Seeding approved UIP vaccine masters...');
  let count = 0;
  for (const v of approvedUIPVaccines) {
    await prisma.vaccineMaster.upsert({
      where: { code: v.code },
      update: {
        name: v.name,
        targetGroup: v.targetGroup,
        doseNumber: v.doseNumber,
        doseLabel: v.doseLabel,
        recommendedAgeDays: v.recommendedAgeDays,
        minAgeDays: v.minAgeDays,
        maxAgeDays: v.maxAgeDays,
        route: v.route,
        siteOfInjection: v.siteOfInjection,
        isActive: true
      },
      create: v
    });
    count++;
  }
  console.log(`✅ Upserted ${count} approved UIP VaccineMaster records.`);
}

if (process.argv[1]?.includes('update-vaccines.js')) {
  seedVaccines().catch(console.error).finally(() => prisma.$disconnect());
}

