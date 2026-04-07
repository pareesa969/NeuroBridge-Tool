import { motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { BottomBar } from '../components/BottomBar';
import { Icons } from '../components/Icons';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { QuizResult } from '../types';

const GENERAL_QUESTIONS = [
  { id: 1, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { id: 2, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
  { id: 3, question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
  { id: 4, question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare" },
  { id: 5, question: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2" },
  { id: 6, question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Silver", "Iron"], answer: "Oxygen" },
  { id: 7, question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: "Tokyo" },
  { id: 8, question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
  { id: 9, question: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], answer: "Diamond" },
  { id: 10, question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
  { id: 11, question: "What is the largest mammal in the world?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], answer: "Blue Whale" },
  { id: 12, question: "In which year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], answer: "1912" },
];

export default function LearningModule() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQuestion = GENERAL_QUESTIONS[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < GENERAL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const results: QuizResult = {
      id: Date.now().toString(),
      topic: "General Knowledge",
      score: GENERAL_QUESTIONS.reduce((acc, q) => acc + (selectedAnswers[q.id] === q.answer ? 1 : 0), 0),
      totalQuestions: GENERAL_QUESTIONS.length,
      answers: GENERAL_QUESTIONS.map(q => ({
        question: q.question,
        answer: selectedAnswers[q.id] || "No answer",
        isCorrect: selectedAnswers[q.id] === q.answer
      })),
      date: new Date().toISOString()
    };

    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    localStorage.setItem('quizResults', JSON.stringify([...existingResults, results]));
    setQuizCompleted(true);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 min-h-screen pb-32">
        <TopBar placeholder="Search concepts..." />
        
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-12 py-12 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">Module 4</span>
                <span className="text-on-surface-variant text-sm">• {quizCompleted ? 'Completed' : `${currentQuestionIndex + 1} of ${GENERAL_QUESTIONS.length}`}</span>
              </div>
              <h2 className="text-4xl font-bold text-on-surface tracking-tight">General Knowledge Quiz</h2>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={speakQuestion}
                className={cn(
                  "p-4 rounded-2xl transition-colors",
                  isSpeaking ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:text-primary"
                )}
              >
                <Icons.Volume className="w-6 h-6" />
              </button>
              {quizCompleted && (
                <button 
                  onClick={() => window.location.href = '/progress'}
                  className="px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  View Progress
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Quiz Area */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl p-10 shadow-sm flex flex-col min-h-[500px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-surface-container-highest">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${((currentQuestionIndex + 1) / GENERAL_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
              
              {!quizCompleted ? (
                <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                  <h3 className="text-2xl font-bold mb-10 leading-tight">{currentQuestion.question}</h3>
                  <div className="grid grid-cols-1 gap-4 mb-12">
                    {currentQuestion.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className={cn(
                          "p-6 rounded-2xl text-left font-bold transition-all border-2",
                          selectedAnswers[currentQuestion.id] === option 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-surface-container-high border-transparent hover:border-primary/30"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      disabled={!selectedAnswers[currentQuestion.id]}
                      className="px-10 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {currentQuestionIndex === GENERAL_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <Icons.ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8">
                    <Icons.Check className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Quiz Completed!</h3>
                  <p className="text-on-surface-variant mb-10 max-w-md">
                    Great job! You've completed the General Knowledge module. Your results have been saved to your profile.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                        setQuizCompleted(false);
                      }}
                      className="px-8 py-4 bg-surface-container-high font-bold rounded-2xl hover:bg-surface-container-highest transition-all"
                    >
                      Retake Quiz
                    </button>
                    <button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="px-8 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-lg hover:scale-105 transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebars */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-surface-container-high p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Icons.AI className="w-5 h-5 text-primary" />
                  AI Assistant
                </h3>
                <div className="p-5 bg-surface-container rounded-xl border-l-4 border-primary">
                  <h4 className="font-bold text-sm mb-2">Did you know?</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Testing yourself is one of the most effective ways to strengthen neural pathways and improve long-term retention.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-high p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-6">Quiz Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-surface-container rounded-xl">
                    <span className="text-sm font-bold text-on-surface-variant">Time Taken</span>
                    <span className="font-bold">2:45</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-surface-container rounded-xl">
                    <span className="text-sm font-bold text-on-surface-variant">Accuracy</span>
                    <span className="font-bold text-primary">--%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <BottomBar centerLabel={quizCompleted ? "Module Finished" : "In Progress"} centerIcon={quizCompleted ? Icons.Check : Icons.Timer} />
    </div>
  );
}
