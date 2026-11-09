// Knowledge base for /api/chat. Built ONLY from the current JSON data files, so the assistant
// can never disagree with what the site shows. Runs server-side (api/chat.js).
import profile from '../data/profile.json' with { type: 'json' };
import education from '../data/education.json' with { type: 'json' };
import skills from '../data/skills.json' with { type: 'json' };
import certifications from '../data/certifications.json' with { type: 'json' };
import wins from '../data/wins.json' with { type: 'json' };
import projects from '../data/projects.json' with { type: 'json' };

const list = (a) => (a && a.length ? a.join('; ') : '');
const line = (label, v) => (v ? `${label}: ${v}` : '');
const join = (...parts) => parts.filter(Boolean).join('\n');

export const buildPortfolioKnowledge = () => {
    const kb = [];

    // Profile
    kb.push({
        id: 'profile', type: 'profile', title: `${profile.name} (profile)`,
        content: join(
            line('Name', profile.name),
            line('Summary', profile.tagline),
            line('Location', profile.location),
            line('Email', profile.email),
            line('GitHub', profile.links?.github),
            line('LinkedIn', profile.links?.linkedin),
            line('LeetCode', profile.links?.leetcode),
            ...(profile.skills || []).map((g) => `${g.group}: ${list(g.items)}`),
        ),
    });

    // Education
    const { eec, iitm, school } = education;
    kb.push({
        id: 'education', type: 'education', title: 'Education',
        content: join(
            `${eec.degree} at ${eec.institution}, ${eec.years}, CGPA ${eec.cgpa}.`,
            `${iitm.degree} at ${iitm.institution}, ${iitm.years}, CGPA ${iitm.cgpa}.`,
            `IIT Madras BS levels: ${(iitm.levels || []).map((l) => `${l.label} (${l.status})`).join(', ')}.`,
            school,
        ),
    });

    // Projects (id = slug)
    projects.forEach((p) => {
        kb.push({
            id: p.slug, type: 'project', title: `${p.name} [project id: ${p.slug}]${p.featured ? ' (featured)' : ''}`,
            content: join(
                line('Tagline', p.tagline),
                line('Problem', p.problem),
                line('How it works', list(p.built)),
                line('Stack', list(p.stack)),
                line('Result', p.result),
                line('Status', p.status),
                line('Context', p.context),
                line('Event', p.event),
                line('GitHub', p.github),
                line('Live app', p.live),
                line('Demo video', p.video),
            ),
        });
    });

    // Wins (hackathons and competitions)
    wins.forEach((w) => {
        const proj = w.projectSlug ? projects.find((p) => p.slug === w.projectSlug) : null;
        kb.push({
            id: w.slug, type: 'win', title: `${w.title} (${w.rank || 'participation'})`,
            content: join(
                line('Result', [w.rank, w.rankNote].filter(Boolean).join(': ')),
                line('Event', w.event),
                line('Organiser', w.issuer),
                line('Date', w.date),
                line('Prize', w.prize),
                line('Team', w.team),
                line('Format', w.format),
                line('Category', w.category),
                line('Project', proj ? `${proj.name} [project id: ${proj.slug}]` : ''),
                line('Story', w.story),
            ),
        });
    });

    // Certifications
    certifications.forEach((c) => {
        kb.push({
            id: c.slug, type: 'certification', title: c.title,
            content: join(
                line('Issuer', c.issuer),
                line('Date', c.date),
                line('Valid until', c.expires),
                line('Grade/score', [c.grade, c.score].filter(Boolean).join(' ')),
                line('Credential ID', c.credentialId),
                line('Verify', c.verifyUrl || c.credlyUrl),
            ),
        });
    });

    // Skills
    const byCat = {};
    skills.forEach((s) => { (byCat[s.category] ||= []).push(`${s.name} (${s.level}, used in ${s.projectCount} projects)`); });
    Object.entries(byCat).forEach(([cat, items]) => {
        kb.push({ id: `skills-${cat}`, type: 'skill', title: `Skills: ${cat}`, content: items.join('; ') });
    });

    return kb;
};
