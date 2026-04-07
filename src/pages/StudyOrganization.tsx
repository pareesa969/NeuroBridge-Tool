import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Note {
  id: number;
  title: string;
  content: string;
  type: 'concept' | 'list' | 'analogy';
  x: number;
  y: number;
  rotate: number;
}

export default function StudyOrganization() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else setTasks([
      { id: 1, text: 'Review Neural Network Basics', completed: true },
      { id: 2, text: 'Complete Module 4 Quiz', completed: false },
      { id: 3, text: 'Draft Research Proposal', completed: false },
    ]);

    const savedNotes = localStorage.getItem('studyNotes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    else setNotes([
      { 
        id: 1, 
        title: 'Key Concept', 
        content: 'Backpropagation is the backbone of neural network training, allowing the model to adjust its weights based on the error rate.',
        type: 'concept',
        x: 8,
        y: 8,
        rotate: -2
      },
      { 
        id: 2, 
        title: 'Activation Functions', 
        content: 'ReLU, Sigmoid, Tanh',
        type: 'list',
        x: 60,
        y: 20,
        rotate: 3
      },
      { 
        id: 3, 
        title: 'Visual Analogy', 
        content: '"Think of it like a mountain climber trying to find the lowest point in a valley during a thick fog (Gradient Descent)."',
        type: 'analogy',
        x: 25,
        y: 60,
        rotate: 0
      }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(notes));
  }, [notes]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now(),
      text: newTask,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addNote = () => {
    const note: Note = {
      id: Date.now(),
      title: 'New Insight',
      content: 'Click to edit this note...',
      type: 'concept',
      x: Math.random() * 50 + 10,
      y: Math.random() * 50 + 10,
      rotate: Math.random() * 10 - 5
    };
    setNotes([...notes, note]);
  };

  const updateNote = (id: number, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search your vault..." />
        
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-12 py-12 max-w-7xl mx-auto"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Study Organization</h2>
            <p className="text-on-surface-variant text-lg">Hierarchical mapping and executive function support.</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Daily Planner */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-surface-container rounded-xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Daily Planner</h3>
                  <div className="flex gap-2">
                    <input 
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Add task..."
                      className="bg-surface-container-low border-none rounded-lg px-3 py-1 text-sm w-32 focus:ring-1 focus:ring-primary/30"
                    />
                    <button 
                      onClick={addTask}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Icons.Add className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl transition-all group",
                        task.completed ? "bg-surface-container-low opacity-50" : "bg-surface-container-high hover:bg-surface-container-highest"
                      )}
                    >
                      <div 
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          task.completed ? "bg-primary border-primary text-on-primary" : "border-outline-variant"
                        )}>
                          {task.completed && <Icons.Check className="w-4 h-4" />}
                        </div>
                        <span className={cn("font-medium text-sm", task.completed && "line-through")}>{task.text}</span>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-all"
                      >
                        <Icons.Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-outline-variant/10">
                  <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    <span>Energy Level</span>
                    <span className="text-primary">Optimal</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4"></div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Cognitive Step Builder</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/20"></div>
                  <StepItem number="01" title="Define Scope" active={activeStep === 1} onClick={() => setActiveStep(1)} />
                  <StepItem number="02" title="Gather Assets" active={activeStep === 2} onClick={() => setActiveStep(2)} />
                  <StepItem number="03" title="Synthesize" active={activeStep === 3} onClick={() => setActiveStep(3)} />
                  <StepItem number="04" title="Review" active={activeStep === 4} onClick={() => setActiveStep(4)} />
                </div>
              </div>
            </div>

            {/* Thinking Canvas */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-10 shadow-sm min-h-[700px] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-tertiary/10 text-tertiary rounded-2xl">
                    <Icons.Pencil className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Thinking Canvas</h3>
                    <p className="text-sm text-on-surface-variant">Visual synthesis of your ideas</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={addNote}
                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2 font-bold text-sm"
                  >
                    <Icons.Add className="w-4 h-4" />
                    New Note
                  </button>
                  <button className="p-3 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-primary transition-colors">
                    <Icons.Attachment className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden border border-outline-variant/10">
                {notes.map(note => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      position: 'absolute', 
                      top: `${note.y}%`, 
                      left: `${note.x}%`,
                      rotate: `${note.rotate}deg`
                    }}
                    className={cn(
                      "p-6 rounded-xl shadow-xl border max-w-xs group transition-all cursor-move",
                      note.type === 'concept' ? "bg-surface-container-high border-primary/20" : 
                      note.type === 'list' ? "bg-surface-container-high border-secondary/20" : 
                      "bg-surface-container-high border-tertiary/20"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={cn(
                        "font-bold flex items-center gap-2",
                        note.type === 'concept' ? "text-primary" : 
                        note.type === 'list' ? "text-secondary" : 
                        "text-tertiary"
                      )}>
                        {note.type === 'concept' && <Icons.AI className="w-4 h-4" />}
                        {note.title}
                      </h4>
                      <button 
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error transition-all"
                      >
                        <Icons.Close className="w-3 h-3" />
                      </button>
                    </div>
                    <textarea 
                      value={note.content}
                      onChange={(e) => updateNote(note.id, e.target.value)}
                      className="bg-transparent border-none p-0 text-sm leading-relaxed w-full resize-none focus:ring-0 text-on-surface-variant"
                      rows={3}
                    />
                  </motion.div>
                ))}

                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              </div>

              <div className="mt-8 flex gap-3 flex-wrap">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">#NeuralNetworks</span>
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-widest">#AI-Basics</span>
                <span className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase tracking-widest">#Study-Notes</span>
                <span className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-widest">+ Add Tag</span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <BottomBar centerLabel="Save to Vault" centerIcon={Icons.FolderHeart} />
    </div>
  );
}

function StepItem({ number, title, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-6 group cursor-pointer"
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all",
        active ? "bg-primary text-on-primary scale-110 shadow-lg" : "bg-surface-container-highest text-on-surface-variant group-hover:bg-surface-container-high"
      )}>
        {number}
      </div>
      <span className={cn(
        "font-bold transition-colors",
        active ? "text-on-surface" : "text-on-surface-variant group-hover:text-on-surface"
      )}>
        {title}
      </span>
    </div>
  );
}
