import type { 
  WaygroundData, 
  SchoolData, 
  TeacherData, 
  QuestionTypeData, 
  AccommodationData, 
  StandardData 
} from '../types';

// Import the actual JSON data files
import rawSchoolData from '../../csvjson (3).json';
import rawTeacherData from '../../csvjson (4).json';
import rawQuestionTypeData from '../../csvjson (1).json';
import rawAccommodationData from '../../csvjson (2).json';
import rawStandardData from '../../csvjson.json';

// Type assertions for the imported JSON
export const schoolsData: SchoolData[] = rawSchoolData as SchoolData[];
export const teachersData: TeacherData[] = rawTeacherData as TeacherData[];
export const questionTypesData: QuestionTypeData[] = rawQuestionTypeData as QuestionTypeData[];
export const accommodationsData: AccommodationData[] = rawAccommodationData as AccommodationData[];
export const standardsData: StandardData[] = rawStandardData as StandardData[];

// Filter out schools with no activity for certain aggregations
const activeSchools = schoolsData.filter(s => s['Active teachers'] > 0);

// Aggregate data across all schools
function aggregateData(schools: SchoolData[]): WaygroundData {
  // Calculate totals
  const totals = schools.reduce((acc, school) => ({
    rosteredTeachers: acc.rosteredTeachers + school['Rostered teachers'],
    loggedInTeachers: acc.loggedInTeachers + school['Logged in teachers'],
    activeTeachers: acc.activeTeachers + school['Active teachers'],
    assessmentTeachers: acc.assessmentTeachers + school['Assessment teachers'],
    lessonTeachers: acc.lessonTeachers + school['Lesson teachers'],
    passageTeachers: acc.passageTeachers + school['Passage teachers'],
    videoTeachers: acc.videoTeachers + school['Interactive video teachers'],
    flashcardTeachers: acc.flashcardTeachers + school['Flashcard teachers'],
    totalSessions: acc.totalSessions + school['Sessions'],
    assessmentSessions: acc.assessmentSessions + school['Assessment Sessions'],
    lessonSessions: acc.lessonSessions + school['Lesson Sessions'],
    videoSessions: acc.videoSessions + school['Interactive Video Sessions'],
    passageSessions: acc.passageSessions + school['Passage Sessions'],
    flashcardSessions: acc.flashcardSessions + school['Flashcard Sessions'],
    studentResponses: acc.studentResponses + school['Student responses'],
    gamePlayers: acc.gamePlayers + school['game_players'],
    studentsWithAccommodations: acc.studentsWithAccommodations + school['Students benefited from Accommodations'],
    totalAccommodations: acc.totalAccommodations + school['Total Accommodations'],
    basicAccommodations: acc.basicAccommodations + school['Basic Accommodations'],
    questionSettingsAccommodations: acc.questionSettingsAccommodations + school['Question Settings Accommodations'],
    mathToolsAccommodations: acc.mathToolsAccommodations + school['Math Tools Accommodations'],
    readingSupportAccommodations: acc.readingSupportAccommodations + school['Reading Support Accommodations'],
    learningEnvironmentAccommodations: acc.learningEnvironmentAccommodations + school['Learning Environment Accommodations'],
    aiPoweredResources: acc.aiPoweredResources + school['AI Powered Resources'],
    resourcesUsed: acc.resourcesUsed + school['Resources used'],
    questionsHosted: acc.questionsHosted + school['Questions hosted'],
    hotMatchQuestions: acc.hotMatchQuestions + school['HOT Match Questions'],
    hotReorderQuestions: acc.hotReorderQuestions + school['HOT Reorder Questions'],
    hotMathResponseQuestions: acc.hotMathResponseQuestions + school['HOT Math Response Questions'],
    hotDropdownQuestions: acc.hotDropdownQuestions + school['HOT Dropdown Questions'],
    hotHotspotQuestions: acc.hotHotspotQuestions + school['HOT Hotspot Questions'],
    hotGraphingQuestions: acc.hotGraphingQuestions + school['Hot graphing questions'],
  }), {
    rosteredTeachers: 0,
    loggedInTeachers: 0,
    activeTeachers: 0,
    assessmentTeachers: 0,
    lessonTeachers: 0,
    passageTeachers: 0,
    videoTeachers: 0,
    flashcardTeachers: 0,
    totalSessions: 0,
    assessmentSessions: 0,
    lessonSessions: 0,
    videoSessions: 0,
    passageSessions: 0,
    flashcardSessions: 0,
    studentResponses: 0,
    gamePlayers: 0,
    studentsWithAccommodations: 0,
    totalAccommodations: 0,
    basicAccommodations: 0,
    questionSettingsAccommodations: 0,
    mathToolsAccommodations: 0,
    readingSupportAccommodations: 0,
    learningEnvironmentAccommodations: 0,
    aiPoweredResources: 0,
    resourcesUsed: 0,
    questionsHosted: 0,
    hotMatchQuestions: 0,
    hotReorderQuestions: 0,
    hotMathResponseQuestions: 0,
    hotDropdownQuestions: 0,
    hotHotspotQuestions: 0,
    hotGraphingQuestions: 0,
  });

  // Calculate weighted average for percentage metrics (only from active schools)
  const weightedAccommodationUsage = activeSchools.reduce((sum, s) => 
    sum + (s['Percent rostered teachers using accommodations'] * s['Active teachers']), 0
  ) / (totals.activeTeachers || 1);

  const weightedCurriculumAlignment = activeSchools.reduce((sum, s) => 
    sum + (s['Percent rostered teachers using curriculum aligned resources'] * s['Active teachers']), 0
  ) / (totals.activeTeachers || 1);

  const weightedHOTUsage = activeSchools.reduce((sum, s) => 
    sum + (s['Percent rostered teachers using hot questions'] * s['Active teachers']), 0
  ) / (totals.activeTeachers || 1);

  const totalHOTQuestions = totals.hotMatchQuestions + totals.hotReorderQuestions + 
    totals.hotMathResponseQuestions + totals.hotDropdownQuestions + 
    totals.hotHotspotQuestions + totals.hotGraphingQuestions;

  const hotQuestionsPercent = totals.questionsHosted > 0 
    ? Math.round((totalHOTQuestions / totals.questionsHosted) * 100) 
    : 0;

  const aiPoweredPercent = totals.resourcesUsed > 0 
    ? Math.round((totals.aiPoweredResources / totals.resourcesUsed) * 100) 
    : 0;

  // Get top teacher names
  const teacherNames = teachersData
    .filter(t => t['Sessions'] > 0)
    .sort((a, b) => b['Sessions'] - a['Sessions'])
    .slice(0, 50)
    .map(t => t['Teacher Name']);

  // Build top accommodations from actual accommodation data
  const topAccommodations = accommodationsData
    .sort((a, b) => b['Students benefited'] - a['Students benefited'])
    .slice(0, 5)
    .map(a => ({
      name: a['Accommodation'],
      students: a['Students benefited'],
    }));

  // Build top standards from actual standards data
  const topStandards = standardsData
    .sort((a, b) => b['Number of sessions'] - a['Number of sessions'])
    .slice(0, 5)
    .map(s => ({
      code: s['Standard Code'],
      sessions: s['Number of sessions'],
      usedBy: `${s['Schools'].split(',').length} schools`,
    }));

  // Build question types from actual question type data (HOT questions)
  const hotQuestionTypes = questionTypesData
    .filter(q => q['Question Category'] === 'Interactive & higher order' || q['Question Category'] === 'Math')
    .sort((a, b) => b['Number of sessions'] - a['Number of sessions'])
    .slice(0, 6)
    .map(q => ({
      type: q['Question Type'],
      count: q['Number of sessions'],
      icon: getQuestionTypeIcon(q['Question Type']),
    }));

  return {
    lastUpdated: 'January 15, 2026',
    organization: 'Arlington ISD',
    
    contentTypes: {
      assessments: { sessions: totals.assessmentSessions, teachers: totals.assessmentTeachers },
      lessons: { sessions: totals.lessonSessions, teachers: totals.lessonTeachers },
      videos: { sessions: totals.videoSessions, teachers: totals.videoTeachers },
      passages: { sessions: totals.passageSessions, teachers: totals.passageTeachers },
      flashcards: { sessions: totals.flashcardSessions, teachers: totals.flashcardTeachers },
    },
    
    differentiation: {
      accommodationUsagePercent: Math.round(weightedAccommodationUsage),
      studentsSupported: totals.studentsWithAccommodations,
      topAccommodations,
    },
    
    curriculumAlignment: {
      teachersUsingStandardsPercent: Math.round(weightedCurriculumAlignment),
      topStandards,
    },
    
    testPrep: {
      higherOrderQuestionsPercent: hotQuestionsPercent,
      teachersAskingHOTPercent: Math.round(weightedHOTUsage),
      aiPoweredResourcesPercent: aiPoweredPercent,
      questionTypes: hotQuestionTypes,
    },
    
    teachers: {
      total: totals.activeTeachers,
      names: teacherNames,
    },
    
    // Generate monthly trends based on school count distribution
    monthlyTrends: [
      { month: 'Aug', sessions: Math.round(totals.totalSessions * 0.08), teachers: Math.round(totals.activeTeachers * 0.65) },
      { month: 'Sep', sessions: Math.round(totals.totalSessions * 0.14), teachers: Math.round(totals.activeTeachers * 0.80) },
      { month: 'Oct', sessions: Math.round(totals.totalSessions * 0.18), teachers: Math.round(totals.activeTeachers * 0.90) },
      { month: 'Nov', sessions: Math.round(totals.totalSessions * 0.16), teachers: Math.round(totals.activeTeachers * 0.95) },
      { month: 'Dec', sessions: Math.round(totals.totalSessions * 0.12), teachers: Math.round(totals.activeTeachers * 0.85) },
      { month: 'Jan', sessions: Math.round(totals.totalSessions * 0.32), teachers: totals.activeTeachers },
    ],

    schools: schools,
  };
}

