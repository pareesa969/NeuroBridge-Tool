import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import FocusTools from './pages/FocusTools';
import ReadingSupport from './pages/ReadingSupport';
import StudyOrganization from './pages/StudyOrganization';
import LearningModule from './pages/LearningModule';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function ThemeHandler() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return null;
}

function PreferenceHandler() {
  useEffect(() => {
    const saved = localStorage.getItem('onboardingData');
    if (saved) {
      const data = JSON.parse(saved);
      const { dyslexiaFont, highContrast, largeText, reducedAnimation } = data.preferences || {};
      
      if (dyslexiaFont) document.documentElement.classList.add('dyslexia-font');
      else document.documentElement.classList.remove('dyslexia-font');
      
      if (highContrast) document.documentElement.classList.add('high-contrast');
      else document.documentElement.classList.remove('high-contrast');
      
      if (largeText) document.documentElement.classList.add('large-text');
      else document.documentElement.classList.remove('large-text');
      
      if (reducedAnimation) document.documentElement.classList.add('reduced-animation');
      else document.documentElement.classList.remove('reduced-animation');
    }
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <ThemeHandler />
      <PreferenceHandler />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/focus" element={<FocusTools />} />
        <Route path="/reading" element={<ReadingSupport />} />
        <Route path="/organization" element={<StudyOrganization />} />
        <Route path="/module" element={<LearningModule />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
