import { useState, useEffect, useRef, MouseEvent } from 'react';
import { GraduationCap, Calendar, Star, BookOpen, Award, X, MapPin, CheckCircle2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { certBySlug } from '@/lib/content';
import { ProofRow } from './Proof';
import { LiftCard, ScrollHint } from './shared';

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  year: string;
  score: string;
  description: string;
  details: string[];
  icon: React.ElementType;
  color: string;
  logo?: string;
  glow: string;
  certSlug?: string;
}

const educationData: EducationItem[] = [
  {
    id: 1,
    degree: 'B.E. Computer Science and Engineering',
    institution: 'Easwari Engineering College',
    year: '5th Sem Ongoing',
    score: 'CGPA: 8.87',
    description: 'Specializing in Full Stack Development and AI/ML. Active member of technical clubs.',
    details: [
      "Consistently maintained a high CGPA of 8.87 through rigorous coursework.",
      "Key Courses: Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks.",
      "Active participant in the college's Coding Club and Technical Symposiums.",
      "Leading a team for the Smart India Hackathon internal rounds."
    ],
    icon: GraduationCap,
    color: 'text-blue-300',
    logo: '/logos/eec.png',
    glow: 'hover:border-blue-400',
  },
  {
    id: 3,
    degree: 'Diploma in Data Science',
    institution: 'IIT Madras (BS Degree)',
    year: 'Ongoing',
    score: 'Current CGPA: 7.52',
    description: 'Advanced curriculum covering Machine Learning, Statistics, Data Visualization, and real-world AI/ML applications.',
    details: [
      "Core Courses: Machine Learning Foundations (MLF), Machine Learning Techniques (MLT), Tools in Data Science (TDS), and Business Data Management (BDM).",
      "Project Courses: Machine Learning Practice (MLP) Project, Business Data Management (BDM) Project.",
      "Gained hands-on expertise in building ML models, data pipelines, business analytics, and using tools like git, bash, SQL, and Python libraries.",
      "Engaged in in-person invigilated examinations and continuous weekly assignments."
    ],
    icon: Award,
    color: 'text-emerald-400',
    logo: '/logos/iitm.png',
    glow: 'hover:border-emerald-400',
  },
  {
    id: 2,
    degree: 'Diploma in Programming',
    institution: 'IIT Madras (BS Degree)',
    year: 'Completed',
    score: 'Verified completion',
    certSlug: 'iitm-bs-diploma-programming',
    description: 'Rigorous curriculum covering DSA, Java, and Database Management.',
    details: [
      "Completed: Modern Application Development I (Project: MAD I App), Programming, Data Structures and Algorithms using Python, Database Management Systems, Programming Concepts using Java.",
      "Ongoing: System Commands, Modern Application Development II (Project: MAD II App).",
      "Gained proficiency in Python, Java, and PostGreSQL through graded assignments and proctored exams.",
      "Collaborated with peers from across India on group projects."
    ],
    icon: BookOpen,
    color: 'text-purple-300',
    logo: '/logos/iitm.png',
    glow: 'hover:border-purple-400',
  },
  {
    id: 6,
    degree: 'Foundation in Data Science',
    institution: 'IIT Madras (BS Degree)',
    year: 'Completed',
    score: 'Verified completion',
    certSlug: 'iitm-bs-foundation',
    description: 'Gained strong fundamentals in Mathematics, Statistics, and Python.',
    details: [
      "Mastered Computational Thinking and Mathematics for Data Science.",
      "Completed intensive courses in Statistics I & II, building a base for ML.",
      "Passed rigorous in-person quizzes and end-term exams at designated centers.",
      "Learned to analyze real-world datasets using Python libraries like Pandas and NumPy."
    ],
    icon: Award,
    color: 'text-emerald-400',
    logo: '/logos/iitm.png',
    glow: 'hover:border-emerald-400',
  },
  {
    id: 4,
    degree: 'Class XII (CBSE)',
    institution: "Swamy's School",
    year: 'Completed',
    score: '95.8% (School Rank 3)',
    description: 'School Topper in Mathematics. Excellence in Physics, Chemistry and Computer Science.',
    details: [
      "Secured School Rank 3 with an aggregate of 95.8%.",
      "Subject Topper in Mathematics for scoring 95/100.",
      "Scored 98/100 in Computer Science, demonstrating early aptitude for coding.",
      "Won medals in inter-school Maths olympiads and quizzes."
    ],
    icon: Star,
    color: 'text-blue-300',
    logo: '/logos/school.png',
    glow: 'hover:border-blue-400',
  },
  {
    id: 5,
    degree: 'Class X (CBSE)',
    institution: "Swamy's School",
    year: 'Completed',
    score: '97.4% (School Topper)',
    description: 'Foundation for strong analytical and problem-solving skills.',
    details: [
      "School Topper (Rank 1) with 97.4%.",
      "Scored 100/100 in Tamil and 99/100 in Science,English.",
      "Claimed the 'Best Student Award' for academic and extracurricular excellence.",
      "Built a strong foundation in logical and analytical reasoning."
    ],
    icon: Star,
    color: 'text-orange-400',
    logo: '/logos/school.png',
    glow: 'hover:border-orange-400',
  },
];

