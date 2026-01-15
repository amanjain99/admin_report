import type { WaygroundData } from '../types';

export const mockWaygroundData: WaygroundData = {
  lastUpdated: 'January 15, 2026',
  organization: 'Quizizz',
  
  contentTypes: {
    assessments: { sessions: 609, teachers: 32 },
    presentations: { sessions: 1121, teachers: 16 },
    videos: { sessions: 519, teachers: 4 },
    passages: { sessions: 745, teachers: 7 },
    flashcards: { sessions: 11, teachers: 3 },
  },
  
  differentiation: {
    accommodationUsagePercent: 38,
    studentsSupported: 461,
    topAccommodations: [
      { name: 'Math Tools', students: 173 },
      { name: 'Reading Support', students: 99 },
      { name: 'Question Settings', students: 59 },
      { name: 'Learning Environment', students: 19 },
    ],
  },
  
  curriculumAlignment: {
    teachersUsingStandardsPercent: 68,
    topStandards: [
      { code: 'TX.MA.7.3.A', sessions: 50, usedBy: 'Not Associated With An Org' },
      { code: 'TX.LA.2.6.B', sessions: 50, usedBy: 'Not Associated With An Org' },
      { code: 'TX.LA.2.9.D.ii', sessions: 44, usedBy: 'Not Associated With An Org' },
      { code: 'TX.LA.6.9.C', sessions: 41, usedBy: 'Not Associated With An Org' },
      { code: 'CCSS.RI.1.4', sessions: 40, usedBy: 'Not Associated With An Org' },
    ],
  },
  
  testPrep: {
    higherOrderQuestionsPercent: 3,
    teachersAskingHOTPercent: 56,
    aiPoweredResourcesPercent: 33,
    questionTypes: [
      { type: 'Match', count: 88, icon: '🎯' },
      { type: 'Reorder', count: 44, icon: '📊' },
      { type: 'Math Response', count: 21, icon: 'ƒx' },
      { type: 'Dropdown', count: 64, icon: '📋' },
      { type: 'Hotspot', count: 91, icon: '🎯' },
      { type: 'Graphing', count: 46, icon: '📈' },
    ],
  },
  
  teachers: {
    total: 42,
    names: [
      'Ross Mckenzie',
      'Catherine Selzler',
      'Emily Johnson',
      'Michael Chen',
      'Sarah Williams',
      'David Brown',
      'Jessica Davis',
      'James Wilson',
      'Amanda Martinez',
      'Robert Taylor',
      // 40 other teachers
      ...Array.from({ length: 32 }, (_, i) => `Teacher ${i + 11}`),
    ],
  },
  
  monthlyTrends: [
    { month: 'Aug', sessions: 450, teachers: 28 },
    { month: 'Sep', sessions: 820, teachers: 35 },
    { month: 'Oct', sessions: 1150, teachers: 38 },
    { month: 'Nov', sessions: 980, teachers: 40 },
    { month: 'Dec', sessions: 620, teachers: 36 },
    { month: 'Jan', sessions: 985, teachers: 42 },
  ],
};

// Example queries that users might ask
export const exampleQueries = [
  'How many teachers are using accommodations?',
  'Compare presentations vs assessments by session count',
  'What are the top accommodations used?',
  'Show me the breakdown of content types by teachers',
  'How many students are supported through accommodations?',
  'What percentage of teachers use curriculum-aligned resources?',
  'Show the trend of sessions over time',
  'What are the most used question types?',
  'Compare all content types by number of teachers',
  'How many assessment sessions were there?',
  'What percent of questions are higher-order thinking?',
  'Show the top 5 standards used',
];

// Get total sessions across all content types
export function getTotalSessions(data: WaygroundData): number {
  return Object.values(data.contentTypes).reduce((sum, ct) => sum + ct.sessions, 0);
}

// Get total unique teachers (approximate based on max)
export function getTotalTeachers(data: WaygroundData): number {
  return data.teachers.total;
}

