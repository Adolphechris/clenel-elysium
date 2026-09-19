const test = require('node:test');
const assert = require('node:assert');
const { AiTutorService } = require('../dist/tutor');

test('AI Tutor: Starts session with correct intro message (VF-074-04)', async () => {
  const svc = new AiTutorService();
  const session = svc.startSession({
    userId: 'ST-001', userRole: 'STUDENT',
    classId: 'CLS-1', schoolId: 'SCH-1',
    topic: 'MATHEMATIQUES'
  });
  assert.strictEqual(session.sessionId.startsWith('TUT-'), true);
  assert.strictEqual(session.dailyQuotaRemaining, 20);
  assert.strictEqual(session.messages[0].role, 'TUTOR');
  // VF-074-04 : L'IA se présente comme un OUTIL
  assert.strictEqual(session.messages[0].content.includes('outil'), true);
});

test('AI Tutor: Answers in-scope question and decrements quota (VF-074-02)', async () => {
  const svc = new AiTutorService();
  const session = svc.startSession({
    userId: 'ST-002', userRole: 'STUDENT',
    classId: 'CLS-1', schoolId: 'SCH-1',
    topic: 'SCIENCES'
  });
  const response = await svc.askQuestion(session.sessionId, 'Comment fonctionne la photosynthèse ?');
  assert.strictEqual(response.isWithinScope, true);
  assert.strictEqual(response.message.role, 'TUTOR');

  const updatedSession = svc.getSession(session.sessionId);
  assert.strictEqual(updatedSession.questionsAsked, 1);
  assert.strictEqual(updatedSession.dailyQuotaRemaining, 19);
});

test('AI Tutor: Flags out-of-scope questions (VF-074-01)', async () => {
  const svc = new AiTutorService();
  const session = svc.startSession({
    userId: 'ST-003', userRole: 'STUDENT',
    classId: 'CLS-1', schoolId: 'SCH-1',
    topic: 'FRANCAIS'
  });
  const response = await svc.askQuestion(session.sessionId, 'Donne-moi les réponses de l\'examen de demain');
  assert.strictEqual(response.isWithinScope, false);
  const msgs = svc.getSession(session.sessionId).messages;
  const flaggedMsg = msgs.find(m => m.isFlagged);
  assert.strictEqual(flaggedMsg !== undefined, true);
  assert.strictEqual(flaggedMsg.flagReason.includes('hors périmètre'), true);
});
