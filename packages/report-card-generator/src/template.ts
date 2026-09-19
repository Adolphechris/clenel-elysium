import { StudentReportCard } from '@elysium/academic-engine';

export function renderReportCardHTML(reportCard: StudentReportCard): string {
  const { deliberation } = reportCard;
  
  const gradeRows = reportCard.grades.map(g => {
    const pct = ((g.pointsObtenus / g.pointsMaxima) * 100).toFixed(1);
    const statusClass = g.pointsObtenus < (g.pointsMaxima * 0.5) ? 'color: #c0392b; font-weight: bold;' : '';
    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${g.disciplineName} ${g.isEliminatoire ? '<strong>(*)</strong>' : ''}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${g.pointsMaxima}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center; ${statusClass}">${g.pointsObtenus}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${g.coefficient || 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${pct}%</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Bulletin Scolaire Officiel — ${reportCard.studentName}</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; color: #111; margin: 0; padding: 20px; font-size: 12pt; }
    .header { text-align: center; border-bottom: 2px solid #0B2545; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 15pt; text-transform: uppercase; color: #0B2545; }
    .header h2 { margin: 4px 0; font-size: 13pt; text-transform: uppercase; font-weight: normal; }
    .header h3 { margin: 4px 0; font-size: 11pt; color: #555; }
    .info-box { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .info-col { width: 48%; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0B2545; color: #fff; padding: 8px; border: 1px solid #0B2545; font-size: 11pt; }
    .deliberation-box { background: #f9f9f9; border: 2px solid #0B2545; padding: 15px; margin-bottom: 20px; }
    .deliberation-box h4 { margin: 0 0 10px 0; font-size: 13pt; color: #0B2545; text-align: center; }
    .footer { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
    .seal-box { font-family: monospace; font-size: 9pt; color: #444; border-top: 1px dashed #999; padding-top: 10px; margin-top: 20px; }
  </style>
</head>
<body>

  <div class="header">
    <h1>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
    <h2>MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ</h2>
    <h3>SYSTÈME DE GESTION SCOLAIRE ELLYSIUM (CNEL)</h3>
    <h2 style="margin-top: 10px; color: #0B2545; font-weight: bold;">BULLETIN OFFICIEL DE SCOLARITÉ — ${reportCard.period}</h2>
  </div>

  <div class="info-box">
    <div class="info-col">
      <p><strong>Élève :</strong> ${reportCard.studentName}</p>
      <p><strong>Identifiant Unique (IUNE) :</strong> ${reportCard.studentId}</p>
      <p><strong>Classe / Promotion :</strong> ${reportCard.classId}</p>
    </div>
    <div class="info-col" style="text-align: right;">
      <p><strong>Établissement :</strong> ${reportCard.schoolId}</p>
      <p><strong>Année Scolaire :</strong> ${reportCard.academicYear}</p>
      <p><strong>Date d'Émission :</strong> ${new Date(reportCard.timestampUTC).toLocaleDateString('fr-FR')}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align: left;">Discipline Pédagogique</th>
        <th>Maximum</th>
        <th>Points Obtenus</th>
        <th>Coef</th>
        <th>Pourcentage</th>
      </tr>
    </thead>
    <tbody>
      ${gradeRows}
    </tbody>
  </table>

  <div class="deliberation-box">
    <h4>RÉSULTAT DE LA DÉLIBÉRATION DU JURY (FORMULE OFFICIELLE RDC)</h4>
    <p style="text-align: center; font-size: 11pt; margin-bottom: 8px;">
      <strong>Formule RDC :</strong> Taux = (&Sigma; Points Obtenus / &Sigma; Maxima) &times; 100
    </p>
    <div style="display: flex; justify-content: space-around; font-size: 12pt;">
      <div>Total Points : <strong>${deliberation.totalPointsObtenus} / ${deliberation.totalPointsMaxima}</strong></div>
      <div>Pourcentage : <strong style="font-size: 14pt; color: #0B2545;">${deliberation.pourcentageOfficiel}%</strong></div>
      <div>Mention : <strong>${deliberation.mention.replace(/_/g, ' ')}</strong></div>
      <div>Décision : <strong style="color: ${deliberation.isAdmis ? '#27ae60' : '#c0392b'};">${deliberation.isAdmis ? 'ADMIS(E)' : 'AJOURNÉ(E)'}</strong></div>
    </div>
  </div>

  <div class="footer">
    <div style="width: 40%;">
      <p>Le Directeur / Préfet des Études</p>
      <div style="height: 60px;"></div>
      <p><em>(Signature et Sceau)</em></p>
    </div>
    <div style="width: 40%;">
      <p>Le Président du Jury</p>
      <div style="height: 60px;"></div>
      <p><em>(Signature certifiée)</em></p>
    </div>
  </div>

  <div class="seal-box">
    <p><strong>Sceau Cryptographique Cloud KMS (Module 68 / 76) :</strong> ${reportCard.cryptographicHash || 'NON_SCELLE'}</p>
    <p><strong>Vérification d'Authenticité Publique :</strong> <a href="${reportCard.verificationUrl}">${reportCard.verificationUrl}</a></p>
    <p><em>Document certifié infalsifiable conforme aux normes éducatives nationales de la RDC.</em></p>
  </div>

</body>
</html>
  `.trim();
}
