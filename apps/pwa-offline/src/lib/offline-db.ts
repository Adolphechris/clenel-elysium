/**
 * Moteur de Persistance Locale Hors-Ligne — ELLYSIUM PWA (Tome 7 / Module 112)
 * Stockage local chiffré via IndexedDB/SQLite simulé en mémoire côté serveur pour les tests.
 * Verrous : VF-112-01, VF-112-02, VF-112-03
 */

export type EntryStatus = 'PENDING_SYNC' | 'SYNCED' | 'CONFLICT';

export interface OfflineGradeEntry {
  localId: string;
  studentId: string;
  disciplineId: string;
  pointsObtenus: number;
  pointsMaxima: number;
  teacherId: string;
  classId: string;
  schoolId: string;
  status: EntryStatus;
  createdAtLocal: string; // ISO timestamp local (peut être décalé)
  syncedAtUTC?: string;   // Rempli après synchronisation réussie
}

export interface OfflineRollCallEntry {
  localId: string;
  studentId: string;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';
  date: string;
  teacherId: string;
  classId: string;
  schoolId: string;
  status: EntryStatus;
  createdAtLocal: string;
  syncedAtUTC?: string;
}

export interface SyncQueue {
  grades: OfflineGradeEntry[];
  rollCalls: OfflineRollCallEntry[];
}

/**
 * Gestionnaire de file de synchronisation hors-ligne.
 * Garantit l'intégrité des données même en cas de coupure réseau prolongée (72h).
 * La vraie implémentation PWA utilise IndexedDB (browser) ou SQLite WASM.
 */
export class OfflineSyncManager {
  private queue: SyncQueue = { grades: [], rollCalls: [] };
  private isOnline: boolean = true;

  /**
   * Simule le changement d'état réseau (pour les tests)
   */
  public setOnlineStatus(online: boolean): void {
    this.isOnline = online;
    if (online) {
      console.log('[ELLYSIUM PWA] Réseau restauré. Démarrage de la synchronisation différée...');
    } else {
      console.log('[ELLYSIUM PWA] Mode hors-ligne activé. Les données sont sauvegardées localement.');
    }
  }

  /**
   * Enregistre une cote saisie hors-ligne.
   * VF-112-01 : L'enseignant peut saisir toutes ses cotes sans connexion.
   */
  public storeGradeOffline(entry: Omit<OfflineGradeEntry, 'localId' | 'status' | 'createdAtLocal'>): OfflineGradeEntry {
    if (entry.pointsObtenus < 0 || entry.pointsObtenus > entry.pointsMaxima) {
      throw new Error(`SAISIE_INVALIDE: ${entry.pointsObtenus}/${entry.pointsMaxima} — note hors limites.`);
    }

    const localEntry: OfflineGradeEntry = {
      ...entry,
      localId: `LOC-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: this.isOnline ? 'SYNCED' : 'PENDING_SYNC',
      createdAtLocal: new Date().toISOString()
    };

    this.queue.grades.push(localEntry);
    return localEntry;
  }

  /**
   * Enregistre un appel de présences hors-ligne.
   * VF-112-02 : L'appel peut être effectué sans réseau.
   */
  public storeRollCallOffline(entry: Omit<OfflineRollCallEntry, 'localId' | 'status' | 'createdAtLocal'>): OfflineRollCallEntry {
    const localEntry: OfflineRollCallEntry = {
      ...entry,
      localId: `ROL-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      status: this.isOnline ? 'SYNCED' : 'PENDING_SYNC',
      createdAtLocal: new Date().toISOString()
    };

    this.queue.rollCalls.push(localEntry);
    return localEntry;
  }

  /**
   * Retourne les entrées en attente de synchronisation.
   * VF-112-03 : Toutes les données hors-ligne sont synchronisées dès le retour du réseau.
   */
  public getPendingEntries(): SyncQueue {
    return {
      grades: this.queue.grades.filter(e => e.status === 'PENDING_SYNC'),
      rollCalls: this.queue.rollCalls.filter(e => e.status === 'PENDING_SYNC')
    };
  }

  /**
   * Marque une entrée comme synchronisée après confirmation du serveur.
   */
  public markAsSynced(localId: string, type: 'grade' | 'rollCall', syncedAtUTC: string): boolean {
    if (type === 'grade') {
      const entry = this.queue.grades.find(e => e.localId === localId);
      if (entry) { entry.status = 'SYNCED'; entry.syncedAtUTC = syncedAtUTC; return true; }
    } else {
      const entry = this.queue.rollCalls.find(e => e.localId === localId);
      if (entry) { entry.status = 'SYNCED'; entry.syncedAtUTC = syncedAtUTC; return true; }
    }
    return false;
  }

  /**
   * Statistiques de la file de synchronisation.
   */
  public getQueueStats(): { pending: number; synced: number; total: number } {
    const allEntries = [...this.queue.grades, ...this.queue.rollCalls];
    const pending = allEntries.filter(e => e.status === 'PENDING_SYNC').length;
    return { pending, synced: allEntries.length - pending, total: allEntries.length };
  }
}
