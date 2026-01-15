import { Download, ChevronDown, Phone } from 'lucide-react';

interface FilterDropdownProps {
  label: string;
  value: string;
}

function FilterDropdown({ label, value }: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 transition-colors min-w-[160px]">
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

interface HeaderProps {
  lastUpdated: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Quizizz</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: <span className="text-gray-700 font-medium">{lastUpdated}</span>
          </span>
          
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E91E8C] text-white rounded-xl text-sm font-medium hover:bg-[#D1177D] transition-colors">
            <Phone className="w-4 h-4" />
            <span>Contact your success partner</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex items-end gap-4">
        <FilterDropdown label="Date range" value="Current school year" />
        <FilterDropdown label="Schools" value="Schools" />
        <FilterDropdown label="Subjects" value="Subjects" />
        <FilterDropdown label="Grades" value="Grades" />
      </div>
    </header>
  );
}

