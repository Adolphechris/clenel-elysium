import * as crypto from 'crypto';
import { Discipline, ClassConfiguration, WeeklySchedule, TimeSlot } from './types';

/**
 * Service de Paramétrage Pédagogique et Emplois du Temps
 * VF-063-01 : Tout établissement configure son référentiel de matières avant de saisir des cotes.
 * VF-064-01 : L'emploi du temps valide ne dépasse pas 8h par jour.
 * VF-064-03 : Aucun enseignant ne peut avoir 2 cours simultanés.
 */
export class SchedulingService {

  /**
   * Crée la configuration pédagogique d'une classe à partir du référentiel officiel RDC.
   */
  public configureClass(params: {
    schoolId: string;
    name: string;
    level: string;
    filiere: string;
    disciplines: Omit<Discipline, 'disciplineId'>[];
    maxStudents?: number;
  }): ClassConfiguration {
    const disciplines: Discipline[] = params.disciplines.map(d => ({
      ...d,
      disciplineId: `DISC-${d.code}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`
    }));

    // Calcul du total des maxima (avec coefficients) — base de la formule RDC
    const totalMaximaAnnuel = disciplines.reduce((acc, d) => acc + (d.pointsMaxima * d.coefficient), 0);
    const totalMaximaSemestriel = Math.round(totalMaximaAnnuel / 2);

    return {
      classId: `CLS-${crypto.randomUUID()}`,
      schoolId: params.schoolId,
      name: params.name,
      level: params.level,
      filiere: params.filiere,
      maxStudents: params.maxStudents || 50,
      disciplines,
      totalMaximaAnnuel,
      totalMaximaSemestriel
    };
  }

  /**
   * Génère et valide un emploi du temps hebdomadaire.
   * VF-064-01 : Max 8h/jour. VF-064-03 : Pas de double affectation enseignant.
   */
  public validateSchedule(classId: string, schoolId: string, academicYear: string, slots: TimeSlot[]): WeeklySchedule {
    const errors: string[] = [];

    // VF-064-01 : Vérification du maximum de 8h par jour
    const hoursByDay = new Map<string, number>();
    for (const slot of slots) {
      const [sh, sm] = slot.startTime.split(':').map(Number);
      const [eh, em] = slot.endTime.split(':').map(Number);
      const duration = (eh * 60 + em - (sh * 60 + sm)) / 60;
      hoursByDay.set(slot.dayOfWeek, (hoursByDay.get(slot.dayOfWeek) || 0) + duration);
    }
    for (const [day, hours] of hoursByDay) {
      if (hours > 8) errors.push(`VF-064-01: ${day} dépasse 8h de cours (${hours.toFixed(1)}h).`);
    }

    // VF-064-03 : Détection des conflits horaires par enseignant
    const teacherSlots = new Map<string, TimeSlot[]>();
    for (const slot of slots) {
      if (!teacherSlots.has(slot.teacherId)) teacherSlots.set(slot.teacherId, []);
      teacherSlots.get(slot.teacherId)!.push(slot);
    }
    for (const [teacherId, tSlots] of teacherSlots) {
      for (let i = 0; i < tSlots.length; i++) {
        for (let j = i + 1; j < tSlots.length; j++) {
          const a = tSlots[i], b = tSlots[j];
          if (a.dayOfWeek === b.dayOfWeek && a.startTime < b.endTime && b.startTime < a.endTime) {
            errors.push(`VF-064-03: Conflit de l'enseignant ${teacherId} le ${a.dayOfWeek} (${a.startTime}-${a.endTime} vs ${b.startTime}-${b.endTime}).`);
          }
        }
      }
    }

    const totalHoursPerWeek = Array.from(hoursByDay.values()).reduce((a, b) => a + b, 0);

    return {
      scheduleId: `SCH-${crypto.randomUUID()}`,
      classId, schoolId, academicYear, slots,
      totalHoursPerWeek: Math.round(totalHoursPerWeek * 10) / 10,
      isValid: errors.length === 0,
      validationErrors: errors
    };
  }
}
