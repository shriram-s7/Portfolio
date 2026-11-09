import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/** Floating "scroll" pill on every page while there is more content below. Hides at the bottom and while a dialog is open. */
const ScrollCue = () => {
  const { pathname } = useLocation();
  const [state, setState] = useState<'hidden' | 'top' | 'mid'>('hidden');

  useEffect(() => {
    const check = () => {
      const locked = document.body.hasAttribute('data-scroll-locked') || document.body.style.overflow === 'hidden';
      const el = document.documentElement;
      const left = el.scrollHeight - window.scrollY - window.innerHeight;
      setState(locked || left < 120 ? 'hidden' : window.scrollY < 120 ? 'top' : 'mid');
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const iv = window.setInterval(check, 600); // lazy sections / dialogs change the page height
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); window.clearInterval(iv); };
  }, [pathname]);

  if (state === 'hidden') return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
      className="fixed bottom-5 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-300/50 bg-[#0b1220]/90 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 backdrop-blur hover:bg-cyan-500/30"
      aria-label="Scroll down"
    >
      {state === 'top' ? 'Scroll to explore' : 'More below'} <ChevronDown size={16} className="cue-bounce" />
    </button>
  );
};

export default ScrollCue;