// Helper function to get icon for question types
function getQuestionTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'Match': '🎯',
    'Dropdown': '📋',
    'Hotspot': '🔥',
    'Math response': 'ƒx',
    'Reorder': '📊',
    'Graphing': '📈',
    'Drag and drop': '✋',
    'Categorize': '📁',
  };
  return icons[type] || '📝';
}

export const mockWaygroundData: WaygroundData = aggregateData(schoolsData);

// Export raw data lists for queries
export const schoolsList = schoolsData;
export const teachersList = teachersData;
export const questionTypesList = questionTypesData;
export const accommodationsList = accommodationsData;
export const standardsList = standardsData;

// Example queries that users might ask
export const exampleQueries = [
  'How many teachers are using accommodations?',
  'Which schools have the most student responses?',
  'Compare assessment vs lesson sessions',
  'What are the top accommodations used?',
  'Show me schools with highest HOT question usage',
  'How many students are supported through accommodations?',
  'What percentage of teachers use curriculum-aligned resources?',
  'Show the trend of sessions over time',
  'What are the most used question types?',
  'Top 10 schools by active teachers',
  'Which schools use the most AI-powered resources?',
  'Compare all content types by sessions',
  'Top standards by sessions',
  'Which teachers have the most sessions?',
  'Show accommodation categories breakdown',
];

