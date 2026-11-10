import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { rememberScroll } from '@/lib/content';

/* ---------------------------------------------------------------- LiftCard */
/** Card with a small lift + tinted glow on hover. No tilt, no 3D rotation. */
export const LiftCard = ({
  children, className = '', onClick, glow, tint, id, as = 'div', focusable = true, cue = false,
}: {
  children: ReactNode; className?: string; onClick?: () => void; glow?: string; tint?: string; id?: string; as?: 'div' | 'article'; focusable?: boolean; cue?: boolean;
}) => {
  const Tag = as as any;
  const clickable = !!onClick;
  return (
    <Tag
      id={id}
      onClick={onClick}
      onKeyDown={clickable ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!(); } } : undefined}
      tabIndex={clickable ? (focusable ? 0 : -1) : undefined}
      role={clickable ? 'button' : undefined}
      className={`lift-card relative rounded-2xl border border-white/10 bg-white/[0.04] ${clickable ? 'cursor-pointer' : ''} ${className}`}
      style={{ ...(glow ? { ['--glow' as any]: glow } : {}), ...(tint ? { ['--tint' as any]: tint } : {}) }}
    >
      {children}
      {clickable && cue && <CardCue />}
    </Tag>
  );
};

/** Small round arrow in a card's corner: tells people the whole card is clickable. */
export const CardCue = () => (
  <span aria-hidden="true" className="card-cue pointer-events-none absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full border border-cyan-300/50 bg-cyan-500/20 text-cyan-200">
    <ArrowUpRight size={14} />
  </span>
);

/* ----------------------------------------------------------------- MoreBox */
export interface MorePreview { title: string; sub?: string; img?: string }

/**
 * "+N more" box. Same size as a card, live count, three stacked previews that fan out on hover.
 * Opens a dedicated page and remembers the scroll position for the Back button.
 */
export const MoreBox = ({
  count, noun, to, section, previews, className = '',
}: {
  count: number; noun: string; to: string; section: string; previews: MorePreview[]; className?: string;
}) => {
  const nav = useNavigate();
  if (count <= 0) return null;
  const go = () => { rememberScroll(section); nav(to); };
  return (
    <button
      type="button"
      onClick={go}
      className={`more-box lift-card group relative flex h-full min-h-[260px] w-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/[0.12] via-[#0b1220]/60 to-purple-500/[0.16] p-5 text-center ${className}`}
      style={{ ['--glow' as any]: 'rgba(168,85,247,0.45)', ['--tint' as any]: 'rgba(34,211,238,0.10)' }}
    >
      <div className="relative h-28 w-full flex-1 min-h-[110px]">
        {previews.slice(0, 3).map((p, i) => (
          <div key={p.title} className="stack-card overflow-hidden rounded-xl border border-white/15 bg-[#0b1220] shadow-lg" style={{ ['--i' as any]: i }}>
            {p.img ? (
              <img src={p.img} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" />
            ) : (
              <div className="px-3 py-2 text-left">
                <p className="truncate text-xs font-bold text-white/90">{p.title}</p>
                {p.sub && <p className="truncate text-[10px] text-white/65">{p.sub}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <p className="more-count text-6xl font-extrabold gradient-text leading-none">+{count}</p>
        <p className="mt-1.5 text-lg font-bold text-white">more {noun}</p>
      </div>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500/25 to-purple-500/25 px-5 py-2 text-sm font-bold text-white transition-all group-hover:from-cyan-500/45 group-hover:to-purple-500/45">
        Explore all <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
      </span>
    </button>
  );
};

/* -------------------------------------------------------------- page pieces */
export const BackButton = () => {
  const nav = useNavigate();
  return (
    <button
      type="button"
      onClick={() => nav('/')}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300"
    >
      <ArrowLeft size={16} /> Back to portfolio
    </button>
  );
};

export const PageShell = ({ title, accent, subtitle, children }: { title: string; accent: string; subtitle: string; children: ReactNode }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="container mx-auto px-5 sm:px-6 py-8 md:py-12">
      <Helmet><title>{`${title} ${accent} | S Shriram`}</title></Helmet>
      <div className="mb-8 flex justify-center sm:justify-start"><BackButton /></div>
      <header className="mb-8 text-center">
        <h1 className="section-title">{title} <span className="gradient-text">{accent}</span></h1>
        <p className="section-subtitle">{subtitle}</p>
      </header>
      {children}
      <div className="mt-14 flex justify-center"><BackButton /></div>
    </div>
  );
};

export const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide transition-colors duration-150 ${
      active ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200' : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export const SearchBox = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <label className="relative block w-full md:max-w-sm">
    <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/65" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-white/65 focus:border-cyan-400/60 focus:outline-none"
    />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
        <X size={14} />
      </button>
    )}
  </label>
);

/** "Not on home" / "All" switch. The default is the first option. */
export const ViewSwitch = ({ value, onChange, restCount, allCount, restLabel = 'Not on home' }: { value: 'rest' | 'all'; onChange: (v: 'rest' | 'all') => void; restCount: number; allCount: number; restLabel?: string }) => (
  <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1" role="group" aria-label="Which items to show">
    {([['rest', `${restLabel} (${restCount})`], ['all', `All (${allCount})`]] as const).map(([v, label]) => (
      <button
        key={v}
        type="button"
        onClick={() => onChange(v)}
        aria-pressed={value === v}
        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${value === v ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white' : 'text-white/60 hover:text-white'}`}
      >
        {label}
      </button>
    ))}
  </div>
);

export const SelectBox = ({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; label: string }) => (
  <label className="inline-flex items-center gap-2 text-xs font-semibold text-white/60">
    {label}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-white/15 bg-[#0b1220] px-3 py-1.5 text-xs font-bold text-white focus:border-cyan-400/60 focus:outline-none"
    >
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </label>
);

export const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">{text}</div>
);

/* -------------------------------------------------------------- ScrollHint */
/**
 * Scrolling box that shows a fade and a bouncing "Scroll for more" button while there is
 * content below. It disappears once the reader reaches the end.
 */
export const ScrollHint = ({
  children, className = '', outerClassName = '', label = 'Scroll for more',
}: { children: ReactNode; className?: string; outerClassName?: string; label?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    const t = window.setTimeout(check, 400); // images / fonts settling
    return () => { ro.disconnect(); window.clearTimeout(t); };
  }, [check]);
  return (
    <div className={`relative flex flex-col ${outerClassName}`}>
      <div ref={ref} onScroll={check} className={`min-h-0 flex-1 overflow-y-auto ${className}`}>{children}</div>
      {more && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent pb-3 pt-12">
          <button
            type="button"
            onClick={() => ref.current?.scrollBy({ top: Math.max(240, ref.current.clientHeight * 0.8), behavior: 'smooth' })}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-cyan-300/50 bg-cyan-500/25 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur hover:bg-cyan-500/40"
          >
            {label} <ChevronDown size={14} className="cue-bounce" />
          </button>
        </div>
      )}
    </div>
  );
};
