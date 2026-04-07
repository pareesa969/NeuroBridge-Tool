import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';

export default function Progress() {
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [username, setUsername] = useState('Alex');

  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults));
    }

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUsername(profile.username?.split(' ')[0] || 'Alex');
    }

    // Real focus time from localStorage (in seconds)
    const focusSeconds = parseInt(localStorage.getItem('totalFocusTime') || '0');
    setTotalFocusTime(focusSeconds); 
  }, []);

  const formatFocusTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const averageScore = quizResults.length > 0 
    ? Math.round(quizResults.reduce((acc, curr) => acc + curr.score, 0) / quizResults.length)
    : 0;

  const totalQuestions = quizResults.length * 12;
  const totalCorrect = quizResults.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search progress history..." />
        
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-12 py-12 max-w-6xl mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Progress & Insights</h2>
            <p className="text-on-surface-variant text-lg">A holistic view of your cognitive growth and mastery, {username}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Focus Time" value={formatFocusTime(totalFocusTime)} subValue="+12% this week" color="primary" />
            <StatCard label="Quizzes Taken" value={quizResults.length.toString()} subValue={`${totalCorrect}/${totalQuestions} Correct`} color="secondary" />
            <StatCard label="Average Score" value={`${averageScore}/12`} subValue="Optimal range" color="tertiary" />
            <StatCard label="Sanctuary Level" value="Gold IV" subValue="Next: Platinum" color="primary-fixed" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold mb-8">Skill Mastery Radar</h3>
              <div className="aspect-square bg-surface-container-high rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-full h-full border border-outline-variant rounded-full scale-[0.8]"></div>
                  <div className="w-full h-full border border-outline-variant rounded-full scale-[0.6]"></div>
                  <div className="w-full h-full border border-outline-variant rounded-full scale-[0.4]"></div>
                  <div className="w-full h-full border border-outline-variant rounded-full scale-[0.2]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-outline-variant/20"></div>
                  <div className="h-0.5 w-full bg-outline-variant/20"></div>
                </div>
                <svg className="w-full h-full relative z-10 p-12" viewBox="0 0 100 100">
                  <polygon 
                    points={`50,${10 + (12 - averageScore) * 3} ${90 - (12 - averageScore) * 2},50 50,${90 - (12 - averageScore) * 3} ${10 + (12 - averageScore) * 2},50`} 
                    className="fill-primary/20 stroke-primary stroke-2 transition-all duration-1000"
                  />
                  <circle cx="50" cy="10" r="2" className="fill-primary" />
                  <circle cx="90" cy="50" r="2" className="fill-primary" />
                  <circle cx="50" cy="90" r="2" className="fill-primary" />
                  <circle cx="10" cy="50" r="2" className="fill-primary" />
                </svg>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest">Logic</div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest">Memory</div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest -rotate-90">Focus</div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest rotate-90">Creative</div>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-8">
              <h3 className="text-xl font-bold mb-8">Recent Quiz Performance</h3>
              <div className="space-y-4">
                {quizResults.length > 0 ? (
                  quizResults.slice(-4).reverse().map((result, i) => (
                    <AchievementItem 
                      key={i}
                      title={`General Knowledge Quiz #${quizResults.length - i}`}
                      description={`Scored ${result.score}/12 questions correctly.`}
                      date={new Date(result.date).toLocaleDateString()}
                      score={result.score}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Icons.History className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                    <p className="text-on-surface-variant">No quiz history yet. Start learning to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <BottomBar centerLabel="Share Progress" centerIcon={Icons.ArrowRight} />
    </div>
  );
}

function StatCard({ label, value, subValue, color }: any) {
  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black text-on-surface mb-1">{value}</p>
      <p className={`text-xs font-bold text-${color}`}>{subValue}</p>
    </div>
  );
}

function AchievementItem({ title, description, date, score }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl border border-outline-variant/5">
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center",
        score >= 10 ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
      )}>
        <Icons.AI className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter">{date}</span>
    </div>
  );
}
