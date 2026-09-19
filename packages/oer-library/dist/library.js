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
exports.OerLibraryService = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Service de Bibliothèque OER / REL ELLYSIUM — Module 73
 * VF-073-01 : Toute ressource doit avoir un checksum SHA-256 et une licence explicite.
 * VF-073-02 : Les bundles hors-ligne sont optimisés pour les connexions bas-débit (< 50 Mo par module).
 * VF-073-03 : Seules les ressources validées comme conformes au curriculum national RDC sont indexées.
 */
class OerLibraryService {
    catalog = new Map();
    /**
     * Ajoute une ressource éducative au catalogue national.
     */
    registerResource(params) {
        // VF-073-01 : Validation checksum et conformité
        if (!params.checksumSha256 || params.checksumSha256.length !== 64) {
            throw new Error('CHECKSUM_INVALIDE: Checksum SHA-256 de 64 caractères hex obligatoire (VF-073-01).');
        }
        if (!params.curriculumAligned) {
            throw new Error('CONFORMITE_REQUISE: La ressource doit être officiellement alignée sur le programme national RDC (VF-073-03).');
        }
        const resourceId = `OER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const resource = {
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
    search(query) {
        return Array.from(this.catalog.values()).filter(res => {
            if (query.discipline && res.discipline.toLowerCase() !== query.discipline.toLowerCase())
                return false;
            if (query.level && res.level !== query.level)
                return false;
            if (query.format && res.format !== query.format)
                return false;
            if (query.maxSizeBytes && res.fileSizeBytes > query.maxSizeBytes)
                return false;
            if (query.keyword) {
                const kw = query.keyword.toLowerCase();
                const matchesTitle = res.title.toLowerCase().includes(kw);
                const matchesTags = res.tags.some(t => t.toLowerCase().includes(kw));
                const matchesAuthor = res.author.toLowerCase().includes(kw);
                if (!matchesTitle && !matchesTags && !matchesAuthor)
                    return false;
            }
            return true;
        });
    }
    /**
     * Prépare un bundle hors-ligne pour la synchronisation PWA (VF-073-02).
     */
    generateOfflineBundle(discipline, level) {
        const matching = this.search({ discipline, level });
        const offlineEligible = matching.filter(r => r.downloadableOffline);
        const totalBytes = offlineEligible.reduce((acc, r) => acc + r.fileSizeBytes, 0);
        return {
            bundleId: `BUNDLE-${discipline}-${Date.now()}`,
            totalBytes,
            resources: offlineEligible
        };
    }
    getCatalogCount() {
        return this.catalog.size;
    }
}
exports.OerLibraryService = OerLibraryService;
