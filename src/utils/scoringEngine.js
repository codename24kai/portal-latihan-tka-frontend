/**
 * Bank Soal V2 Scoring Engine
 * Handles different grading logic for various question types.
 */

import { QUESTION_TYPES } from '../constants/questions';

/**
 * Main scoring dispatcher
 */
export function calculateScore(question, studentAnswer, maxPoints = 1) {
  if (studentAnswer === undefined || studentAnswer === null || studentAnswer === '') {
    return 0;
  }

  // Normalize studentAnswer if it's an object with .selected or .text (V1 compatibility)
  const answerValue = (typeof studentAnswer === 'object' && !Array.isArray(studentAnswer))
    ? (studentAnswer.selected !== undefined ? studentAnswer.selected : studentAnswer.text)
    : studentAnswer;

  if (answerValue === undefined || answerValue === null || answerValue === '') {
    return 0;
  }

  switch (question.question_type) {
    case QUESTION_TYPES.SINGLE_CHOICE:
      return scoreSingleChoice(question.payload, answerValue, maxPoints);
    
    case QUESTION_TYPES.MULTI_CHOICE:
      return scoreMultiChoice(question.payload, answerValue, maxPoints);
    
    case QUESTION_TYPES.TRUE_FALSE:
      return scoreTrueFalse(question.payload, answerValue, maxPoints);
    
    case QUESTION_TYPES.ESSAY:
      return null; // Manual grading required
    
    default:
      return 0;
  }
}

/**
 * Single Choice Scoring (Binary)
 */
function scoreSingleChoice(payload, selected, maxPoints) {
  const correct = payload.correct_keys?.[0];
  return selected === correct ? maxPoints : 0;
}

/**
 * True/False Scoring (Binary)
 */
function scoreTrueFalse(payload, selected, maxPoints) {
  return selected === payload.correct_value ? maxPoints : 0;
}

/**
 * Multi Choice Scoring (Partial Credit)
 */
function scoreMultiChoice(payload, selectedKeys, maxPoints) {
  if (!Array.isArray(selectedKeys) || selectedKeys.length === 0) return 0;

  const correctSet = new Set(payload.correct_keys || []);
  const studentSet = new Set(selectedKeys);
  
  const hits = [...studentSet].filter(k => correctSet.has(k)).length;
  const false_pos = [...studentSet].filter(k => !correctSet.has(k)).length;
  const totalCorrect = correctSet.size;
  
  if (totalCorrect === 0) return 0;
  
  const base = (hits / totalCorrect) * maxPoints;
  const penalty = payload.penalty_for_wrong 
    ? (false_pos / totalCorrect) * maxPoints 
    : 0;
  
  return Math.max(0, parseFloat((base - penalty).toFixed(2)));
}
