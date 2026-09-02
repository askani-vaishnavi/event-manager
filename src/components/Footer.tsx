import { Sparkles, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const sections = [
    { title: 'Platform', links: ['Explore Events', 'For Organizers', 'Pricing', 'Mobile App'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press Kit'] },
    { title: 'Support', links: ['Help Center', 'Contact Us', 'Refund Policy', 'Terms of Service'] },
  ];

  return (
    <footer className="mt-20 border-t border-[rgb(var(--border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Eventra</span>
            </div>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              Where moments become experiences. Discover, book, and manage unforgettable events all in one platform.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg surface flex items-center justify-center hover:surface-2 transition-colors">
                  <Icon className="w-4 h-4 text-muted" />
                </button>
              ))}
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-semibold text-sm mb-3">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted hover:text-[rgb(var(--text))] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[rgb(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">© 2026 Eventra. All rights reserved.</p>
          <p className="text-xs text-muted">Made with passion for event creators.</p>
        </div>
      </div>
    </footer>
  );
}
