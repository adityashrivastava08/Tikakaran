import app from '../src/app.js';

async function runChildTests() {
  const server = app.listen(5003);
  const baseUrl = 'http://localhost:5003/api';
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
    console.log('\n========================================');
    console.log('🧪 RUNNING CHILD REGISTER INTEGRATION SUITE');
    console.log('========================================\n');

    // 1. Login as ANM Pipariya
    const pipariyaLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.pipariya@mphealth.gov.in', password: 'ANM@12345' })
    });
    const pipariyaData = await pipariyaLoginRes.json();
    const pipariyaToken = pipariyaData.data.token;

    // 2. Login as ANM Khera
    const kheraLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.khera@mphealth.gov.in', password: 'ANM@12345' })
    });
    const kheraData = await kheraLoginRes.json();
    const kheraToken = kheraData.data.token;

    // TEST 1: GET /api/children for Pipariya
    const listRes = await fetch(`${baseUrl}/children`, {
      headers: { 'Authorization': `Bearer ${pipariyaToken}` }
    });
    const listData = await listRes.json();
    assert(listRes.status === 200 && listData.data.length >= 5, `GET /api/children returns children list (found: ${listData.data.length})`);
    const firstChild = listData.data[0];

    // TEST 2: Search child by name
    const searchRes = await fetch(`${baseUrl}/children?search=Aarav`, {
      headers: { 'Authorization': `Bearer ${pipariyaToken}` }
    });
    const searchData = await searchRes.json();
    assert(searchData.data.length >= 1 && searchData.data[0].name.includes('Aarav'), 'Search child by name works');

    // TEST 3: Filter by site / AWC
    const siteRes = await fetch(`${baseUrl}/children?siteId=AWC-04`, {
      headers: { 'Authorization': `Bearer ${pipariyaToken}` }
    });
    const siteData = await siteRes.json();
    assert(siteData.data.every(c => c.awcCode === 'AWC-04'), 'Filter by AWC code works');

    // TEST 4: Filter by age group (0-11m)
    const ageRes = await fetch(`${baseUrl}/children?ageGroup=0-11m`, {
      headers: { 'Authorization': `Bearer ${pipariyaToken}` }
    });
    const ageData = await ageRes.json();
    assert(ageData.data.length >= 1 && ageData.data.every(c => c.ageMonths <= 11), 'Filter by age group (0-11m) works');

    // TEST 5: GET /api/children/:id with vaccination history
    const detailRes = await fetch(`${baseUrl}/children/${firstChild.id}`, {
      headers: { 'Authorization': `Bearer ${pipariyaToken}` }
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200 && detailData.data.vaccinationRecords?.length > 0,
      `GET /api/children/:id returns profile and ${detailData.data.vaccinationRecords?.length} UIP scheduled vaccines`);

    // TEST 6: POST /api/children - Register new child
    const newChildName = `Rohan Test ${Date.now().toString().slice(-4)}`;
    const newRchId = `984210${Math.floor(1000 + Math.random() * 9000)}`;
    const addRes = await fetch(`${baseUrl}/children`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pipariyaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newChildName,
        dob: '2026-08-01',
        gender: 'MALE',
        birthWeight: 3.1,
        motherName: 'Kalyani Test',
        fatherName: 'Vikas Test',
        guardianPhone: '9826199881',
        village: 'Pipariya',
        awcCode: 'AWC-04',
        rchId: newRchId,
        isHighRisk: false
      })
    });
    const addData = await addRes.json();
    assert(addRes.status === 201 && addData.data.registrationNumber, 'POST /api/children registers child and returns registrationNumber');
    const createdChildId = addData.data.id;

    // TEST 7: Duplicate detection on RCH ID
    const duplicateRchRes = await fetch(`${baseUrl}/children`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pipariyaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Another Child',
        dob: '2026-08-01',
        gender: 'FEMALE',
        motherName: 'Some Mother',
        guardianPhone: '9826100000',
        village: 'Pipariya',
        awcCode: 'AWC-04',
        rchId: newRchId // duplicate
      })
    });
    assert(duplicateRchRes.status === 409, 'Duplicate registration detected by RCH ID returns 409 Conflict');

    // TEST 8: Duplicate detection on Demographic Match (Name + DOB + Mother + Phone)
    const duplicateDemoRes = await fetch(`${baseUrl}/children`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pipariyaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newChildName, // same name
        dob: '2026-08-01',  // same dob
        gender: 'MALE',
        motherName: 'Kalyani Test', // same mother
        guardianPhone: '9826199881', // same phone
        village: 'Pipariya',
        awcCode: 'AWC-04'
      })
    });
    assert(duplicateDemoRes.status === 409, 'Duplicate registration detected by demographics returns 409 Conflict');

    // TEST 9: PUT /api/children/:id - Edit child
    const updateRes = await fetch(`${baseUrl}/children/${createdChildId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${pipariyaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${newChildName} (Updated)`,
        birthWeight: 3.4
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.data.name.includes('(Updated)'), 'PUT /api/children/:id updates child details');

    // TEST 10: ANM-wise Data Isolation - ANM Khera accessing Pipariya's child
    const unauthorizedChildRes = await fetch(`${baseUrl}/children/${createdChildId}`, {
      headers: { 'Authorization': `Bearer ${kheraToken}` }
    });
    assert(unauthorizedChildRes.status === 403, 'ANM Khera accessing ANM Pipariya child returns 403 Forbidden');

    console.log(`\n========================================`);
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Child test error:', err);
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runChildTests();

