import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { Icons } from './Icons';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
  { name: 'Focus Tools', path: '/focus', icon: Icons.Focus },
  { name: 'Reading Support', path: '/reading', icon: Icons.Reading },
  { name: 'Study Organization', path: '/organization', icon: Icons.Organization },
  { name: 'Learning Module', path: '/module', icon: Icons.Module },
  { name: 'Progress', path: '/progress', icon: Icons.Progress },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('Alex Rivera');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUsername(profile.username || 'Alex Rivera');
      setProfileImage(profile.profileImage || null);
    }
  }, []);

  const handleNewSession = () => {
    if (window.confirm('Are you sure you want to start a new session? This will clear your current progress.')) {
      localStorage.removeItem('quizResults');
      localStorage.removeItem('totalFocusTime');
      localStorage.removeItem('studyTasks');
      localStorage.removeItem('studyNotes');
      navigate('/onboarding');
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 flex flex-col py-8 bg-surface-container border-r border-outline-variant/10 shadow-xl rounded-r-xl z-50">
      <div className="px-8 mb-10">
        <h1 className="text-xl font-bold bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">
          Counselling Support
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 tracking-widest uppercase opacity-70">
          WELLNESS SANCTUARY
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-4 transition-colors",
                isActive 
                  ? "text-primary border-l-4 border-primary bg-surface-container-high" 
                  : "text-on-surface-variant hover:bg-surface-container-high/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-6 py-4 transition-colors mt-auto",
            location.pathname === '/settings' 
              ? "text-primary border-l-4 border-primary bg-surface-container-high" 
              : "text-on-surface-variant hover:bg-surface-container-high/50"
          )}
        >
          <Icons.Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </nav>

      <div className="px-6 mt-8">
        <button 
          onClick={handleNewSession}
          className="w-full primary-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 active:scale-95 shadow-lg"
        >
          <Icons.Add className="w-5 h-5" />
          <span>New Session</span>
        </button>
        
        <div className="mt-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-primary/20">
            <img 
              src={profileImage || `https://picsum.photos/seed/${username.split(' ')[0]}/100/100`} 
              alt="User avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{username}</p>
            <p className="text-xs text-on-surface-variant">Focus Tier: Gold</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
