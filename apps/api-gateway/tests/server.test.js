const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { server } = require('../dist/server');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

test('API Gateway Integration Tests', async (t) => {
  const PORT = 8999;
  await new Promise(resolve => server.listen(PORT, resolve));

  t.after(() => {
    server.close();
  });

  await t.test('GET /health returns 200 UP', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/health',
      method: 'GET'
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'UP');
    assert.strictEqual(res.headers['x-doctrine-compliance'], 'Article-1-bis');
  });

  await t.test('POST /api/deliberations calculates official RDC rate', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/deliberations',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      grades: [
        { disciplineId: 'MATH', disciplineName: 'Math', pointsObtenus: 40, pointsMaxima: 50 },
        { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 30, pointsMaxima: 50 }
      ]
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.deliberation.pourcentageOfficiel, 70.0);
    assert.strictEqual(res.body.deliberation.mention, 'DISTINCTION');
  });

  await t.test('POST /api/students/iune generates valid Congolese IUNE', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/students/iune',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      provinceCode: 'KIN',
      year: 2026
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.iune.startsWith('IUNE-CD-KIN-2026-'), true);
  });

  await t.test('POST /api/finance/pay BLOCKS teachers under Article 5 (403 FORBIDDEN)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/finance/pay',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'ENSEIGNANT' // Rôle enseignant illégal pour les finances
      }
    }, {
      schoolId: 'SCH-1',
      studentId: 'ST-1',
      amount: 50,
      currency: 'USD',
      feeType: 'MINERVAL',
      paymentChannel: 'CASH',
      cashierId: 'TEACHER-TRYING-TO-ACCESS'
    });

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.error, 'FORBIDDEN_ARTICLE_5');
  });

  await t.test('POST /api/finance/pay ALLOWS accountants (200 OK)', async () => {
    const res = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/finance/pay',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': 'COMPTABLE'
      }
    }, {
      schoolId: 'SCH-1',
      studentId: 'ST-1',
      amount: 100,
      currency: 'USD',
      feeType: 'MINERVAL',
      paymentChannel: 'MPESA',
      cashierId: 'CASHIER-99'
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.receipt.amount, 100);
  });
});
