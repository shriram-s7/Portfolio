import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

export type Tone = 'gold' | 'silver' | 'bronze' | 'theme';

/** Which wins get the rank-themed treatment. Participation returns null so wins visibly pop next to it. */
export const toneOf = (w: { rank: string; group?: string }): Tone | null => {
  if (w.rank === '1st Place') return 'gold';
  if (w.rank === '2nd Place') return 'silver';
  if (w.rank === '3rd Place') return 'bronze';
  if (w.rank === 'Theme Winner' || w.rank === '4th Place' || w.group === 'honor') return 'theme';
  return null;
};

export const medalText = (w: { rank: string }) =>
  w.rank === '1st Place' ? '1' : w.rank === '2nd Place' ? '2' : w.rank === '3rd Place' ? '3' : w.rank === '4th Place' ? '4' : '★';

const FILL: Record<Tone, [string, string, string]> = {
  gold: ['#fde68a', '#f59e0b', '#92400e'],
  silver: ['#f1f5f9', '#94a3b8', '#334155'],
  bronze: ['#fdba74', '#c2410c', '#431407'],
  theme: ['#67e8f9', '#a855f7', '#1e1b4b'],
};

/** Custom ribbon + medal with the rank printed on it. */
export const WinMedal = ({ tone, text, size = 60 }: { tone: Tone; text: string; size?: number }) => {
  const [light, mid, dark] = FILL[tone];
  const id = `m-${tone}`;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 60 69" role="img" aria-label={`Rank ${text}`} className="shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path d="M14 36 L8 66 L21 59 L28 68 L31 42 Z" fill={`url(#${id}-r)`} />
      <path d="M46 36 L52 66 L39 59 L32 68 L29 42 Z" fill={`url(#${id}-r)`} opacity="0.85" />
      <circle cx="30" cy="27" r="25" fill={`url(#${id})`} />
      <circle cx="30" cy="27" r="19.5" fill="none" stroke={light} strokeOpacity="0.8" strokeWidth="1.6" />
      <circle cx="30" cy="27" r="22.5" fill="none" stroke={dark} strokeOpacity="0.35" strokeWidth="1" />
      <text x="30" y="36" textAnchor="middle" fontSize={text.length > 1 ? 20 : 26} fontWeight="900" fontFamily="Inter, system-ui, sans-serif" fill={dark} fillOpacity="0.9">{text}</text>
    </svg>
  );
};

export const PrizePill = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300/50 bg-gradient-to-r from-yellow-400/25 to-amber-500/25 px-3 py-1 text-sm font-extrabold text-yellow-200 shadow-[0_0_18px_-4px_rgba(250,204,21,0.6)]">
    💰 {text}
  </span>
);

const SPARKS = [[-26, -30], [28, -24], [34, 6], [-30, 14], [4, -38], [-6, 30]];

/** Rank-coloured frame: conic border, tint, shimmer on hover and a one-shot sparkle burst. */
export const WinFrame = ({ tone, onClick, children, className = '' }: { tone: Tone; onClick: () => void; children: ReactNode; className?: string }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    className={`win-card win-${tone} cursor-pointer ${className}`}
  >
    <div className="win-inner">{children}</div>
    <div className="win-shine" aria-hidden="true" />
    {SPARKS.map(([dx, dy], i) => (
      <span key={i} className="win-spark" aria-hidden="true" style={{ ['--dx' as any]: `${dx}px`, ['--dy' as any]: `${dy}px`, animationDelay: `${i * 40}ms` }} />
    ))}
  </div>
);

export const ViewDetails = () => (
  <span className="inline-flex items-center gap-1 text-sm font-bold text-white/85 transition-all group-hover:gap-2 group-hover:text-white">
    View details <ArrowRight size={15} />
  </span>
);
