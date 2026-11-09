import { Mail, Phone, Linkedin, Github, Download, MapPin, Code2, BadgeCheck } from 'lucide-react';
import profile from '@/data/profile.json';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'shriram0981234@gmail.com',
    href: 'mailto:shriram0981234@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 9345598380',
    href: 'tel:+919345598380',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Chennai, India',
    href: null,
  },
];

const socialLinks = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: profile.links.linkedin,
  },
  {
    icon: Github,
    label: 'GitHub',
    href: profile.links.github,
  },
  {
    icon: Code2,
    label: 'LeetCode',
    href: profile.links.leetcode,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-10 relative overflow-hidden">
      <div className="glow-effect w-[500px] h-[500px] bg-primary bottom-0 right-0 animate-pulse-glow" />
      <div className="glow-effect w-[400px] h-[400px] bg-secondary top-0 left-0 animate-pulse-glow animation-delay-300" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title animate-slide-up">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle animate-slide-up animation-delay-100">
            Let's connect and discuss opportunities
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 animate-scale-in animation-delay-200">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="font-display font-semibold text-xl mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h4 className="font-medium text-sm text-muted-foreground mb-4">Connect with me</h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-muted/50 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col justify-center">
                <div className="text-center md:text-left">
                  <h3 className="font-display font-semibold text-xl mb-4">
                    Open to Opportunities
                  </h3>
                  {/* Fixed: Removed text-justify */}
                  <p className="text-muted-foreground mb-8">
                    Actively seeking internship opportunities in Full Stack Development, 
                    AI, and Data-Driven Systems. Let's build something amazing together!
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {/* Real Download Button */}
                    <a 
                      href="/resume.pdf" 
                      download="S_Shriram_Resume.pdf"
                      className="btn-primary"
                    >
                      <Download size={18} />
                      Download Resume
                    </a>
                    <a
                      href="mailto:shriram0981234@gmail.com"
                      className="btn-secondary"
                    >
                      <Mail size={18} />
                      Send Email
                    </a>
                  </div>
                  <div className="mt-4 flex justify-center md:justify-start">
                    <a
                      href="/verify/"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30 transition-colors duration-300"
                    >
                      <BadgeCheck size={16} />
                      Verify Credentials
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;