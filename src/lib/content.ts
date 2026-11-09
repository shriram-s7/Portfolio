import winsRaw from "@/data/wins.json";
import certsRaw from "@/data/certifications.json";
import projectsRaw from "@/data/projects.json";
import proofManifest from "virtual:proof-manifest";
import projectMedia from "virtual:project-media";

export type Win = (typeof winsRaw)[number];
export type Cert = (typeof certsRaw)[number];
export type Project = (typeof projectsRaw)[number];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** One date format everywhere: "Mar 2026". Year-only values stay "2024". */
export function fmtDate(iso?: string): string {
  if (!iso) return "";
  const [y, m] = iso.split("-");
  if (!m) return y;
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
export const yearOf = (iso?: string) => (iso ? iso.slice(0, 4) : "");

export interface Proof {
  cert?: string;
  pdf?: string;
  badge?: string;
  photos: string[];
}
export const proofFor = (slug: string): Proof => proofManifest[slug] ?? { photos: [] };

/** Screenshots for a project: public/projects/<slug>/cover.webp plus gallery/. */
export const mediaFor = (slug: string): { cover?: string; gallery: string[] } => projectMedia[slug] ?? { gallery: [] };

export const TAGS = [
  { id: "ai-ml", label: "AI/ML" },
  { id: "fullstack", label: "Full-stack" },
  { id: "security", label: "Security" },
  { id: "logistics", label: "Logistics" },
  { id: "data", label: "Data" },
] as const;

/* ------------------------------------------------------------------ projects */
export const projects: Project[] = projectsRaw;
export const featuredProjects = projects.filter((p) => p.featured > 0).sort((a, b) => a.featured - b.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
/** Does this project have a linked win? (used for "Wins first" sorting) */
export const projectWin = (slug: string) => (winsRaw as Win[]).find((w) => w.projectSlug === slug);

/* ---------------------------------------------------------------------- wins */
const RANK_ORDER: Record<string, number> = { "1st Place": 1, "2nd Place": 2, "3rd Place": 3, "Theme Winner": 4, "4th Place": 5, "": 9 };
const byRankThenDate = (a: Win, b: Win) =>
  (RANK_ORDER[a.rank] ?? 9) - (RANK_ORDER[b.rank] ?? 9) || b.date.localeCompare(a.date);
const wins = winsRaw as Win[];
const inGroup = (g: string) => wins.filter((w) => w.group === g);
const ordered = (slugs: string[]) => slugs.map((s) => wins.find((w) => w.slug === s)!).filter(Boolean);

/** All 4 hackathon wins and prize awards (counted in the hero chip). */
export const hackathonWins = inGroup("hackathon").sort(byRankThenDate);
/** Consolation placements (kept for compatibility). */
export const hackathonOther: Win[] = [];
export const hackathonAll = hackathonWins;

export const contestWins = ordered([
  "code-crux-niral-2026",
  "code-noobies-carte-blanche-25",
  "code-mathrix-mathrix-25",
  "pseudo-2-code-mathrix-25",
  "reverse-coding-tech-fiesta-25",
]);
export const projectExpos = ordered(["nexus-7-project-competition", "srm-project-expo-2026"]);
export const honorAwards = inGroup("honor");
export const competedAll = inGroup("competed").sort((a, b) => b.date.localeCompare(a.date));
/** Only these two competed-in events are shown on the home page; everything else sits behind the "+N more" box. */
export const competedHome = ordered(["smart-city-challenge-2026", "technova-2026-grand-finale"]);
export const competedRest = competedAll.filter((w) => !competedHome.some((h) => h.slug === w.slug));

export type AchievementKind = "hackathon" | "contest" | "expo" | "honor" | "competed";
export const KIND_LABEL: Record<AchievementKind, string> = {
  hackathon: "Hackathons",
  contest: "Coding contests",
  expo: "Project expos",
  honor: "Honors",
  competed: "Competed in",
};
/** Everything, for /achievements. */
export const allAchievements: Win[] = [...hackathonAll, ...contestWins, ...projectExpos, ...honorAwards, ...competedAll];
/** Slugs already visible on the home page (the /achievements default filter hides these). */
export const homeAchievementSlugs = new Set<string>([
  ...hackathonAll.map((w) => w.slug),
  ...contestWins.map((w) => w.slug),
  ...projectExpos.map((w) => w.slug),
  ...honorAwards.map((w) => w.slug),
  ...competedHome.map((w) => w.slug),
]);

/* ------------------------------------------------------------ certifications */
/** Courses, badges and certifications only. The IIT Madras degree documents live in Education, not here. */
export const certs: Cert[] = certsRaw.filter((c) => c.tier !== "4-education");
export const eduDocs: Cert[] = certsRaw.filter((c) => c.tier === "4-education");
export const certBySlug = (slug: string) => certsRaw.find((c) => c.slug === slug);

export type CertType = "certification" | "course" | "badge" | "internship" | "education";
export const CERT_TYPE_LABEL: Record<CertType, string> = {
  certification: "Certification",
  course: "Course",
  badge: "Badge",
  internship: "Internship",
  education: "Degree document",
};
export function certType(c: Cert): CertType {
  if (c.tier === "1-industry" || c.tier === "2-nptel") return "certification";
  if (c.tier === "4-education") return "education";
  if (c.slug.includes("internship")) return "internship";
  if (c.credlyUrl || c.verifyUrl.includes("credly.com")) return "badge";
  return "course";
}

/** Top-level issuer used for the home cards, filters and logos. */
export function issuerOf(c: Cert): string {
  const i = c.issuer;
  if (i.startsWith("Oracle")) return "Oracle";
  if (i.startsWith("Amazon")) return "AWS";
  if (i.startsWith("NPTEL")) return "NPTEL";
  if (i.startsWith("Cisco")) return "Cisco";
  if (i.includes("1M1B") || i.includes("IBM")) return "IBM SkillsBuild";
  if (i.startsWith("Google")) return "Google Cloud";
  if (i.startsWith("MongoDB")) return "MongoDB";
  if (i.startsWith("Infosys")) return "Infosys";
  if (i.startsWith("LIVEWIRE")) return "LIVEWIRE";
  if (i.startsWith("IIT Madras")) return "IIT Madras";
  return i;
}

export const HOME_ISSUERS = ["Oracle", "AWS", "Cisco", "NPTEL"] as const;
const sortByDateDesc = (a: Cert, b: Cert) => b.date.localeCompare(a.date);
export const certsByIssuer = (issuer: string) =>
  certs
    .filter((c) => issuerOf(c) === issuer)
    .sort((a, b) => Number(b.grade === "Discipline Star") - Number(a.grade === "Discipline Star") || sortByDateDesc(a, b));
export const homeCertSlugs = new Set<string>(HOME_ISSUERS.flatMap((i) => certsByIssuer(i).map((c) => c.slug)));
export const restCerts = certs.filter((c) => !homeCertSlugs.has(c.slug)).sort(sortByDateDesc);

/** The one official place to verify a certificate, if there is one. */
export const verifyLink = (c: { verifyUrl: string; credlyUrl?: string }) => c.credlyUrl || c.verifyUrl || "";

/** Remembers the scroll position so the "Back to portfolio" button returns to where the visitor was. */
export const RETURN_KEY = "portfolio-return";
export function rememberScroll(section: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, JSON.stringify({ y: window.scrollY, section }));
  } catch {
    /* storage can be blocked; the back button then falls back to the section anchor */
  }
}
