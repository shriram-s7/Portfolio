import { useState, forwardRef } from 'react';
import { X, ExternalLink, FileX, ArrowRight, Eye, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CERT_TYPE_LABEL, certType, certsByIssuer, fmtDate, issuerOf, proofFor, verifyLink, type Cert } from '@/lib/content';
import { LiftCard, ScrollHint } from './shared';
import { OrgLogo } from './OrgLogo';
import { ProofRow } from './Proof';

/** Real logo for the issuer (see OrgLogo); initials badge only when no logo exists. */
export const IssuerLogo = ({ issuer, size = 48 }: { issuer: string; size?: number }) => <OrgLogo org={issuer} size={size} />;

export const gradeText = (c: Cert) => (c.grade ? (c.score ? `${c.grade} · ${c.score}%` : c.grade) : '');
export const gradeTone = (g: string) => {
  const s = g.toLowerCase();
  if (s.includes('silver') || s.includes('discipline')) return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300';
  if (s.includes('elite')) return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  return 'border-slate-500/30 bg-slate-500/10 text-slate-300';
};

/** Long credential IDs are shortened on the card; the full ID shows on hover and in the lightbox. */
export const shortId = (id: string) => (id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id);

/** Issuer styling metadata for the 4 core issuers */
export interface IssuerMeta {
  name: string;
  highlight: string;
  glowClass: string;
  hoverBorderClass: string;
  accentBorderClass: string;
}

export const ISSUER_META: Record<string, IssuerMeta> = {
  Oracle: {
    name: 'Oracle',
    highlight: 'Professional Java SE 17',
    glowClass: 'hover:shadow-[0_12px_40px_-6px_rgba(234,27,34,0.45)]',
    hoverBorderClass: 'hover:border-red-500/60',
    accentBorderClass: 'border-red-500/25 hover:border-red-500/50',
  },
  AWS: {
    name: 'AWS',
    highlight: 'Associate + Foundational',
    glowClass: 'hover:shadow-[0_12px_40px_-6px_rgba(255,153,0,0.45)]',
    hoverBorderClass: 'hover:border-amber-500/60',
    accentBorderClass: 'border-amber-500/25 hover:border-amber-500/50',
  },
  Cisco: {
    name: 'Cisco',
    highlight: 'Networking, security & AI',
    glowClass: 'hover:shadow-[0_12px_40px_-6px_rgba(4,159,217,0.45)]',
    hoverBorderClass: 'hover:border-sky-500/60',
    accentBorderClass: 'border-sky-500/25 hover:border-sky-500/50',
  },
  NPTEL: {
    name: 'NPTEL',
    highlight: 'IIT courses · Elite grades',
    glowClass: 'hover:shadow-[0_12px_40px_-6px_rgba(245,158,11,0.45)]',
    hoverBorderClass: 'hover:border-amber-500/60',
    accentBorderClass: 'border-amber-500/25 hover:border-amber-500/50',
  },
};

