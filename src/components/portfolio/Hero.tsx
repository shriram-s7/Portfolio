import { useState, useEffect, useRef } from 'react';
import { Eye, Briefcase, Download, MapPin, Github, Linkedin, Mail, Wrench, Rocket, GraduationCap } from 'lucide-react';
import { profileData } from '../../data/profileData';
import { certs, projects as allProjects, hackathonWins, contestWins, projectExpos } from '@/lib/content';

// Counts are computed from the verified data files, so they can never drift from the proof.
const COUNTS = {
  certifications: certs.filter((c) => c.tier !== '4-education').length,
  projects: allProjects.length,
  hackathons: hackathonWins.length,
  competitions: contestWins.length + projectExpos.filter((w) => w.rank).length,
};

const Hero = () => {
  const { name, role, summary, location, education, techStack, github, linkedin, email } = profileData;

  const statsRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    certifications: 0,
    projects: 0,
    hackathons: 0,
    competitions: 0
  });

  const [eecLogoError, setEecLogoError] = useState(false);
  const [iitmLogoError, setIitmLogoError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const duration = 1200; // 1.2s
          const startTimestamp = performance.now();
          
          const animate = (now: number) => {
            const elapsed = now - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            
            // easeOutQuad timing
            const easeProgress = progress * (2 - progress);
            
            setStats({
              certifications: Math.round(easeProgress * COUNTS.certifications),
              projects: Math.round(easeProgress * COUNTS.projects),
              hackathons: Math.round(easeProgress * COUNTS.hackathons),
              competitions: Math.round(easeProgress * COUNTS.competitions)
            });
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-24">
      {/* Background Effects - GLOW INTENSITY INCREASED */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      {/* Increased size from 600px to 800px and added opacity for stronger, larger glow */}
      <div className="glow-effect w-[800px] h-[800px] bg-primary/60 -top-48 -left-48 animate-pulse-glow" />
      {/* Increased size from 500px to 700px */}
      <div className="glow-effect w-[700px] h-[700px] bg-secondary/60 -bottom-32 -right-32 animate-pulse-glow animation-delay-300" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="max-w-[90rem] mx-auto text-center">

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-3 animate-slide-up">
            <span className="bg-gradient-to-r from-[#00C9A7] to-[#845EF7] bg-clip-text text-transparent">{name}</span>
          </h1>

          {/* Dual Degree Badges */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-3 animate-slide-up animation-delay-100">
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-[#00C9A7]/15 text-[#00C9A7] border border-[#00C9A7]/30 max-w-full text-center whitespace-normal md:whitespace-nowrap">
              🎓 B.E. CSE @ Easwari Engineering College
            </span>
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-[#845EF7]/20 text-[#A78BFA] border border-[#845EF7]/30 max-w-full text-center whitespace-normal md:whitespace-nowrap">
              🎓 BS Data Science @ IIT Madras
            </span>
          </div>

          <p className="text-lg md:text-[20px] text-white font-semibold mb-2 px-4 md:px-0 text-wrap animate-slide-up animation-delay-150">
            {role}
          </p>

          <div className="text-[14.5px] text-[#94A3B8] mb-4 animate-slide-up animation-delay-175">
            {location}
          </div>

          <p className="text-[#E2E8F0] text-sm md:text-[16px] leading-[1.7] max-w-2xl mx-auto mb-5 px-4 md:px-0 animate-slide-up animation-delay-200">
            {summary}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up animation-delay-300">
            <a href="#projects" className="btn-primary">
              <Briefcase size={18} />
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Eye size={18} />
              View Resume
            </a>
          </div>

          {/* --- SLIM STATS STRIP --- */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:flex md:flex-nowrap items-center justify-center gap-3 md:gap-x-6 md:gap-y-3 rounded-[12px] border w-full max-w-5xl mx-auto mb-8 animate-slide-up animation-delay-350 p-4 md:p-[16px_32px]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Item 1 */}
            <div className="flex items-center justify-center md:justify-start gap-2 hover:-translate-y-0.5 transition-transform duration-200 ease-out cursor-default">
              <span className="font-bold text-lg md:text-[22px] text-[#00C9A7] leading-none shrink-0">{stats.certifications}</span>
              <span className="text-[#94A3B8] text-[11px] md:text-[13px] font-normal leading-tight">Certifications & Courses</span>
            </div>

            <div className="hidden md:block w-[1px] h-5 bg-white/10 shrink-0" />

            {/* Item 2 */}
            <div className="flex items-center justify-center md:justify-start gap-2 hover:-translate-y-0.5 transition-transform duration-200 ease-out cursor-default">
              <span className="font-bold text-lg md:text-[22px] text-[#A78BFA] leading-none shrink-0">{stats.projects}</span>
              <span className="text-[#94A3B8] text-[11px] md:text-[13px] font-normal leading-tight">Full Stack & AI/ML Projects</span>
            </div>

            <div className="hidden md:block w-[1px] h-5 bg-white/10 shrink-0" />

            {/* Item 3 */}
            <div className="flex items-center justify-center md:justify-start gap-2 hover:-translate-y-0.5 transition-transform duration-200 ease-out cursor-default">
              <span className="font-bold text-lg md:text-[22px] text-[#F59E0B] leading-none shrink-0">{stats.hackathons}</span>
              <span className="text-[#94A3B8] text-[11px] md:text-[13px] font-normal leading-tight">Hackathon Wins</span>
            </div>

            <div className="hidden md:block w-[1px] h-5 bg-white/10 shrink-0" />

            {/* Item 4 */}
            <div className="flex items-center justify-center md:justify-start gap-2 hover:-translate-y-0.5 transition-transform duration-200 ease-out cursor-default">
              <span className="font-bold text-lg md:text-[22px] text-[#F472B6] leading-none shrink-0">{stats.competitions}</span>
              <span className="text-[#94A3B8] text-[11px] md:text-[13px] font-normal leading-tight">Competition Wins</span>
            </div>
          </div>

          {/* --- EDUCATION CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl mx-auto mb-7 items-stretch animate-slide-up animation-delay-375">
            {/* Card 1 - Easwari Engineering College */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 md:p-[24px_28px] min-h-[160px] flex flex-col justify-between hover:border-[#00C9A7]/50 transition-all duration-300 text-left">
              <div className="flex justify-between items-start gap-3 md:gap-4 h-full w-full">
                <div className="flex flex-col justify-between h-full flex-1">
                  {/* Header Row */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {!eecLogoError ? (
                      <img
                        src="/logos/eec.png"
                        alt="Easwari Logo"
                        className="w-11 h-11 md:w-[52px] md:h-[52px] object-contain rounded-[10px] bg-white/10 p-[6px] shrink-0"
                        onError={() => setEecLogoError(true)}
                      />
                    ) : (
                      <div className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-full bg-[#00C9A7]/20 text-[#00C9A7] text-xs md:text-[14px] font-bold flex items-center justify-center shrink-0">
                        EEC
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] md:text-[12px] tracking-[0.05em] md:tracking-[0.08em] text-[#94A3B8] font-semibold uppercase leading-none">EASWARI ENGINEERING COLLEGE</p>
                      <h2 className="font-bold text-base md:text-[20px] text-white leading-[1.3] mt-1.5">B.E. Computer Science & Engineering</h2>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs md:text-[13px] font-semibold bg-[#00C9A7]/20 text-[#00C9A7]">
                      Semester 5 • 2024–2028
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] md:text-[12px] text-[#94A3B8] uppercase tracking-wider font-semibold">CGPA</p>
                  <p className="text-3xl md:text-[40px] font-extrabold text-[#00C9A7] leading-none mt-1.5">8.87</p>
                </div>
              </div>
            </div>

            {/* Card 2 - IIT Madras */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 md:p-[24px_28px] min-h-[160px] flex flex-col justify-between hover:border-[#845EF7]/50 transition-all duration-300 text-left">
              <div className="flex justify-between items-start gap-3 md:gap-4 h-full w-full">
                <div className="flex flex-col justify-between h-full flex-1">
                  {/* Header Row */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {!iitmLogoError ? (
                      <img
                        src="/logos/iitm.png"
                        alt="IIT Madras Logo"
                        className="w-11 h-11 md:w-[52px] md:h-[52px] object-contain rounded-[10px] bg-white/10 p-[6px] shrink-0"
                        onError={() => setIitmLogoError(true)}
                      />
                    ) : (
                      <div className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-full bg-[#A78BFA]/20 text-[#A78BFA] text-xs md:text-[14px] font-bold flex items-center justify-center shrink-0">
                        IIT
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] md:text-[12px] tracking-[0.05em] md:tracking-[0.08em] text-[#94A3B8] font-semibold uppercase leading-none">IIT MADRAS</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-[11px] font-semibold bg-[#845EF7]/25 text-[#A78BFA]">
                          2024–2028
                        </span>
                      </div>
                      <h4 className="font-bold text-base md:text-[20px] text-white leading-[1.3] mt-1.5">BS Data Science & Applications</h4>
                    </div>
                  </div>
                  
                  {/* Two-row Diploma Tracker */}
                  <div className="mt-3 flex flex-col gap-[10px]">
                    {/* Row 1: Completed */}
                    <div className="flex items-center justify-between text-xs md:text-[14px] max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#4ADE80] text-black font-extrabold flex items-center justify-center text-[10px] shrink-0">✓</span>
                        <span className="text-[#4ADE80] font-medium">Diploma in Programming</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-[11px] font-bold bg-[#4ADE80]/20 text-[#4ADE80] shrink-0">
                        Completed
                      </span>
                    </div>
                    
                    {/* Row 2: In Progress */}
                    <div className="flex items-center justify-between text-xs md:text-[14px] max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#7C3AED]"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
                        </span>
                        <span className="text-[#A78BFA] font-medium">Diploma in Data Science</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] md:text-[11px] font-bold bg-[#7C3AED]/20 text-[#C4B5FD] shrink-0">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="text-[10px] md:text-[12px] text-[#94A3B8] uppercase tracking-wider font-semibold">CGPA</p>
                  <p className="text-3xl md:text-[40px] font-extrabold text-[#845EF7] leading-none mt-1.5">7.52</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- MERGED ACTIONS & STATUS CARD --- */}
          <div className="w-full max-w-5xl mx-auto mb-6 p-4 md:py-6 md:px-7 bg-black/30 backdrop-blur border border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 animate-slide-up animation-delay-385">
            {/* Row 1: Action Icon-Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
              {/* Resume Button */}
              <a
                href="/resume.pdf"
                download="S_Shriram_Resume.pdf"
                className="w-full md:w-auto justify-center bg-gradient-to-r from-[#00C9A7] to-[#845EF7] text-white text-[14px] font-semibold rounded-full py-2.5 px-5 flex items-center gap-2 hover:scale-105 transition-all duration-300 shrink-0"
                title="Download Resume"
              >
                <Download size={16} />
                <span>Download Resume</span>
              </a>

              {/* Icons Group */}
              <div className="flex items-center justify-center gap-6">
                {/* GitHub Button */}
                <div className="flex flex-col items-center gap-1">
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#00C9A7]/40 hover:text-[#00C9A7] text-foreground rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
                    title="View GitHub Repositories"
                  >
                    <Github size={15} />
                  </a>
                  <span className="text-[11px] text-[#94A3B8] font-medium">GitHub</span>
                </div>
      
                {/* LinkedIn Button */}
                <div className="flex flex-col items-center gap-1">
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#845EF7]/40 hover:text-[#845EF7] text-foreground rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={15} />
                  </a>
                  <span className="text-[11px] text-[#94A3B8] font-medium">LinkedIn</span>
                </div>
      
                {/* Contact Button */}
                <div className="flex flex-col items-center gap-1">
                  <a
                    href="#contact"
                    className="p-2.5 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#00C9A7]/40 hover:text-[#00C9A7] text-foreground rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
                    title="Contact Me"
                  >
                    <Mail size={15} />
                  </a>
                  <span className="text-[11px] text-[#94A3B8] font-medium">Contact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;