import { Trophy, Medal, Award, Presentation, Star, Users, ArrowUpRight, X, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { fmtDate, projectBySlug, type Win } from '@/lib/content';
import { LiftCard, ScrollHint } from './shared';
import { ProofRow } from './Proof';
import { OrgLogos } from './OrgLogo';
import { PrizePill, ViewDetails, WinFrame, WinMedal, medalText, toneOf } from './WinCard';

export const rankStyle = (w: Win) => {
  const label = w.rank || w.badge || 'Participant';
  if (w.rank === '1st Place') return { label, color: 'text-yellow-400', glow: 'rgba(250,204,21,0.45)', tint: 'rgba(250,204,21,0.06)', Icon: Trophy };
  if (w.rank === '2nd Place') return { label, color: 'text-slate-200', glow: 'rgba(148,163,184,0.5)', tint: 'rgba(148,163,184,0.07)', Icon: Medal };
  if (w.rank === '3rd Place') return { label, color: 'text-orange-400', glow: 'rgba(251,146,60,0.45)', tint: 'rgba(251,146,60,0.06)', Icon: Medal };
  if (w.rank) return { label, color: 'text-cyan-300', glow: 'rgba(34,211,238,0.45)', tint: 'rgba(34,211,238,0.07)', Icon: Award };
  if (w.group === 'honor') return { label, color: 'text-purple-300', glow: 'rgba(168,85,247,0.45)', tint: 'rgba(168,85,247,0.07)', Icon: Star };
  if (w.group === 'expo') return { label, color: 'text-sky-300', glow: 'rgba(56,189,248,0.45)', tint: 'rgba(56,189,248,0.07)', Icon: Presentation };
  return { label, color: 'text-white/70', glow: 'rgba(148,163,184,0.4)', tint: 'rgba(148,163,184,0.06)', Icon: Users };
};

export const AchievementCard = ({ w, onOpen }: { w: Win; onOpen: (w: Win) => void }) => {
  const { label, color, glow, tint, Icon } = rankStyle(w);
  const tone = toneOf(w);
  const body = (
    <div className="group relative flex h-full flex-col p-6">
      <Icon strokeWidth={1} className={`pointer-events-none absolute -right-5 -top-5 h-36 w-36 -rotate-12 opacity-[0.05] ${color}`} />
      <div className="relative mb-4 flex items-start justify-between gap-3">
        {tone ? <WinMedal tone={tone} text={medalText(w)} size={58} /> : <div className={`rounded-lg bg-black/40 p-2.5 ${color}`}><Icon size={22} /></div>}
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85">{fmtDate(w.date) || 'Date not printed'}</span>
      </div>
      <h3 className="relative text-lg font-bold leading-snug text-white">{w.title}</h3>
      <p className="relative mt-1 text-sm text-white/65">{w.event !== w.title ? w.event : ''}</p>
      <div className="relative mt-3 flex items-center gap-2.5">
        <OrgLogos text={w.issuer} size={34} />
        <p className="line-clamp-2 text-xs leading-snug text-white/65">{w.issuer}</p>
      </div>
      {w.prize && <div className="relative mt-3"><PrizePill text={w.prize} /></div>}
      <div className="relative mt-auto pt-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold ${color}`}><Award size={14} /> {label}</span>
          <ViewDetails />
        </div>
        <ProofRow item={w} />
      </div>
    </div>
  );
  if (tone) return <WinFrame tone={tone} onClick={() => onOpen(w)} className="group h-full">{body}</WinFrame>;
  return <LiftCard onClick={() => onOpen(w)} glow={glow} tint={tint} className="group h-full overflow-hidden">{body}</LiftCard>;
};

const Fact = ({ k, v }: { k: string; v?: string }) =>
  v ? (
    <div className="flex flex-col"><dt className="text-[10px] uppercase tracking-wider text-white/65">{k}</dt><dd className="break-words text-sm text-white/85">{v}</dd></div>
  ) : null;

export const AchievementDetail = ({ w, onClose }: { w: Win | null; onClose: () => void }) => {
  const project = w?.projectSlug ? projectBySlug(w.projectSlug) : undefined;
  const style = w ? rankStyle(w) : null;
  return (
    <Dialog open={!!w} onOpenChange={(o) => !o && onClose()}>
      <DialogContent hideDefaultClose className="max-w-xl w-[94vw] sm:w-full glass-card border-white/10 p-0 overflow-hidden z-[100]">
        {w && style && (
          <ScrollHint className="max-h-[88vh]">
            <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-white/20" aria-label="Close"><X size={18} /></DialogClose>
            <div className="border-b border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                {toneOf(w) ? <WinMedal tone={toneOf(w)!} text={medalText(w)} size={60} /> : <div className={`rounded-full border border-white/10 bg-black/40 p-3 ${style.color}`}><style.Icon size={24} /></div>}
                <div className="flex-1 pr-8">
                  <DialogTitle className="text-2xl font-bold leading-snug text-white">{w.title}</DialogTitle>
                  <DialogDescription className="mt-1 text-sm font-medium text-primary">{w.event}</DialogDescription>
                  <div className="mt-2"><OrgLogos text={w.issuer} size={32} /></div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded bg-white/10 px-2.5 py-1 font-mono text-xs text-white/80">{fmtDate(w.date) || 'Date not printed'}</span>
                    <span className={`rounded border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-bold ${style.color}`}>{style.label}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <Fact k="Organiser" v={w.issuer} />
                <Fact k="Where" v={w.location} />
                <Fact k="Format" v={w.format} />
                <Fact k="Prize" v={w.prize} />
                <Fact k="Team" v={w.team} />
                <Fact k="Project" v={project?.name} />
                <Fact k="Credential ID" v={w.credentialId} />
              </dl>
              {(w.rankNote || w.certificateNote) && <p className="border-l-2 border-white/10 pl-3 text-xs leading-relaxed text-white/55">{[w.rankNote, w.certificateNote].filter(Boolean).join(' ')}</p>}
              {w.story && <p className="whitespace-pre-line text-sm leading-relaxed text-white/75">{w.story}</p>}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck size={16} className="text-emerald-400" /> Proof</h4>
                <ProofRow item={w} />
              </div>
            </div>
          </ScrollHint>
        )}
      </DialogContent>
    </Dialog>
  );
};
