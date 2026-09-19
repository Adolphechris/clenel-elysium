"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOfficialReportCard = generateOfficialReportCard;
const academic_engine_1 = require("@elysium/academic-engine");
const template_1 = require("./template");
/**
 * Génère un bulletin officiel scellé prêt pour l'impression ou la conversion PDF/A
 * Verrous associés : VF-068-01, VF-068-02, VF-076-01
 */
function generateOfficialReportCard(rawCard) {
    // 1. Calcul du sceau cryptographique SHA-256
    const { hash, verificationUrl } = (0, academic_engine_1.generateReportCardSeal)(rawCard);
    // 2. Assemblage du bulletin scellé
    const sealedReportCard = {
        ...rawCard,
        cryptographicHash: hash,
        verificationUrl
    };
    // 3. Rendu HTML normé
    const htmlContent = (0, template_1.renderReportCardHTML)(sealedReportCard);
    return {
        reportCard: sealedReportCard,
        htmlContent,
        hash,
        verificationUrl
    };
}
