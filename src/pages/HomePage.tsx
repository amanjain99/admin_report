import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  ChevronDown, 
  Phone,
  FileText,
  BookOpen,
  PlayCircle,
  FileType,
  Layers,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { QuerySidebar } from '../components/QuerySidebar';
import { mockWaygroundData } from '../data/mockData';

type MainTab = 'overview' | 'details';
type SubTab = 'differentiation' | 'test-prep' | 'curriculum';

interface FilterDropdownProps {
  label: string;
  value: string;
}

function FilterDropdown({ label, value }: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors min-w-[180px]">
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

interface ContentTypeCardProps {
  icon: React.ReactNode;
  label: string;
  sessions: number;
  teachers: number;
  color: string;
}

function ContentTypeCard({ icon, label, sessions, teachers, color }: ContentTypeCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-5 h-5 rounded flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Sessions</span>
          <span className="text-sm font-semibold text-gray-900">{sessions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Teachers</span>
          <span className="text-sm font-semibold text-gray-900">{teachers}</span>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  value: string | number;
  label: string;
  suffix?: string;
}

function StatCard({ value, label, suffix = '' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {value}{suffix}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

interface BarChartItemProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function BarChartItem({ label, value, maxValue, color }: BarChartItemProps) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-600 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
        <div 
          className={`h-full rounded ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<MainTab>('overview');
  const [subTab, setSubTab] = useState<SubTab>('differentiation');
  const data = mockWaygroundData;

  const contentTypes = [
    { 
      icon: <FileText className="w-3 h-3 text-white" />, 
      label: 'Assessments', 
      sessions: 20950, 
      teachers: 220,
      color: 'bg-purple-500'
    },
    { 
      icon: <BookOpen className="w-3 h-3 text-white" />, 
      label: 'Lessons', 
      sessions: 20950, 
      teachers: 220,
      color: 'bg-blue-500'
    },
    { 
      icon: <PlayCircle className="w-3 h-3 text-white" />, 
      label: 'Interactive Videos', 
      sessions: 20950, 
      teachers: 220,
      color: 'bg-orange-500'
    },
    { 
      icon: <FileType className="w-3 h-3 text-white" />, 
      label: 'Passages', 
      sessions: 20850, 
      teachers: 220,
      color: 'bg-cyan-500'
    },
    { 
      icon: <Layers className="w-3 h-3 text-white" />, 
      label: 'Flashcards', 
      sessions: 20950, 
      teachers: 220,
      color: 'bg-pink-500'
    },
  ];

  const accommodationBars = [
    { label: 'Reading Support', value: 1400, color: 'bg-[#E91E8C]' },
    { label: 'Math Tools', value: 420, color: 'bg-[#FFB800]' },
    { label: 'Learning Environment', value: 1000, color: 'bg-[#14B8A6]' },
    { label: 'Basic', value: 600, color: 'bg-[#8B5CF6]' },
    { label: 'Question Settings', value: 800, color: 'bg-[#3B82F6]' },
  ];

  const maxBarValue = Math.max(...accommodationBars.map(b => b.value));

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Usage Analytics</h1>
              <p className="text-sm text-gray-500 mt-0.5">Springfield District</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Last updated: <span className="text-gray-700 font-medium">July 24, 2025</span>
              </span>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg text-sm font-medium hover:bg-[#D1177D] transition-colors">
                <Phone className="w-4 h-4" />
                <span>Contact your success partner</span>
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-end gap-4">
            <FilterDropdown label="Date range" value="March 2024 - April 2025" />
            <FilterDropdown label="Schools" value="All schools" />
            <FilterDropdown label="Subjects" value="All subjects" />
            <FilterDropdown label="Grades" value="All grades" />
            <button className="px-5 py-2.5 bg-[#E91E8C] text-white rounded-lg text-sm font-medium hover:bg-[#D1177D] transition-colors">
              Apply Filters
            </button>
          </div>
        </header>

        {/* Main Tabs */}
        <div className="px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMainTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mainTab === 'overview' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setMainTab('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mainTab === 'details' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="px-8 py-6">
          {/* Content Type Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {contentTypes.map((ct, index) => (
              <ContentTypeCard key={index} {...ct} />
            ))}
          </div>

          {/* Teacher Highlight */}
          <div className="bg-gradient-to-r from-[#FEF3F8] to-white rounded-xl p-6 mb-8 border border-pink-100">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#E91E8C]">Michelle Williams, Chris Wu and 3900 other teachers</span> used Wayground in their classrooms to deliver engaging, interactive learning experiences.
            </p>
          </div>

          {/* Sub Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSubTab('differentiation')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  subTab === 'differentiation' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Differentiation
              </button>
              <button 
                onClick={() => setSubTab('test-prep')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  subTab === 'test-prep' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Test prep
              </button>
              <button 
                onClick={() => setSubTab('curriculum')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  subTab === 'curriculum' 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Curriculum alignment
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {subTab === 'differentiation' && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#E91E8C] mb-2">Differentiation</h2>
                <p className="text-gray-600 max-w-lg">
                  Create equitable learning for all students with unique Accommodations built in to every session
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Stats & Chart */}
                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard 
                      value="79" 
                      suffix="%" 
                      label="of teachers who used Wayground used Accommodations" 
                    />
                    <StatCard 
                      value="24.5k" 
                      label="Students supported through Accommodations" 
                    />
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">Top Accommodations used</h3>
                      <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        View all
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-6">Frequency of the most used Accommodations features</p>
                    
                    <div className="space-y-4">
                      {accommodationBars.map((bar, index) => (
                        <BarChartItem 
                          key={index}
                          label={bar.label}
                          value={bar.value}
                          maxValue={maxBarValue}
                          color={bar.color}
                        />
                      ))}
                    </div>

                    {/* X Axis */}
                    <div className="flex justify-between mt-4 ml-28 text-xs text-gray-400">
                      <span>0</span>
                      <span>250</span>
                      <span>500</span>
                      <span>750</span>
                      <span>1000</span>
                      <span>1250</span>
                      <span>1500</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Feature Promo */}
                <div className="space-y-6">
                  <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                    <span className="text-gray-400">Feature Preview</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">New Accommodations launched!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Give your students the extra time they need to show what they know, with Extended Deadline! Set it once, and every future deadline adjusts automatically, just for them.
                    </p>
                    <button className="px-5 py-2.5 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg text-sm font-medium hover:bg-[#FCE4F2] transition-colors">
                      See all Accommodations
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {subTab === 'test-prep' && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">STAAR Test Prep</h2>
                <p className="text-gray-600 max-w-2xl">
                  Prepare students for success with a variety of formats & question types that make practice engaging, strengthen learning, and improve scores, all with AI by your side
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-gray-900">12%</span>
                      <span className="text-sm text-gray-600">of questions asked were higher order thinking skill questions</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-gray-900">74%</span>
                      <span className="text-sm text-gray-600">of teachers who used Wayground used higher order thinking skill questions</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-gray-900">83%</span>
                      <span className="text-sm text-gray-600">of resources were AI powered saving valuable time for teachers</span>
                    </div>
                  </div>

                  {/* Question Types Grid */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Top State Test-aligned question types used</h3>
                      <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        View all
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {data.testPrep.questionTypes.slice(0, 6).map((qt, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{qt.icon}</span>
                            <span className="text-xs text-gray-600">{qt.type}</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900">{qt.count > 100 ? qt.count : '24'}</div>
                          <div className="text-xs text-gray-500">questions</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                    <span className="text-gray-400">Feature Preview</span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">New question types coming soon!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Improved Math equation, hot text, and 2D graphing tools coming soon!
                    </p>
                    <button className="px-5 py-2.5 border-2 border-[#E91E8C] text-[#E91E8C] rounded-lg text-sm font-medium hover:bg-[#FCE4F2] transition-colors">
                      Explore all question types
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {subTab === 'curriculum' && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Curriculum alignment</h2>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">No curriculum data available yet</h3>
                  <p className="text-sm text-gray-500">
                    We currently do not have sufficient curriculum and standards information for your region. You will see data here once your curricula and standards are supported.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Query Sidebar */}
      <QuerySidebar />
    </div>
  );
}
