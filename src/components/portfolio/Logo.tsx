import {
  siPython, siC, siJavascript, siTypescript, siPytorch, siOpencv, siFastapi, siFlask, siReact, siVite, siTailwindcss,
  siNestjs, siPostgresql, siSqlite, siMongodb, siGit, siGithub, siElectron, siCisco, siGooglecloud, siInfosys,
  siNodedotjs, siJupyter, siClaude, siIeee, siNokia, siCplusplus, siHtml5, siNextdotjs, siVuedotjs, siCelery, siRedis, siFlutter, siDocker, siStreamlit, siPandas, siMaplibre,
} from 'simple-icons';

type Icon = { path: string; hex: string; title: string };

const ICONS: Record<string, Icon> = {
  python: siPython, c: siC, javascript: siJavascript, typescript: siTypescript, pytorch: siPytorch, opencv: siOpencv,
  fastapi: siFastapi, flask: siFlask, react: siReact, vite: siVite, tailwind: siTailwindcss, nestjs: siNestjs,
  postgresql: siPostgresql, sqlite: siSqlite, mongodb: siMongodb, git: siGit, github: siGithub, electron: siElectron,
  cisco: siCisco, 'google cloud': siGooglecloud, infosys: siInfosys, node: siNodedotjs, jupyter: siJupyter, 'claude code': siClaude, ieee: siIeee, nokia: siNokia, 'c++': siCplusplus, html: siHtml5, nextjs: siNextdotjs, vue: siVuedotjs, celery: siCelery, redis: siRedis,
  flutter: siFlutter, docker: siDocker, streamlit: siStreamlit, pandas: siPandas, maplibre: siMaplibre,
};

/** Brands that simple-icons does not ship get a styled text badge instead of a logo. */
const BADGE: Record<string, { text: string; color: string }> = {
  java: { text: 'Java', color: '#f89820' },
  sql: { text: 'SQL', color: '#38bdf8' },
  mysql: { text: 'MySQL', color: '#00a3d9' },
  aws: { text: 'AWS', color: '#ff9900' },
  oracle: { text: 'Oracle', color: '#f80000' },
  'ibm skillsbuild': { text: 'IBM', color: '#4f8cff' },
  nptel: { text: 'NPTEL', color: '#f59e0b' },
  timm: { text: 'timm', color: '#a78bfa' },
  nlp: { text: 'NLP', color: '#22d3ee' },
  cnn: { text: 'CNN', color: '#f472b6' },
  vit: { text: 'ViT', color: '#a78bfa' },
  gradcam: { text: 'CAM', color: '#fb923c' },
  rest: { text: 'REST', color: '#34d399' },
  rag: { text: 'RAG', color: '#34d399' },
  'iit madras': { text: 'IITM', color: '#a78bfa' },
  livewire: { text: 'LW', color: '#fb923c' },
};

/** Dark brand colours would vanish on the dark theme, so lift them. */
const visible = (hex: string) => {
  const n = parseInt(hex, 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.28 ? '#e2e8f0' : `#${hex}`;
};

export const hasLogo = (name: string) => !!ICONS[name.toLowerCase()];

export const Logo = ({ name, size = 28, className = '', raw = false }: { name: string; size?: number; className?: string; raw?: boolean }) => {
  const key = name.toLowerCase();
  const icon = ICONS[key];
  if (icon) {
    return (
      <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={size} height={size} className={className} fill={raw ? `#${icon.hex}` : visible(icon.hex)}>
        <path d={icon.path} />
      </svg>
    );
  }
  const b = BADGE[key] ?? { text: name.slice(0, 4), color: '#94a3b8' };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-bold font-mono leading-none ${className}`}
      style={{ minWidth: size, height: size, padding: '0 6px', fontSize: Math.max(9, size * 0.34), color: b.color, border: `1px solid ${b.color}55`, background: `${b.color}14` }}
      aria-label={name}
    >
      {b.text}
    </span>
  );
};
