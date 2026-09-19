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
    createdAtLocal: string;
    syncedAtUTC?: string;
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
export declare class OfflineSyncManager {
    private queue;
    private isOnline;
    /**
     * Simule le changement d'état réseau (pour les tests)
     */
    setOnlineStatus(online: boolean): void;
    /**
     * Enregistre une cote saisie hors-ligne.
     * VF-112-01 : L'enseignant peut saisir toutes ses cotes sans connexion.
     */
    storeGradeOffline(entry: Omit<OfflineGradeEntry, 'localId' | 'status' | 'createdAtLocal'>): OfflineGradeEntry;
    /**
     * Enregistre un appel de présences hors-ligne.
     * VF-112-02 : L'appel peut être effectué sans réseau.
     */
    storeRollCallOffline(entry: Omit<OfflineRollCallEntry, 'localId' | 'status' | 'createdAtLocal'>): OfflineRollCallEntry;
    /**
     * Retourne les entrées en attente de synchronisation.
     * VF-112-03 : Toutes les données hors-ligne sont synchronisées dès le retour du réseau.
     */
    getPendingEntries(): SyncQueue;
    /**
     * Marque une entrée comme synchronisée après confirmation du serveur.
     */
    markAsSynced(localId: string, type: 'grade' | 'rollCall', syncedAtUTC: string): boolean;
    /**
     * Statistiques de la file de synchronisation.
     */
    getQueueStats(): {
        pending: number;
        synced: number;
        total: number;
    };
}
