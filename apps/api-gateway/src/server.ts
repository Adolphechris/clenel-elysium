import * as http from 'http';
import { calculateDeliberationRDC } from '@elysium/academic-engine';
import { generateOfficialReportCard } from '@elysium/report-card-generator';
import { calculateStudentAttendance } from '@elysium/attendance-service';
import { SealedFinanceService } from '@elysium/finance-service';
import { StudentService } from '@elysium/student-service';
import { DiplomaRegistry } from '@elysium/diploma-registry';
import { OerLibraryService } from '@elysium/oer-library';
import { SreMonitoringService } from '@elysium/sre-monitoring';
import { RbacEngine } from '@elysium/rbac-engine';
import { NotificationService } from '@elysium/notification-service';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const financeService = new SealedFinanceService();
const studentService = new StudentService();
const diplomaRegistry = new DiplomaRegistry();
const oerLibrary = new OerLibraryService();
const sreMonitoring = new SreMonitoringService('elysium-pgi-gateway');
const rbacEngine = new RbacEngine();
const notificationService = new NotificationService();

function parseJSON(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJSON(res: http.ServerResponse, status: number, data: any) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Elysium-Platform': 'Google-Cloud-Run',
    'X-Doctrine-Compliance': 'Article-1-bis'
  });
  res.end(JSON.stringify(data));
}

export const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const method = req.method || 'GET';

  // Enregistrement télémétrique à la fin de la réponse
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    sreMonitoring.recordRequest({
      route: url.pathname,
      method,
      statusCode: res.statusCode,
      durationMs,
      timestampUTC: new Date().toISOString()
    });
  });

  try {
    // 1. Health Check Google Cloud Run & Load Balancer
    if (method === 'GET' && url.pathname === '/health') {
      return sendJSON(res, 200, {
        status: 'UP',
        service: 'elysium-pgi-api',
        region: process.env.GCP_REGION || 'africa-south1',
        environment: process.env.NODE_ENV || 'production',
        timestampUTC: new Date().toISOString()
      });
    }

    // 2. Délibération Académique (Module 67)
    if (method === 'POST' && url.pathname === '/api/deliberations') {
      const payload = await parseJSON(req);
      const result = calculateDeliberationRDC(payload.grades);
      return sendJSON(res, 200, { success: true, deliberation: result });
    }

    // 3. Génération de Bulletin Officiel Scellé (Module 68)
    if (method === 'POST' && url.pathname === '/api/report-cards/generate') {
      const payload = await parseJSON(req);
      const doc = generateOfficialReportCard(payload);
      return sendJSON(res, 200, {
        success: true,
        hash: doc.hash,
        verificationUrl: doc.verificationUrl,
        reportCard: doc.reportCard
      });
    }

    // 4. Génération IUNE National (Module 58)
    if (method === 'POST' && url.pathname === '/api/students/iune') {
      const payload = await parseJSON(req);
      const iune = studentService.generateIUNE(payload.provinceCode || 'KIN', payload.year || 2026);
      return sendJSON(res, 200, { success: true, iune });
    }

    // 5. Bilan Assiduité et Alertes Présences (Module 62)
    if (method === 'POST' && url.pathname === '/api/attendance/summary') {
      const payload = await parseJSON(req);
      const summary = calculateStudentAttendance(payload.studentId, payload.entries || []);
      return sendJSON(res, 200, { success: true, summary });
    }

    // 6. Encaissement Caisse Étanche (Module 71 / Article 5)
    if (method === 'POST' && url.pathname === '/api/finance/pay') {
      const payload = await parseJSON(req);
      const role = req.headers['x-user-role'] as string || 'UNKNOWN';
      financeService.assertFinancialAccessAuthorized(role);
      const result = financeService.processPayment(payload);
      return sendJSON(res, result.success ? 200 : 400, result);
    }

    // 7. Émission et Vérification de Diplôme (Module 76)
    if (method === 'POST' && url.pathname === '/api/diplomas/issue') {
      const payload = await parseJSON(req);
      const diploma = diplomaRegistry.issueDiploma(payload);
      return sendJSON(res, 201, { success: true, diploma });
    }

    if (method === 'GET' && url.pathname === '/api/diplomas/verify') {
      const query = url.searchParams.get('q') || '';
      const verification = diplomaRegistry.verify(query);
      return sendJSON(res, 200, verification);
    }

    // 8. Bibliothèque OER / Ressources didactiques (Module 73)
    if (method === 'POST' && url.pathname === '/api/oer/search') {
      const query = await parseJSON(req);
      const results = oerLibrary.search(query);
      return sendJSON(res, 200, { success: true, count: results.length, resources: results });
    }

    // 9. Observabilité SRE & SLO/SLI (Tome 13)
    if (method === 'GET' && url.pathname === '/api/sre/health') {
      const health = sreMonitoring.evaluateHealth();
      return sendJSON(res, 200, health);
    }

    // 10. Contrôle d'accès RBAC / ABAC (Module 80)
    if (method === 'POST' && url.pathname === '/api/rbac/check') {
      const request = await parseJSON(req);
      const decision = rbacEngine.evaluate(request);
      return sendJSON(res, decision.httpStatus, decision);
    }

    // 11. Notification Alert (Module 70)
    if (method === 'POST' && url.pathname === '/api/notifications/alert-absence') {
      const payload = await parseJSON(req);
      const notif = notificationService.alertAbsenceToParent(payload);
      return sendJSON(res, 200, { success: true, notification: notif });
    }

    // 404 Route inconnue
    return sendJSON(res, 404, { error: 'NOT_FOUND', message: 'Route non répertoriée dans le PGI ELLYSIUM.' });

  } catch (err: any) {
    const isArticle5 = err.message && (err.message.includes('VIOLATION_ARTICLE_5') || err.message.includes('FORBIDDEN_ARTICLE_5'));
    const statusCode = isArticle5 ? 403 : 400;
    return sendJSON(res, statusCode, {
      error: isArticle5 ? 'FORBIDDEN_ARTICLE_5' : 'BAD_REQUEST',
      message: err.message || 'Erreur interne de traitement.'
    });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[ELLYSIUM PGI API] Écoute active sur le port ${PORT} (Cloud Run)`);
  });
}
