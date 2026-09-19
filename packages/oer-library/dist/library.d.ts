import { OerResource, ResourceSearchQuery } from './types';
/**
 * Service de Bibliothèque OER / REL ELLYSIUM — Module 73
 * VF-073-01 : Toute ressource doit avoir un checksum SHA-256 et une licence explicite.
 * VF-073-02 : Les bundles hors-ligne sont optimisés pour les connexions bas-débit (< 50 Mo par module).
 * VF-073-03 : Seules les ressources validées comme conformes au curriculum national RDC sont indexées.
 */
export declare class OerLibraryService {
    private catalog;
    /**
     * Ajoute une ressource éducative au catalogue national.
     */
    registerResource(params: Omit<OerResource, 'resourceId' | 'publishedAtUTC'>): OerResource;
    /**
     * Recherche et filtrage avec contraintes réseau (maxSizeBytes pour 2G/3G).
     */
    search(query: ResourceSearchQuery): OerResource[];
    /**
     * Prépare un bundle hors-ligne pour la synchronisation PWA (VF-073-02).
     */
    generateOfflineBundle(discipline: string, level: any): {
        bundleId: string;
        totalBytes: number;
        resources: OerResource[];
    };
    getCatalogCount(): number;
}
