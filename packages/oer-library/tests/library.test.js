const test = require('node:test');
const assert = require('node:assert');
const { OerLibraryService } = require('../dist/library');

test('OER Library: Registers curriculum-aligned resource (VF-073-01/03)', () => {
  const lib = new OerLibraryService();
  const res = lib.registerResource({
    title: 'Manuel Officiel d Algèbre — 4ème Humanités',
    discipline: 'Mathématiques',
    level: 'HUMANITES',
    author: 'Commission Pédagogique Nationale RDC',
    publisher: 'Ministère EPST',
    license: 'CC-BY-SA-4.0',
    format: 'PDF',
    fileUrl: 'https://storage.googleapis.com/elysium-pedagogy/math4-algebre.pdf',
    fileSizeBytes: 12500000, // 12.5 Mo
    checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    curriculumAligned: true,
    tags: ['maths', 'algebre', 'humanités', 'rdc'],
    downloadableOffline: true
  });

  assert.strictEqual(res.resourceId.startsWith('OER-'), true);
  assert.strictEqual(res.curriculumAligned, true);
  assert.strictEqual(lib.getCatalogCount(), 1);
});

test('OER Library: Rejects unaligned resource (VF-073-03)', () => {
  const lib = new OerLibraryService();
  assert.throws(() => {
    lib.registerResource({
      title: 'Cours non officiel étranger',
      discipline: 'Physique',
      level: 'HUMANITES',
      author: 'Auteur Inconnu',
      publisher: 'Editeur Privé',
      license: 'CC-BY-4.0',
      format: 'PDF',
      fileUrl: 'https://storage.googleapis.com/elysium-pedagogy/cours.pdf',
      fileSizeBytes: 5000000,
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      curriculumAligned: false, // NON-CONFORME
      tags: ['physique'],
      downloadableOffline: true
    });
  }, /CONFORMITE_REQUISE/);
});

test('OER Library: Filters by size for low-bandwidth 2G download (VF-073-02)', () => {
  const lib = new OerLibraryService();
  // Petite ressource (< 2 Mo)
  lib.registerResource({
    title: 'Fiche Résumé Trigonométrie',
    discipline: 'Mathématiques',
    level: 'HUMANITES',
    author: 'Cellule Maths Kinshasa',
    publisher: 'ELLYSIUM Didactique',
    license: 'CC-BY-4.0',
    format: 'PDF',
    fileUrl: 'https://storage.googleapis.com/elysium-pedagogy/trigo-fiche.pdf',
    fileSizeBytes: 850000, // 850 Ko
    checksumSha256: '1111111111111111111111111111111111111111111111111111111111111111',
    curriculumAligned: true,
    tags: ['trigo', 'resume'],
    downloadableOffline: true
  });

  // Grosse vidéo (85 Mo)
  lib.registerResource({
    title: 'Documentaire Géométrie de l Espace',
    discipline: 'Mathématiques',
    level: 'HUMANITES',
    author: 'RTNC Educatif',
    publisher: 'RTNC',
    license: 'CC-BY-NC-4.0',
    format: 'VIDEO_MP4',
    fileUrl: 'https://storage.googleapis.com/elysium-pedagogy/geom.mp4',
    fileSizeBytes: 89000000,
    checksumSha256: '2222222222222222222222222222222222222222222222222222222222222222',
    curriculumAligned: true,
    tags: ['geometrie', 'video'],
    downloadableOffline: false
  });

  // Filtre max 5 Mo (terrain bas-débit)
  const lowBandwidthResults = lib.search({
    discipline: 'Mathématiques',
    maxSizeBytes: 5000000
  });

  assert.strictEqual(lowBandwidthResults.length, 1);
  assert.strictEqual(lowBandwidthResults[0].title, 'Fiche Résumé Trigonométrie');
});
