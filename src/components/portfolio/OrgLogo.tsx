import { Logo } from './Logo';

/**
 * Real logos for every issuer and organiser on the site.
 * Files live in public/logos/orgs (official logo from the organisation's own site, or simple-icons).
 * Names that have no logo yet fall back to an initials badge, never an empty slot.
 */
const FILE: Record<string, string> = {
  oracle: 'oracle.svg', aws: 'aws.svg', ibm: 'ibm.svg', nptel: 'nptel.webp', 'iit-madras': 'iit-madras.webp',
  '1m1b': '1m1b.webp', simplilearn: 'simplilearn.webp', codetantra: 'codetantra.webp', codegalatta: 'codegalatta.svg',
  unstop: 'unstop.webp', 'anna-university': 'anna-university.webp', 'mit-madras': 'mit-madras.webp', cit: 'cit.webp',
  saveetha: 'saveetha.webp', cmr: 'cmr.webp', srm: 'srm.svg', tsm: 'tsm.webp', smit: 'smit.webp',
  'abv-iiitm': 'abv-iiitm.webp', 'iiit-surat': 'iiit-surat.webp', 'hero-motocorp': 'hero-motocorp.svg',
  rajalakshmi: 'rajalakshmi.webp', kyndryl: 'kyndryl.svg', cumta: 'cumta.webp', easwari: 'easwari.webp',
  iet: 'iet.webp', adobe: 'adobe.webp', livewire: 'livewire.svg',
};
const SI: Record<string, string> = { cisco: 'cisco', mongodb: 'mongodb', 'google-cloud': 'google cloud', infosys: 'infosys', ieee: 'ieee', nokia: 'nokia' };

/** Order matters: the first rule that matches wins for a given phrase. */
const RULES: [RegExp, string][] = [
  [/1m1b/i, '1m1b'],
  [/oracle/i, 'oracle'],
  [/amazon|\baws\b/i, 'aws'],
  [/cisco/i, 'cisco'],
  [/nptel/i, 'nptel'],
  [/iit madras|iitm/i, 'iit-madras'],
  [/ibm/i, 'ibm'],
  [/mongodb/i, 'mongodb'],
  [/google cloud/i, 'google-cloud'],
  [/simplilearn/i, 'simplilearn'],
  [/infosys/i, 'infosys'],
  [/codetantra/i, 'codetantra'],
  [/livewire/i, 'livewire'],
  [/codegalatta/i, 'codegalatta'],
  [/unstop/i, 'unstop'],
  [/kyndryl/i, 'kyndryl'],
  [/saveetha/i, 'saveetha'],
  [/cmr/i, 'cmr'],
  [/\bsrm\b(?!\s*easwari)/i, 'srm'],
  [/madras institute of technology|csmit|\bmit\b/i, 'mit-madras'],
  [/anna university|college of engineering guindy|\bceg\b|csea/i, 'anna-university'],
  [/chennai institute of technology|\bcit\b/i, 'cit'],
  [/thiagarajar|\btsm\b/i, 'tsm'],
  [/muthukumaran|\bsmit\b/i, 'smit'],
  [/abv-iiitm|iiitm/i, 'abv-iiitm'],
  [/iiit surat/i, 'iiit-surat'],
  [/hero motocorp/i, 'hero-motocorp'],
  [/rajalakshmi/i, 'rajalakshmi'],
  [/cumta|chennai unified/i, 'cumta'],
  [/easwari/i, 'easwari'],
  [/\bieee\b/i, 'ieee'],
  [/nokia/i, 'nokia'],
  [/\biet\b/i, 'iet'],
  [/adobe/i, 'adobe'],
];

/** Every organisation named in a phrase, in the order they appear. */
export function orgKeys(text: string): string[] {
  const hits: { key: string; at: number }[] = [];
  for (const [re, key] of RULES) {
    const m = re.exec(text);
    if (m && !hits.some((h) => h.key === key)) hits.push({ key, at: m.index });
  }
  // "Mathematics Colloquium, College of Engineering Guindy, Anna University": one crest is enough
  const keys = hits.sort((a, b) => a.at - b.at).map((h) => h.key);
  return keys.includes('mit-madras') ? keys.filter((k) => k !== 'anna-university') : keys;
}

const NAME: Record<string, string> = { iet: 'IET', adobe: 'Adobe', livewire: 'LIVEWIRE' };
const initials = (text: string) => {
  if (!/\s/.test(text.trim())) return text.trim().slice(0, 4);
  const w = text.replace(/\(.*?\)/g, '').split(/[\s,&-]+/).filter((x) => x.length > 1 && !/^(of|and|the|with|for|dept|department)$/i.test(x));
  return (w[0]?.[0] ?? '?') + (w[1]?.[0] ?? '');
};

export const OrgLogo = ({ org, size = 44, className = '' }: { org: string; size?: number; className?: string }) => {
  const key = FILE[org] || SI[org] ? org : orgKeys(org)[0];
  const box = { width: size, height: size };
  if (key && FILE[key]) {
    return (
      <span className={`grid shrink-0 place-items-center rounded-xl bg-white p-1.5 shadow-sm ${className}`} style={box} title={org}>
        <img src={`/logos/orgs/${FILE[key]}`} alt={`${org} logo`} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
      </span>
    );
  }
  if (key && SI[key]) {
    return (
      <span className={`grid shrink-0 place-items-center rounded-xl bg-white p-1.5 shadow-sm ${className}`} style={box} title={org}>
        <Logo name={SI[key]} size={size * 0.62} raw />
      </span>
    );
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/25 font-extrabold uppercase tracking-tight text-white ${className}`}
      style={{ ...box, fontSize: Math.max(11, size * 0.34) }}
      title={org}
      aria-label={org}
    >
      {initials(NAME[key ?? ''] ?? org)}
    </span>
  );
};

/** Logos of every organisation in a phrase (max 2), side by side. */
export const OrgLogos = ({ text, size = 40 }: { text: string; size?: number }) => {
  const keys = orgKeys(text).slice(0, 2);
  if (!keys.length) return <OrgLogo org={text} size={size} />;
  return <span className="flex items-center gap-1.5">{keys.map((k) => <OrgLogo key={k} org={k} size={size} />)}</span>;
};

export const hasOrgLogo = (key: string) => !!(FILE[key] || SI[key]);
