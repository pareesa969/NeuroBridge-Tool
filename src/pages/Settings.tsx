import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect, ChangeEvent } from 'react';
import { jsPDF } from 'jspdf';
import { cn } from '@/src/lib/utils';

export default function Settings() {
  const [username, setUsername] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUsername(profile.username || 'Alex Rivera');
      setEmail(profile.email || 'alex.rivera@example.com');
      setProfileImage(profile.profileImage || null);
    }

    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setAiSuggestionsEnabled(data.aiSuggestionsEnabled !== false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleAiSuggestions = () => {
    const newValue = !aiSuggestionsEnabled;
    setAiSuggestionsEnabled(newValue);
    const onboardingData = localStorage.getItem('onboardingData');
    const data = onboardingData ? JSON.parse(onboardingData) : {};
    localStorage.setItem('onboardingData', JSON.stringify({ ...data, aiSuggestionsEnabled: newValue }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const savedProfile = localStorage.getItem('userProfile');
    const profile = savedProfile ? JSON.parse(savedProfile) : {};
    const updatedProfile = { ...profile, username, email, profileImage };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    alert('Profile saved successfully!');
  };

  const getFullProfile = () => {
    const quizResults = localStorage.getItem('quizResults');
    const userProfile = localStorage.getItem('userProfile');
    const onboardingData = localStorage.getItem('onboardingData');

    return {
      user: userProfile ? JSON.parse(userProfile) : { username, email },
      onboarding: onboardingData ? JSON.parse(onboardingData) : {},
      quizzes: quizResults ? JSON.parse(quizResults) : [],
      exportedAt: new Date().toISOString()
    };
  };

  const exportAsJSON = () => {
    const fullProfile = getFullProfile();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullProfile, null, 2));
    downloadFile(dataStr, 'json');
  };

  const exportAsCSV = () => {
    const fullProfile = getFullProfile();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Name,Value/Score,Date\n";
    csvContent += `Profile,Username,${fullProfile.user.username},N/A\n`;
    csvContent += `Profile,Email,${fullProfile.user.email},N/A\n`;
    
    fullProfile.quizzes.forEach((q: any) => {
      csvContent += `Quiz,${q.topic || 'General'},${q.score}/12,${new Date(q.date).toLocaleDateString()}\n`;
    });

    downloadFile(csvContent, 'csv');
  };

  const exportAsPDF = () => {
    const fullProfile = getFullProfile();
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("NeuroBridge Tools Profile", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Username: ${fullProfile.user.username}`, 20, 40);
    doc.text(`Email: ${fullProfile.user.email}`, 20, 50);
    doc.text(`Exported At: ${new Date(fullProfile.exportedAt).toLocaleString()}`, 20, 60);
    
    doc.setFontSize(18);
    doc.text("Quiz History", 20, 80);
    
    doc.setFontSize(12);
    let y = 90;
    fullProfile.quizzes.forEach((q: any, i: number) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${i + 1}. ${q.topic || 'General'} Quiz: ${q.score}/12 - ${new Date(q.date).toLocaleDateString()}`, 20, y);
      y += 10;
    });

    doc.save(`neurobridge_profile_${username.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  const downloadFile = (dataUri: string, ext: string) => {
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", `neurobridge_profile_${username.replace(/\s+/g, '_').toLowerCase()}.${ext}`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search settings..." />
        
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-12 py-12 max-w-4xl mx-auto"
        >
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Settings</h2>
              <p className="text-on-surface-variant text-lg">Manage your account and sanctuary preferences.</p>
            </div>
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-all"
            >
              <Icons.Repeat className="w-5 h-5" />
              Export Profile
            </button>
          </div>

          <div className="space-y-8">
            <section className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold mb-8">Profile Settings</h3>
              <div className="flex items-center gap-8 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20">
                    <img 
                      src={profileImage || `https://picsum.photos/seed/${username.split(' ')[0]}-settings/200/200`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform cursor-pointer">
                    <Icons.Pencil className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold mb-8">Sanctuary Preferences</h3>
              <div className="space-y-4">
                <SettingItem 
                  label="Dark Mode" 
                  description="Switch between light and dark themes." 
                  checked={isDarkMode} 
                  onToggle={toggleTheme}
                />
                <SettingItem 
                  label="AI Suggestions" 
                  description="Allow our AI to offer real-time wellness tips." 
                  checked={aiSuggestionsEnabled}
                  onToggle={toggleAiSuggestions}
                />
              </div>
            </section>

            <section className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold mb-8 text-error">Danger Zone</h3>
              <div className="flex items-center justify-between p-6 bg-error-container/10 rounded-xl border border-error/20">
                <div>
                  <h4 className="font-bold text-on-surface">Delete Account</h4>
                  <p className="text-sm text-on-surface-variant">Permanently remove all your learning data and profile.</p>
                </div>
                <button className="px-6 py-3 bg-error text-on-error font-bold rounded-xl hover:bg-error/80 transition-colors">
                  Delete
                </button>
              </div>
            </section>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface-container-high rounded-3xl p-8 max-w-md w-full shadow-2xl border border-outline-variant/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Export Profile</h3>
                <button onClick={() => setShowExportModal(false)} className="text-on-surface-variant hover:text-on-surface">
                  <Icons.Close className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-on-surface-variant mb-8">Choose your preferred format for exporting your learning sanctuary data.</p>
              
              <div className="grid grid-cols-1 gap-4">
                <ExportOption 
                  icon={Icons.AI} 
                  label="JSON Format" 
                  description="Best for developers and data backup." 
                  onClick={() => { exportAsJSON(); setShowExportModal(false); }}
                />
                <ExportOption 
                  icon={Icons.History} 
                  label="PDF Document" 
                  description="Clean, readable report of your progress." 
                  onClick={() => { exportAsPDF(); setShowExportModal(false); }}
                />
                <ExportOption 
                  icon={Icons.Check} 
                  label="CSV Spreadsheet" 
                  description="Analyze your quiz results in Excel." 
                  onClick={() => { exportAsCSV(); setShowExportModal(false); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomBar 
        centerLabel="Save Changes" 
        centerIcon={Icons.Check} 
        onCenterClick={handleSave}
      />
    </div>
  );
}

function SettingItem({ label, description, defaultChecked, checked, onToggle }: any) {
  const isChecked = checked !== undefined ? checked : defaultChecked;
  
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-high transition-colors">
      <div>
        <p className="font-bold text-on-surface">{label}</p>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <button 
        onClick={onToggle}
        className={cn(
          "w-12 h-6 rounded-full relative transition-colors",
          isChecked ? 'bg-primary' : 'bg-surface-container-highest'
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-all",
          isChecked ? 'right-1 bg-on-primary' : 'left-1 bg-outline'
        )}></div>
      </button>
    </div>
  );
}

function ExportOption({ icon: Icon, label, description, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-all text-left group border border-transparent hover:border-primary/20"
    >
      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </button>
  );
}
