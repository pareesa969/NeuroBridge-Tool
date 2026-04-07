import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { getAISummary } from '../lib/gemini';
import { ReadingTopic } from '../types';

const TOPICS: ReadingTopic[] = [
  {
    id: '1',
    title: "The Neurobiology of Focused Attention",
    content: "Attention is not a single process, but a complex suite of neural mechanisms that allow us to prioritize specific information while filtering out the noise of our environment. In the prefrontal cortex, specialized neurons act as conductors, orchestrating the flow of electrical signals across the brain's vast network. For many learners, the challenge lies in the 'switching cost'—the cognitive energy required to move focus from one stimulus to another. By creating a sensory-friendly environment and using cognitive scaffolding, we can reduce this cost and extend the duration of productive focus."
  },
  {
    id: '2',
    title: "The History of Artificial Intelligence",
    content: "The concept of artificial intelligence dates back to ancient myths of mechanical men, but the modern field was founded in 1956 at a workshop at Dartmouth College. Early researchers were optimistic, predicting that machines would soon be able to perform any task a human could. However, they underestimated the complexity of common sense and natural language. Today, AI has evolved into specialized fields like machine learning and neural networks, powering everything from search engines to self-driving cars."
  },
  {
    id: '3',
    title: "Sustainable Architecture in the 21st Century",
    content: "Sustainable architecture aims to minimize the negative environmental impact of buildings through efficiency and moderation in the use of materials, energy, and development space. Modern architects are increasingly using biomimicry—designing buildings that mimic natural processes. Examples include buildings that use passive cooling systems inspired by termite mounds or solar panels that track the sun like sunflowers. This approach not only reduces carbon footprints but also creates healthier living spaces."
  }
];

export default function ReadingSupport() {
  const [fontSize, setFontSize] = useState(18);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [focusGuide, setFocusGuide] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<ReadingTopic>(TOPICS[0]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const aiSummary = await getAISummary(selectedTopic.content);
    setSummary(aiSummary);
    setIsSummarizing(false);
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedTopic.content);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search articles or paste text..." />
        
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-12 py-12 max-w-6xl mx-auto"
        >
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Reading & Processing Support</h2>
              <p className="text-on-surface-variant text-lg">Visual and cognitive aids for better comprehension.</p>
            </div>
            <div className="flex gap-3">
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setSummary(null);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedTopic.id === topic.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  )}
                >
                  Topic {topic.id}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Control Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-surface-container rounded-xl p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Visual Comfort</h3>
                  <div className="space-y-4">
                    <ControlToggle 
                      label="Dyslexia Font" 
                      active={dyslexiaFont} 
                      onClick={() => setDyslexiaFont(!dyslexiaFont)} 
                    />
                    <ControlToggle 
                      label="Focus Guide" 
                      active={focusGuide} 
                      onClick={() => setFocusGuide(!focusGuide)} 
                    />
                    <div className="p-4 bg-surface-container-low rounded-xl">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm font-medium">Text Scaling</span>
                        <span className="text-sm font-bold text-primary">{fontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="12" 
                        max="32" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Processing Tools</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={speakText}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl transition-colors text-left",
                        isSpeaking ? "bg-primary/10 text-primary" : "bg-surface-container-high hover:bg-surface-container-highest"
                      )}
                    >
                      <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                        <Icons.Volume className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Text to Speech</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Neural Narration</p>
                      </div>
                    </button>
                    <button 
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                      className="flex items-center gap-4 p-4 bg-surface-container-high rounded-xl hover:bg-surface-container-highest transition-colors text-left disabled:opacity-50"
                    >
                      <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
                        <Icons.List className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{isSummarizing ? 'Summarizing...' : 'AI Summarizer'}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">AI Core Concepts</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {summary && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-tertiary-container/10 p-6 rounded-xl border border-tertiary/20"
                >
                  <div className="flex items-center gap-3 mb-4 text-tertiary">
                    <Icons.List className="w-5 h-5" />
                    <h4 className="font-bold">AI Summary</h4>
                  </div>
                  <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </div>
                </motion.div>
              )}

              <div className="bg-primary-container/10 p-6 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Icons.AI className="w-5 h-5" />
                  <h4 className="font-bold">AI Insight</h4>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  "I've noticed you slow down on paragraphs with more than 3 technical terms. Would you like me to highlight definitions automatically?"
                </p>
              </div>
            </div>

            {/* Reading Area */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-12 shadow-sm min-h-[600px] relative">
              {focusGuide && (
                <div className="absolute left-0 right-0 h-12 bg-primary/5 border-y border-primary/10 pointer-events-none transition-all duration-300" style={{ top: '180px' }}></div>
              )}
              
              <article 
                className={cn(
                  "max-w-2xl mx-auto transition-all duration-500",
                  dyslexiaFont ? "font-serif italic" : "font-body"
                )}
                style={{ fontSize: `${fontSize}px` }}
              >
                <h1 className="text-4xl font-extrabold mb-10 leading-tight">{selectedTopic.title}</h1>
                <div className="space-y-8 text-on-surface-variant leading-relaxed">
                  <p>{selectedTopic.content}</p>
                </div>
              </article>
            </div>
          </div>
        </motion.section>
      </main>
      <BottomBar centerLabel="Activate Reading Guide" centerIcon={Icons.ReadingStyle} />
    </div>
  );
}

function ControlToggle({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-xl transition-all",
        active ? "bg-primary/10 text-primary border border-primary/20" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
      )}
    >
      <span className="font-bold text-sm">{label}</span>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-colors",
        active ? "bg-primary" : "bg-surface-container-highest"
      )}>
        <div className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full transition-all",
          active ? "right-1 bg-on-primary" : "left-1 bg-outline"
        )}></div>
      </div>
    </button>
  );
}
