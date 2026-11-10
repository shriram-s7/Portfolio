import { useState } from 'react';
import { Github, ExternalLink, Youtube, Download, Info, Trophy, Play, ChevronLeft, ChevronRight, ArrowUpRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mediaFor, projectWin, TAGS, type Project } from '@/lib/content';
import { LiftCard, ScrollHint } from './shared';
import { ProofRow } from './Proof';

const THEME: Record<string, { from: string; to: string; glow: string }> = {
  'ai-ml': { from: '#0e7490', to: '#6d28d9', glow: 'rgba(34,211,238,0.45)' },
  fullstack: { from: '#1d4ed8', to: '#0891b2', glow: 'rgba(59,130,246,0.45)' },
  security: { from: '#6d28d9', to: '#be185d', glow: 'rgba(168,85,247,0.45)' },
  logistics: { from: '#c2410c', to: '#b45309', glow: 'rgba(251,146,60,0.45)' },
  data: { from: '#047857', to: '#0e7490', glow: 'rgba(52,211,153,0.45)' },
};
export const themeOf = (p: Project) => THEME[p.tags[0]] ?? THEME['fullstack'];
export const tagLabel = (id: string) => TAGS.find((t) => t.id === id)?.label ?? id;

export const ytId = (url: string) => url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)?.[1] ?? '';

const linkBtn =
  'inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/65 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur transition-colors hover:border-cyan-300 hover:bg-cyan-500/30';

export const ProjectLinks = ({ project, className = '' }: { project: Project; className?: string }) => {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} onClick={stop}>
      {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkBtn}><Github size={12} /> GitHub</a>}
      {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className={linkBtn}><ExternalLink size={12} /> Live</a>}
      {project.video && <a href={project.video} target="_blank" rel="noopener noreferrer" className={linkBtn}><Youtube size={12} /> Video</a>}
      {project.release && <a href={project.release} target="_blank" rel="noopener noreferrer" className={linkBtn}><Download size={12} /> {project.releaseLabel || 'Release'}</a>}
    </div>
  );
};


type Tile = { href: string; Icon: typeof Github; label: string; sub: string; cls: string; ring: string };

