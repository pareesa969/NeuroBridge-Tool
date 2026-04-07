import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect } from 'react';
import { getAISuggestion } from '../lib/gemini';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [username, setUsername] = useState('Alex');
  const [learningStyle, setLearningStyle] = useState('Visual');
  const [attentionSpan, setAttentionSpan] = useState('Short');
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const onboardingData = localStorage.getItem('onboardingData');
    
    let currentStyle = 'Visual';
    let currentSpan = 'Short';
    let currentAiEnabled = true;

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUsername(profile.username?.split(' ')[0] || 'Alex');
    }

    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      currentStyle = data.learningStyle || 'Visual';
      currentSpan = data.attentionSpan || 'Short';
      currentAiEnabled = data.aiSuggestionsEnabled !== false;
      setLearningStyle(currentStyle);
      setAttentionSpan(currentSpan);
      setAiSuggestionsEnabled(currentAiEnabled);
    }

    if (currentAiEnabled) {
      fetchSuggestions(currentStyle, currentSpan);
    }
  }, []);

  const fetchSuggestions = async (style = learningStyle, span = attentionSpan) => {
    setIsLoadingSuggestions(true);
    try {
      const context = `User style: ${style}, Attention: ${span}. Current module: Neural Networks.`;
      const aiSuggestions = await getAISuggestion(context);
      
      // Map AI suggestions to UI format
      const suggestionsArray = Array.isArray(aiSuggestions) ? aiSuggestions : [aiSuggestions];
      const mapped = suggestionsArray.map((s: any, i: number) => ({
        title: s.title || 'AI Tip',
        description: s.description || (typeof s === 'string' ? s : 'Personalized recommendation'),
        icon: i === 0 ? Icons.Timer : i === 1 ? Icons.ReadingStyle : Icons.Auditory,
        color: i === 0 ? 'primary' : i === 1 ? 'secondary' : 'tertiary'
      }));
      setSuggestions(mapped);
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar />
        
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-12 mt-12"
        >
          <div className="flex flex-col gap-2 mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Welcome back, {username}</h2>
            <p className="text-on-surface-variant text-lg">Your sanctuary is optimized for today's learning path.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <SummaryCard icon={Icons.Visual} label="Learning Style" value={learningStyle} color="primary" />
            <SummaryCard icon={Icons.Timer} label="Attention Span" value={attentionSpan} color="tertiary" />
            <SummaryCard icon={Icons.Reading} label="Reading Support" value="Enabled" color="secondary" />
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/focus">
                <BentoCard 
                  icon={Icons.Focus} 
                  title="Focus Tools" 
                  description="Manage your environmental triggers and attention timers."
                  action="Enter Workspace"
                  color="primary"
                />
              </Link>
              <Link to="/reading">
                <BentoCard 
                  icon={Icons.Reading} 
                  title="Reading Support" 
                  description="Text-to-speech and adaptive formatting for easy focus."
                  action="Open Reader"
                  color="secondary"
                />
              </Link>
              <Link to="/organization">
                <BentoCard 
                  icon={Icons.Organization} 
                  title="Study Organization" 
                  description="AI-curated folder structures and priority mapping."
                  action="View Vault"
                  color="tertiary"
                />
              </Link>
              <Link to="/module">
                <BentoCard 
                  icon={Icons.Module} 
                  title="Learning Module" 
                  description="Current: Advanced Neural Networks - Module 4."
                  action="Resume Learning"
                  color="primary-fixed"
                />
              </Link>

              <div className="col-span-1 md:col-span-2 bg-surface-container-high p-8 rounded-xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Progress Tracker</h3>
                    <p className="text-sm text-on-surface-variant">Your weekly retention curve</p>
                  </div>
                  <Icons.TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="h-32 w-full flex items-end gap-2 px-4">
                  {[40, 60, 85, 55, 95, 70, 100].map((height, i) => (
                    <div key={i} className="flex-1 bg-surface-container-highest rounded-t-lg group relative" style={{ height: '100%' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-lg group-hover:bg-primary transition-all"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-4 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                </div>
              </div>
            </div>

            <aside className={cn("col-span-12 lg:col-span-4", !aiSuggestionsEnabled && "hidden")}>
              <div className="bg-surface-container-highest p-8 rounded-xl shadow-2xl relative overflow-hidden h-full">
                <div className="flex items-center gap-3 mb-8">
                  <Icons.AI className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                  {isLoadingSuggestions ? (
                    [1, 2, 3].map(i => (
                      <div key={i} className="p-5 bg-surface-container rounded-lg border border-primary/5 animate-pulse">
                        <div className="h-4 bg-surface-container-highest rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-surface-container-highest rounded w-full"></div>
                      </div>
                    ))
                  ) : (
                    suggestions.map((s, i) => (
                      <RecommendationItem 
                        key={i}
                        icon={s.icon} 
                        title={s.title} 
                        description={s.description}
                        color={s.color}
                      />
                    ))
                  )}
                </div>
                <button 
                  onClick={fetchSuggestions}
                  className="w-full mt-10 py-4 bg-surface-container-high rounded-lg text-primary font-bold text-sm border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  REFRESH SUGGESTIONS
                </button>
              </div>
            </aside>
          </div>
        </motion.section>
      </main>
      {aiSuggestionsEnabled ? (
        <BottomBar 
          centerLabel="AI Suggestions" 
          centerIcon={Icons.AI} 
          onCenterClick={fetchSuggestions}
        />
      ) : (
        <BottomBar />
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className={cn("bg-surface-container p-8 rounded-xl border-l-4 shadow-lg flex items-center gap-6", `border-${color}`)}>
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", `bg-${color}/10 text-${color}`)}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function BentoCard({ icon: Icon, title, description, action, color }: any) {
  return (
    <div className="bg-surface-container-high p-8 rounded-xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer relative overflow-hidden h-full">
      <div className={cn("mb-4 w-fit p-3 rounded-2xl", `text-${color} bg-${color}/10`)}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{description}</p>
      <div className={cn("flex items-center text-sm font-semibold", `text-${color}`)}>
        {action} <Icons.ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
}

function RecommendationItem({ icon: Icon, title, description, color }: any) {
  return (
    <div className="p-5 bg-surface-container rounded-lg border border-primary/10 hover:border-primary/40 transition-colors cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg", `bg-${color}/10 text-${color}`)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-on-surface mb-1">{title}</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
        </div>
        <Icons.ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
