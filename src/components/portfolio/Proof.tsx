import { useState } from 'react';
import { ShieldCheck, FileText, Images, Linkedin, BarChart3, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { proofFor, verifyLink } from '@/lib/content';

export interface ProofItem {
  slug: string;
  title: string;
  verifyUrl?: string;
  credlyUrl?: string;
  linkedinUrl?: string;
  resultUrl?: string;
  certificateNote?: string;
}

interface ViewerRequest {
  title: string;
  note?: string;
  images: { src: string; alt: string }[];
  pdf?: string;
  start?: number;
}

/** Image viewer for certificates and photos. The original PDF is only linked, never loaded up front. */
export const ProofViewer = ({ req, onClose }: { req: ViewerRequest | null; onClose: () => void }) => {
  const [i, setI] = useState(0);
  const [lastReq, setLastReq] = useState<ViewerRequest | null>(null);
  if (req !== lastReq) {
    setLastReq(req);
    setI(req?.start ?? 0);
  }
  const many = !!req && req.images.length > 1;
  const go = (d: number) => req && setI((n) => (n + d + req.images.length) % req.images.length);
  const img = req?.images[i];

  return (
    <Dialog open={!!req} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-4xl glass-card border-white/10 p-4 md:p-5 z-[120]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === 'ArrowRight') go(1);
          if (e.key === 'ArrowLeft') go(-1);
        }}
      >
        <DialogClose className="absolute right-4 top-4 z-50 rounded-full p-2 bg-black/50 hover:bg-white/20 text-white transition-colors" aria-label="Close">
          <X size={18} />
        </DialogClose>
        <div className="pr-10">
          <DialogTitle className="text-lg font-bold text-white">{req?.title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {req?.note ?? (many ? `Photo ${i + 1} of ${req!.images.length}` : 'Preview of the original document')}
          </DialogDescription>
        </div>
        {img && (
          <div className="relative rounded-lg bg-black/50 overflow-auto max-h-[68vh]">
            <img src={img.src} alt={img.alt} className="mx-auto max-h-[66vh] w-auto max-w-full object-contain" />
            {many && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Previous photo">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Next photo">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
        {req?.pdf && (
          <a href={req.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 transition-colors">
            Open original PDF <ExternalLink size={12} />
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
};

const btn =
  'inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white/85 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300';

/**
 * Proof buttons for one item. A button is rendered only when its proof exists:
 * official Verify link, certificate image/PDF, photos, LinkedIn post, official results.
 * Returns null when there is nothing, so no dead buttons are ever shown.
 */
export const ProofRow = ({ item, className = '', hideCert = false }: { item: ProofItem; className?: string; hideCert?: boolean }) => {
  const [req, setReq] = useState<ViewerRequest | null>(null);
  const proof = proofFor(item.slug);
  const verify = verifyLink({ verifyUrl: item.verifyUrl ?? '', credlyUrl: item.credlyUrl });
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const showCert = !!proof.cert && !hideCert;
  const hasAny = verify || showCert || item.resultUrl || item.linkedinUrl || proof.photos.length;
  if (!hasAny) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} onClick={stop}>
      {verify && (
        <a href={verify} target="_blank" rel="noopener noreferrer" className={btn} onClick={stop}>
          <ShieldCheck size={13} className="text-emerald-400" /> Verify
        </a>
      )}
      {showCert && (
        <button
          type="button"
          className={btn}
          onClick={(e) => {
            stop(e);
            setReq({ title: item.title, note: item.certificateNote, images: [{ src: proof.cert!, alt: `Certificate: ${item.title}` }], pdf: proof.pdf });
          }}
        >
          <FileText size={13} className="text-cyan-400" /> Certificate
        </button>
      )}
      {item.resultUrl && (
        <a href={item.resultUrl} target="_blank" rel="noopener noreferrer" className={btn} onClick={stop}>
          <BarChart3 size={13} className="text-cyan-400" /> Official results
        </a>
      )}
      {item.linkedinUrl && (
        <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer" className={btn} onClick={stop}>
          <Linkedin size={13} className="text-cyan-400" /> LinkedIn post
        </a>
      )}
      {proof.photos.length > 0 && (
        <button
          type="button"
          className={btn}
          onClick={(e) => {
            stop(e);
            setReq({ title: item.title, images: proof.photos.map((src, n) => ({ src, alt: `${item.title}, photo ${n + 1}` })) });
          }}
        >
          <Images size={13} className="text-cyan-400" /> Photos
        </button>
      )}
      <ProofViewer req={req} onClose={() => setReq(null)} />
    </div>
  );
};
