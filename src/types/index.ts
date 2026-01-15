// Content Type Data
export interface ContentTypeStats {
  sessions: number;
  teachers: number;
}

export interface ContentTypes {
  assessments: ContentTypeStats;
  presentations: ContentTypeStats;
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

// Conversation
export interface ConversationMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  response?: QueryResponse;
  timestamp: Date;
}

// Dashboard Item - stores full QueryResponse for rendering on dashboard
export interface DashboardItem {
  id: string;
  response: QueryResponse;
  addedAt: Date;
}

