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
exports.DiplomaRegistry = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Registre Souverain d'Authenticité des Diplômes — Module 76
 * VF-076-01 : Tout diplôme officiel est scellé cryptographiquement et vérifiable publiquement.
 * VF-076-02 : Numéro de série national unique et non-reproductible.
 * VF-076-03 : Immutabilité garantie — conservation 100 ans (WORM Storage).
 * VF-076-04 : Révocation publique traçable avec motif obligatoire.
 */
class DiplomaRegistry {
    diplomas = new Map(); // key = sealHash
    serials = new Set();
    /**
     * Émet et enregistre un diplôme officiel scellé.
     */
    issueDiploma(params) {
        if (params.pourcentage < 50.0) {
            throw new Error(`EMISSION_REFUSEE: Pourcentage insuffisant (${params.pourcentage}% < 50%).`);
        }
        const yearSuffix = params.academicYear.split('-')[0] || '2026';
        const randomSeq = crypto.randomBytes(3).toString('hex').toUpperCase();
        const serialNumber = `CD-DIP-${params.province.substring(0, 3).toUpperCase()}-${yearSuffix}-${randomSeq}`;
        if (this.serials.has(serialNumber)) {
            throw new Error('COLLISION_SERIE: Numéro de série déjà utilisé.');
        }
        const issuedAtUTC = new Date().toISOString();
        // Canonisation des métadonnées pour scellement SHA-256
        const canonicalPayload = JSON.stringify({
            serialNumber,
            studentIune: params.studentIune,
            studentFullName: params.studentFullName,
            schoolId: params.schoolId,
            level: params.level,
            optionFiliere: params.optionFiliere,
            pourcentage: params.pourcentage,
            mention: params.mention,
            academicYear: params.academicYear,
            issuedAtUTC
        });
        const sealHash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
        // Simulation de signature ECDSA P-256 Cloud KMS HSM
        const simulatedKmsSign = crypto.createHmac('sha256', 'KMS_HSM_SIGNING_KEY_CD_MASTER')
            .update(sealHash)
            .digest('hex');
        const diploma = {
            diplomaId: `DIP-${crypto.randomUUID()}`,
            serialNumber,
            studentIune: params.studentIune,
            studentFullName: params.studentFullName,
            studentBirthDate: params.studentBirthDate,
            studentBirthPlace: params.studentBirthPlace,
            schoolId: params.schoolId,
            schoolName: params.schoolName,
            province: params.province,
            level: params.level,
            optionFiliere: params.optionFiliere,
            pourcentage: params.pourcentage,
            mention: params.mention,
            academicYear: params.academicYear,
            issuedAtUTC,
            sealHash,
            kmsSignatureHex: simulatedKmsSign,
            verificationUrl: `https://verify.elysium.cd/${sealHash}`,
            status: 'VALIDE'
        };
        this.diplomas.set(sealHash, diploma);
        this.serials.add(serialNumber);
        return diploma;
    }
    /**
     * Vérifie publiquement l'authenticité d'un diplôme via son hash ou numéro de série.
     */
    verify(query) {
        const verifiedAtUTC = new Date().toISOString();
        // Recherche par sealHash ou serialNumber
        let diploma = this.diplomas.get(query);
        if (!diploma) {
            for (const d of this.diplomas.values()) {
                if (d.serialNumber === query) {
                    diploma = d;
                    break;
                }
            }
        }
        if (!diploma) {
            return {
                isValid: false,
                verifiedAtUTC,
                message: 'DIPLÔME NON RECONNU: Aucun document officiel correspondant trouvé dans le registre national.'
            };
        }
        if (diploma.status === 'REVOQUE') {
            return {
                isValid: false,
                diploma,
                verifiedAtUTC,
                message: `DIPLÔME RÉVOQUÉ: Ce titre a été invalidé. Motif: ${diploma.revocationReason || 'Non spécifié'}.`
            };
        }
        return {
            isValid: true,
            diploma,
            verifiedAtUTC,
            message: `DIPLÔME AUTHENTIQUE: Délivré à ${diploma.studentFullName} (${diploma.level} - ${diploma.optionFiliere}).`
        };
    }
    /**
     * Révocation d'un diplôme frauduleux (VF-076-04).
     */
    revokeDiploma(sealHash, reason) {
        const diploma = this.diplomas.get(sealHash);
        if (!diploma)
            throw new Error('DIPLOME_INTROUVABLE');
        if (!reason || reason.trim().length < 5)
            throw new Error('MOTIF_REQUIS: Le motif de révocation doit être explicite.');
        diploma.status = 'REVOQUE';
        diploma.revocationReason = reason;
        return diploma;
    }
    getRegistryCount() {
        return this.diplomas.size;
    }
}
exports.DiplomaRegistry = DiplomaRegistry;
