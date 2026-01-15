import type { 
  WaygroundData, 
  QueryResponse, 
  VisualizationType,
  SingleStatData,
  ComparisonData,
  DistributionData,
  TrendData,
  ListData,
  SchoolData,
  TeacherData
} from '../types';
import { 
  teachersData, 
  questionTypesData, 
  accommodationsData, 
  standardsData 
} from '../data/mockData';

// Generate unique ID
function generateId(): string {
  return `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format large numbers with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Pattern definitions for query matching
interface QueryPattern {
  patterns: RegExp[];
  type: VisualizationType;
  handler: (query: string, data: WaygroundData) => Omit<QueryResponse, 'id' | 'timestamp'> | null;
}

const queryPatterns: QueryPattern[] = [
  // Top schools by student responses
  {
    patterns: [
      /top.*schools?.*student responses?/i,
      /schools?.*most.*student responses?/i,
      /which schools?.*most.*responses?/i,
      /highest.*student responses?/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Student responses'] > 0)
        .sort((a, b) => b['Student responses'] - a['Student responses'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools by Student Responses',
        subtitle: 'Schools with highest engagement',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: formatNumber(s['Student responses']),
            subtext: 'responses',
          })),
          valueLabel: 'responses',
        } as ListData,
        followUpSuggestions: [
          'Top schools by active teachers',
          'Which schools have the most sessions?',
        ],
      };
    },
  },

  // Top schools by active teachers
  {
    patterns: [
      /top.*schools?.*active teachers?/i,
      /schools?.*most.*active teachers?/i,
      /which schools?.*most.*teachers?/i,
      /schools?.*by.*teachers?/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Active teachers'] > 0)
        .sort((a, b) => b['Active teachers'] - a['Active teachers'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools by Active Teachers',
        subtitle: 'Schools with most engaged teaching staff',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: s['Active teachers'],
            subtext: `of ${s['Rostered teachers']} rostered`,
          })),
          valueLabel: 'teachers',
        } as ListData,
        followUpSuggestions: [
          'Top schools by student responses',
          'How many total teachers?',
        ],
      };
    },
  },

  // Top schools by sessions
  {
    patterns: [
      /top.*schools?.*sessions?/i,
      /schools?.*most.*sessions?/i,
      /which schools?.*most.*sessions?/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Sessions'] > 0)
        .sort((a, b) => b['Sessions'] - a['Sessions'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools by Sessions',
        subtitle: 'Schools with most activity sessions',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: formatNumber(s['Sessions']),
            subtext: 'sessions',
          })),
          valueLabel: 'sessions',
        } as ListData,
        followUpSuggestions: [
          'Compare content types by sessions',
          'Show session trend over time',
        ],
      };
    },
  },

  // Schools with highest HOT question usage
  {
    patterns: [
      /schools?.*HOT.*question/i,
      /schools?.*higher.*order/i,
      /highest.*HOT.*question/i,
      /top.*schools?.*critical.*thinking/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Percent rostered teachers using hot questions'] > 0)
        .sort((a, b) => b['Percent rostered teachers using hot questions'] - a['Percent rostered teachers using hot questions'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools Using HOT Questions',
        subtitle: 'Schools with highest higher-order thinking question usage',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: `${s['Percent rostered teachers using hot questions']}%`,
            subtext: 'of teachers',
          })),
          valueLabel: 'usage',
        } as ListData,
        followUpSuggestions: [
          'What question types are used?',
          'What percentage of questions are higher-order?',
        ],
      };
    },
  },

  // Schools using AI-powered resources
  {
    patterns: [
      /schools?.*AI.*powered/i,
      /schools?.*AI.*resources?/i,
      /which schools?.*AI/i,
      /top.*AI.*resources?/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Percent Resources Which Are AI Powered'] > 0)
        .sort((a, b) => b['Percent Resources Which Are AI Powered'] - a['Percent Resources Which Are AI Powered'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools Using AI-Powered Resources',
        subtitle: 'Schools leveraging AI to save teacher time',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: `${s['Percent Resources Which Are AI Powered']}%`,
            subtext: `${s['AI Powered Resources']} resources`,
          })),
          valueLabel: 'AI %',
        } as ListData,
        followUpSuggestions: [
          'What is the overall AI resource usage?',
          'Top schools by sessions',
        ],
      };
    },
  },

  // Schools with highest accommodation usage
  {
    patterns: [
      /schools?.*accommodations?/i,
      /which schools?.*accommodations?/i,
      /top.*schools?.*accommodations?/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Students benefited from Accommodations'] > 0)
        .sort((a, b) => b['Students benefited from Accommodations'] - a['Students benefited from Accommodations'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Schools Supporting Students with Accommodations',
        subtitle: 'Schools providing the most student accommodations',
        data: {
          items: topSchools.map((s, i) => ({
            rank: i + 1,
            name: s['School name'],
            value: formatNumber(s['Students benefited from Accommodations']),
            subtext: 'students supported',
          })),
          valueLabel: 'students',
        } as ListData,
        followUpSuggestions: [
          'What are the top accommodations used?',
          'How many teachers use accommodations?',
        ],
      };
    },
  },

  // Total student responses
  {
    patterns: [
      /total.*student responses?/i,
      /how many.*student responses?/i,
      /student responses?.*total/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const total = data.schools.reduce((sum, s) => sum + s['Student responses'], 0);
      return {
        query,
        type: 'single_stat',
        title: 'Total Student Responses',
        subtitle: 'Student engagement across all schools',
        data: {
          value: formatNumber(total),
          label: 'student responses recorded',
        } as SingleStatData,
        followUpSuggestions: [
          'Top schools by student responses',
          'How many game players?',
        ],
      };
    },
  },

  // Total game players
  {
    patterns: [
      /game players?/i,
      /how many.*players?/i,
      /students?.*playing/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const total = data.schools.reduce((sum, s) => sum + s['game_players'], 0);
      return {
        query,
        type: 'single_stat',
        title: 'Total Game Players',
        subtitle: 'Students engaged through game-based learning',
        data: {
          value: formatNumber(total),
          label: 'students played learning games',
        } as SingleStatData,
        followUpSuggestions: [
          'Total student responses',
          'Top schools by sessions',
        ],
      };
    },
  },

  // Teachers using accommodations
  {
    patterns: [
      /how many teachers.*accommodations?/i,
      /teachers.*using accommodations?/i,
      /accommodation.*usage.*percent/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Teachers Using Accommodations',
      subtitle: 'Percentage of active teachers who enabled accommodations',
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
      /students?.*benefited/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Students Supported',
      subtitle: 'Students receiving support through Accommodations features',
      data: {
        value: formatNumber(data.differentiation.studentsSupported),
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
      /what accommodations?/i,
    ],
    type: 'list',
    handler: (query, data) => ({
      query,
      type: 'list',
      title: 'Top Accommodations Used',
      subtitle: 'Most utilized accommodation features for student support',
      data: {
        items: data.differentiation.topAccommodations.map((acc, i) => ({
          rank: i + 1,
          name: acc.name,
          value: formatNumber(acc.students),
          subtext: 'students',
        })),
        valueLabel: 'students',
      } as ListData,
      followUpSuggestions: [
        'How many students are supported through accommodations?',
        'Which schools use the most accommodations?',
      ],
    }),
  },

  // Compare lessons vs assessments
  {
    patterns: [
      /compare.*lessons?.*assessments?/i,
      /lessons?.*vs.*assessments?/i,
      /assessments?.*vs.*lessons?/i,
      /compare.*assessments?.*lessons?/i,
    ],
    type: 'comparison',
    handler: (query, data) => {
      const metric = query.toLowerCase().includes('teacher') ? 'teachers' : 'sessions';
      return {
        query,
        type: 'comparison',
        title: `Lessons vs Assessments`,
        subtitle: `Comparison by ${metric}`,
        data: {
          items: [
            { 
              name: 'Lessons', 
              value: data.contentTypes.lessons[metric],
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
            { name: 'Lessons', value: data.contentTypes.lessons[metric], color: colors[1] },
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
        value: formatNumber(data.contentTypes.assessments.sessions),
        label: 'assessment sessions',
      } as SingleStatData,
      followUpSuggestions: [
        'How many teachers use assessments?',
        'Compare assessments vs lessons',
      ],
    }),
  },

  // Lesson sessions
  {
    patterns: [
      /how many.*lesson.*sessions?/i,
      /lesson sessions?/i,
      /sessions?.*lessons?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => ({
      query,
      type: 'single_stat',
      title: 'Lesson Sessions',
      subtitle: 'Total number of lesson sessions',
      data: {
        value: formatNumber(data.contentTypes.lessons.sessions),
        label: 'lesson sessions',
      } as SingleStatData,
      followUpSuggestions: [
        'How many teachers use lessons?',
        'Compare lessons vs assessments',
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
      title: 'Total Active Teachers',
      subtitle: 'Teachers actively using the platform',
      data: {
        value: formatNumber(data.teachers.total),
        label: 'active teachers across all schools',
      } as SingleStatData,
      followUpSuggestions: [
        'Top schools by active teachers',
        'How many teachers use accommodations?',
      ],
    }),
  },

  // Total schools
  {
    patterns: [
      /how many schools?/i,
      /total.*schools?/i,
      /number of schools?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const activeSchools = data.schools.filter(s => s['Active teachers'] > 0).length;
      return {
        query,
        type: 'single_stat',
        title: 'Total Schools',
        subtitle: 'Schools in the district',
        data: {
          value: activeSchools,
          label: `schools with active teachers (${data.schools.length} total)`,
        } as SingleStatData,
        followUpSuggestions: [
          'Top schools by student responses',
          'Top schools by active teachers',
        ],
      };
    },
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
        'Top schools by curriculum alignment',
        'Compare content types',
      ],
    }),
  },

  // Top schools by curriculum alignment
  {
    patterns: [
      /top.*schools?.*curriculum/i,
      /schools?.*curriculum.*align/i,
    ],
    type: 'list',
    handler: (query, data) => {
      const topSchools = [...data.schools]
        .filter(s => s['Percent rostered teachers using curriculum aligned resources'] > 0 && s['Active teachers'] > 0)
        .sort((a, b) => b['Percent rostered teachers using curriculum aligned resources'] - a['Percent rostered teachers using curriculum aligned resources'])
        .slice(0, 10);
      return {
      query,
      type: 'list',
        title: 'Top Schools by Curriculum Alignment',
        subtitle: 'Schools with highest standards alignment',
      data: {
          items: topSchools.map((s, i) => ({
          rank: i + 1,
            name: s['School name'],
            value: `${s['Percent rostered teachers using curriculum aligned resources']}%`,
            subtext: `${s['Active teachers']} active teachers`,
          })),
          valueLabel: 'alignment',
      } as ListData,
      followUpSuggestions: [
          'What percentage use curriculum-aligned resources?',
          'Top schools by sessions',
      ],
      };
    },
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

  // Total sessions
  {
    patterns: [
      /total.*sessions?/i,
      /how many.*sessions?/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const total = Object.values(data.contentTypes).reduce((sum, ct) => sum + ct.sessions, 0);
      return {
        query,
        type: 'single_stat',
        title: 'Total Sessions',
        subtitle: 'All learning sessions across the district',
        data: {
          value: formatNumber(total),
          label: 'total learning sessions',
        } as SingleStatData,
        followUpSuggestions: [
          'Show session trend over time',
          'Compare content types by sessions',
        ],
      };
    },
  },

  // Higher order thinking
  {
    patterns: [
      /higher.*order.*thinking/i,
      /HOT.*questions?.*percent/i,
      /percent.*HOT/i,
      /critical.*thinking.*percent/i,
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
      /percent.*teachers?.*HOT/i,
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
      /AI.*powered.*percent/i,
      /percent.*AI.*resources?/i,
      /overall.*AI/i,
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
        'Which schools use the most AI resources?',
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
      /HOT.*question.*types?/i,
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
        'Which schools use HOT questions most?',
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
            { name: 'Lessons', value: data.contentTypes.lessons.sessions, color: colors[1] },
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
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
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
            color: colors[i % colors.length],
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

  // Total questions hosted
  {
    patterns: [
      /total.*questions?.*hosted/i,
      /how many.*questions?.*hosted/i,
      /questions?.*hosted/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const total = data.schools.reduce((sum, s) => sum + s['Questions hosted'], 0);
      return {
        query,
        type: 'single_stat',
        title: 'Total Questions Hosted',
        subtitle: 'Questions used across all sessions',
        data: {
          value: formatNumber(total),
          label: 'questions hosted across all schools',
        } as SingleStatData,
        followUpSuggestions: [
          'What question types are used?',
          'What percent are higher-order thinking?',
        ],
      };
    },
  },

  // Resources used
  {
    patterns: [
      /total.*resources?.*used/i,
      /how many.*resources?/i,
      /resources?.*used/i,
    ],
    type: 'single_stat',
    handler: (query, data) => {
      const total = data.schools.reduce((sum, s) => sum + s['Resources used'], 0);
      const aiPowered = data.schools.reduce((sum, s) => sum + s['AI Powered Resources'], 0);
      return {
        query,
        type: 'single_stat',
        title: 'Total Resources Used',
        subtitle: 'Learning resources utilized across the district',
        data: {
          value: formatNumber(total),
          label: `resources used (${formatNumber(aiPowered)} AI-powered)`,
        } as SingleStatData,
        followUpSuggestions: [
          'What percent are AI-powered?',
          'Which schools use the most AI resources?',
        ],
      };
    },
  },

  // Top teachers by sessions
  {
    patterns: [
      /top.*teachers?.*sessions?/i,
      /teachers?.*most.*sessions?/i,
      /which teachers?.*most.*sessions?/i,
    ],
    type: 'list',
    handler: (query) => {
      const topTeachers = [...teachersData]
        .filter(t => t['Sessions'] > 0)
        .sort((a, b) => b['Sessions'] - a['Sessions'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Teachers by Sessions',
        subtitle: 'Most active teachers by learning sessions',
        data: {
          items: topTeachers.map((t, i) => ({
            rank: i + 1,
            name: t['Teacher Name'],
            value: formatNumber(t['Sessions']),
            subtext: t['School name'],
          })),
          valueLabel: 'sessions',
        } as ListData,
        followUpSuggestions: [
          'Top teachers by student responses',
          'Top schools by sessions',
        ],
      };
    },
  },

  // Top teachers by student responses
  {
    patterns: [
      /top.*teachers?.*student responses?/i,
      /teachers?.*most.*responses?/i,
      /which teachers?.*most.*responses?/i,
    ],
    type: 'list',
    handler: (query) => {
      const topTeachers = [...teachersData]
        .filter(t => t['Student responses'] > 0)
        .sort((a, b) => b['Student responses'] - a['Student responses'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Teachers by Student Responses',
        subtitle: 'Teachers with highest student engagement',
        data: {
          items: topTeachers.map((t, i) => ({
            rank: i + 1,
            name: t['Teacher Name'],
            value: formatNumber(t['Student responses']),
            subtext: t['School name'],
          })),
          valueLabel: 'responses',
        } as ListData,
        followUpSuggestions: [
          'Top teachers by sessions',
          'Top schools by student responses',
        ],
      };
    },
  },

  // Top standards by sessions
  {
    patterns: [
      /top.*standards?.*sessions?/i,
      /standards?.*most.*sessions?/i,
      /which standards?.*most/i,
      /popular.*standards?/i,
      /most used standards?/i,
    ],
    type: 'list',
    handler: (query) => {
      const topStandards = [...standardsData]
        .sort((a, b) => b['Number of sessions'] - a['Number of sessions'])
        .slice(0, 10);
      return {
        query,
        type: 'list',
        title: 'Top Standards by Usage',
        subtitle: 'Most frequently used curriculum standards',
        data: {
          items: topStandards.map((s, i) => ({
            rank: i + 1,
            name: s['Standard Code'],
            value: formatNumber(s['Number of sessions']),
            subtext: `${s['Schools'].split(',').length} schools`,
          })),
          valueLabel: 'sessions',
        } as ListData,
        followUpSuggestions: [
          'What percentage use curriculum-aligned resources?',
          'Top schools by curriculum alignment',
        ],
      };
    },
  },

  // All question types by sessions
  {
    patterns: [
      /all.*question types?/i,
      /question types?.*all/i,
      /question types?.*by sessions?/i,
      /breakdown.*question types?/i,
    ],
    type: 'comparison',
    handler: (query) => {
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
      const sortedTypes = [...questionTypesData]
        .sort((a, b) => b['Number of sessions'] - a['Number of sessions'])
        .slice(0, 8);
      return {
        query,
        type: 'comparison',
        title: 'Question Types by Sessions',
        subtitle: 'All question types by usage',
        data: {
          items: sortedTypes.map((q, i) => ({
            name: q['Question Type'],
            value: q['Number of sessions'],
            color: colors[i % colors.length],
          })),
          yLabel: 'Sessions',
        } as ComparisonData,
        followUpSuggestions: [
          'Show question types by category',
          'What percentage are higher-order thinking?',
        ],
      };
    },
  },

  // Question types by category
  {
    patterns: [
      /question.*by category/i,
      /question category/i,
      /question.*categories?/i,
    ],
    type: 'comparison',
    handler: (query) => {
      const categories = [...new Set(questionTypesData.map(q => q['Question Category']))];
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
      const categoryData = categories.map(cat => ({
        name: cat,
        value: questionTypesData
          .filter(q => q['Question Category'] === cat)
          .reduce((sum, q) => sum + q['Number of sessions'], 0),
      })).sort((a, b) => b.value - a.value);
      return {
        query,
        type: 'comparison',
        title: 'Question Types by Category',
        subtitle: 'Sessions grouped by question category',
        data: {
          items: categoryData.map((c, i) => ({
            ...c,
            color: colors[i % colors.length],
          })),
          yLabel: 'Sessions',
        } as ComparisonData,
        followUpSuggestions: [
          'Show all question types',
          'What percentage are higher-order thinking?',
        ],
      };
    },
  },

  // Accommodations by category
  {
    patterns: [
      /accommodation.*categories?/i,
      /accommodation.*by category/i,
      /categories?.*accommodation/i,
    ],
    type: 'comparison',
    handler: (query) => {
      const categories = [...new Set(accommodationsData.map(a => a['Accommodation Category']))];
      const colors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
      const categoryData = categories.map(cat => ({
        name: cat,
        value: accommodationsData
          .filter(a => a['Accommodation Category'] === cat)
          .reduce((sum, a) => sum + a['Students benefited'], 0),
      })).sort((a, b) => b.value - a.value);
      return {
        query,
        type: 'comparison',
        title: 'Accommodations by Category',
        subtitle: 'Students benefited grouped by accommodation category',
        data: {
          items: categoryData.map((c, i) => ({
            ...c,
            color: colors[i % colors.length],
          })),
          yLabel: 'Students',
        } as ComparisonData,
        followUpSuggestions: [
          'What are the top accommodations?',
          'How many students are supported?',
        ],
      };
    },
  },

  // All accommodations list
  {
    patterns: [
      /all.*accommodations?/i,
      /list.*accommodations?/i,
      /show.*all.*accommodations?/i,
    ],
    type: 'list',
    handler: (query) => {
      const sortedAccommodations = [...accommodationsData]
        .sort((a, b) => b['Students benefited'] - a['Students benefited']);
      return {
        query,
        type: 'list',
        title: 'All Accommodations',
        subtitle: 'Complete list of accommodations by students benefited',
        data: {
          items: sortedAccommodations.map((a, i) => ({
            rank: i + 1,
            name: a['Accommodation'],
            value: formatNumber(a['Students benefited']),
            subtext: a['Accommodation Category'],
          })),
          valueLabel: 'students',
        } as ListData,
        followUpSuggestions: [
          'Show accommodations by category',
          'How many students are supported?',
        ],
      };
    },
  },

  // Total teachers count from teacher data
  {
    patterns: [
      /how many individual teachers?/i,
      /total individual teachers?/i,
      /count.*teachers?/i,
    ],
    type: 'single_stat',
    handler: (query) => ({
      query,
      type: 'single_stat',
      title: 'Total Teachers',
      subtitle: 'Individual teachers in the system',
      data: {
        value: formatNumber(teachersData.length),
        label: 'teachers in the district',
      } as SingleStatData,
      followUpSuggestions: [
        'Top teachers by sessions',
        'Top teachers by student responses',
      ],
    }),
  },
];

// Helper to find a school by name (fuzzy match)
function findSchoolByName(query: string, schools: SchoolData[]): SchoolData | null {
  const normalizedQuery = query.toLowerCase();
  
  // Try exact match first
  const exactMatch = schools.find(s => 
    normalizedQuery.includes(s['School name'].toLowerCase())
  );
  if (exactMatch) return exactMatch;
  
  // Try partial match
  for (const school of schools) {
    const schoolWords = school['School name'].toLowerCase().split(/\s+/);
    const matchCount = schoolWords.filter(word => 
      word.length > 2 && normalizedQuery.includes(word)
    ).length;
    if (matchCount >= 2 || (schoolWords.length === 1 && matchCount === 1)) {
      return school;
    }
  }
  
  return null;
}

// Handle school-specific queries
function handleSchoolSpecificQuery(query: string, data: WaygroundData): QueryResponse | null {
  const school = findSchoolByName(query, data.schools);
  if (!school) return null;
  
  const normalizedQuery = query.toLowerCase();
  const schoolName = school['School name'];
  
  // Active teachers for a specific school
  if (normalizedQuery.includes('active teacher')) {
    return {
      id: generateId(),
      query,
      type: 'single_stat',
      title: `Active Teachers at ${schoolName}`,
      subtitle: `Teacher engagement at this school`,
      data: {
        value: school['Active teachers'],
        label: `active teachers out of ${school['Rostered teachers']} rostered`,
      } as SingleStatData,
      followUpSuggestions: [
        `How many sessions at ${schoolName}?`,
        `Student responses at ${schoolName}`,
        'Top schools by active teachers',
      ],
      timestamp: new Date(),
    };
  }
  
  // Rostered teachers for a specific school
  if (normalizedQuery.includes('rostered teacher') || normalizedQuery.includes('total teacher')) {
    return {
      id: generateId(),
      query,
      type: 'single_stat',
      title: `Rostered Teachers at ${schoolName}`,
      subtitle: `Total teaching staff at this school`,
      data: {
        value: school['Rostered teachers'],
        label: `rostered teachers (${school['Active teachers']} active, ${school['Logged in teachers']} logged in)`,
      } as SingleStatData,
      followUpSuggestions: [
        `How many active teachers at ${schoolName}?`,
        `Sessions at ${schoolName}`,
        'Top schools by active teachers',
      ],
      timestamp: new Date(),
    };
  }
  
  // Sessions for a specific school
  if (normalizedQuery.includes('session')) {
    return {
      id: generateId(),
      query,
      type: 'single_stat',
      title: `Sessions at ${schoolName}`,
      subtitle: `Learning sessions at this school`,
      data: {
        value: formatNumber(school['Sessions']),
        label: `total sessions (${school['Assessment Sessions']} assessments, ${school['Lesson Sessions']} lessons)`,
      } as SingleStatData,
      followUpSuggestions: [
        `Student responses at ${schoolName}`,
        `Active teachers at ${schoolName}`,
        'Top schools by sessions',
      ],
      timestamp: new Date(),
    };
  }
  
  // Student responses for a specific school
  if (normalizedQuery.includes('student response') || normalizedQuery.includes('responses')) {
    return {
      id: generateId(),
      query,
      type: 'single_stat',
      title: `Student Responses at ${schoolName}`,
      subtitle: `Student engagement at this school`,
      data: {
        value: formatNumber(school['Student responses']),
        label: `student responses recorded`,
      } as SingleStatData,
      followUpSuggestions: [
        `Sessions at ${schoolName}`,
        `Game players at ${schoolName}`,
        'Top schools by student responses',
      ],
      timestamp: new Date(),
    };
  }
  
  // Accommodations for a specific school
  if (normalizedQuery.includes('accommodation')) {
    return {
      id: generateId(),
      query,
      type: 'single_stat',
      title: `Accommodations at ${schoolName}`,
      subtitle: `Student support at this school`,
      data: {
        value: formatNumber(school['Students benefited from Accommodations']),
        label: `students supported with accommodations`,
      } as SingleStatData,
      followUpSuggestions: [
        `Active teachers at ${schoolName}`,
        'Top schools by accommodations',
        'What are the top accommodations used?',
      ],
      timestamp: new Date(),
    };
  }
  
  // Default school overview
  return {
    id: generateId(),
    query,
    type: 'single_stat',
    title: `${schoolName} Overview`,
    subtitle: `Key metrics for this school`,
    data: {
      value: school['Active teachers'],
      label: `active teachers | ${formatNumber(school['Sessions'])} sessions | ${formatNumber(school['Student responses'])} responses`,
    } as SingleStatData,
    followUpSuggestions: [
      `How many sessions at ${schoolName}?`,
      `Student responses at ${schoolName}`,
      `Accommodations at ${schoolName}`,
    ],
    timestamp: new Date(),
  };
}

// Parse and process a user query
export function processQuery(query: string, data: WaygroundData): QueryResponse | null {
  const normalizedQuery = query.trim().toLowerCase();
  
  // First, check for school-specific queries
  const schoolResult = handleSchoolSpecificQuery(query, data);
  if (schoolResult) {
    return schoolResult;
  }
  
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
      label: 'Try asking about schools, teachers, sessions, accommodations, or content types',
    } as SingleStatData,
    followUpSuggestions: [
      'How many teachers are using accommodations?',
      'Top schools by student responses',
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
    'Top schools by student responses',
    'Which schools have the most active teachers?',
    'What are the top accommodations used?',
    'How many students are supported through accommodations?',
    'What percentage of teachers use curriculum-aligned resources?',
    'Show the trend of sessions over time',
    'What are the most used question types?',
    'Compare all content types by sessions',
    'How many assessment sessions were there?',
    'What percent of questions are higher-order thinking?',
    'Which schools use the most AI-powered resources?',
    'How many total teachers?',
    'Show session distribution by content type',
    'Top schools by sessions',
    'How many total student responses?',
  ];
  
  if (!partialQuery.trim()) {
    return suggestions.slice(0, 5);
  }
  
  const lowerQuery = partialQuery.toLowerCase();
  return suggestions
    .filter(s => s.toLowerCase().includes(lowerQuery))
    .slice(0, 5);
}
