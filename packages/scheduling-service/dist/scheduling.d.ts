import { Discipline, ClassConfiguration, WeeklySchedule, TimeSlot } from './types';
/**
 * Service de Paramétrage Pédagogique et Emplois du Temps
 * VF-063-01 : Tout établissement configure son référentiel de matières avant de saisir des cotes.
 * VF-064-01 : L'emploi du temps valide ne dépasse pas 8h par jour.
 * VF-064-03 : Aucun enseignant ne peut avoir 2 cours simultanés.
 */
export declare class SchedulingService {
    /**
     * Crée la configuration pédagogique d'une classe à partir du référentiel officiel RDC.
     */
    configureClass(params: {
        schoolId: string;
        name: string;
        level: string;
        filiere: string;
        disciplines: Omit<Discipline, 'disciplineId'>[];
        maxStudents?: number;
    }): ClassConfiguration;
    /**
     * Génère et valide un emploi du temps hebdomadaire.
     * VF-064-01 : Max 8h/jour. VF-064-03 : Pas de double affectation enseignant.
     */
    validateSchedule(classId: string, schoolId: string, academicYear: string, slots: TimeSlot[]): WeeklySchedule;
}
