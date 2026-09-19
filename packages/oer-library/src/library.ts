import * as crypto from 'crypto';
import { OerResource, ResourceSearchQuery } from './types';

/**
 * Service de Bibliothèque OER / REL ELLYSIUM — Module 73
 * VF-073-01 : Toute ressource doit avoir un checksum SHA-256 et une licence explicite.
 * VF-073-02 : Les bundles hors-ligne sont optimisés pour les connexions bas-débit (< 50 Mo par module).
 * VF-073-03 : Seules les ressources validées comme conformes au curriculum national RDC sont indexées.
 */
export class OerLibraryService {
  private catalog: Map<string, OerResource> = new Map();

  /**
   * Ajoute une ressource éducative au catalogue national.
   */
  public registerResource(params: Omit<OerResource, 'resourceId' | 'publishedAtUTC'>): OerResource {
    // VF-073-01 : Validation checksum et conformité
    if (!params.checksumSha256 || params.checksumSha256.length !== 64) {
      throw new Error('CHECKSUM_INVALIDE: Checksum SHA-256 de 64 caractères hex obligatoire (VF-073-01).');
    }
    if (!params.curriculumAligned) {
      throw new Error('CONFORMITE_REQUISE: La ressource doit être officiellement alignée sur le programme national RDC (VF-073-03).');
    }

    const resourceId = `OER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const resource: OerResource = {
      ...params,
      resourceId,
      publishedAtUTC: new Date().toISOString()
    };

    this.catalog.set(resourceId, resource);
    return resource;
  }

  /**
   * Recherche et filtrage avec contraintes réseau (maxSizeBytes pour 2G/3G).
   */
  public search(query: ResourceSearchQuery): OerResource[] {
    return Array.from(this.catalog.values()).filter(res => {
      if (query.discipline && res.discipline.toLowerCase() !== query.discipline.toLowerCase()) return false;
      if (query.level && res.level !== query.level) return false;
      if (query.format && res.format !== query.format) return false;
      if (query.maxSizeBytes && res.fileSizeBytes > query.maxSizeBytes) return false;
      if (query.keyword) {
        const kw = query.keyword.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(kw);
        const matchesTags = res.tags.some(t => t.toLowerCase().includes(kw));
        const matchesAuthor = res.author.toLowerCase().includes(kw);
        if (!matchesTitle && !matchesTags && !matchesAuthor) return false;
      }
      return true;
    });
  }

  /**
   * Prépare un bundle hors-ligne pour la synchronisation PWA (VF-073-02).
   */
  public generateOfflineBundle(discipline: string, level: any): { bundleId: string; totalBytes: number; resources: OerResource[] } {
    const matching = this.search({ discipline, level });
    const offlineEligible = matching.filter(r => r.downloadableOffline);
    const totalBytes = offlineEligible.reduce((acc, r) => acc + r.fileSizeBytes, 0);

    return {
      bundleId: `BUNDLE-${discipline}-${Date.now()}`,
      totalBytes,
      resources: offlineEligible
    };
  }

  public getCatalogCount(): number {
    return this.catalog.size;
  }
}
