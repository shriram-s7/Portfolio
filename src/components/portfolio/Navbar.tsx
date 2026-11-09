import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Hackathons', href: '#hackathon' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Auto-detect active section for highlighting
      const sections = navLinks.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-card py-3' : 'py-5'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#home" className="text-xl font-display font-bold gradient-text">
          S Shriram
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.href.substring(1))}
                // --- HOVER HIGHLIGHT LOGIC ---
                className={`
                  text-sm font-medium px-4 py-2 rounded-full transition-all duration-300
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' // Active State
                    : 'text-muted-foreground hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20' // Hover State
                  }
                `}
              >
                {link.name}
              </a>
            );
          })}

          {/* Resume Button - REDIRECTS BELOW TO #CONTACT */}
          <a
            href="#contact"
            onClick={() => setActiveSection('contact')}
            className="ml-4 btn-primary text-sm py-2 px-5 rounded-full shadow-lg hover:shadow-primary/25 flex items-center gap-2"
          >
            <Download size={16} />
            Resume
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Toggle menu" className="lg:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-card mt-2 mx-4 rounded-xl p-4 animate-scale-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-white hover:bg-primary/20 px-4 py-3 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Resume Button */}
            <a
              href="#contact"
              className="btn-primary text-sm py-3 justify-center mt-2 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: 'smooth'
                });
              }}
            >
              <Download size={16} />
              Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;