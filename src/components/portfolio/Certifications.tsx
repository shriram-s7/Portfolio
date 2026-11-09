import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HOME_ISSUERS, restCerts, rememberScroll, type Cert } from '@/lib/content';
import { CertDetail, IssuerDialog, IssuerGridCard } from './CertificationParts';

const Certifications = () => {
  const nav = useNavigate();
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<Cert | null>(null);
  const issuerCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleCloseIssuerDialog = () => {
    const prevIssuer = selectedIssuer;
    setSelectedIssuer(null);
    if (prevIssuer && issuerCardRefs.current[prevIssuer]) {
      setTimeout(() => issuerCardRefs.current[prevIssuer]?.focus(), 50);
    }
  };

  return (
    <section id="certifications" className="relative overflow-hidden py-20">
      <div className="absolute left-0 top-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-purple-500/5 blur-3xl" />
      <div className="container mx-auto px-5 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="section-title animate-slide-up">
            Technical <span className="gradient-text">Certifications & Courses</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            Pick an issuer to explore certificates, courses and official verification
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* 4 large issuer cards in a 2x2 grid (1 column on mobile): Oracle, AWS, Cisco, NPTEL */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {HOME_ISSUERS.map((issuer) => (
              <IssuerGridCard
                key={issuer}
                ref={(el) => {
                  issuerCardRefs.current[issuer] = el;
                }}
                issuer={issuer}
                onClick={() => setSelectedIssuer(issuer)}
              />
            ))}
          </div>

          {/* Check remaining courses & certs button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => { rememberScroll('certifications'); nav('/certifications'); }}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_-8px_rgba(168,85,247,0.7)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Check remaining courses & certs
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-sm">{restCerts.length}</span>
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Issuer Dialog: opens on click (centred modal on desktop, bottom sheet on mobile) */}
      <IssuerDialog
        issuer={selectedIssuer}
        onClose={handleCloseIssuerDialog}
        onOpenCertificate={(c) => setSelectedCert(c)}
      />

      {/* Certificate Lightbox: stacked ON TOP of the dialog */}
      <CertDetail
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};

export default Certifications;
