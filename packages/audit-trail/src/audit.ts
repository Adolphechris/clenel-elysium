import * as crypto from 'crypto';

/**
 * Journal d'Audit Immuable — Structure Merkle Append-Only
 * VF-155-03 : Append-only Event Store pour l'historique académique
 * VF-155-04 : Hash cryptographique de chaque événement (SHA-256 chaîné)
 * VF-135-03 : Rétention des journaux pendant 3 ans minimum
 */

export type AuditAction =
  | 'STUDENT_ENROLLED'
  | 'GRADE_SUBMITTED'
  | 'GRADE_MODIFIED'
  | 'REPORT_CARD_GENERATED'
  | 'DIPLOMA_ISSUED'
  | 'PAYMENT_RECORDED'
  | 'USER_ROLE_CHANGED'
  | 'ATTENDANCE_MARKED'
  | 'STUDENT_TRANSFERRED'
  | 'DELIBERATION_SEALED';

export interface AuditEvent {
  eventId: string;
  action: AuditAction;
  operatorId: string;
  operatorRole: string;
  targetId: string;
  targetType: string;
  payload: Record<string, unknown>;
  previousHash: string; // Hash du log précédent — Chaîne Merkle
  eventHash: string;    // SHA-256 de (eventId + action + previousHash + payload)
  timestampUTC: string;
}

export class ImmutableAuditTrail {
  private events: AuditEvent[] = [];
  private lastHash: string = '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis

  /**
   * Ajoute un événement immuable dans le journal.
   * Impossible de modifier ou supprimer (append-only).
   */
  public log(
    action: AuditAction,
    operatorId: string,
    operatorRole: string,
    targetId: string,
    targetType: string,
    payload: Record<string, unknown>
  ): AuditEvent {
    const eventId = `EVT-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const timestampUTC = new Date().toISOString();
    const previousHash = this.lastHash;

    // Calcul du hash chaîné (structure Merkle simplifiée)
    const canonical = JSON.stringify({
      eventId,
      action,
      operatorId,
      targetId,
      payload,
      previousHash,
      timestampUTC
    });
    const eventHash = crypto.createHash('sha256').update(canonical).digest('hex');

    const event: AuditEvent = {
      eventId,
      action,
      operatorId,
      operatorRole,
      targetId,
      targetType,
      payload,
      previousHash,
      eventHash,
      timestampUTC
    };

    this.events.push(event);
    this.lastHash = eventHash;

    return event;
  }

  /**
   * Vérifie l'intégrité de la chaîne d'événements.
   * VF-155-05 : Audit automatisé mensuel détectant toute rupture dans la chaîne.
   */
  public verifyChainIntegrity(): { isValid: boolean; brokenAtIndex?: number } {
    let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];

      if (event.previousHash !== previousHash) {
        return { isValid: false, brokenAtIndex: i };
      }

      // Recalcul du hash pour vérifier qu'il n'a pas été altéré
      const canonical = JSON.stringify({
        eventId: event.eventId,
        action: event.action,
        operatorId: event.operatorId,
        targetId: event.targetId,
        payload: event.payload,
        previousHash: event.previousHash,
        timestampUTC: event.timestampUTC
      });
      const expectedHash = crypto.createHash('sha256').update(canonical).digest('hex');

      if (event.eventHash !== expectedHash) {
        return { isValid: false, brokenAtIndex: i };
      }

      previousHash = event.eventHash;
    }

    return { isValid: true };
  }

  public getEvents(): ReadonlyArray<AuditEvent> {
    return this.events;
  }

  public getEventCount(): number {
    return this.events.length;
  }
}
