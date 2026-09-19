const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { server } = require('../dist/server');

let baseUrl;

test('SETUP: Starts HTTP Server on ephemeral port', (_, done) => {
  server.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(url, options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

test('API Gateway: GET /health returns 200 UP', async () => {
  const res = await request('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'UP');
});

test('API Gateway: POST /api/deliberations calculates RDC percentage', async () => {
  const res = await request('/api/deliberations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    grades: [
      { disciplineId: 'MATH', disciplineName: 'Mathématiques', pointsObtenus: 80, pointsMaxima: 100, coefficient: 2, isEliminatoire: true },
      { disciplineId: 'FR', disciplineName: 'Français', pointsObtenus: 40, pointsMaxima: 50, coefficient: 1, isEliminatoire: false }
    ]
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.deliberation.isAdmis, true);
});

test('API Gateway: POST /api/students/iune generates valid IUNE', async () => {
  const res = await request('/api/students/iune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { provinceCode: 'KIN', year: 2026 });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.iune.startsWith('IUNE-CD-KIN-2026-'), true);
});

test('API Gateway: POST /api/finance/pay BLOCKS ENSEIGNANT (Article 5 Constitution)', async () => {
  const res = await request('/api/finance/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'ENSEIGNANT' // TENTATIVE ENSEIGNANT SUR FINANCES
    }
  }, {
    studentId: 'ST-001',
    schoolId: 'SCH-KIN',
    amountCDF: 50000,
    motif: 'FRAIS_SCOLAIRES',
    operatorId: 'PROF-01'
  });
  assert.strictEqual(res.status, 403);
  assert.strictEqual(res.body.error, 'FORBIDDEN_ARTICLE_5');
});

test('API Gateway: POST /api/diplomas/issue issues sealed diploma (Module 76)', async () => {
  const res = await request('/api/diplomas/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    studentIune: 'IUNE-CD-KIN-2026-112233',
    studentFullName: 'TUTONDA Eric',
    studentBirthDate: '2008-05-15',
    studentBirthPlace: 'Kinshasa',
    schoolId: 'SCH-KIN-001',
    schoolName: 'Institut de la Gombe',
    province: 'KINSHASA',
    level: 'EXETAT',
    optionFiliere: 'SCIENTIFIQUE',
    pourcentage: 81.0,
    mention: 'GRANDE_DISTINCTION',
    academicYear: '2025-2026'
  });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.diploma.serialNumber.startsWith('CD-DIP-KIN-2025-'), true);
});

test('API Gateway: GET /api/sre/health returns SRE metrics and SLO status', async () => {
  const res = await request('/api/sre/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.serviceName, 'elysium-pgi-gateway');
  assert.strictEqual(typeof res.body.uptimePercentage, 'number');
});

test('API Gateway: POST /api/rbac/check verifies role permissions', async () => {
  const res = await request('/api/rbac/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    requesterId: 'PROF-1',
    requesterRole: 'ENSEIGNANT',
    requesterSchoolId: 'SCH-KIN',
    targetSchoolId: 'SCH-KIN',
    resource: 'grades',
    action: 'WRITE'
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.granted, true);
});

test('TEARDOWN: Closes HTTP Server', (_, done) => {
  server.close(done);
});
