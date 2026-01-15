import type { 
  WaygroundData, 
  QueryResponse, 
  VisualizationType,
  SingleStatData,
  ComparisonData,
  DistributionData,
  TrendData,
  ListData
} from '../types';

// Generate unique ID
function generateId(): string {
  return `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Pattern definitions for query matching
interface QueryPattern {
  patterns: RegExp[];
  type: VisualizationType;
  handler: (query: string, data: WaygroundData) => Omit<QueryResponse, 'id' | 'timestamp'> | null;
}

const queryPatterns: QueryPattern[] = [
  // Teachers using accommodations
  {
    patterns: [
      /how many teachers.*accommodations?/i,
      /teachers.*using accommodations?/i,
      /accommodation.*teachers?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Teachers Using Accommodations',
      subtitle: 'Percentage of teachers who used Wayground and enabled accommodations',
      data: {
        value: data.differentiation.accommodationUsagePercent,
        label: 'of teachers use Accommodations',
        suffix: '%',
      } as SingleStatData,
      followUpSuggestions: [
        'How many students are supported through accommodations?',
        'What are the top accommodations used?',
      ],
    }),
  },

  // Students with accommodations
  {
    patterns: [
      /how many students.*accommodations?/i,
      /students.*supported.*accommodations?/i,
      /accommodations?.*students?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Students Supported',
      subtitle: 'Students receiving support through Accommodations features',
      data: {
        value: data.differentiation.studentsSupported,
        label: 'students supported through Accommodations',
      } as SingleStatData,
      followUpSuggestions: [
        'What are the top accommodations used?',
        'How many teachers are using accommodations?',
      ],
    }),
  },

  // Top accommodations
  {
    patterns: [
      /top accommodations?/i,
      /most used accommodations?/i,
      /popular accommodations?/i,
      /accommodations? breakdown/i,
    ],
    type: 'list',
    handler: (query, data) => ({
      query,
      type: 'list',
      title: 'Top Accommodations Used',
      subtitle: 'Frequency of the most used Accommodations features',
      data: {
        items: data.differentiation.topAccommodations.map((acc, i) => ({
          rank: i + 1,
          name: acc.name,
          value: acc.students,
          subtext: 'students',
        })),
        valueLabel: 'students',
      } as ListData,
      followUpSuggestions: [
        'How many students are supported through accommodations?',
        'Compare accommodations by student count',
      ],
    }),
  },

  // Compare presentations vs assessments
  {
    patterns: [
      /compare.*presentations?.*assessments?/i,
      /presentations?.*vs.*assessments?/i,
      /assessments?.*vs.*presentations?/i,
      /compare.*assessments?.*presentations?/i,
    ],
    type: 'comparison',
    handler: (query, data) => {
      const metric = query.toLowerCase().includes('teacher') ? 'teachers' : 'sessions';
      return {
        query,
        type: 'comparison',
        title: `Presentations vs Assessments`,
        subtitle: `Comparison by ${metric}`,
        data: {
          items: [
            { 
              name: 'Presentations', 
              value: data.contentTypes.presentations[metric],
              color: '#E91E8C',
            },
            { 
              name: 'Assessments', 
              value: data.contentTypes.assessments[metric],
              color: '#10B981',
            },
          ],
          yLabel: metric === 'teachers' ? 'Teachers' : 'Sessions',
        } as ComparisonData,
        followUpSuggestions: [
          'Compare all content types',
          'Show sessions trend over time',
        ],
      };
    },
  },

  // Compare all content types
  {
    patterns: [
      /compare.*content types?/i,
      /all content types?/i,
      /content types?.*comparison/i,
      /breakdown.*content types?/i,
      /content types?.*breakdown/i,
    ],
    type: 'comparison',
    handler: (query, data) => {
      const metric = query.toLowerCase().includes('teacher') ? 'teachers' : 'sessions';
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
      return {
        query,
        type: 'comparison',
        title: 'Content Types Comparison',
        subtitle: `By ${metric}`,
        data: {
          items: [
            { name: 'Assessments', value: data.contentTypes.assessments[metric], color: colors[0] },
            { name: 'Presentations', value: data.contentTypes.presentations[metric], color: colors[1] },
            { name: 'Videos', value: data.contentTypes.videos[metric], color: colors[2] },
            { name: 'Passages', value: data.contentTypes.passages[metric], color: colors[3] },
            { name: 'Flashcards', value: data.contentTypes.flashcards[metric], color: colors[4] },
          ],
          yLabel: metric === 'teachers' ? 'Teachers' : 'Sessions',
        } as ComparisonData,
        followUpSuggestions: [
          'Which content type has the most teachers?',
          'Show sessions trend over time',
        ],
      };
    },
  },

  // Assessment sessions
  {
    patterns: [
      /how many.*assessment.*sessions?/i,
      /assessment sessions?/i,
      /sessions?.*assessments?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Assessment Sessions',
      subtitle: 'Total number of assessment sessions',
      data: {
        value: data.contentTypes.assessments.sessions,
        label: 'assessment sessions',
      } as SingleStatData,
      followUpSuggestions: [
        'How many teachers use assessments?',
        'Compare assessments vs presentations',
      ],
    }),
  },

  // Presentation sessions
  {
    patterns: [
      /how many.*presentation.*sessions?/i,
      /presentation sessions?/i,
      /sessions?.*presentations?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Presentation Sessions',
      subtitle: 'Total number of presentation sessions',
      data: {
        value: data.contentTypes.presentations.sessions,
        label: 'presentation sessions',
      } as SingleStatData,
      followUpSuggestions: [
        'How many teachers use presentations?',
        'Compare presentations vs assessments',
      ],
    }),
  },

  // Total teachers
  {
    patterns: [
      /how many teachers?$/i,
      /total.*teachers?/i,
      /teachers?.*total/i,
      /number of teachers?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Total Teachers',
      subtitle: 'Teachers using Wayground',
      data: {
        value: data.teachers.total,
        label: 'teachers using Wayground',
      } as SingleStatData,
      followUpSuggestions: [
        'Show teachers by content type',
        'How many teachers use accommodations?',
      ],
    }),
  },

  // Curriculum alignment percentage
  {
    patterns: [
      /curriculum.*aligned/i,
      /standards.*resources?/i,
      /teachers?.*standards?/i,
      /percentage.*standards?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Curriculum Alignment',
      subtitle: 'Teachers using standards and curriculum-aligned resources',
      data: {
        value: data.curriculumAlignment.teachersUsingStandardsPercent,
        label: 'of teachers used standards and curriculum-aligned resources',
        suffix: '%',
      } as SingleStatData,
      followUpSuggestions: [
        'Show the top standards used',
        'Compare content types',
      ],
    }),
  },

  // Top standards
  {
    patterns: [
      /top.*standards?/i,
      /most.*used.*standards?/i,
      /popular.*standards?/i,
      /frequently.*standards?/i,
    ],
    type: 'list',
    handler: (query, data) => ({
      query,
      type: 'list',
      title: 'Most Frequently Used Standards',
      subtitle: 'Top standards by session count',
      data: {
        items: data.curriculumAlignment.topStandards.map((std, i) => ({
          rank: i + 1,
          name: std.code,
          value: std.sessions,
          subtext: 'sessions',
        })),
        valueLabel: 'sessions',
      } as ListData,
      followUpSuggestions: [
        'What percentage of teachers use curriculum-aligned resources?',
        'Show content types comparison',
      ],
    }),
  },

  // Sessions trend
  {
    patterns: [
      /trend.*sessions?/i,
      /sessions?.*trend/i,
      /sessions?.*over time/i,
      /sessions?.*monthly/i,
      /show.*trend/i,
    ],
    type: 'trend',
    handler: (query, data) => ({
      query,
      type: 'trend',
      title: 'Sessions Over Time',
      subtitle: 'Monthly session trends',
      data: {
        points: data.monthlyTrends.map(t => ({
          label: t.month,
          value: t.sessions,
        })),
        xLabel: 'Month',
        yLabel: 'Sessions',
      } as TrendData,
      followUpSuggestions: [
        'Compare content types by sessions',
        'How many total sessions?',
      ],
    }),
  },

  // Higher order thinking
  {
    patterns: [
      /higher.*order.*thinking/i,
      /HOT.*questions?/i,
      /critical.*thinking/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Higher-Order Thinking Questions',
      subtitle: 'Percentage of questions that were higher-order thinking',
      data: {
        value: data.testPrep.higherOrderQuestionsPercent,
        label: 'of questions were higher-order thinking',
        suffix: '%',
      } as SingleStatData,
      followUpSuggestions: [
        'What percentage of teachers asked higher-order thinking questions?',
        'Show question types breakdown',
      ],
    }),
  },

  // Teachers asking HOT questions
  {
    patterns: [
      /teachers?.*higher.*order/i,
      /teachers?.*HOT/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Teachers Using Higher-Order Thinking',
      subtitle: 'Teachers who asked higher-order thinking questions',
      data: {
        value: data.testPrep.teachersAskingHOTPercent,
        label: 'of teachers asked higher-order thinking questions',
        suffix: '%',
      } as SingleStatData,
      followUpSuggestions: [
        'What percentage of questions are higher-order?',
        'Show question types used',
      ],
    }),
  },

  // AI powered resources
  {
    patterns: [
      /AI.*powered/i,
      /AI.*resources?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'AI-Powered Resources',
      subtitle: 'Resources that were AI-powered, saving teacher time',
      data: {
        value: data.testPrep.aiPoweredResourcesPercent,
        label: 'of resources were AI-powered',
        suffix: '%',
      } as SingleStatData,
      followUpSuggestions: [
        'Show question types breakdown',
        'Compare content types',
      ],
    }),
  },

  // Question types
  {
    patterns: [
      /question types?/i,
      /types? of questions?/i,
      /most.*used.*questions?/i,
    ],
    type: 'comparison',
    handler: (query, data) => ({
      query,
      type: 'comparison',
      title: 'Question Types Used',
      subtitle: 'Higher-order thinking question types by usage',
      data: {
        items: data.testPrep.questionTypes.map((qt, i) => ({
          name: qt.type,
          value: qt.count,
          color: ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'][i],
        })),
        yLabel: 'Questions',
      } as ComparisonData,
      followUpSuggestions: [
        'What percentage of questions are higher-order thinking?',
        'Compare content types',
      ],
    }),
  },

  // Content type distribution (pie chart)
  {
    patterns: [
      /distribution.*content/i,
      /pie.*chart.*content/i,
      /content.*distribution/i,
      /breakdown of sessions/i,
    ],
    type: 'distribution',
    handler: (query, data) => {
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
      const total = Object.values(data.contentTypes).reduce((sum, ct) => sum + ct.sessions, 0);
      return {
        query,
        type: 'distribution',
        title: 'Session Distribution by Content Type',
        subtitle: 'How sessions are distributed across content types',
        data: {
          items: [
            { name: 'Assessments', value: data.contentTypes.assessments.sessions, color: colors[0] },
            { name: 'Presentations', value: data.contentTypes.presentations.sessions, color: colors[1] },
            { name: 'Videos', value: data.contentTypes.videos.sessions, color: colors[2] },
            { name: 'Passages', value: data.contentTypes.passages.sessions, color: colors[3] },
            { name: 'Flashcards', value: data.contentTypes.flashcards.sessions, color: colors[4] },
          ],
          total,
        } as DistributionData,
        followUpSuggestions: [
          'Compare content types by teachers',
          'Show sessions trend over time',
        ],
      };
    },
  },

  // Accommodation distribution
  {
    patterns: [
      /accommodation.*distribution/i,
      /distribution.*accommodation/i,
      /pie.*accommodation/i,
    ],
    type: 'distribution',
    handler: (query, data) => {
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6'];
      const total = data.differentiation.topAccommodations.reduce((sum, acc) => sum + acc.students, 0);
      return {
        query,
        type: 'distribution',
        title: 'Accommodation Distribution',
        subtitle: 'How students use different accommodations',
        data: {
          items: data.differentiation.topAccommodations.map((acc, i) => ({
            name: acc.name,
            value: acc.students,
            color: colors[i],
          })),
          total,
        } as DistributionData,
        followUpSuggestions: [
          'How many students are supported?',
          'How many teachers use accommodations?',
        ],
      };
    },
  },
];

// Parse and process a user query
export function processQuery(query: string, data: WaygroundData): QueryResponse | null {
  const normalizedQuery = query.trim().toLowerCase();
  
  for (const pattern of queryPatterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedQuery)) {
        const result = pattern.handler(query, data);
        if (result) {
          return {
            ...result,
            id: generateId(),
            timestamp: new Date(),
          };
        }
      }
    }
  }
  
  // Default fallback - try to provide helpful suggestions
  return {
    id: generateId(),
    query,
    type: 'single_stat',
    title: "I couldn't understand that query",
    subtitle: 'Try one of these example questions:',
    data: {
      value: '?',
      label: 'Try asking about teachers, sessions, accommodations, or content types',
    } as SingleStatData,
    followUpSuggestions: [
      'How many teachers are using accommodations?',
      'Compare presentations vs assessments',
      'What are the top accommodations used?',
      'Show the trend of sessions over time',
    ],
    timestamp: new Date(),
  };
}

// Get query suggestions based on partial input
export function getQuerySuggestions(partialQuery: string): string[] {
  const suggestions = [
    'How many teachers are using accommodations?',
    'Compare presentations vs assessments by session count',
    'What are the top accommodations used?',
    'Show me the breakdown of content types by teachers',
    'How many students are supported through accommodations?',
    'What percentage of teachers use curriculum-aligned resources?',
    'Show the trend of sessions over time',
    'What are the most used question types?',
    'Compare all content types by number of sessions',
    'How many assessment sessions were there?',
    'What percent of questions are higher-order thinking?',
    'Show the top 5 standards used',
    'How many total teachers?',
    'Show session distribution by content type',
  ];
  
  if (!partialQuery.trim()) {
    return suggestions.slice(0, 5);
  }
  
  const lowerQuery = partialQuery.toLowerCase();
  return suggestions
    .filter(s => s.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}

