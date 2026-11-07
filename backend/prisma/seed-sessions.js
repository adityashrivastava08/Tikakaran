import prisma from '../src/services/prisma.service.js';

async function seedSessions() {
  const anm = await prisma.aNMProfile.findFirst({
    where: { mobile: '9826144521' },
    include: { healthCentre: { include: { sites: true } } }
  });

  if (!anm || anm.healthCentre.sites.length === 0) {
    console.log('No ANM or sites found');
    return;
  }

  const site1 = anm.healthCentre.sites[0];
  const site2 = anm.healthCentre.sites[1] || site1;

  const today = new Date();
  const sessionDate1 = new Date(today);
  sessionDate1.setDate(today.getDate() + 1); // Tomorrow session

  const sessionDate2 = new Date(today); // Today session

  const existing = await prisma.vaccinationSession.findMany({
    where: { anmId: anm.id }
  });

  if (existing.length === 0) {
    await prisma.vaccinationSession.create({
      data: {
        siteId: site1.id,
        anmId: anm.id,
        sessionDate: sessionDate2,
        sessionType: 'ROUTINE_RI',
        startTime: '09:00 AM',
        endTime: '02:00 PM',
        status: 'IN_PROGRESS',
        beneficiariesTarget: 25,
        pregnantTarget: 8,
        beneficiariesActual: 6,
        pregnantActual: 2,
        coldChainStatus: '4.2°C Safe',
        remarks: 'Routine Immunization Session at AWC Pipariya Ward-04'
      }
    });

    await prisma.vaccinationSession.create({
      data: {
        siteId: site2.id,
        anmId: anm.id,
        sessionDate: sessionDate1,
        sessionType: 'ROUTINE_RI',
        startTime: '09:30 AM',
        endTime: '02:30 PM',
        status: 'SCHEDULED',
        beneficiariesTarget: 30,
        pregnantTarget: 10,
        beneficiariesActual: 0,
        pregnantActual: 0,
        coldChainStatus: '4.0°C Safe',
        remarks: 'Upcoming Outreach Session'
      }
    });

    console.log('✅ Created 2 sample vaccination sessions for ANM Pipariya');
  } else {
    console.log(`ANM Pipariya already has ${existing.length} sessions.`);
  }
}

seedSessions().catch(console.error).finally(() => prisma.$disconnect());

