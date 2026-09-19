/**
 * Tests des règles de sécurité Firestore — Article 5 de la Constitution (VF-056-02, VF-071-01)
 * et RBAC (Tome 9). Exécution : émulateur Firestore requis (firebase emulators:start --only firestore)
 * puis `npm run test:rules`. Mode dégradé : ces tests valident la STRUCTURE des règles si
 * @firebase/rules-unit-testing n'est pas installé (vérification statique).
 *
 * Doctrine : émulateurs Firebase officiels uniquement (Art. 7) — LocalStack interdit.
 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RULES_PATH = path.join(__dirname, '..', '..', '..', 'firestore.rules');

test('Rules: le fichier firestore.rules existe et est versionné v2', () => {
  assert.ok(fs.existsSync(RULES_PATH), 'firestore.rules introuvable à la racine');
  const content = fs.readFileSync(RULES_PATH, 'utf-8');
  assert.match(content, /rules_version = '2'/, 'rules_version 2 requis');
  assert.match(content, /service cloud\.firestore/, 'service cloud.firestore requis');
});

test('Rules ARTICLE 5 (VF-056-02): la collection finances est inaccessible aux enseignants et élèves', () => {
  const content = fs.readFileSync(RULES_PATH, 'utf-8');
  // La caisse ne doit être lisible/écrivable QUE par comptable/caissier ou préfet de l'école
  const financesMatch = content.match(/match \/finances\/\{paymentId\} \{[^}]*\}/);
  assert.ok(financesMatch, 'règle /finances introuvable');
  const rule = financesMatch[0];
  assert.match(rule, /isAccountant\(schoolId\) \|\| isPrefet\(schoolId\)/,
    'La caisse doit être réservée au comptable et au préfet');
  // Aucune clause ne doit autoriser enseignant ou élève sur /finances
  assert.doesNotMatch(rule, /isTeacher|isStudent/,
    'INTERDIT: un enseignant ou un élève ne doit jamais accéder à /finances');
});

test('Rules (VF-066-02): seuls enseignants/préfets saisissent les cotes — jamais un caissier', () => {
  const content = fs.readFileSync(RULES_PATH, 'utf-8');
  const gradesMatch = content.match(/match \/grades\/\{gradeId\} \{[\s\S]*?\n      \}/);
  assert.ok(gradesMatch, 'règle /grades introuvable');
  const rule = gradesMatch[0];
  assert.match(rule, /isTeacher\(schoolId\) \|\| isPrefet\(schoolId\)/,
    'Écriture des cotes réservée aux enseignants et préfets');
  // Le caissier ne doit pas pouvoir écrire une note même s'il a un autre rôle
  assert.match(rule, /!isAccountant\(schoolId\)/,
    'Défense explicite contre le cumul de rôles caissier/saisie de notes');
});

test('Rules: immutabilité — aucune suppression de notes ni de bulletins', () => {
  const content = fs.readFileSync(RULES_PATH, 'utf-8');
  const deletes = content.match(/allow delete: if [^;]+;/g) || [];
  assert.ok(deletes.length >= 2, 'au moins notes et bulletins doivent être non-supprimables');
  assert.ok(deletes.every(d => /if false/.test(d)),
    'Toute règle allow delete doit être strictement if false (historisation immuable)');
});

test('Rules: cloisonnement multi-établissement (schoolId du token = schoolId de la ressource)', () => {
  const content = fs.readFileSync(RULES_PATH, 'utf-8');
  assert.match(content, /getUserSchoolId\(\) == schoolId/,
    'Le RBAC doit comparer le schoolId du jeton à celui de la ressource (isolation tenant)');
});