/** Big, highlighted logo buttons shown inside the project dialog. */
export const ProjectLinkTiles = ({ project }: { project: Project }) => {
  const tiles: Tile[] = [];
  if (project.github) tiles.push({ href: project.github, Icon: Github, label: 'GitHub', sub: 'Source code', cls: 'border-violet-400/70 bg-violet-500/15 hover:bg-violet-500/30', ring: 'rgba(167,139,250,0.6)' });
  if (project.live) tiles.push({ href: project.live, Icon: ExternalLink, label: 'Live app', sub: project.live.replace(/^https?:\/\//, '').replace(/\/$/, ''), cls: 'border-emerald-400/70 bg-emerald-500/15 hover:bg-emerald-500/30', ring: 'rgba(52,211,153,0.6)' });
  if (project.video) tiles.push({ href: project.video, Icon: Youtube, label: 'YouTube', sub: 'Watch the demo', cls: 'border-red-400/70 bg-red-500/15 hover:bg-red-500/30', ring: 'rgba(248,113,113,0.6)' });
  if (project.release) tiles.push({ href: project.release, Icon: Download, label: project.releaseLabel || 'Release', sub: 'Download', cls: 'border-amber-400/70 bg-amber-500/15 hover:bg-amber-500/30', ring: 'rgba(251,191,36,0.6)' });
  if (tiles.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-300/90">
        <ArrowUpRight size={13} /> Click a logo to open
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {tiles.map((t) => (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ['--ring' as any]: t.ring }}
            className={`link-tile group flex items-center gap-3 rounded-xl border-2 p-3 text-white ${t.cls}`}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-black/50"><t.Icon size={24} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t.label}</span>
              <span className="block truncate text-xs text-white/65">{t.sub}</span>
            </span>
            <ArrowUpRight size={18} className="shrink-0 text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
};

/** Browser-frame project card: window dots, screenshot with link buttons overlaid, then the details. */
export const ProjectCard = ({ project, onOpen, featured = false, id }: { project: Project; onOpen: (p: Project) => void; featured?: boolean; id?: string }) => {
  const t = themeOf(project);
  const { cover } = mediaFor(project.slug);
  const [broken, setBroken] = useState(false);
  const hasShot = !!cover && !broken;
  const host = project.live ? project.live.replace(/^https?:\/\//, '') : `github.com/shriram-s7/${project.github.split('/').pop()}`;
  return (
    <LiftCard id={id} onClick={() => onOpen(project)} glow={t.glow} className="group flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-white/5 px-3 py-0.5 text-center font-mono text-[10px] text-white/65">{host}</span>
      </div>
      {hasShot && (
        <div className="relative aspect-[16/10] overflow-hidden bg-black/50">
          <img src={cover} alt={`${project.name} screenshot`} loading="lazy" decoding="async" onError={() => setBroken(true)} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-10">
            <ProjectLinks project={project} />
          </div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.tags.map((tg) => (
            <span key={tg} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60">{tagLabel(tg)}</span>
          ))}
        </div>
        <h3 className="text-xl font-bold text-white">{project.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/65">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, featured ? 6 : 4).map((s) => (
            <span key={s} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/75">{s}</span>
          ))}
        </div>
        {!hasShot && <ProjectLinks project={project} className="mt-4" />}
        {featured && project.challenges.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300/80">Challenges solved</p>
            <ul className="space-y-1.5">
              {project.challenges.slice(0, 3).map((c, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/65">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                  <span className="line-clamp-3">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto pt-4">
          {project.result ? (
            <p className="flex items-start gap-1.5 text-xs font-semibold text-amber-400"><Trophy size={13} className="mt-0.5 shrink-0" /> {project.result}</p>
          ) : project.context ? (
            <p className="flex items-start gap-1.5 text-xs font-medium text-white/55"><Info size={13} className="mt-0.5 shrink-0" /> {project.context}</p>
          ) : null}
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-3 py-1 text-[11px] font-bold text-cyan-200 transition-colors group-hover:bg-cyan-500/30">Click for full details <ArrowUpRight size={12} /></span>
        </div>
      </div>
    </LiftCard>
  );
};

/** YouTube demo: only a thumbnail until clicked, so no third-party scripts load with the page. */
const Demo = ({ url, title }: { url: string; title: string }) => {
  const [play, setPlay] = useState(false);
  const id = ytId(url);
  if (!id) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
      {play ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={`${title} demo`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={`Play ${title} demo`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110"><Play size={22} fill="currentColor" /></span>
        </button>
      )}
    </div>
  );
};

/** Full detail panel: description, how it works, screenshot gallery, embedded demo and any linked win. */
export const ProjectDetail = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const [shot, setShot] = useState(0);
  const [last, setLast] = useState<Project | null>(null);
  if (project !== last) { setLast(project); setShot(0); }
  const media = project ? mediaFor(project.slug) : { cover: undefined, gallery: [] as string[] };
  const shots = project ? [media.cover, ...media.gallery].filter(Boolean) as string[] : [];
  const win = project ? projectWin(project.slug) : undefined;
  const go = (d: number) => setShot((n) => (n + d + shots.length) % shots.length);

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-[94vw] sm:w-full glass-card border-white/10 p-0 overflow-hidden z-[100]">
        {project && (
          <ScrollHint className="max-h-[88vh]">
            <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-white/20" aria-label="Close"><X size={18} /></DialogClose>
            {shots.length > 0 && (
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] bg-black/70 flex items-center justify-center overflow-hidden">
              <img src={shots[shot]} alt={`${project.name} screenshot ${shot + 1}`} className="h-full w-full object-contain object-center" />
              {shots.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Previous screenshot"><ChevronLeft size={20} /></button>
                  <button type="button" onClick={() => go(1)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80" aria-label="Next screenshot"><ChevronRight size={20} /></button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono text-white/80">{shot + 1} / {shots.length}</span>
                </>
              )}
            </div>
            )}
            <div className="space-y-6 p-6 md:p-8">
              <div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tg) => <span key={tg} className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60">{tagLabel(tg)}</span>)}
                  {project.status && <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/60">{project.status}</span>}
                </div>
                <DialogTitle className="text-2xl font-bold text-white md:text-3xl">{project.name}</DialogTitle>
                <DialogDescription className="mt-2 text-base leading-relaxed text-white/70">{project.tagline}</DialogDescription>
                <ProjectLinkTiles project={project} />
              </div>

              {project.problem && (
                <section>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300/80">The problem</h4>
                  <p className="text-sm leading-relaxed text-white/75">{project.problem}</p>
                </section>
              )}
              <section>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300/80">How it works</h4>
                <ul className="space-y-2">
                  {project.built.map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-white/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />{b}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300/80">Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">{s}</span>)}
                </div>
              </section>

              {project.video && (
                <section>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300/80">Demo</h4>
                  <Demo url={project.video} title={project.name} />
                </section>
              )}

              {win && (
                <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                  <h4 className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-400"><Trophy size={15} /> {win.rank}{win.rankNote ? `: ${win.rankNote}` : ''}</h4>
                  <p className="mb-3 text-xs text-white/60">{win.event}{win.prize ? ` · ${win.prize}` : ''}</p>
                  <ProofRow item={win} />
                </section>
              )}
              {!win && project.context && <p className="flex items-center gap-2 text-xs text-white/50"><Info size={13} /> {project.context}</p>}
            </div>
          </ScrollHint>
        )}
      </DialogContent>
    </Dialog>
  );
};