/** Formats a coloured pill for grade, score or level */
export function getCertPill(c: Cert): { text: string; tone: string } | null {
  const issuer = issuerOf(c);
  if (issuer === 'NPTEL') {
    if (c.grade === 'Discipline Star') {
      return { text: 'Discipline Star ★', tone: 'border-yellow-400/40 bg-yellow-400/15 text-yellow-300' };
    }
    if (c.grade) {
      const label = c.score ? `${c.grade} · ${c.score}%` : c.grade;
      if (c.grade.includes('Silver')) {
        return { text: label, tone: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-300' };
      }
      return { text: label, tone: 'border-amber-400/40 bg-amber-400/15 text-amber-300' };
    }
  }
  if (issuer === 'AWS') {
    if (c.title.includes('Associate')) {
      return { text: 'Associate', tone: 'border-purple-400/40 bg-purple-500/15 text-purple-300' };
    }
    if (c.title.includes('Practitioner')) {
      return { text: 'Foundational', tone: 'border-cyan-400/40 bg-cyan-500/15 text-cyan-300' };
    }
  }
  if (issuer === 'Oracle') {
    return { text: 'Professional', tone: 'border-red-400/40 bg-red-500/15 text-red-300' };
  }
  if (issuer === 'Cisco') {
    if (c.title.startsWith('CCNA')) return { text: 'CCNA', tone: 'border-sky-400/40 bg-sky-500/15 text-sky-300' };
    if (c.title.includes('Modern AI') || c.title.includes('Apply AI')) return { text: 'AI', tone: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-300' };
    if (c.title.includes('Security')) return { text: 'Security', tone: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300' };
    if (c.title.includes('Networking')) return { text: 'Networking', tone: 'border-sky-400/40 bg-sky-500/15 text-sky-300' };
    if (c.title.includes('Python')) return { text: 'Python', tone: 'border-amber-400/40 bg-amber-500/15 text-amber-300' };
  }
  if (c.grade) {
    return { text: c.score ? `${c.grade} · ${c.score}%` : c.grade, tone: 'border-slate-500/30 bg-slate-500/10 text-slate-300' };
  }
  return null;
}

/** Issuer Grid Card for the 2x2 home section */
export const IssuerGridCard = forwardRef<
  HTMLButtonElement,
  {
    issuer: string;
    onClick: () => void;
  }
>(({ issuer, onClick }, ref) => {
  const meta = ISSUER_META[issuer] ?? {
    name: issuer,
    highlight: 'Certifications & Credentials',
    glowClass: 'hover:shadow-[0_12px_40px_-6px_rgba(56,189,248,0.4)]',
    hoverBorderClass: 'hover:border-cyan-400/60',
    accentBorderClass: 'border-white/10 hover:border-cyan-400/50',
  };
  const certs = certsByIssuer(issuer);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1220]/90 p-6 text-left transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${meta.glowClass} ${meta.hoverBorderClass}`}
    >
      <div>
        <div className="flex items-start gap-4">
          <OrgLogo org={issuer} size={56} className="rounded-xl shadow-md shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                {issuer}
              </h3>
              <span className="shrink-0 text-xs sm:text-sm font-medium text-white/60">
                {certs.length} {certs.length === 1 ? 'certification' : 'certifications'}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-cyan-300/90">
              {meta.highlight}
            </p>
          </div>
        </div>

        {/* Row of mini badge icons / thumbnails previewing its certificates */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {certs.map((c) => {
            const p = proofFor(c.slug);
            const thumb = p.badge || p.cert;
            return (
              <span
                key={c.slug}
                title={c.title}
                className="relative block h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/40 p-0.5 transition-transform group-hover:scale-105 group-hover:border-white/30"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className={`h-full w-full rounded ${p.badge ? 'object-contain' : 'object-cover object-top'}`}
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/50">
                    {c.title.slice(0, 2)}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Whole card clickable, with clear hint */}
      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs sm:text-sm">
        <span className="text-white/50 transition-colors group-hover:text-white/75">
          {certs.length} verified {certs.length === 1 ? 'credential' : 'credentials'}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 transition-all group-hover:translate-x-1 group-hover:text-cyan-300">
          View certificates <ArrowRight size={15} />
        </span>
      </div>
    </button>
  );
});
IssuerGridCard.displayName = 'IssuerGridCard';

/** Certificate Card inside the Issuer Dialog */
export const DialogCertCard = ({
  cert,
  accentBorderClass,
  onOpenCertificate,
}: {
  cert: Cert;
  accentBorderClass: string;
  onOpenCertificate: (c: Cert) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const proof = proofFor(cert.slug);
  const pill = getCertPill(cert);
  const verifyUrl = verifyLink(cert);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cert.credentialId) return;
    navigator.clipboard.writeText(cert.credentialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenCertificate(cert)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenCertificate(cert);
        }
      }}
      className={`group relative flex flex-col justify-between rounded-xl border bg-[#0e1628]/90 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer ${accentBorderClass}`}
    >
      <div>
        <div className="flex items-start gap-3.5">
          {/* Badge or cropped thumbnail */}
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-0.5 flex items-center justify-center">
            {proof.badge ? (
              <img src={proof.badge} alt="" className="h-full w-full object-contain" />
            ) : proof.cert ? (
              <img src={proof.cert} alt="" className="h-full w-full object-cover object-top rounded-lg" />
            ) : (
              <FileX className="h-5 w-5 text-white/40" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/60">
              {pill && (
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${pill.tone}`}>
                  {pill.text}
                </span>
              )}
              <span className="text-white/50">{fmtDate(cert.date)}</span>
            </div>
            <h4 className="mt-1.5 text-sm sm:text-base font-bold leading-snug text-white transition-colors group-hover:text-cyan-300 line-clamp-2">
              {cert.title}
            </h4>
          </div>
        </div>

        {/* Short credential ID */}
        {cert.credentialId && (
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-xs">
            <span className="text-[11px] font-medium text-white/50">Credential ID</span>
            <button
              type="button"
              onClick={handleCopy}
              title={`Full ID: ${cert.credentialId} (click to copy)`}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
              aria-label={`Copy credential ID ${cert.credentialId}`}
            >
              <span>{shortId(cert.credentialId)}</span>
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-white/40 group-hover:text-white/70" />}
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-3.5 flex items-center gap-2 border-t border-white/5 pt-2.5">
        {verifyUrl && (
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition-all hover:border-cyan-400/50 hover:bg-white/10 hover:text-cyan-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            Verify <ExternalLink size={12} />
          </a>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCertificate(cert);
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/25 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
        >
          <Eye size={13} /> Certificate
        </button>
      </div>
    </div>
  );
};

/** Issuer Dialog: opens when an issuer card is clicked */
export const IssuerDialog = ({
  issuer,
  onClose,
  onOpenCertificate,
}: {
  issuer: string | null;
  onClose: () => void;
  onOpenCertificate: (cert: Cert) => void;
}) => {
  if (!issuer) return null;
  const meta = ISSUER_META[issuer] ?? {
    name: issuer,
    highlight: 'Certifications',
    glowClass: '',
    hoverBorderClass: '',
    accentBorderClass: 'border-white/10 hover:border-white/20',
  };
  const certs = certsByIssuer(issuer);

  const maxWidthClass =
    issuer === 'Oracle'
      ? 'sm:max-w-md'
      : issuer === 'AWS'
      ? 'sm:max-w-3xl'
      : 'sm:max-w-5xl';

  const gridClass =
    issuer === 'Oracle'
      ? 'grid-cols-1'
      : issuer === 'AWS'
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <Dialog open={!!issuer} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        overlayClassName="z-50 bg-black/75 backdrop-blur-md"
        hideDefaultClose
        className={`p-0 gap-0 border-white/10 bg-[#0a0f1d] shadow-2xl flex flex-col max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-h-[85vh] max-sm:w-full max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 sm:fixed sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:max-h-[85vh] sm:w-[92vw] ${maxWidthClass}`}
      >
        {/* Mobile bottom sheet drag handle */}
        <div className="sm:hidden mx-auto mt-2.5 mb-1 h-1 w-12 rounded-full bg-white/25 shrink-0" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0c1324] px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-3.5 min-w-0 pr-4">
            <OrgLogo org={issuer} size={48} className="rounded-xl shadow-md shrink-0" />
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{issuer}</span>
                <span className="text-white/60 font-medium text-sm sm:text-base">Certifications</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-white/65 mt-0.5 leading-snug">
                {certs.length} {certs.length === 1 ? 'certification' : 'certifications'} · {meta.highlight}
              </DialogDescription>
            </div>
          </div>
          <DialogClose
            className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </DialogClose>
        </div>

        {/* Body: scrolling only if taller than 85vh */}
        <ScrollHint outerClassName="min-h-0 flex-1" className="p-4 sm:p-6 [scrollbar-width:thin]">
          <div className={`grid gap-3.5 sm:gap-4 ${gridClass}`}>
            {certs.map((c) => (
              <DialogCertCard
                key={c.slug}
                cert={c}
                accentBorderClass={meta.accentBorderClass}
                onOpenCertificate={onOpenCertificate}
              />
            ))}
          </div>
        </ScrollHint>
      </DialogContent>
    </Dialog>
  );
};

/** Compact certificate card fallback */
export const CertMini = ({ cert, onOpen, focusable = true }: { cert: Cert; onOpen: (c: Cert) => void; focusable?: boolean }) => (
  <LiftCard cue onClick={() => onOpen(cert)} focusable={focusable} className="flex h-full min-h-[112px] flex-col !rounded-xl p-4 pr-12 text-left">
    <h4 className="text-sm font-semibold leading-snug text-white/95">{cert.title}</h4>
    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-[11px] text-white/65">
      <span>{fmtDate(cert.date)}</span>
      {gradeText(cert) && <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${gradeTone(cert.grade)}`}>{gradeText(cert)}</span>}
      {cert.credentialId && <span className="font-mono" title={cert.credentialId}>ID {shortId(cert.credentialId)}</span>}
    </div>
  </LiftCard>
);

/** Detailed card used on /certifications. */
export const CertCard = ({ cert, onOpen }: { cert: Cert; onOpen: (c: Cert) => void }) => {
  const issuer = issuerOf(cert);
  return (
    <LiftCard cue onClick={() => onOpen(cert)} className="flex h-full min-h-[230px] flex-col p-5">
      <div className="flex items-start gap-3">
        <IssuerLogo issuer={cert.issuer} size={44} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/65">{issuer} · {CERT_TYPE_LABEL[certType(cert)]}</p>
          <h3 className="mt-0.5 text-base font-bold leading-snug text-white">{cert.title}</h3>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div><dt className="text-[10px] uppercase tracking-wider text-white/65">Issued</dt><dd className="text-white/85">{fmtDate(cert.date)}</dd></div>
        {cert.expires && <div><dt className="text-[10px] uppercase tracking-wider text-white/65">Valid until</dt><dd className="text-white/85">{fmtDate(cert.expires)}</dd></div>}
        {gradeText(cert) && <div><dt className="text-[10px] uppercase tracking-wider text-white/65">Result</dt><dd className="text-white/85">{gradeText(cert)}</dd></div>}
        {cert.institute && <div><dt className="text-[10px] uppercase tracking-wider text-white/65">Institute</dt><dd className="text-white/85">{cert.institute}</dd></div>}
        {cert.credentialId && <div className="col-span-2"><dt className="text-[10px] uppercase tracking-wider text-white/65">Credential ID</dt><dd className="break-all font-mono text-white/85">{cert.credentialId}</dd></div>}
      </dl>
      <div className="mt-auto pt-4"><ProofRow item={cert} /></div>
    </LiftCard>
  );
};

const Row = ({ k, v }: { k: string; v?: string }) =>
  v ? <div className="flex flex-col"><dt className="text-[10px] uppercase tracking-wider text-white/65">{k}</dt><dd className="break-words text-sm text-white/90">{v}</dd></div> : null;

/** Lightbox: the certificate image, the credential ID and the proof buttons. Stacked ON TOP of the dialog. */
export const CertDetail = ({ cert, onClose }: { cert: Cert | null; onClose: () => void }) => {
  const proof = cert ? proofFor(cert.slug) : null;
  return (
    <Dialog open={!!cert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        overlayClassName="z-[90] bg-black/80 backdrop-blur-sm"
        hideDefaultClose
        className="max-w-4xl w-[94vw] sm:w-full glass-card border-white/10 p-0 overflow-hidden z-[100]"
      >
        {cert && proof && (
          <ScrollHint className="max-h-[90vh]">
            <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-white/20" aria-label="Close">
              <X size={18} />
            </DialogClose>
            <div className="flex items-start gap-4 border-b border-white/10 bg-white/5 p-5 pr-16">
              <IssuerLogo issuer={cert.issuer} size={52} />
              <div className="min-w-0">
                <DialogTitle className="text-xl font-bold leading-snug text-white">{cert.title}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/60">{cert.issuer} · {CERT_TYPE_LABEL[certType(cert)]}</DialogDescription>
              </div>
            </div>
            <div className="bg-black/50 p-3">
              {proof.cert ? (
                <img src={proof.cert} alt={`Certificate: ${cert.title}`} className="mx-auto max-h-[56vh] w-auto max-w-full object-contain" />
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-white/65"><FileX size={28} /> Certificate image not available</div>
              )}
            </div>
            <div className="space-y-5 p-5 md:p-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
                <Row k="Issued" v={fmtDate(cert.date)} />
                <Row k="Valid until" v={fmtDate(cert.expires)} />
                <Row k="Term" v={cert.term} />
                <Row k="Institute" v={cert.institute} />
                <Row k="Result" v={gradeText(cert)} />
                <Row k="Type" v={cert.kind} />
                <div className="col-span-2"><Row k="Credential ID" v={cert.credentialId} /></div>
              </dl>
              <div className="flex flex-wrap items-center gap-2">
                <ProofRow item={cert} hideCert />
                {proof.pdf && (
                  <a href={proof.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/85 hover:border-cyan-400/50 hover:text-cyan-300">
                    Original PDF <ExternalLink size={12} />
                  </a>
                )}
              </div>
              {!cert.verifyUrl && !cert.credlyUrl && (
                <p className="text-xs text-white/65">No official online verifier exists for this credential, so the certificate itself is the proof.</p>
              )}
            </div>
          </ScrollHint>
        )}
      </DialogContent>
    </Dialog>
  );
};
