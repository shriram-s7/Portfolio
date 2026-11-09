import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import skillsData from '@/data/skills.json';
import { certBySlug, projectBySlug, rememberScroll } from '@/lib/content';
import { Logo } from './Logo';
import { OrgLogo } from './OrgLogo';

type Skill = (typeof skillsData)[number];
const byName = (n: string) => skillsData.find((s) => s.name === n || s.name.startsWith(n + ' ('))!;

/** Shorter project names for the proof lines. */
const SHORT: Record<string, string> = {
  'Hospital Management System (MAD 1)': 'Hospital MAD1',
  'Hospital Management System (MAD 2)': 'Hospital MAD2',
  'Capstone: Enterprise Knowledge Platform': 'FinNova',
  'Aadhaar Pressure Update Intelligence': 'Aadhaar Pressure',
  'BookMyShow Deluxe': 'BookMyShow',
};
const short = (n: string) => SHORT[n] ?? n.split(':')[0];

const CERT_PROOF: Record<string, string> = {
  'oracle-ocp-java-se-17': 'Oracle Certified Java SE 17',
  'nptel-c-programming': 'NPTEL C programming',
  'livewire-cpp': 'LIVEWIRE C++ course',
  'nptel-nlp': 'NPTEL NLP',
  'mongodb-basics-for-students': 'MongoDB Basics badge',
};
const certLine = (s: Skill) => {
  if (s.name.startsWith('AWS')) return `${s.certs.length} AWS certifications`;
  return [...new Set(s.certs.map((c) => CERT_PROOF[c] ?? certBySlug(c)?.title).filter(Boolean))].join(' · ');
};

/** "Used in N projects (A, B, C)" and/or the related certificate. Git and GitHub get no proof line. */
const proofOf = (s: Skill): string => {
  if (!s.proofLine) return '';
  const names = s.projects.slice(0, 3).map((slug) => short(projectBySlug(slug)?.name ?? slug));
  const used = s.projectCount ? `Used in ${s.projectCount} project${s.projectCount === 1 ? '' : 's'} (${names.join(', ')}${s.projectCount > 3 ? ', …' : ''})` : '';
  return [used, certLine(s)].filter(Boolean).join(' · ');
};

const tipOf = (s: Skill) =>
  s.projectCount ? `Used in ${s.projectCount} project${s.projectCount === 1 ? '' : 's'}` : certLine(s) || (s.level === 'Primary' ? 'Primary skill' : s.level);

/** The real AWS logo where we have one, simple-icons or a styled badge otherwise. */
const SkillLogo = ({ skill, size }: { skill: Skill; size: number }) =>
  skill.logo === 'aws' ? <OrgLogo org="aws" size={size + 8} className="!rounded-lg !p-1" /> : <Logo name={skill.logo} size={size} />;

