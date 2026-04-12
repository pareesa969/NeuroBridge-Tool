import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [learningStyle, setLearningStyle] = useState('visual');
  const [attentionSpan, setAttentionSpan] = useState('medium');
  const [preferences, setPreferences] = useState({
    tts: true,
    dyslexiaFont: false,
    lineGuide: true,
    simplifiedText: false,
    pomodoro: true,
    taskBreaker: false,
    distractionFree: true,
    backgroundSound: false,
    largeText: false,
    highContrast: false,
    simplifiedUI: true,
    reducedAnimation: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      const data = JSON.parse(saved);
      setLearningStyle(data.learningStyle || 'visual');
      setAttentionSpan(data.attentionSpan || 'medium');
      setPreferences(prev => ({ ...prev, ...data.preferences }));
    }
  }, []);

  const savePreferences = () => {
    const data = {
      learningStyle,
      attentionSpan,
      preferences,
      completed: true
    };
    localStorage.setItem('onboardingData', JSON.stringify(data));
    
    // Apply preferences immediately
    applyPreferences(data);
  };

  const applyPreferences = (data: any) => {
    const { dyslexiaFont, highContrast, largeText, reducedAnimation } = data.preferences;
    
    if (dyslexiaFont) document.documentElement.classList.add('dyslexia-font');
    else document.documentElement.classList.remove('dyslexia-font');
    
    if (highContrast) document.documentElement.classList.add('high-contrast');
    else document.documentElement.classList.remove('high-contrast');
    
    if (largeText) document.documentElement.classList.add('large-text');
    else document.documentElement.classList.remove('large-text');
    
    if (reducedAnimation) document.documentElement.classList.add('reduced-animation');
    else document.documentElement.classList.remove('reduced-animation');
  };

  const handleContinue = () => {
    savePreferences();
    navigate('/dashboard');
  };

  const updatePref = (key: string, val: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary/30 relative overflow-hidden">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-6 py-12 mb-32"
      >
        <header className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high text-primary font-medium text-sm">
            <Icons.Settings className="w-4 h-4" />
            Personalization
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
            Tailor Your Learning <br/>
            <span className="bg-gradient-to-br from-primary to-primary-container bg-clip-text text-transparent">Sanctuary</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Adjust how our NeuroBridge Tools AI interacts with your wellness profile. These settings help us create a low-friction environment for your unique journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-8">
            <section className="bg-surface-container rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Icons.Reading className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Learning Style</h2>
                  <p className="text-sm text-on-surface-variant">How do you absorb information best?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StyleButton 
                  icon={Icons.Visual} 
                  label="Visual" 
                  active={learningStyle === 'visual'} 
                  onClick={() => setLearningStyle('visual')} 
                />
                <StyleButton 
                  icon={Icons.Auditory} 
                  label="Auditory" 
                  active={learningStyle === 'auditory'} 
                  onClick={() => setLearningStyle('auditory')} 
                />
                <StyleButton 
                  icon={Icons.ReadingStyle} 
                  label="Reading" 
                  active={learningStyle === 'reading'} 
                  onClick={() => setLearningStyle('reading')} 
                />
                <StyleButton 
                  icon={Icons.MixedStyle} 
                  label="Mixed" 
                  active={learningStyle === 'mixed'} 
                  onClick={() => setLearningStyle('mixed')} 
                />
              </div>
            </section>

            <section className="bg-surface-container rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-tertiary/10 text-tertiary">
                  <Icons.Timer className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Attention Span</h2>
                  <p className="text-sm text-on-surface-variant">Customize the frequency of focus reminders.</p>
                </div>
              </div>
              <div className="flex gap-2 p-1.5 bg-surface-container-lowest rounded-full">
                {['Short', 'Medium', 'Long'].map((span) => (
                  <button 
                    key={span}
                    onClick={() => setAttentionSpan(span.toLowerCase())}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-full font-medium transition-all",
                      attentionSpan === span.toLowerCase() 
                        ? "bg-primary text-on-primary font-bold shadow-lg" 
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    {span}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-surface-container rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                  <Icons.Reading className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Reading Support</h2>
              </div>
              <div className="space-y-4">
                <ToggleItem 
                  icon={Icons.Auditory} 
                  label="Text-to-speech" 
                  description="AI-generated narration for all modules" 
                  checked={preferences.tts}
                  onChange={(val) => updatePref('tts', val)}
                />
                <ToggleItem 
                  icon={Icons.ReadingStyle} 
                  label="Dyslexia font" 
                  checked={preferences.dyslexiaFont}
                  onChange={(val) => updatePref('dyslexiaFont', val)}
                />
                <ToggleItem 
                  icon={Icons.MixedStyle} 
                  label="Line guide" 
                  checked={preferences.lineGuide}
                  onChange={(val) => updatePref('lineGuide', val)}
                />
                <ToggleItem 
                  icon={Icons.List} 
                  label="Simplified text" 
                  checked={preferences.simplifiedText}
                  onChange={(val) => updatePref('simplifiedText', val)}
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-8">
            <div className="relative aspect-video rounded-xl overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/focus-workspace/600/400" 
                alt="Focus Workspace" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Current Mood</span>
                <h3 className="text-xl font-bold">Deep Focus Mode</h3>
              </div>
            </div>

            <section className="bg-surface-container rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary-container/20 text-primary-container">
                  <Icons.Timer className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Focus Tools</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <CheckboxItem 
                  label="Pomodoro Timer" 
                  checked={preferences.pomodoro}
                  onChange={(val) => updatePref('pomodoro', val)}
                />
                <CheckboxItem 
                  label="Task breaker" 
                  checked={preferences.taskBreaker}
                  onChange={(val) => updatePref('taskBreaker', val)}
                />
                <CheckboxItem 
                  label="Distraction free UI" 
                  checked={preferences.distractionFree}
                  onChange={(val) => updatePref('distractionFree', val)}
                />
                <CheckboxItem 
                  label="Background sound" 
                  checked={preferences.backgroundSound}
                  onChange={(val) => updatePref('backgroundSound', val)}
                />
              </div>
            </section>

            <section className="bg-surface-container rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-error-container/20 text-error">
                  <Icons.Accessibility className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Accessibility</h2>
              </div>
              <div className="space-y-2">
                <MiniToggle 
                  label="Large text" 
                  checked={preferences.largeText}
                  onChange={(val) => updatePref('largeText', val)}
                />
                <MiniToggle 
                  label="High contrast" 
                  checked={preferences.highContrast}
                  onChange={(val) => updatePref('highContrast', val)}
                />
                <MiniToggle 
                  label="Simplified UI" 
                  checked={preferences.simplifiedUI}
                  onChange={(val) => updatePref('simplifiedUI', val)}
                />
                <MiniToggle 
                  label="Reduced animation" 
                  checked={preferences.reducedAnimation}
                  onChange={(val) => updatePref('reducedAnimation', val)}
                />
              </div>
            </section>
          </div>
        </div>
      </motion.main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center h-28 px-6 bg-surface-container border-t border-outline-variant/20 shadow-2xl">
        <div className="max-w-6xl w-full flex justify-between items-center">
          <button 
            onClick={savePreferences}
            className="px-8 py-3 rounded-full text-on-surface-variant font-semibold hover:bg-surface-container-high transition-all active:scale-95"
          >
            Save locally
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 3 of 3</span>
              <span className="text-sm text-on-surface-variant">Profile completion 92%</span>
            </div>
            <button 
              onClick={handleContinue}
              className="primary-gradient text-on-primary rounded-full px-10 py-4 font-bold flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Continue
              <Icons.ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/5 blur-[100px] -z-10 rounded-full"></div>
    </div>
  );
}

function StyleButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-6 rounded-xl transition-all hover:scale-[1.02]",
        active 
          ? "bg-surface-container-high border-2 border-primary text-primary" 
          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
      )}
    >
      <Icon className="w-8 h-8" />
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function ToggleItem({ icon: Icon, label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-on-surface-variant" />
        <div>
          <p className="font-medium">{label}</p>
          {description && <p className="text-xs text-on-surface-variant">{description}</p>}
        </div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full relative transition-colors",
          checked ? "bg-primary" : "bg-surface-container-highest"
        )}
      >
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-all",
          checked ? "right-1 bg-on-primary" : "left-1 bg-outline"
        )}></div>
      </button>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-high/50 cursor-pointer hover:bg-surface-container-high transition-colors">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest"
      />
      <span className="font-medium">{label}</span>
    </label>
  );
}

function MiniToggle({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-3">
      <span className="text-on-surface-variant font-medium">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={cn(
          "w-10 h-5 rounded-full relative transition-colors",
          checked ? "bg-primary" : "bg-surface-container-highest"
        )}
      >
        <div className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full transition-all",
          checked ? "right-1 bg-on-primary" : "left-1 bg-outline"
        )}></div>
      </button>
    </div>
  );
}