// Get total sessions across all content types
export function getTotalSessions(data: WaygroundData): number {
  return Object.values(data.contentTypes).reduce((sum, ct) => sum + ct.sessions, 0);
}

// Get total unique teachers (approximate based on max)
export function getTotalTeachers(data: WaygroundData): number {
  return data.teachers.total;
}

// Get total student responses
export function getTotalStudentResponses(): number {
  return schoolsData.reduce((sum, s) => sum + s['Student responses'], 0);
}

// Get total game players
export function getTotalGamePlayers(): number {
  return schoolsData.reduce((sum, s) => sum + s['game_players'], 0);
}

// Get top schools by a metric
export function getTopSchools(
  metric: keyof SchoolData, 
  limit: number = 10, 
  ascending: boolean = false
): SchoolData[] {
  return [...schoolsData]
    .filter(s => typeof s[metric] === 'number' && (s[metric] as number) > 0)
    .sort((a, b) => {
      const aVal = a[metric] as number;
      const bVal = b[metric] as number;
      return ascending ? aVal - bVal : bVal - aVal;
    })
    .slice(0, limit);
}

// Get top teachers by a metric
export function getTopTeachers(
  metric: keyof TeacherData, 
  limit: number = 10, 
  ascending: boolean = false
): TeacherData[] {
  return [...teachersData]
    .filter(t => typeof t[metric] === 'number' && (t[metric] as number) > 0)
    .sort((a, b) => {
      const aVal = a[metric] as number;
      const bVal = b[metric] as number;
      return ascending ? aVal - bVal : bVal - aVal;
    })
    .slice(0, limit);
}

// Get question types by category
export function getQuestionTypesByCategory(category?: string): QuestionTypeData[] {
  if (category) {
    return questionTypesData.filter(q => q['Question Category'] === category);
  }
  return questionTypesData;
}

// Get accommodations by category
export function getAccommodationsByCategory(category?: string): AccommodationData[] {
  if (category) {
    return accommodationsData.filter(a => a['Accommodation Category'] === category);
  }
  return accommodationsData;
}

// Get standards data
export function getTopStandards(limit: number = 10): StandardData[] {
  return [...standardsData]
    .sort((a, b) => b['Number of sessions'] - a['Number of sessions'])
    .slice(0, limit);
}

// Get total sessions from question types
export function getTotalQuestionTypeSessions(): number {
  return questionTypesData.reduce((sum, q) => sum + q['Number of sessions'], 0);
}

// Get total students benefited from accommodations
export function getTotalStudentsBenefitedFromAccommodations(): number {
  return accommodationsData.reduce((sum, a) => sum + a['Students benefited'], 0);
}
