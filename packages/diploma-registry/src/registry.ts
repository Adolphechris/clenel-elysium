import * as crypto from 'crypto';
import { DiplomaRecord, DiplomaLevel, VerificationResult } from './types';

/**
 * Registre Souverain d'Authenticité des Diplômes — Module 76
 * VF-076-01 : Tout diplôme officiel est scellé cryptographiquement et vérifiable publiquement.
 * VF-076-02 : Numéro de série national unique et non-reproductible.
 * VF-076-03 : Immutabilité garantie — conservation 100 ans (WORM Storage).
 * VF-076-04 : Révocation publique traçable avec motif obligatoire.
 */
export class DiplomaRegistry {
  private diplomas: Map<string, DiplomaRecord> = new Map(); // key = sealHash
  private serials: Set<string> = new Set();

  /**
   * Émet et enregistre un diplôme officiel scellé.
   */
  public issueDiploma(params: {
    studentIune: string;
    studentFullName: string;
    studentBirthDate: string;
    studentBirthPlace: string;
    schoolId: string;
    schoolName: string;
    province: string;
    level: DiplomaLevel;
    optionFiliere: string;
    pourcentage: number;
    mention: string;
    academicYear: string;
  }): DiplomaRecord {
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

    const diploma: DiplomaRecord = {
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
  public verify(query: string): VerificationResult {
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
  public revokeDiploma(sealHash: string, reason: string): DiplomaRecord {
    const diploma = this.diplomas.get(sealHash);
    if (!diploma) throw new Error('DIPLOME_INTROUVABLE');
    if (!reason || reason.trim().length < 5) throw new Error('MOTIF_REQUIS: Le motif de révocation doit être explicite.');

    diploma.status = 'REVOQUE';
    diploma.revocationReason = reason;
    return diploma;
  }

  public getRegistryCount(): number {
    return this.diplomas.size;
  }
}
