/**
 * Module 67 (Tome 5) — Moteur de calcul académique officiel RDC
 * Alias vers @elysium/academic-engine.
 *
 * Ce package ne duplique aucune logique : il ré-exporte l'intégralité du moteur
 * académique officiel afin de garantir qu'il n'existe qu'une seule source de vérité
 * pour la formule de délibération (Verrous VF-067-01, VF-067-02, VF-067-05, VF-066-03).
 *
 * Formule inviolable : Taux = (Somme(PointsObtenus * Coef) / Somme(PointsMaxima * Coef)) * 100
 */

// Types officiels du moteur académique
export type {
  GradeItem,
  MentionRDC,
  DeliberationResult,
  StudentReportCard
} from '@elysium/academic-engine';

// Fonction de délibération officielle RDC
export { calculateDeliberationRDC } from '@elysium/academic-engine';

// Sceau cryptographique canonique des bulletins (SHA-256)
export { generateReportCardSeal } from '@elysium/academic-engine';
