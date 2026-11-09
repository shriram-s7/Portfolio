import { useMemo, useState } from 'react';
import { CERT_TYPE_LABEL, HOME_ISSUERS, certType, certs, homeCertSlugs, issuerOf, yearOf, type Cert, type CertType } from '@/lib/content';
import { Chip, EmptyState, PageShell, SearchBox, SelectBox, ViewSwitch } from '@/components/portfolio/shared';
import { CertCard, CertDetail } from '@/components/portfolio/CertificationParts';
import { OrgLogo } from '@/components/portfolio/OrgLogo';

// "Remaining" = every certificate whose issuer is not one of the four on the home page.
const rest = certs.filter((c) => !homeCertSlugs.has(c.slug));
const issuers = [...new Set(certs.map(issuerOf))].sort((a, b) => {
  const ia = (HOME_ISSUERS as readonly string[]).indexOf(a), ib = (HOME_ISSUERS as readonly string[]).indexOf(b);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
});
const years = [...new Set(certs.map((c) => yearOf(c.date)).filter(Boolean))].sort().reverse();
const types = (Object.keys(CERT_TYPE_LABEL) as CertType[]).filter((t) => t !== 'education');

const CertificationsPage = () => {
  const [q, setQ] = useState('');
  const [issuer, setIssuer] = useState('all');
  const [type, setType] = useState<'all' | CertType>('all');
  const [year, setYear] = useState('all');
  const [view, setView] = useState<'rest' | 'all'>(rest.length ? 'rest' : 'all');
  const [sort, setSort] = useState('date-desc');
  const [open, setOpen] = useState<Cert | null>(null);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = (view === 'rest' ? rest : certs)
      .filter((c) => issuer === 'all' || issuerOf(c) === issuer)
      .filter((c) => type === 'all' || certType(c) === type)
      .filter((c) => year === 'all' || yearOf(c.date) === year)
      .filter((c) => !needle || [c.title, c.issuer, c.credentialId, c.grade, c.institute].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => (sort === 'date-asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    const map = new Map<string, Cert[]>();
    for (const c of list) map.set(issuerOf(c), [...(map.get(issuerOf(c)) ?? []), c]);
    return [...map].sort(([a], [b]) => issuers.indexOf(a) - issuers.indexOf(b));
  }, [q, issuer, type, year, view, sort]);
  const total = groups.reduce((n, [, l]) => n + l.length, 0);

  return (
    <PageShell title="All" accent="Certifications & Courses" subtitle={`${certs.length} certificates, courses and badges, grouped by issuer. Open one to see the original and verify it.`}>
      <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox value={q} onChange={setQ} placeholder="Search title, issuer or credential ID" />
          <div className="flex flex-wrap items-center gap-3">
            <ViewSwitch value={view} onChange={setView} restCount={rest.length} allCount={certs.length} restLabel="Remaining issuers" />
            <SelectBox label="Sort" value={sort} onChange={setSort} options={[{ v: 'date-desc', l: 'Newest first' }, { v: 'date-asc', l: 'Oldest first' }]} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by issuer">
          <Chip active={issuer === 'all'} onClick={() => setIssuer('all')}>All issuers</Chip>
          {issuers.filter((i) => view === 'all' || !(HOME_ISSUERS as readonly string[]).includes(i)).map((i) => <Chip key={i} active={issuer === i} onClick={() => setIssuer(i)}>{i}</Chip>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <Chip active={type === 'all'} onClick={() => setType('all')}>All types</Chip>
          {types.map((t) => <Chip key={t} active={type === t} onClick={() => setType(t)}>{CERT_TYPE_LABEL[t]}</Chip>)}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by year">
          <Chip active={year === 'all'} onClick={() => setYear('all')}>All years</Chip>
          {years.map((y) => <Chip key={y} active={year === y} onClick={() => setYear(y)}>{y}</Chip>)}
        </div>
        <p className="text-xs text-white/65" aria-live="polite">{total} shown</p>
      </div>

      {groups.length ? (
        <div className="mx-auto max-w-6xl space-y-12">
          {groups.map(([name, list]) => (
            <section key={name} aria-labelledby={`g-${name}`}>
              <div className="mb-5 flex items-center gap-4">
                <OrgLogo org={name} size={52} />
                <div>
                  <h2 id={`g-${name}`} className="text-xl font-bold text-white md:text-2xl">{name}</h2>
                  <p className="text-sm text-white/65">{list.length} {list.length === 1 ? 'certificate' : 'certificates'}</p>
                </div>
                <span className="hidden h-px flex-1 bg-white/10 sm:block" />
              </div>
              <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => <CertCard key={c.slug} cert={c} onOpen={setOpen} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState text="Nothing matches. Clear the filters or switch to All." />
      )}
      <CertDetail cert={open} onClose={() => setOpen(null)} />
    </PageShell>
  );
};

export default CertificationsPage;