const PILL: Record<string, string> = {
  Primary: 'bg-gradient-to-r from-amber-300 to-orange-400 text-[#2a1600] border-transparent',
  Advanced: 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-transparent',
  Intermediate: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/40',
  Familiar: 'bg-white/5 text-white/70 border-white/20',
};
const LevelPill = ({ level }: { level: string }) => (
  <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${PILL[level]}`}>
    {level === 'Primary' && <Star size={10} fill="currentColor" />} {level}
  </span>
);

/* ------------------------------------------------------------------ marquee */
const ROW1 = ['Python', 'Java', 'C', 'SQL', 'JavaScript', 'TypeScript', 'Git'];
const ROW2 = ['PyTorch', 'OpenCV', 'FastAPI', 'Flask', 'React', 'Vite', 'Tailwind', 'NestJS', 'PostgreSQL', 'MongoDB', 'AWS', 'Electron'];

const Chip = ({ skill }: { skill: Skill }) => {
  const primary = skill.level === 'Primary';
  return (
    <span
      tabIndex={0}
      className={`group/chip relative inline-flex shrink-0 items-center gap-2.5 rounded-full border bg-white/[0.05] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] focus-visible:-translate-y-0.5 focus-visible:border-cyan-400/70 ${
        primary ? 'border-amber-300/60 px-6 py-3.5 text-lg font-extrabold shadow-[0_0_28px_-8px_rgba(251,191,36,0.7)]' : 'border-white/15 px-4 py-2.5 text-sm font-semibold'
      } text-white`}
    >
      <SkillLogo skill={skill} size={primary ? 34 : 22} />
      {skill.name.split(' (')[0]}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#0b1220] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/chip:opacity-100 group-focus-visible/chip:opacity-100"
      >
        {tipOf(skill)}
      </span>
    </span>
  );
};

const Row = ({ names, reverse, dur, label }: { names: string[]; reverse?: boolean; dur: number; label: string }) => (
  <div className="marquee" aria-label={label} role="group">
    <div className={`marquee-track ${reverse ? 'rev' : ''}`} style={{ ['--dur' as any]: `${dur}s` }}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy === 1}>
          {names.map((n) => <Chip key={`${copy}-${n}`} skill={byName(n)} />)}
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------------- bento */
const CATS = ['Languages', 'AI / ML', 'Data & Cloud', 'Web & Backend', 'Tools'] as const;
const SPAN: Record<string, string> = {
  Languages: 'lg:col-span-1', 'AI / ML': 'lg:col-span-1', 'Data & Cloud': 'lg:col-span-1', 'Web & Backend': 'lg:col-span-2', Tools: 'lg:col-span-1',
};

const SkillRow = ({ skill, onOpen }: { skill: Skill; onOpen: (s: Skill) => void }) => {
  const [title, detail] = skill.name.split(/ \((.*)\)$/);
  const proof = [detail, proofOf(skill)].filter(Boolean).join(' · ');
  const clickable = skill.projectCount > 0;
  const body = (
    <>
      <span className="mt-0.5 shrink-0"><SkillLogo skill={skill} size={24} /></span>
      <span className="min-w-0 flex-1 text-left">
        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="font-semibold text-white">{title}</span>
          <LevelPill level={skill.level} />
        </span>
        {proof && <span className="mt-1 block text-xs leading-snug text-white/65">{proof}</span>}
      </span>
    </>
  );
  const cls = 'flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors duration-150';
  return clickable ? (
    <button type="button" onClick={() => onOpen(skill)} title={`Show projects that use ${skill.name}`} className={`${cls} w-full hover:border-cyan-400/40 hover:bg-cyan-500/[0.06]`}>{body}</button>
  ) : (
    <div className={cls}>{body}</div>
  );
};

const PythonTile = ({ skill, onOpen }: { skill: Skill; onOpen: (s: Skill) => void }) => (
  <button
    type="button"
    onClick={() => onOpen(skill)}
    title="Show projects that use Python"
    className="mb-3 w-full rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-purple-500 p-[2px] text-left shadow-[0_0_34px_-10px_rgba(251,191,36,0.8)] transition-transform duration-200 hover:-translate-y-0.5"
  >
    <span className="flex items-center gap-4 rounded-[14px] bg-[#0d1424] p-4">
      <SkillLogo skill={skill} size={52} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-2xl font-extrabold text-white">Python</span>
          <LevelPill level="Primary" />
        </span>
        <span className="mt-1 block text-xs leading-snug text-white/70">{proofOf(skill)}</span>
      </span>
    </span>
  </button>
);

const Skills = () => {
  const nav = useNavigate();
  const open = (s: Skill) => { rememberScroll('skills'); nav(`/projects?skill=${encodeURIComponent(s.name)}`); };

  return (
    <section id="skills" className="relative overflow-hidden py-16">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="section-title animate-slide-up">
            Toolbox & <span className="gradient-text">Skills</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">What I build with, and the proof behind each skill</p>
        </div>
      </div>

      {/* A. toolbox marquee: two rows, opposite directions, edge fade, pause on hover */}
      <div className="space-y-2">
        <Row names={ROW1} dur={42} label="Languages and core tools" />
        <Row names={ROW2} reverse dur={58} label="Frameworks, AI and cloud" />
      </div>

      {/* B. skills at a glance */}
      <div className="container mx-auto mt-14 px-5 sm:px-6">
        <h3 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">Skills at a glance</h3>
        <p className="mx-auto mb-8 max-w-3xl text-center text-sm leading-relaxed text-white/65">
          <b className="text-amber-300">Primary</b> is my strongest. <b className="text-cyan-300">Advanced</b> is the core I put on my resume.{' '}
          <b className="text-cyan-200">Intermediate</b> means used in 2+ projects. <b className="text-white/80">Familiar</b> means 1 project or a course.
          Tap a skill to see its projects.
        </p>

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {CATS.map((cat) => {
            const list = skillsData.filter((s) => s.category === cat);
            const python = list.find((s) => s.level === 'Primary');
            const rest = list.filter((s) => s !== python);
            return (
              <div key={cat} className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 ${SPAN[cat]}`}>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" /> {cat}
                  <span className="ml-auto text-xs font-medium text-white/50">{list.length}</span>
                </h4>
                {python && <PythonTile skill={python} onOpen={open} />}
                <div className={`grid gap-2.5 ${cat === 'Web & Backend' ? 'md:grid-cols-2' : ''}`}>
                  {rest.map((s) => <SkillRow key={s.name} skill={s} onOpen={open} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
