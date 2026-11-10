import { ENABLE_CHAT } from '@/config';
import ScrollCue from '@/components/ScrollCue';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/portfolio/Navbar';
import Hero from './components/portfolio/Hero';
import Skills from './components/portfolio/Skills';
import Projects from './components/portfolio/Projects';
import Hackathon from './components/portfolio/Hackathon';
import Achievements from './components/portfolio/Achievements';
import Certifications from './components/portfolio/Certifications';
import Education from './components/portfolio/Education';
import Contact from './components/portfolio/Contact';
import Footer from './components/portfolio/Footer';
import ModernBackground from './components/ModernBackground';
import { RETURN_KEY } from './lib/content';

// The three "see everything" pages are only downloaded when opened.
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
// Non-critical widgets: loaded after the page is interactive, not in the main bundle.
const TechCompanion = lazy(() => import('./components/TechCompanion'));
const HelperAIChat = lazy(() => import('./components/HelperAIChat'));

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'; // we restore the exact position ourselves
}

const Home = () => {
  // Returning from a dedicated page: go back to the exact scroll position, not the top.
  useEffect(() => {
    let saved: { y: number; section: string } | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(RETURN_KEY) || 'null');
      sessionStorage.removeItem(RETURN_KEY);
    } catch { /* ignore */ }
    const target = saved?.y;
    const section = saved?.section;
    const t = window.setTimeout(() => {
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' });
      else if (section) document.getElementById(section)?.scrollIntoView();
      else if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
    }, 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Hackathon />
      <Achievements />
      <Certifications />
      <Education />
      <Contact />
      <Footer />
      {ENABLE_CHAT && <Suspense fallback={null}><HelperAIChat /></Suspense>}
    </>
  );
};

const Routed = () => {
  const { pathname } = useLocation();
  useEffect(() => { if (pathname !== '/') window.scrollTo(0, 0); }, [pathname]);
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <main className="min-h-screen text-foreground relative selection:bg-primary/30 overflow-x-clip">
          <ModernBackground />
          {ENABLE_CHAT && <Suspense fallback={null}><TechCompanion /></Suspense>}
          <div className="relative z-10">
            <Routed />
          </div>
          <ScrollCue />
        </main>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
