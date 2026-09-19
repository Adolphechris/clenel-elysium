import { GradeItem, DeliberationResult } from './types';
/**
 * Calcule la délibération officielle d'un élève selon les normes strictes de la RDC.
 * Formule inviolable : Taux = (Somme des points obtenus / Somme des maxima) * 100
 * Verrous associés : VF-067-01, VF-067-02, VF-067-05, VF-066-03
 */
export declare function calculateDeliberationRDC(grades: GradeItem[]): DeliberationResult;
