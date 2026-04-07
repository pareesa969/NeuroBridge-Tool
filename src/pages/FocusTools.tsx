import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { getTaskBreakdown } from '../lib/gemini';

export default function FocusTools() {
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [activeSound, setActiveSound] = useState('Rain');
  const [taskInput, setTaskInput] = useState('');
  const [taskSteps, setTaskSteps] = useState<string[]>([]);
  const [isBreakingTask, setIsBreakingTask] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
        
        // Track focus time (every second)
        const currentTotal = parseInt(localStorage.getItem('totalFocusTime') || '0');
        localStorage.setItem('totalFocusTime', (currentTotal + 1).toString());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerMinutes * 60);
  };

  const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = parseInt(e.target.value);
    setTimerMinutes(mins);
    if (!isActive) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBreakTask = async () => {
    if (!taskInput.trim()) return;
    setIsBreakingTask(true);
    const steps = await getTaskBreakdown(taskInput);
    setTaskSteps(steps);
    setIsBreakingTask(false);
  };

  return (
    <div className={cn("min-h-screen bg-surface transition-all duration-700", distractionFree && "grayscale-[0.8] brightness-[0.8]")}>
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search focus templates..." />
        
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-12 py-12 max-w-6xl mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Focus Tools</h2>
            <p className="text-on-surface-variant text-lg">Tune your environment for deep work sessions.</p>
          </div>

          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Pomodoro Timer */}
            <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icons.Timer className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-on-surface">Pomodoro Timer</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    {isActive ? 'Session Active' : 'Ready to Focus'}
                  </span>
                </div>
                <div className="flex flex-col items-center py-6">
                  <div className="text-8xl font-bold text-on-surface tabular-nums mb-4 tracking-tighter">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-on-surface-variant mb-10">
                    {isActive ? 'Stay focused, Alex.' : 'Set your session length'}
                  </p>
                  <div className="w-full px-8 mb-12">
                    <input 
                      type="range" 
                      min="5" 
                      max="60" 
                      step="5"
                      value={timerMinutes} 
                      onChange={handleTimerChange}
                      disabled={isActive}
                      className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50" 
                    />
                    <div className="flex justify-between text-xs text-on-surface-variant mt-4 font-medium">
                      <span>5 min</span>
                      <span>Session Length</span>
                      <span>60 min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={resetTimer}
                      className="w-16 h-16 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90"
                    >
                      <Icons.Repeat className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={toggleTimer}
                      className="px-12 py-5 rounded-full primary-gradient text-on-primary font-extrabold text-xl shadow-lg hover:scale-[1.05] transition-transform active:scale-95"
                    >
                      {isActive ? 'Pause Session' : 'Start Session'}
                    </button>
                    <button className="w-16 h-16 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-all active:scale-90">
                      <Icons.VolumeX className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Breaker & Toggles */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
              <div className="bg-surface-container-high rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                  <Icons.AI className="w-5 h-5 text-primary" />
                  Task Breaker
                </h3>
                <div className="space-y-4">
                  <input 
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-2xl p-5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="What are you working on?" 
                  />
                  <button 
                    onClick={handleBreakTask}
                    disabled={isBreakingTask || !taskInput.trim()}
                    className="w-full py-4 bg-surface-container-highest text-primary font-bold rounded-2xl hover:bg-primary hover:text-on-primary transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isBreakingTask ? 'AI is thinking...' : 'Auto split into steps'}
                    {!isBreakingTask && <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
                
                {taskSteps.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-3"
                  >
                    {taskSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/10">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-on-surface-variant">{step}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant leading-relaxed italic">
                    "AI will analyze your task and break it into dopamine-friendly milestones."
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setDistractionFree(!distractionFree)}
                className={cn(
                  "bg-surface-container-high rounded-xl p-8 flex items-center justify-between group cursor-pointer transition-colors",
                  distractionFree ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-container-highest"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                    distractionFree ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"
                  )}>
                    <Icons.VolumeX className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Distraction Free</h4>
                    <p className="text-xs text-on-surface-variant">Block notifications & tabs</p>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-8 rounded-full p-1 relative transition-colors",
                  distractionFree ? "bg-primary" : "bg-surface-container-lowest"
                )}>
                  <div className={cn(
                    "w-6 h-6 bg-white rounded-full shadow-sm transition-all",
                    distractionFree ? "translate-x-6" : "translate-x-0"
                  )}></div>
                </div>
              </div>
            </div>

            {/* Soundscapes */}
            <div className="col-span-12 bg-surface-container rounded-xl p-10 mt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-1">Atmospheric Soundscapes</h3>
                  <p className="text-on-surface-variant text-sm">Layered textures for neural grounding.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-highest p-2 rounded-full">
                  <Icons.Volume className="w-5 h-5 text-on-surface-variant px-2" />
                  <div className="w-32 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <SoundItem icon={Icons.Rain} label="Rain" active={activeSound === 'Rain'} onClick={() => setActiveSound('Rain')} />
                <SoundItem icon={Icons.Wind} label="White noise" active={activeSound === 'White noise'} onClick={() => setActiveSound('White noise')} />
                <SoundItem icon={Icons.Cafe} label="Cafe" active={activeSound === 'Cafe'} onClick={() => setActiveSound('Cafe')} />
                <SoundItem icon={Icons.Forest} label="Forest" active={activeSound === 'Forest'} onClick={() => setActiveSound('Forest')} />
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <BottomBar centerLabel={isActive ? "Focusing..." : "Enable Focus Tool"} centerIcon={isActive ? Icons.Timer : Icons.Enable} />
    </div>
  );
}

function SoundItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-surface-container-high p-6 rounded-xl text-center group transition-all border border-transparent",
        active ? "border-primary/40 bg-surface-container-highest" : "hover:bg-surface-container-highest hover:border-primary/20"
      )}
    >
      <div className={cn(
        "w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container-lowest flex items-center justify-center transition-colors",
        active ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="font-bold text-sm block mb-1">{label}</span>
      <span className={cn(
        "text-[10px] uppercase tracking-widest font-bold",
        active ? "text-primary" : "text-on-surface-variant/40"
      )}>
        {active ? 'Active' : 'Inactive'}
      </span>
    </button>
  );
}
