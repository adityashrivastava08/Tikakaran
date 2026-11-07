import app from '../src/app.js';
import prisma from '../src/services/prisma.service.js';
import { 
  calculateAge, 
  determineVaccinationStatus, 
  UIP_MINIMUM_INTERVALS,
  toDateString 
} from '../src/services/vaccineCalculation.service.js';

async function runVaccinationTests() {
  const server = app.listen(5004);
  const baseUrl = 'http://localhost:5004/api';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    console.log('\n======================================================');
    console.log('🧪 RUNNING VACCINATION REGISTER & DUE ENGINE TEST SUITE');
    console.log('======================================================\n');

    // --------------------------------------------------------------------------
    // PART 1: UNIT CALCULATIONS & UIP SCHEDULE INTERVAL RULES
    // --------------------------------------------------------------------------
    console.log('--- Sub-Suite 1: Calculation Engine Unit Verification ---');

    // Test 1.1: Age calculation at birth
    const age0 = calculateAge('2026-11-07', '2026-11-07');
    assert(age0.totalDays === 0 && age0.formattedAge === '0 Days' && age0.ageGroup === '0-11m', 
      'Age calculation: 0 days at birth formatted correctly');

    // Test 1.2: Age calculation at 6 weeks (42 days)
    const age42 = calculateAge('2026-09-26', '2026-11-07');
    assert(age42.totalDays === 42 && age42.formattedAge === '1.4 Months', 
      'Age calculation: 42 days (6 weeks) formatted as 1.4 Months');

    // Test 1.3: Age calculation at 2+ years
    const age2y = calculateAge('2024-10-01', '2026-11-07');
    assert(age2y.years >= 2.0 && age2y.ageGroup === '2-5y', 
      'Age calculation: 2 years formatted in Yrs with 2-5y age group');

    // Test 1.4: UIP Minimum Intervals verification (no invented intervals)
    assert(UIP_MINIMUM_INTERVALS.PENTA['PENTA_1'].minIntervalDays === 28, 
      'UIP interval: Penta-1 to Penta-2 is exactly 28 days (4 weeks)');
    assert(UIP_MINIMUM_INTERVALS.PENTA['PENTA_2'].minIntervalDays === 28, 
      'UIP interval: Penta-2 to Penta-3 is exactly 28 days (4 weeks)');
    assert(UIP_MINIMUM_INTERVALS.FIPV['FIPV_1'].minIntervalDays === 56, 
      'UIP interval: fIPV-1 to fIPV-2 is exactly 56 days (8 weeks)');
    assert(UIP_MINIMUM_INTERVALS.MR['MR_1'].minIntervalDays === 180, 
      'UIP interval: MR-1 to MR-2 is exactly 180 days (6 months)');

    // Test 1.5: Status determination unit tests
    const todayStr = toDateString(new Date());
    assert(determineVaccinationStatus({ dueDate: todayStr, status: 'DUE' }) === 'Due Today', 
      'Status: Due date == today resolves to "Due Today"');
    assert(determineVaccinationStatus({ dueDate: '2020-01-01', status: 'DUE' }) === 'Overdue', 
      'Status: Due date < today resolves to "Overdue"');
    assert(determineVaccinationStatus({ dueDate: '2030-01-01', status: 'DUE' }) === 'Upcoming Due', 
      'Status: Due date > today resolves to "Upcoming Due"');
    assert(determineVaccinationStatus({ status: 'ADMINISTERED' }) === 'Completed', 
      'Status: ADMINISTERED resolves to "Completed"');

    // --------------------------------------------------------------------------
    // PART 2: INTEGRATION API VERIFICATION
    // --------------------------------------------------------------------------
    console.log('\n--- Sub-Suite 2: REST APIs & PostgreSQL Integration ---');

    // 2.1 Login as ANM Pipariya
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.pipariya@mphealth.gov.in', password: 'ANM@12345' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    // user.id is the user ID; token contains anmId
    const userId = loginData.data.user.id;

    // 2.2 Login as ANM Khera (for data isolation testing)
    const kheraLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.khera@mphealth.gov.in', password: 'ANM@12345' })
    });
    const kheraData = await kheraLoginRes.json();
    const kheraToken = kheraData.data.token;

    // TEST 2.3: GET /api/vaccinations/vaccines
    const vMasterRes = await fetch(`${baseUrl}/vaccinations/vaccines`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const vMasterData = await vMasterRes.json();
    assert(vMasterRes.status === 200 && vMasterData.data.length >= 20, 
      `GET /api/vaccinations/vaccines returns UIP vaccine masters (found: ${vMasterData.data.length})`);

    // TEST 2.4: Setup a verified sample child born exactly 42 days ago
    const today = new Date();
    const fortyTwoDaysAgo = new Date(today.getTime() - (42 * 24 * 60 * 60 * 1000));
    const dobString = toDateString(fortyTwoDaysAgo);

    // Register test child
    const childRegRes = await fetch(`${baseUrl}/children`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        name: 'Test Beneficiary Due Engine',
        dob: dobString,
        gender: 'FEMALE',
        motherName: 'Meera Devi',
        guardianPhone: '9826199999',
        village: 'Pipariya',
        awcCode: 'AWC-04'
      })
    });
    const childRegData = await childRegRes.json();
    assert(childRegRes.status === 201 && childRegData.data?.id, 
      `Test child created with DOB ${dobString} (born 42 days ago)`);
    const testChildId = childRegData.data?.id;

    // TEST 2.5: GET /api/vaccinations/due?tab=Due Today
    // Because child was born 42 days ago, 6-week vaccines (Penta-1, OPV-1, Rota-1, fIPV-1, PCV-1) are DUE TODAY!
    const dueTodayRes = await fetch(`${baseUrl}/vaccinations/due?tab=Due Today`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dueTodayData = await dueTodayRes.json();
    const testChildDueToday = dueTodayData.data.filter(item => item.childId === testChildId);
    assert(dueTodayRes.status === 200 && testChildDueToday.length >= 3, 
      `GET /api/vaccinations/due?tab=Due Today correctly identifies 6-week vaccines due today (found: ${testChildDueToday.length})`);

    // TEST 2.6: GET /api/vaccinations/due?tab=Overdue with search for test child
    // Birth doses (BCG, Hep B, OPV-0) were due 42 days ago and are Overdue
    const overdueRes = await fetch(`${baseUrl}/vaccinations/due?tab=Overdue&search=Test%20Beneficiary%20Due%20Engine`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const overdueData = await overdueRes.json();
    const testChildOverdue = overdueData.data.filter(item => item.childId === testChildId);
    assert(overdueRes.status === 200 && testChildOverdue.length >= 2, 
      `GET /api/vaccinations/due?tab=Overdue identifies overdue birth doses (found: ${testChildOverdue.length})`);

    // TEST 2.7: GET /api/vaccinations/due?tab=Upcoming Due
    // 10-week, 14-week, 9-month doses are upcoming
    const upcomingRes = await fetch(`${baseUrl}/vaccinations/due?tab=Upcoming Due&search=Test%20Beneficiary%20Due%20Engine`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const upcomingData = await upcomingRes.json();
    const testChildUpcoming = upcomingData.data.filter(item => item.childId === testChildId);
    assert(upcomingRes.status === 200 && testChildUpcoming.length >= 5, 
      `GET /api/vaccinations/due?tab=Upcoming Due identifies future scheduled doses (found: ${testChildUpcoming.length})`);

    // TEST 2.8: Due Summary Endpoint
    const summaryRes = await fetch(`${baseUrl}/vaccinations/due-summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const summaryData = await summaryRes.json();
    assert(summaryRes.status === 200 && summaryData.data.dueToday > 0 && summaryData.data.overdue > 0, 
      `GET /api/vaccinations/due-summary returns aggregated metrics (dueToday: ${summaryData.data.dueToday}, overdue: ${summaryData.data.overdue})`);

    // TEST 2.9: Cold Chain Validation Failure (temp > 8.0°C rejected)
    const penta1Record = testChildDueToday.find(r => r.vaccineCode === 'PENTA_1') || testChildDueToday[0];
    const invalidTempRes = await fetch(`${baseUrl}/vaccinations/record`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        recordId: penta1Record.id,
        childId: testChildId,
        vaccineId: penta1Record.vaccineId,
        doseGiven: penta1Record.dose,
        administeredDate: todayStr,
        batchNumber: 'LOT-TEST-999',
        coldChainTemp: 9.8 // INVALID: higher than 8°C!
      })
    });
    assert(invalidTempRes.status === 400, 'Cold chain out-of-range temperature (9.8°C) is rejected with 400 Bad Request');

    // TEST 2.10: Record Vaccination Dose Administration with Valid Cold Chain (4.2°C)
    // Check initial due date of Penta-2 before administration
    const penta2Initial = await prisma.vaccinationRecord.findFirst({
      where: { childId: testChildId, vaccine: { code: 'PENTA_2' } }
    });
    const penta2InitialDueDate = penta2Initial.dueDate;

    const validRecordRes = await fetch(`${baseUrl}/vaccinations/record`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        recordId: penta1Record.id,
        childId: testChildId,
        vaccineId: penta1Record.vaccineId,
        doseGiven: 'Dose 1 (6 Weeks)',
        administeredDate: todayStr,
        batchNumber: 'LOT-SERUM-2026A',
        coldChainTemp: 4.2,
        remarks: 'Administered at AWC Pipariya'
      })
    });
    const validRecordData = await validRecordRes.json();
    assert(validRecordRes.status === 201 && validRecordData.data?.record?.status === 'Completed', 
      'POST /api/vaccinations/record records dose, status becomes Completed');

    // TEST 2.11: Dynamic Schedule Recalculation (UIP Minimum Interval Enforcement)
    // Because Penta-1 was administered TODAY, Penta-2 due date must be AT LEAST Today + 28 days!
    const penta2Updated = await prisma.vaccinationRecord.findFirst({
      where: { childId: testChildId, vaccine: { code: 'PENTA_2' } }
    });
    const expectedMinPenta2DueDate = new Date(today.getTime() + (28 * 24 * 60 * 60 * 1000));
    const expectedDateStr = toDateString(expectedMinPenta2DueDate);
    const actualPenta2DateStr = toDateString(penta2Updated.dueDate);
    assert(actualPenta2DateStr >= expectedDateStr, 
      `Minimum interval enforced: Penta-2 due date dynamically shifted to ${actualPenta2DateStr} (>= ${expectedDateStr})`);

    // TEST 2.12: Check Child Vaccination History API
    const historyRes = await fetch(`${baseUrl}/vaccinations/history/${testChildId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const historyData = await historyRes.json();
    assert(historyRes.status === 200 && historyData.data.child.completedDoses >= 1 && historyData.data.timeline.length > 0, 
      `GET /api/vaccinations/history/:childId returns timeline and progress (${historyData.data.child.progressPercent}%)`);

    // TEST 2.13: Data Isolation - ANM Khera attempting to record on ANM Pipariya's child
    const unauthorizedRecordRes = await fetch(`${baseUrl}/vaccinations/record`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${kheraToken}` 
      },
      body: JSON.stringify({
        childId: testChildId,
        vaccineId: penta1Record.vaccineId,
        doseGiven: 'Dose 1',
        administeredDate: todayStr,
        batchNumber: 'LOT-FAIL',
        coldChainTemp: 4.2
      })
    });
    assert(unauthorizedRecordRes.status === 403, 
      'ANM Khera attempting to record dose for ANM Pipariya child receives 403 Forbidden');

    // Cleanup test child
    await prisma.child.delete({ where: { id: testChildId } });

  } catch (err) {
    console.error('Vaccination test suite error:', err);
    failed++;
  } finally {
    server.close();
    await prisma.$disconnect();

    console.log('\n======================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  }
}

runVaccinationTests();
