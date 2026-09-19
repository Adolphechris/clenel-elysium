import { GradeItem, DeliberationResult, MentionRDC } from './types';

/**
 * Calcule la délibération officielle d'un élève selon les normes strictes de la RDC.
 * Formule inviolable : Taux = (Somme des points obtenus / Somme des maxima) * 100
 * Verrous associés : VF-067-01, VF-067-02, VF-067-05, VF-066-03
 */
export function calculateDeliberationRDC(grades: GradeItem[]): DeliberationResult {
  if (!grades || grades.length === 0) {
    throw new Error("ERREUR_ACADEMIQUE: Impossible de délibérer sur une liste vide d'évaluations.");
  }

  let totalObtenu = 0;
  let totalMaxima = 0;
  const matieresEnEchec: string[] = [];
  const disciplinesEliminatoiresEchouees: string[] = [];

  for (const item of grades) {
    const coef = item.coefficient && item.coefficient > 0 ? item.coefficient : 1;

    // Verrou VF-066-03 : Contrôle des maxima autorisés
    if (item.pointsObtenus < 0) {
      throw new Error(`NOTE_INVALIDE: Note négative interdite pour ${item.disciplineName} (${item.pointsObtenus}).`);
    }
    if (item.pointsObtenus > item.pointsMaxima) {
      throw new Error(
        `DEPASSEMENT_MAXIMA: La note obtenue (${item.pointsObtenus}) dépasse le maximum autorisé (${item.pointsMaxima}) pour ${item.disciplineName}.`
      );
    }
    if (item.pointsMaxima <= 0) {
      throw new Error(`MAXIMA_NUL: Le maximum pour ${item.disciplineName} doit être strictement positif.`);
    }

    const pointsPonderes = item.pointsObtenus * coef;
    const maximaPonderes = item.pointsMaxima * coef;

    totalObtenu += pointsPonderes;
    totalMaxima += maximaPonderes;

    // Vérification échec par matière (< 50%)
    const pourcentageMatiere = (item.pointsObtenus / item.pointsMaxima) * 100;
    if (pourcentageMatiere < 50.0) {
      matieresEnEchec.push(item.disciplineName);
      if (item.isEliminatoire) {
        disciplinesEliminatoiresEchouees.push(item.disciplineName);
      }
    }
  }

  // Application de la formule officielle RDC
  const pourcentageBrut = (totalObtenu / totalMaxima) * 100;
  const pourcentageOfficiel = Math.round(pourcentageBrut * 100) / 100; // Arrondi à 2 décimales

  // Détermination de la mention et de l'admission
  let isAdmis = false;
  let mention: MentionRDC = 'AJOURNE';

  if (disciplinesEliminatoiresEchouees.length > 0) {
    // Verrou VF-067-05 : Échec éliminatoire
    isAdmis = false;
    mention = 'AJOURNE';
  } else if (pourcentageOfficiel >= 50.0) {
    isAdmis = true;
    if (pourcentageOfficiel >= 90.0) {
      mention = 'PLUS_GRANDE_DISTINCTION';
    } else if (pourcentageOfficiel >= 80.0) {
      mention = 'GRANDE_DISTINCTION';
    } else if (pourcentageOfficiel >= 70.0) {
      mention = 'DISTINCTION';
    } else if (pourcentageOfficiel >= 60.0) {
      mention = 'SATISFACTION';
    } else {
      mention = 'PASSABLE';
    }
  } else {
    isAdmis = false;
    mention = 'AJOURNE';
  }

  return {
    totalPointsObtenus: Math.round(totalObtenu * 100) / 100,
    totalPointsMaxima: Math.round(totalMaxima * 100) / 100,
    pourcentageOfficiel,
    mention,
    isAdmis,
    matieresEnEchec,
    disciplinesEliminatoiresEchouees,
    formuleAppliquee: "Taux = (Somme(PointsObtenus * Coef) / Somme(PointsMaxima * Coef)) * 100"
  };
}
