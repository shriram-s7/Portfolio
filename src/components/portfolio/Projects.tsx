import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { featuredProjects, otherProjects, projects, mediaFor, projectBySlug, rememberScroll, TAGS, type Project } from '@/lib/content';
import { Chip, MoreBox } from './shared';
import { ProjectCard, ProjectDetail } from './ProjectParts';

const Projects = () => {
  const nav = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState<Project | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  const shown = featuredProjects.filter((p) => filter === 'all' || p.tags.includes(filter));

  // "View Full Project" from the hackathon cards and the skill tooltips.
  useEffect(() => {
    const onTrigger = (e: Event) => {
      const slug = (e as CustomEvent).detail?.projectId as string;
      const project = projectBySlug(slug);
      if (!project) return;
      if (!project.featured) {
        rememberScroll('hackathon');
        nav(`/projects?open=${slug}`);
        return;
      }
      setFilter('all');
      window.setTimeout(() => {
        document.getElementById(`project-card-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlight(slug);
        window.setTimeout(() => setHighlight(null), 1800);
        window.setTimeout(() => setOpen(project), 700);
      }, 50);
    };
    window.addEventListener('trigger-project-view', onTrigger);
    return () => window.removeEventListener('trigger-project-view', onTrigger);
  }, [nav]);

  return (
    <section id="projects" className="relative overflow-hidden py-12">
      <div className="absolute left-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="section-title animate-slide-up">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            Five projects in depth. Every link goes to a real repo, demo or video.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter featured projects by theme">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
          {TAGS.map((t) => (
            <Chip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>{t.label}</Chip>
          ))}
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 grid-cols-1 md:grid-cols-2 justify-items-center md:justify-items-stretch">
          {shown.map((p) => (
            <div key={p.slug} className={`w-full min-w-0 max-w-xl md:max-w-none rounded-2xl transition-shadow duration-500 ${highlight === p.slug ? 'ring-2 ring-primary' : ''}`}>
              <ProjectCard project={p} featured onOpen={setOpen} id={`project-card-${p.slug}`} />
            </div>
          ))}
          <div className="w-full min-w-0 max-w-xl md:max-w-none">
            <MoreBox
              count={otherProjects.length}
              noun="projects"
              to="/projects"
              section="projects"
              previews={otherProjects.slice(0, 3).map((p) => ({ title: p.name, sub: p.stack.slice(0, 2).join(' · '), img: mediaFor(p.slug).cover }))}
            />
          </div>
        </div>
        {shown.length === 0 && (
          <p className="mt-4 text-center text-sm text-white/50">No featured project in this theme. Open the {projects.length - featuredProjects.length} more to see them all.</p>
        )}
      </div>

      <ProjectDetail project={open} onClose={() => setOpen(null)} />
    </section>
  );
};

export default Projects;
