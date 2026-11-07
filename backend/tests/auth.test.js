import app from '../src/app.js';

async function runTests() {
  const server = app.listen(5002);
  const baseUrl = 'http://localhost:5002/api';
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
    console.log('🧪 RUNNING AUTH & ANM PERMISSION SUITE');
    console.log('========================================\n');

    // TEST 1: Unauthorized access without token
    const unauthRes = await fetch(`${baseUrl}/auth/me`);
    assert(unauthRes.status === 401, 'Unauthorized request without token returns 401');

    // TEST 2: Login with invalid credentials
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.pipariya@mphealth.gov.in', password: 'WrongPassword123' })
    });
    assert(badLoginRes.status === 401, 'Login with wrong password returns 401');

    // TEST 3: Login as ANM Pipariya
    const anmLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anm.pipariya@mphealth.gov.in', password: 'ANM@12345' })
    });
    const anmLoginData = await anmLoginRes.json();
    assert(anmLoginRes.status === 200 && anmLoginData.data?.token, 'Login as ANM returns 200 + JWT');
    const anmToken = anmLoginData.data?.token;
    const anmProfileId = anmLoginData.data?.user?.id;

    // TEST 4: Get Profile via GET /auth/me
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${anmToken}` }
    });
    const meData = await meRes.json();
    assert(meData.data?.anmProfile?.fullName === 'Smt. Sunita Sharma', 'GET /auth/me returns ANM Sunita Sharma');

    // TEST 5: ANM Data Isolation - ANM requests /anm/profiles
    const anmProfilesRes = await fetch(`${baseUrl}/anm/profiles`, {
      headers: { 'Authorization': `Bearer ${anmToken}` }
    });
    const anmProfilesData = await anmProfilesRes.json();
    assert(anmProfilesData.data?.length === 1 && anmProfilesData.data[0].fullName === 'Smt. Sunita Sharma',
      'ANM querying /anm/profiles is isolated to their own profile only');

    // TEST 6: Role-Based Access - ANM attempting Admin endpoint
    const anmTryAdminRes = await fetch(`${baseUrl}/auth/admin/register-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anmToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'illegal.worker@mphealth.gov.in',
        password: 'Password123'
      })
    });
    assert(anmTryAdminRes.status === 403, 'ANM attempting admin registration receives 403 Forbidden');

    // TEST 7: Login as Admin
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin.jabalpur@mphealth.gov.in', password: 'Admin@12345' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.data?.user?.role === 'ADMIN', 'Login as Admin returns 200 + ADMIN role');
    const adminToken = adminLoginData.data?.token;

    // TEST 8: Admin querying /anm/profiles sees multiple Sub-Centre ANMs
    const adminProfilesRes = await fetch(`${baseUrl}/anm/profiles`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const adminProfilesData = await adminProfilesRes.json();
    assert(adminProfilesData.data?.length >= 2, `Admin querying /anm/profiles sees all health workers (found: ${adminProfilesData.data?.length})`);

    // TEST 9: Admin registers a new health worker
    const testNewWorkerEmail = `anm.test${Date.now()}@mphealth.gov.in`;
    const adminCreateRes = await fetch(`${baseUrl}/auth/admin/register-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testNewWorkerEmail,
        password: 'SecurePassword@2026',
        role: 'ANM',
        fullName: 'Smt. Anjali Tiwari',
        mobile: `9826${Math.floor(100000 + Math.random() * 900000)}`,
        designation: 'Auxiliary Nurse Midwife (ANM)',
        healthCentreCode: 'SC-49201'
      })
    });
    assert(adminCreateRes.status === 201, 'Admin registers new ANM successfully (201 Created)');

    // TEST 10: Health Centres listing
    const centresRes = await fetch(`${baseUrl}/anm/health-centres`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const centresData = await centresRes.json();
    assert(centresData.data?.length >= 2, 'GET /anm/health-centres returns available Sub-Centres');

    // TEST 11: Logout
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${anmToken}` }
    });
    assert(logoutRes.status === 200, 'POST /auth/logout returns 200 OK');

    console.log(`\n========================================`);
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
