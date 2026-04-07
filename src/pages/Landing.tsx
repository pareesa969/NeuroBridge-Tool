import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { cn } from '@/src/lib/utils';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full -z-10"></div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full flex flex-col items-center text-center space-y-12"
      >
        <div className="w-full bg-surface-container rounded-xl p-8 md:p-16 luminous-shadow border border-outline-variant/10 relative overflow-hidden">
          {/* Branding Anchor */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/20">
            <Icons.AI className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium tracking-wide uppercase text-primary">Counselling Support App</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight mb-6">
            Counselling Support App
          </h1>
          
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10">
            A safe space for mental wellness and emotional support. Our AI-powered platform provides compassionate guidance tailored to your unique journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/onboarding"
              className="primary-gradient text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Start Your Journey</span>
              <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/onboarding"
              className="bg-surface-container-high text-on-surface border border-outline-variant/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-surface-container-highest transition-colors"
            >
              Set Preferences Manually (Anonymous Mode)
            </Link>
          </div>

          {/* Abstract Visual Asset */}
          <div className="mt-16 relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant/10">
            <img 
              alt="Visual abstraction of focus" 
              className="w-full h-full object-cover opacity-60 mix-blend-screen"
              src="https://picsum.photos/seed/focus-abstract/1200/675"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Feature Preview Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 w-full mt-24">
          <FeatureCard 
            icon={Icons.Focus} 
            title="Emotional Support" 
            description="Compassionate AI interactions designed to provide comfort and guidance during difficult times."
            className="md:col-span-2"
          />
          <FeatureCard 
            icon={Icons.Reading} 
            title="Wellness Resources" 
            description="A curated library of mental health resources, exercises, and articles tailored to your needs."
            className="md:col-span-2"
          />
          <FeatureCard 
            icon={Icons.Organization} 
            title="Safe Space" 
            description="A private, secure environment where you can express yourself freely and find peace."
            className="md:col-span-2"
          />
          
          <div className="md:col-span-3 bg-surface-container-high p-8 rounded-xl flex flex-row gap-6 items-center text-left hover:scale-[1.01] transition-transform border border-outline-variant/10 relative overflow-hidden">
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Icons.Module className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-on-surface">Adaptive Learning</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-xs">The curriculum morphs in real-time based on your comprehension and fatigue levels.</p>
            </div>
            <div className="w-48 h-48 hidden lg:block rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <img 
                src="https://picsum.photos/seed/robot-learning/400/400" 
                className="w-full h-full object-cover"
                alt="Adaptive Learning"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="md:col-span-3 bg-surface-container-high p-8 rounded-xl flex flex-row gap-6 items-center text-left hover:scale-[1.01] transition-transform border border-outline-variant/10 relative overflow-hidden">
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Icons.Progress className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-on-surface">Progress Tracking</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-xs">Visualize your growth with soft, intuitive charts that celebrate effort as much as mastery.</p>
            </div>
            <div className="w-48 h-48 hidden lg:block rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
              <img 
                src="https://picsum.photos/seed/data-viz/400/400" 
                className="w-full h-full object-cover"
                alt="Progress Tracking"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <footer className="mt-24 pb-24 text-center max-w-lg">
          <p className="text-on-surface-variant italic font-light text-lg mb-4">
            "Wellness is a journey, not a destination. We provide the support to guide your unique path."
          </p>
          <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full"></div>
        </footer>
      </motion.main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, className }: any) {
  return (
    <div className={cn("bg-surface-container-high p-8 rounded-xl flex flex-col items-start text-left hover:scale-[1.02] transition-transform border border-outline-variant/10", className)}>
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-on-surface">{title}</h3>
      <p className="text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  );
}
