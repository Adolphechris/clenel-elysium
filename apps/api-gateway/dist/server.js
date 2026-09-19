"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const http = __importStar(require("http"));
const academic_engine_1 = require("@elysium/academic-engine");
const report_card_generator_1 = require("@elysium/report-card-generator");
const attendance_service_1 = require("@elysium/attendance-service");
const finance_service_1 = require("@elysium/finance-service");
const student_service_1 = require("@elysium/student-service");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const financeService = new finance_service_1.SealedFinanceService();
const studentService = new student_service_1.StudentService();
function parseJSON(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            }
            catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}
function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Elysium-Platform': 'Google-Cloud-Run',
        'X-Doctrine-Compliance': 'Article-1-bis'
    });
    res.end(JSON.stringify(data));
}
exports.server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const method = req.method;
    try {
        // 1. Health Check pour Google Cloud Run & Load Balancer
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
            const result = (0, academic_engine_1.calculateDeliberationRDC)(payload.grades);
            return sendJSON(res, 200, { success: true, deliberation: result });
        }
        // 3. Génération de Bulletin Officiel Scellé (Module 68)
        if (method === 'POST' && url.pathname === '/api/report-cards/generate') {
            const payload = await parseJSON(req);
            const doc = (0, report_card_generator_1.generateOfficialReportCard)(payload);
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
            const summary = (0, attendance_service_1.calculateStudentAttendance)(payload.studentId, payload.entries || []);
            return sendJSON(res, 200, { success: true, summary });
        }
        // 6. Encaissement Caisse Étanche (Module 71 / Article 5)
        if (method === 'POST' && url.pathname === '/api/finance/pay') {
            const payload = await parseJSON(req);
            // Contrôle de rôle obligatoire
            const role = req.headers['x-user-role'] || 'UNKNOWN';
            financeService.assertFinancialAccessAuthorized(role);
            const result = financeService.processPayment(payload);
            return sendJSON(res, result.success ? 200 : 400, result);
        }
        // 404 Route inconnue
        return sendJSON(res, 404, { error: 'NOT_FOUND', message: 'Route non répertoriée dans le PGI ELLYSIUM.' });
    }
    catch (err) {
        const isArticle5 = err.message && err.message.includes('VIOLATION_ARTICLE_5');
        const statusCode = isArticle5 ? 403 : 400;
        return sendJSON(res, statusCode, {
            error: isArticle5 ? 'FORBIDDEN_ARTICLE_5' : 'BAD_REQUEST',
            message: err.message || 'Erreur interne de traitement.'
        });
    }
});
if (require.main === module) {
    exports.server.listen(PORT, () => {
        console.log(`[ELLYSIUM PGI API] Écoute active sur le port ${PORT} (Cloud Run)`);
    });
}
