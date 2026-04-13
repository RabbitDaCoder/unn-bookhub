import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useUIStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Footer() {
  const { isDarkMode } = useUIStore();

  return (
    <footer className={cn(
      "border-t pt-16 pb-8 transition-colors duration-300",
      isDarkMode ? "bg-bg-dark border-primary/20 text-white" : "bg-bg-cream border-border text-text-dark"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src="https://upload.wikimedia.org/wikipedia/en/5/5e/University_of_Nigeria_Nsukka_logo.png" alt="UNN Logo" className="h-12 w-12 object-contain" referrerPolicy="no-referrer" />
              <div>
                <h2 className="text-xl font-display font-bold leading-tight">UNN BookHub</h2>
                <p className="text-[10px] uppercase tracking-widest opacity-70">University of Nigeria, Nsukka</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-80 italic">
              "To restore the dignity of man" — Providing students and faculty with the highest quality academic resources through a modern, accessible digital platform.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-primary/10 hover:bg-primary hover:text-white rounded-full transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 border-b-2 border-secondary w-fit">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'Browse Bookshelf', path: '/bookshelf' },
                { name: 'Nnamdi Azikiwe Library', path: '/library' },
                { name: 'Author Directory', path: '/authors' },
                { name: 'Student Dashboard', path: '/dashboard' },
                { name: 'File a Complaint', path: '/complaints/new' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-secondary transition-colors flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 border-b-2 border-secondary w-fit">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span className="opacity-80">University of Nigeria, Nsukka, Enugu State, Nigeria.</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span className="opacity-80">+234 (0) 800 UNN BOOK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span className="opacity-80">support@bookhub.unn.edu.ng</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 border-b-2 border-secondary w-fit">Stay Updated</h3>
            <p className="text-sm mb-4 opacity-80">Subscribe to get notifications about new arrivals and library updates.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Student Email" 
                className="w-full bg-white/5 border border-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary transition-colors"
                required
              />
              <button className="w-full bg-primary hover:bg-primary-light text-white py-2 rounded-lg text-sm font-bold transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-widest opacity-60">
          <p>© {new Date().getFullYear()} University of Nigeria, Nsukka. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            <a href="https://unn.edu.ng" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-secondary transition-colors">
              <span>UNN Official Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
