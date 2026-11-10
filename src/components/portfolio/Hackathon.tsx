import { useState } from 'react';
import { Trophy, Award, MapPin, Clock, Users, Layers, ChevronLeft, ChevronRight, X, ArrowUpRight, ShieldCheck, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { hackathonWins, hackathonOther, projectBySlug, proofFor, fmtDate, type Win } from '@/lib/content';
import { hackathonsData } from '../../data/hackathonsData';
import { LiftCard, ScrollHint } from './shared';
import { ProofRow, ProofViewer } from './Proof';
import { OrgLogos } from './OrgLogo';
import { PrizePill, ViewDetails, WinMedal, medalText, toneOf } from './WinCard';

// Technologies and the short overview text come from the old site data; rank, prize, dates and proof come from wins.json.
const extra = (slug: string) => (hackathonsData as any[]).find((h) => h.slug === slug);

const rankLabel = (w: Win) => w.rank;
const rankIcon = (w: Win) => (w.rank === '1st Place' ? '🥇' : w.rank === '2nd Place' ? '🥈' : w.rank === '3rd Place' ? '🥉' : w.rank === '4th Place' ? '🎖️' : '🏆');
const tone = (w: Win) =>
  w.rank === '1st Place' ? { c: 'text-yellow-400', glow: 'rgba(250,204,21,0.45)', tint: 'rgba(250,204,21,0.06)' }
  : w.rank === '2nd Place' ? { c: 'text-slate-200', glow: 'rgba(148,163,184,0.5)', tint: 'rgba(148,163,184,0.07)' }
  : w.rank === '4th Place' ? { c: 'text-orange-300', glow: 'rgba(251,146,60,0.45)', tint: 'rgba(251,146,60,0.06)' }
  : { c: 'text-cyan-300', glow: 'rgba(34,211,238,0.45)', tint: 'rgba(34,211,238,0.07)' };

/** Rank-themed hover glow, border and background tint on hover, similar to certification courses */
const rankHoverStyle = (w: Win) => {
  if (w.rank === '1st Place') {
    return {
      glow: 'hover:shadow-[0_12px_40px_-6px_rgba(250,204,21,0.45)]',
      border: 'hover:border-yellow-400/60',
      bgHover: 'hover:bg-gradient-to-b hover:from-yellow-500/[0.08] hover:via-[#0b1220] hover:to-[#0b1220]',
      stripHover: 'group-hover:bg-yellow-500/10',
      medalHover: 'group-hover:shadow-[0_0_20px_-4px_rgba(250,204,21,0.5)] group-hover:border-yellow-400/40',
      ring: 'focus-visible:ring-yellow-400',
    };
  }
  if (w.rank === '2nd Place') {
    return {
      glow: 'hover:shadow-[0_12px_40px_-6px_rgba(148,163,184,0.45)]',
      border: 'hover:border-slate-300/60',
      bgHover: 'hover:bg-gradient-to-b hover:from-slate-400/[0.08] hover:via-[#0b1220] hover:to-[#0b1220]',
      stripHover: 'group-hover:bg-slate-400/10',
      medalHover: 'group-hover:shadow-[0_0_20px_-4px_rgba(148,163,184,0.5)] group-hover:border-slate-300/40',
      ring: 'focus-visible:ring-slate-300',
    };
  }
  if (w.rank === '4th Place') {
    return {
      glow: 'hover:shadow-[0_12px_40px_-6px_rgba(251,146,60,0.45)]',
      border: 'hover:border-orange-400/60',
      bgHover: 'hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:via-[#0b1220] hover:to-[#0b1220]',
      stripHover: 'group-hover:bg-orange-500/10',
      medalHover: 'group-hover:shadow-[0_0_20px_-4px_rgba(251,146,60,0.5)] group-hover:border-orange-400/40',
      ring: 'focus-visible:ring-orange-400',
    };
  }
  return {
    glow: 'hover:shadow-[0_12px_40px_-6px_rgba(34,211,238,0.45)]',
    border: 'hover:border-cyan-400/60',
    bgHover: 'hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:via-[#0b1220] hover:to-[#0b1220]',
    stripHover: 'group-hover:bg-cyan-500/10',
    medalHover: 'group-hover:shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)] group-hover:border-cyan-400/40',
    ring: 'focus-visible:ring-cyan-400',
  };
};

const Fact = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) =>
  value ? (
    <div className="rounded-lg border border-white/5 bg-white/5 p-3">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/65"><Icon size={11} /> {label}</p>
      <p className="text-sm font-semibold text-white/90">{value}</p>
    </div>
  ) : null;

