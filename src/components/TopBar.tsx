import { Icons } from './Icons';
import { useState, useEffect } from 'react';

export function TopBar({ placeholder = "Search modules..." }: { placeholder?: string }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfileImage(profile.profileImage || null);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 py-3 max-w-[calc(100%-4rem)] mx-auto mt-4 bg-surface-variant/70 backdrop-blur-xl rounded-full shadow-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={placeholder}
            className="w-full bg-surface-container-lowest border-none rounded-full py-2 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface outline-none"
          />
        </div>
        <div className="flex gap-6 ml-8">
          <a href="#" className="text-primary font-semibold text-sm">Modules</a>
          <a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Resources</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-all flex items-center gap-2">
          <Icons.AI className="w-4 h-4" />
          AI Suggestions
        </button>
        <div className="flex items-center gap-2 border-l border-outline-variant/20 pl-4">
          <button className="text-on-surface-variant hover:text-primary p-2">
            <Icons.Notifications className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/20 overflow-hidden">
            <img 
              src={profileImage || "https://picsum.photos/seed/alex-profile/100/100"} 
              alt="User Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
