import { useMemo, useState } from 'react';
import { allAchievements, homeAchievementSlugs, KIND_LABEL, yearOf, type AchievementKind, type Win } from '@/lib/content';
import { Chip, EmptyState, PageShell, SearchBox, SelectBox, ViewSwitch } from '@/components/portfolio/shared';
import { AchievementCard, AchievementDetail } from '@/components/portfolio/AchievementParts';

const kindOf = (w: Win) => (w.group === 'competed' ? 'competed' : (w.group as AchievementKind));
const rest = allAchievements.filter((w) => !homeAchievementSlugs.has(w.slug));
const years = [...new Set(allAchievements.map((w) => yearOf(w.date)).filter(Boolean))].sort().reverse();

const AchievementsPage = () => {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'all' | AchievementKind>('all');
  const [year, setYear] = useState('all');
  const [view, setView] = useState<'rest' | 'all'>(rest.length ? 'rest' : 'all');
  const [sort, setSort] = useState('newest');
  const [open, setOpen] = useState<Win | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (view === 'rest' ? rest : allAchievements)
      .filter((w) => kind === 'all' || kindOf(w) === kind)
      .filter((w) => year === 'all' || yearOf(w.date) === year)
      .filter((w) => !needle || [w.title, w.event, w.issuer, w.rank, w.team].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => (sort === 'oldest' ? a.date.localeCompare(b.date) : sort === 'name' ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
  }, [q, kind, year, view, sort]);

  return (
    <PageShell title="All" accent="Achievements" subtitle={`${allAchievements.length} events: hackathons, contests, expos, honors and everything I competed in.`}>
      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox value={q} onChange={setQ} placeholder="Search event, organiser or rank" />
          <div className="flex flex-wrap items-center gap-3">
            <ViewSwitch value={view} onChange={setView} restCount={rest.length} allCount={allAchievements.length} />
            <SelectBox label="Sort" value={sort} onChange={setSort} options={[{ v: 'newest', l: 'Newest' }, { v: 'oldest', l: 'Oldest' }, { v: 'name', l: 'Name' }]} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <Chip active={kind === 'all'} onClick={() => setKind('all')}>All types</Chip>
          {(Object.keys(KIND_LABEL) as AchievementKind[]).map((k) => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{KIND_LABEL[k]}</Chip>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by year">
          <Chip active={year === 'all'} onClick={() => setYear('all')}>All years</Chip>
          {years.map((y) => <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>)}
        </div>
        <p className="text-xs text-white/50" aria-live="polite">{list.length} shown</p>
      </div>

      {list.length ? (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w) => <AchievementCard key={w.slug} w={w} onOpen={setOpen} />)}
        </div>
      ) : (
        <EmptyState text="Nothing matches. Clear the filters or switch to All." />
      )}
      <AchievementDetail w={open} onClose={() => setOpen(null)} />
    </PageShell>
  );
};

export default AchievementsPage;