const dateRange = (w: Win) => (w.endDate ? `${w.date} to ${w.endDate}`.replace(/-/g, '/') : fmtDate(w.date));

const HackCard = ({ w, onOpen }: { w: Win; onOpen: (w: Win) => void }) => {
  const photos = proofFor(w.slug).photos;
  const ex = extra(w.slug);
  const t = tone(w);
  const wt = toneOf(w) ?? 'theme';
  const hStyle = rankHoverStyle(w);
  const [viewer, setViewer] = useState<{ start: number } | null>(null);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(w)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(w);
        }
      }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 cursor-pointer ${hStyle.border} ${hStyle.glow} ${hStyle.bgHover} ${hStyle.ring}`}
    >
      <div className="flex h-full flex-col">
        {/* badge strip: clean at rest, lights up with subtle colored tint on hover */}
        <div className={`flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-3 transition-colors duration-300 ${hStyle.stripHover}`}>
          <span className={`grid shrink-0 place-items-center rounded-2xl bg-white/5 px-2 pb-1 pt-2 ring-1 ring-white/15 transition-all duration-300 ${hStyle.medalHover}`}>
            <WinMedal tone={wt} text={medalText(w)} size={46} />
          </span>
          <span className={`min-w-0 flex-1 truncate text-sm font-extrabold uppercase tracking-wider ${t.c}`}>{rankLabel(w)}</span>
          <OrgLogos text={w.issuer} size={38} />
        </div>
        {/* photo fills the frame edge to edge; the badges live in the strip above, so nothing covers it */}
        <div className="relative aspect-[16/10] overflow-hidden bg-black">
          {photos[0] ? (
            <img src={photos[0]} alt={`${w.title} photo`} loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_35%] transition-transform duration-300 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-900 to-black p-4 text-center">
              <span className="text-5xl">{rankIcon(w)}</span>
              <p className="text-sm font-bold uppercase tracking-wider text-white/70">{w.event}</p>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-bold text-white">{w.title}</h3>
          <p className="mt-1 text-xs text-white/65">{w.issuer}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/65">
            <span className="inline-flex items-center gap-1"><Calendar size={12} /> {fmtDate(w.date)}</span>
            {w.location && <span className="inline-flex items-center gap-1"><MapPin size={12} /> {w.location}</span>}
            {w.format && <span className="inline-flex items-center gap-1"><Clock size={12} /> {w.format}</span>}
          </div>
          {w.prize && <div className="mt-3"><PrizePill text={w.prize} /></div>}
          {w.rankNote && <p className="mt-2 text-xs italic text-white/65">{w.rankNote}</p>}

          {ex?.technologies?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ex.technologies.map((tech: string) => <span key={tech} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">{tech}</span>)}
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
              {photos.slice(0, 3).map((src, i) => (
                <button key={src} type="button" onClick={() => setViewer({ start: i })} className="group/ph relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10" aria-label={`Open photo ${i + 1} of ${w.title}`}>
                  <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-200 group-hover/ph:scale-110" />
                  {i === 2 && photos.length > 3 && <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-bold">+{photos.length - 3}</span>}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4"><ProofRow item={w} /></div>
          <div className="mt-3"><ViewDetails /></div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ProofViewer
            req={viewer ? { title: w.title, images: photos.map((src, i) => ({ src, alt: `${w.title}, photo ${i + 1}` })), start: viewer.start } : null}
            onClose={() => setViewer(null)}
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300/80">{title}</h4>
    {children}
  </section>
);

const HackDetail = ({ w, onClose }: { w: Win | null; onClose: () => void }) => {
  const [i, setI] = useState(0);
  const [last, setLast] = useState<Win | null>(null);
  if (w !== last) { setLast(w); setI(0); }
  const photos = w ? proofFor(w.slug).photos : [];
  const ex = w ? extra(w.slug) : undefined;
  const project = w?.projectSlug ? projectBySlug(w.projectSlug) : undefined;
  const go = (d: number) => setI((n) => (n + d + photos.length) % photos.length);

  const viewProject = () => {
    onClose();
    window.setTimeout(() => window.dispatchEvent(new CustomEvent('trigger-project-view', { detail: { projectId: w!.projectSlug } })), 150);
  };

  return (
    <Dialog open={!!w} onOpenChange={(o) => !o && onClose()}>
      <DialogContent hideDefaultClose className="max-w-3xl w-[94vw] sm:w-full glass-card border-white/10 p-0 overflow-hidden z-[100]">
        {w && (
          <ScrollHint className="max-h-[88vh]">
            <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-white/20" aria-label="Close"><X size={18} /></DialogClose>
            {photos.length > 0 && (
              <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-black/70 flex items-center justify-center overflow-hidden">
                <img src={photos[i]} alt={`${w.title} photo ${i + 1}`} className="h-full w-full object-contain object-center" />
                {photos.length > 1 && (
                  <>
                    <button type="button" onClick={() => go(-1)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Previous photo"><ChevronLeft size={20} /></button>
                    <button type="button" onClick={() => go(1)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Next photo"><ChevronRight size={20} /></button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {photos.map((_, n) => <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-5 bg-yellow-400' : 'w-1.5 bg-white/40'}`} />)}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <div className="flex items-center gap-3"><span className="grid place-items-center rounded-2xl bg-[#0b1220] px-2 pb-1 pt-2 ring-1 ring-white/25"><WinMedal tone={toneOf(w) ?? 'theme'} text={medalText(w)} size={54} /></span><span className={`rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider ${tone(w).c}`}>{rankLabel(w)}</span><OrgLogos text={w.issuer} size={40} /></div>
                <DialogTitle className="mt-3 text-2xl font-bold text-white md:text-3xl">{w.title}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/60">{w.issuer}</DialogDescription>
                {w.rankNote && <p className="mt-2 text-sm italic text-white/60">{w.rankNote}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Fact icon={Calendar} label="When" value={dateRange(w)} />
                <Fact icon={MapPin} label="Where" value={w.location} />
                <Fact icon={Clock} label="Format" value={w.format} />
                <Fact icon={Award} label="Prize" value={w.prize} />
                <Fact icon={Users} label="Team" value={w.team} />
                <Fact icon={Layers} label="My role" value={w.role} />
              </div>

              {w.rounds && <Section title="Rounds & judging"><p className="text-sm leading-relaxed text-white/75">{w.rounds}</p></Section>}

              {ex?.longDescription?.length > 0 && (
                <Section title="Overview">
                  <div className="space-y-3 text-sm leading-relaxed text-white/75">{ex.longDescription.map((p: string, n: number) => <p key={n}>{p}</p>)}</div>
                </Section>
              )}

              {w.story && <Section title="Story"><p className="whitespace-pre-line text-sm leading-relaxed text-white/75">{w.story}</p></Section>}

              <Section title="Proof">
                {w.certificateNote && <p className="mb-3 border-l-2 border-white/10 pl-3 text-xs leading-relaxed text-white/55">{w.certificateNote}</p>}
                <ProofRow item={w} />
              </Section>

              {project && (
                <button type="button" onClick={viewProject} className="flex w-full items-center gap-4 rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-transparent p-4 text-left transition-colors hover:bg-orange-500/10">
                  <span className="rounded-lg bg-orange-500/20 p-3 text-orange-400"><ShieldCheck size={22} /></span>
                  <span className="flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-orange-400">Project built</span>
                    <span className="block text-lg font-bold text-white">{project.name}</span>
                    <span className="block text-xs text-white/55">{project.tagline}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-white/50" />
                </button>
              )}
            </div>
          </ScrollHint>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Hackathon = () => {
  const [open, setOpen] = useState<Win | null>(null);
  return (
    <section id="hackathon" className="relative overflow-hidden py-20">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/5 blur-[100px]" />
      <div className="container mx-auto px-5 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="section-title animate-slide-up flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Hackathon <span className="gradient-text from-yellow-400 to-orange-500">Wins</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            {hackathonWins.length} wins. Open a card for the details and the proof.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {hackathonWins.map((w) => <HackCard key={w.slug} w={w} onOpen={setOpen} />)}
        </div>

        {hackathonOther.length > 0 && (
          <>
            <div className="mx-auto mb-6 mt-14 flex max-w-6xl items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Also placed</h3>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hackathonOther.map((w) => <HackCard key={w.slug} w={w} onOpen={setOpen} />)}
            </div>
          </>
        )}
      </div>
      <HackDetail w={open} onClose={() => setOpen(null)} />
    </section>
  );
};

export default Hackathon;