// Lift-on-hover card (no tilt / 3D rotation)
const TiltCard = ({ children, className, onClick }: any) => (
  <LiftCard cue onClick={onClick} className={`!bg-[#1E293B] !border-[#334155] ${className}`}>
    {children}
  </LiftCard>
);

const Education = () => {
  const [selectedEdu, setSelectedEdu] = useState<EducationItem | null>(null);

  useEffect(() => {
    if (selectedEdu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedEdu]);

  return (
    <section id="education" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title animate-slide-up">
            Academic <span className="gradient-text">Journey</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            My educational background and milestones
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationData.map((edu, index) => (
            <div
              key={edu.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TiltCard
                onClick={() => setSelectedEdu(edu)}
                className={`${edu.glow} h-full flex flex-col md:flex-row gap-6 items-start md:items-center overflow-hidden p-6 md:p-8`}
              >
                {/* --- HIGHLIGHT GRADIENT --- */}
                {/* Visible on Hover for that "Light Behind" effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${edu.color.replace('text-', 'from-').split(' ')[0]}/20 via-transparent to-transparent pointer-events-none`} />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

                {/* Watermark Icon */}
                <edu.icon
                  strokeWidth={1}
                  className={`absolute -right-6 -top-6 w-32 h-32 opacity-5 group-hover:opacity-10 transition-all duration-500 -rotate-12 ${edu.color.split(' ')[0]}`}
                />

                <div className="flex-1 order-2 md:order-1 relative z-10 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-3 justify-center md:justify-start">
                    <span className="text-xs font-mono text-[#E2E8F0] bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Calendar size={12} />
                      {edu.year}
                    </span>
                    {edu.score && (
                      <span className={`text-xs font-bold ${edu.color} bg-white/10 px-2.5 py-1 rounded-full`}>
                        {edu.score}
                      </span>
                    )}
                  </div>

                  {/* Increased Font Size */}
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white transition-colors text-center md:text-left">
                    {edu.degree}
                  </h3>
                  <p className="text-base font-medium text-[#94A3B8] mb-4 text-center md:text-left">
                    {edu.institution}
                  </p>

                  <p className="text-sm text-[#E2E8F0] leading-relaxed line-clamp-2 text-center md:text-left">
                    {edu.description}
                  </p>

                  <div className="text-center md:text-left">
                    <span className="inline-flex mt-4 text-xs font-medium text-white/50 group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary items-center gap-1">
                      Click to view details <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>

                <div className="order-1 md:order-2 shrink-0 relative z-10 self-center md:self-auto">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${edu.color} flex items-center justify-center p-4 bg-white/5 border border-[#334155] group-hover:scale-110 transition-transform duration-300`}>
                    {edu.logo ? (
                      <img
                        src={edu.logo}
                        alt={edu.institution}
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    ) : (
                      <edu.icon size={32} strokeWidth={1.5} />
                    )}
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>

      {/* --- EXPANDED DETAILS MODAL --- */}
      {selectedEdu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedEdu(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">

            <div className="relative p-5 sm:p-6 md:p-8 border-b border-white/10 bg-white/5">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedEdu(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-start gap-4 sm:gap-5 pr-10">
                <div className={`w-16 h-16 rounded-xl ${selectedEdu.color} flex items-center justify-center p-3.5 bg-black/40 border border-white/10 shrink-0`}>
                  {selectedEdu.logo ? (
                    <img src={selectedEdu.logo} alt="logo" className="w-full h-full object-contain" />
                  ) : (
                    <selectedEdu.icon size={32} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedEdu.degree}</h3>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium mb-3">
                    <MapPin size={14} />
                    {selectedEdu.institution}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded text-white/80">
                      {selectedEdu.year}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded bg-white/5 border border-white/5 ${selectedEdu.color}`}>
                      {selectedEdu.score}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <ScrollHint outerClassName="min-h-0 flex-1" className="p-6 md:p-8">
              {selectedEdu.certSlug && certBySlug(selectedEdu.certSlug) && (
                <div className="mb-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" /> Verify this
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">
                    {certBySlug(selectedEdu.certSlug)!.kind} dated {certBySlug(selectedEdu.certSlug)!.date}. Document ID {certBySlug(selectedEdu.certSlug)!.credentialId}.
                  </p>
                  <ProofRow item={certBySlug(selectedEdu.certSlug)!} />
                </div>
              )}
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Key Highlights
              </h4>
              <ul className="space-y-4">
                {selectedEdu.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${selectedEdu.color}`} />
                    <span className="text-sm leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </ScrollHint>

          </div>
        </div>
      )}

    </section>
  );
};

export default Education;