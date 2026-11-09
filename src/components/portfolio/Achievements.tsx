import { useState } from 'react';
import { Code2, Presentation, Star, Users } from 'lucide-react';
import { contestWins, projectExpos, honorAwards, competedHome, competedRest, fmtDate, type Win } from '@/lib/content';
import { MoreBox } from './shared';
import { AchievementCard, AchievementDetail } from './AchievementParts';

const Group = ({ icon: Icon, title, note, children }: { icon: React.ElementType; title: string; note?: string; children: React.ReactNode }) => (
  <div className="mb-16">
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-cyan-300"><Icon size={20} /></span>
      <h3 className="text-xl font-bold text-white md:text-2xl">{title}</h3>
      {note && <span className="text-xs text-white/65">{note}</span>}
      <span className="hidden h-px flex-1 bg-white/10 sm:block" />
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div>
  </div>
);

const Achievements = () => {
  const [open, setOpen] = useState<Win | null>(null);
  const card = (w: Win) => <AchievementCard key={w.slug} w={w} onOpen={setOpen} />;

  return (
    <section id="achievements" className="relative overflow-hidden py-20">
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-5 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="section-title animate-slide-up">
            Honors & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            Contest podiums, expos and awards. Every card links to its proof.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <Group icon={Code2} title="Coding Contest Wins">{contestWins.map(card)}</Group>
          <Group icon={Presentation} title="Project Expos">{projectExpos.map(card)}</Group>
          <Group icon={Star} title="Honors">{honorAwards.map(card)}</Group>
          <Group icon={Users} title="Competed In" note="hackathons and events I took part in">
            {competedHome.map(card)}
            <MoreBox
              count={competedRest.length}
              noun="events"
              to="/achievements"
              section="achievements"
              previews={competedRest.slice(0, 3).map((w) => ({ title: w.title, sub: [w.event, fmtDate(w.date)].filter(Boolean).join(' · ') }))}
            />
          </Group>
        </div>
      </div>
      <AchievementDetail w={open} onClose={() => setOpen(null)} />
    </section>
  );
};

export default Achievements;
