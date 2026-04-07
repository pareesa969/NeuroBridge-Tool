export interface UserProfile {
  username: string;
  email: string;
  learningStyle: string;
  attentionSpan: string;
  accessibilityNeeds: string[];
  focusTime: number;
  modulesCompleted: number;
  achievements: Achievement[];
  quizResults: QuizResult[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface QuizResult {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  answers: { question: string; answer: string; isCorrect: boolean }[];
  date: string;
}

export interface ReadingTopic {
  id: string;
  title: string;
  content: string;
  summary?: string;
}
