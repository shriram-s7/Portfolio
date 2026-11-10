import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { featuredProjects, projectBySlug, projectWin, projects, TAGS, type Project } from '@/lib/content';
import { Chip, EmptyState, PageShell, SearchBox, SelectBox, ViewSwitch } from '@/components/portfolio/shared';
import { ProjectCard, ProjectDetail } from '@/components/portfolio/ProjectParts';
import skillsData from '@/data/skills.json';
import { X } from 'lucide-react';

const featuredSlugs = new Set(featuredProjects.map((p) => p.slug));
const rest = projects.filter((p) => !featuredSlugs.has(p.slug));

const SORTS: Record<string, (a: Project, b: Project) => number> = {
  featured: (a, b) => (a.featured || 99) - (b.featured || 99) || b.created.localeCompare(a.created),
  newest: (a, b) => b.created.localeCompare(a.created),
  wins: (a, b) => Number(!!projectWin(b.slug)) - Number(!!projectWin(a.slug)) || (a.featured || 99) - (b.featured || 99),
};

const ProjectsPage = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [tag, setTag] = useState('all');
  const skillName = params.get('skill');
  const skill = skillName ? skillsData.find((s) => s.name === skillName) : undefined;
  const [view, setView] = useState<'rest' | 'all'>(skill ? 'all' : 'rest');
  const [sort, setSort] = useState('featured');
  const [open, setOpen] = useState<Project | null>(null);

  // /projects?open=<slug> (from skill tooltips): show everything and open that project
  useEffect(() => {
    const slug = params.get('open');
    const p = slug ? projectBySlug(slug) : undefined;
    if (p) { setView('all'); setOpen(p); }
  }, [params]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (view === 'rest' ? rest : projects)
      .filter((p) => !skill || skill.projects.includes(p.slug))
      .filter((p) => tag === 'all' || p.tags.includes(tag))
      .filter((p) => !needle || [p.name, p.tagline, p.problem, ...p.stack, ...p.tags].join(' ').toLowerCase().includes(needle))
      .sort(SORTS[sort]);
  }, [q, tag, view, sort, skill]);

  const closeDetail = () => {
    setOpen(null);
    if (params.get('open')) { params.delete('open'); setParams(params, { replace: true }); }
  };

  return (
    <PageShell title="All" accent="Projects" subtitle={`${projects.length} projects. Each card links to its real repo, demo or video.`}>
      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox value={q} onChange={setQ} placeholder="Search name, stack or problem" />
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <ViewSwitch value={view} onChange={setView} restCount={rest.length} allCount={projects.length} />
            <SelectBox label="Sort" value={sort} onChange={setSort} options={[{ v: 'featured', l: 'Featured' }, { v: 'newest', l: 'Newest' }, { v: 'wins', l: 'Wins first' }]} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2" role="group" aria-label="Filter by theme">
          <Chip active={tag === 'all'} onClick={() => setTag('all')}>All themes</Chip>
          {TAGS.map((t) => <Chip key={t.id} active={tag === t.id} onClick={() => setTag(t.id)}>{t.label}</Chip>)}
        </div>
        {skill && (
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-bold text-cyan-200">
              Skill: {skill.name.split(' (')[0]} · {skill.projectCount} project{skill.projectCount === 1 ? '' : 's'}
              <button type="button" aria-label="Clear skill filter" onClick={() => { params.delete('skill'); setParams(params, { replace: true }); setView('rest'); }} className="rounded-full p-0.5 hover:bg-white/10"><X size={12} /></button>
            </span>
          </div>
        )}
        <p className="text-xs text-white/65 text-center sm:text-left" aria-live="polite">{list.length} shown</p>
      </div>

      {list.length ? (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProjectCard key={p.slug} project={p} featured={false} onOpen={setOpen} id={`project-card-${p.slug}`} />)}
        </div>
      ) : (
        <EmptyState text="No project matches. Clear the search or switch to All." />
      )}
      <ProjectDetail project={open} onClose={closeDetail} />
    </PageShell>
  );
};

export default ProjectsPage;
