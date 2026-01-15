// Raw School Data from JSON (csvjson (3).json)
export interface SchoolData {
  "School name": string;
  "Rostered teachers": number;
  "Logged in teachers": number;
  "Active teachers": number;
  "Percent rostered teachers using accommodations": number;
  "Percent rostered teachers using curriculum aligned resources": number;
  "Percent rostered teachers using hot questions": number;
  "Assessment teachers": number;
  "Lesson teachers": number;
  "Passage teachers": number;
  "Interactive video teachers": number;
  "Flashcard teachers": number;
  "Student responses": number;
  "game_players": number;
  "Sessions": number;
  "Assessment Sessions": number;
  "Lesson Sessions": number;
  "Interactive Video Sessions": number;
  "Flashcard Sessions": number;
  "Passage Sessions": number;
  "Students benefited from Accommodations": number;
  "Total Accommodations": number;
  "Basic Accommodations": number;
  "Question Settings Accommodations": number;
  "Math Tools Accommodations": number;
  "Reading Support Accommodations": number;
  "Learning Environment Accommodations": number;
  "Percent Questions Which Are HOT Questions": number;
  "AI Powered Resources": number;
  "Resources used": number;
  "Percent Resources Which Are AI Powered": number;
  "Questions hosted": number;
  "HOT Match Questions": number;
  "HOT Reorder Questions": number;
  "HOT Math Response Questions": number;
  "HOT Dropdown Questions": number;
  "HOT Hotspot Questions": number;
  "Hot graphing questions": number;
}

// Teacher Data from JSON (csvjson (4).json)
export interface TeacherData {
  "Teacher Name": string;
  "Email": string;
  "School name": string;
  "Student responses": number;
  "game_players": number;
  "Sessions": number;
  "Assessment Sessions": number;
  "Lesson Sessions": number;
  "Interactive Video Sessions": number;
  "Flashcard Sessions": number;
  "Passage Sessions": number;
  "Students benefited from Accommodations": number;
  "Total Accommodations": number;
  "Basic Accommodations": number;
  "Question Settings Accommodations": number;
  "Math Tools Accommodations": number;
  "Reading Support Accommodations": number;
  "Learning Environment Accommodations": number;
  "Percent Questions Which Are HOT Questions": number;
  "AI Powered Resources": number;
  "Resources used": number;
  "Percent Resources Which Are AI Powered": number;
  "Questions hosted": number;
  "HOT Match Questions": number;
  "HOT Reorder Questions": number;
  "HOT Math Response Questions": number;
  "HOT Dropdown Questions": number;
  "HOT Hotspot Questions": number;
  "Hot graphing questions": number;
}

// Question Type Data from JSON (csvjson (1).json)
export interface QuestionTypeData {
  "Question Type": string;
  "Question Category": string;
  "Schools": string;
  "Number of sessions": number;
}

// Accommodation Data from JSON (csvjson (2).json)
export interface AccommodationData {
  "Accommodation": string;
  "Accommodation Category": string;
  "Schools": string;
  "Students benefited": number;
}

// Standards Data from JSON (csvjson.json)
export interface StandardData {
  "Standard Code": string;
  "Schools": string;
  "Number of sessions": number;
}

// Content Type Data
export interface ContentTypeStats {
  sessions: number;
  teachers: number;
}

export interface ContentTypes {
  assessments: ContentTypeStats;
  lessons: ContentTypeStats;
  videos: ContentTypeStats;
  passages: ContentTypeStats;
  flashcards: ContentTypeStats;
}

// Accommodation Data
export interface Accommodation {
  name: string;
  students: number;
}

export interface DifferentiationData {
  accommodationUsagePercent: number;
  studentsSupported: number;
  topAccommodations: Accommodation[];
}

// Standards Data
export interface Standard {
  code: string;
  sessions: number;
  usedBy: string;
}

export interface CurriculumAlignmentData {
  teachersUsingStandardsPercent: number;
  topStandards: Standard[];
}

// Question Types Data
export interface QuestionType {
  type: string;
  count: number;
  icon?: string;
}

export interface TestPrepData {
  higherOrderQuestionsPercent: number;
  teachersAskingHOTPercent: number;
  aiPoweredResourcesPercent: number;
  questionTypes: QuestionType[];
}

// Teachers Data
export interface TeachersData {
  total: number;
  names: string[];
}

// Monthly Trend Data
export interface MonthlyTrend {
  month: string;
  sessions: number;
  teachers: number;
}

// Complete Wayground Data Structure
export interface WaygroundData {
  lastUpdated: string;
  organization: string;
  contentTypes: ContentTypes;
  differentiation: DifferentiationData;
  curriculumAlignment: CurriculumAlignmentData;
  testPrep: TestPrepData;
  teachers: TeachersData;
  monthlyTrends: MonthlyTrend[];
  schools: SchoolData[];
}

// Query Response Types
export type VisualizationType = 
  | 'single_stat' 
  | 'comparison' 
  | 'distribution' 
  | 'trend' 
  | 'list'
  | 'table';

export interface SingleStatData {
  value: number | string;
  label: string;
  suffix?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
}

export interface ComparisonItem {
  name: string;
  value: number;
  color?: string;
}

export interface ComparisonData {
  items: ComparisonItem[];
  xLabel?: string;
  yLabel?: string;
}

export interface DistributionItem {
  name: string;
  value: number;
  color?: string;
}

export interface DistributionData {
  items: DistributionItem[];
  total?: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendData {
  points: TrendPoint[];
  xLabel?: string;
  yLabel?: string;
}

export interface ListItem {
  rank?: number;
  name: string;
  value: number | string;
  subtext?: string;
}

export interface ListData {
  items: ListItem[];
  valueLabel?: string;
}

export interface QueryResponse {
  id: string;
  query: string;
  type: VisualizationType;
  title: string;
  subtitle?: string;
  data: SingleStatData | ComparisonData | DistributionData | TrendData | ListData;
  followUpSuggestions?: string[];
  timestamp: Date;
}

// Pinned Query
export interface PinnedQuery {
  id: string;
  query: string;
  title: string;
  type: VisualizationType;
  pinnedAt: Date;
}

// AI Query Refinement Info
export interface RefinedQueryInfo {
  originalQuery: string;
  refinedQuery: string;
  confidence: number;
}

// Conversation
export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  response?: QueryResponse;
  timestamp: Date;
  refinedQuery?: RefinedQueryInfo;
}

// Dashboard Item - stores full QueryResponse for rendering on dashboard
export interface DashboardItem {
  id: string;
  response: QueryResponse;
  addedAt: Date;
}

