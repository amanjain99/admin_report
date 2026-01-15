import { 
  Home, 
  Library, 
  Play, 
  Users, 
  BarChart3, 
  Shield, 
  Accessibility,
  ChevronRight,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
        active 
          ? 'bg-[#FCE4F2] text-[#E91E8C] font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems: NavItem[] = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', id: 'home' },
    { icon: <Library className="w-5 h-5" />, label: 'My library', id: 'library' },
    { icon: <Play className="w-5 h-5" />, label: 'Sessions', id: 'sessions' },
    { icon: <Users className="w-5 h-5" />, label: 'Common...', id: 'common' },
    { icon: <Users className="w-5 h-5" />, label: 'Students', id: 'students' },
    { icon: <Settings className="w-5 h-5" />, label: 'Admin...', id: 'admin' },
  ];

  const adminControls: NavItem[] = [
    { icon: <Users className="w-5 h-5" />, label: 'Manage Teachers', id: 'teachers' },
    { icon: <ChevronRight className="w-5 h-5" />, label: 'LMS Integration', id: 'lms' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Usage Analytics', id: 'analytics' },
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'My Dashboard', id: 'dashboard' },
    { icon: <Shield className="w-5 h-5" />, label: 'Content Policy', id: 'policy' },
    { icon: <Accessibility className="w-5 h-5" />, label: 'Accommodations', id: 'accommodations' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'dashboard') {
      navigate('/dashboard');
    } else if (id === 'analytics') {
      navigate('/results');
    } else if (id === 'home') {
      navigate('/');
    }
  };

  const isActive = (id: string) => {
    if (id === 'dashboard') return location.pathname === '/dashboard';
    if (id === 'analytics') return location.pathname === '/results';
    if (id === 'home') return location.pathname === '/';
    return false;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#E91E8C] to-[#FF6B9D] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-gray-800">Wayground</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {mainNavItems.map((item) => (
          <SidebarItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={isActive(item.id)}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </nav>

      {/* Admin Controls Section */}
      <div className="px-3 pb-6">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Admin Controls
          </h3>
          <div className="space-y-1">
            {adminControls.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={isActive(item.id)}
                onClick={() => handleNavClick(item.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">AJ</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@school.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

