// Mock survey responses for reporting analytics
// Includes student names as requested for the Guru Report
export const mockSurveyResponses = [
  {
    response_id: 'resp-001',
    survey_id: 'survey-karakter-1',
    student_id: 1,
    student_name: 'Ahmad Fauzi',
    student_class: '6A',
    submitted_at: '2026-04-01T10:30:00',
    answers: {
      'sk-1': 'A',
      'sk-2': 'B',
      'sk-3': 'B',
    }
  },
  {
    response_id: 'resp-002',
    survey_id: 'survey-karakter-1',
    student_id: 2,
    student_name: 'Budi Santoso',
    student_class: '6A',
    submitted_at: '2026-04-01T11:15:00',
    answers: {
      'sk-1': 'A',
      'sk-2': 'B',
      'sk-3': 'C',
    }
  },
  {
    response_id: 'resp-003',
    survey_id: 'survey-karakter-1',
    student_id: 3,
    student_name: 'Citra Dewi',
    student_class: '6B',
    submitted_at: '2026-03-31T09:45:00',
    answers: {
      'sk-1': 'B',
      'sk-2': 'A',
      'sk-3': 'B',
    }
  },
  {
    response_id: 'resp-004',
    survey_id: 'sulingjar-1',
    student_id: 1,
    student_name: 'Ahmad Fauzi',
    student_class: '6A',
    submitted_at: '2026-04-02T14:20:00',
    answers: {
      'sl-1': 'A',
      'sl-2': 'B',
    }
  },
  {
    response_id: 'resp-005',
    survey_id: 'sulingjar-1',
    student_id: 8,
    student_name: 'Hendra Wijaya',
    student_class: '6A',
    submitted_at: '2026-04-02T15:10:00',
    answers: {
      'sl-1': 'B',
      'sl-2': 'B',
    }
  }
];

export default mockSurveyResponses;
