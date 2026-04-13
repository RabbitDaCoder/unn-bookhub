import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const badge = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(245,158,11,0.12)',
    border: '1px solid rgba(245,158,11,0.25)',
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
  } as const;

  const linkStyle = { color: 'var(--text-secondary)', textDecoration: 'none' } as const;

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-strong)',
        color: 'var(--text-primary)',
        marginTop: 48,
      }}
    >
      <div className="container" style={{ padding: '32px 0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'grid',
                placeItems: 'center',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              ??
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>UNN BookHub</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>University of Nigeria, Nsukka</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            “To restore the dignity of man” — delivering trusted course texts and library access with a modern, mobile-first experience.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-default)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--text-primary)',
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 10 }}>Quick Links</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            {[{ n: 'Bookstore', p: '/books' }, { n: 'Library', p: '/library' }, { n: 'Dashboard', p: '/dashboard' }, { n: 'Complaints', p: '/complaints/new' }].map((l) => (
              <Link key={l.p} to={l.p} style={linkStyle}>
                {l.n}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <h4 style={{ fontSize: 15, fontWeight: 800 }}>Contact</h4>
          <div style={badge}><MapPin size={14} /> Nsukka campus, Enugu State</div>
          <div style={badge}><Phone size={14} /> +234 800-BOOK-UNN</div>
          <div style={badge}><Mail size={14} /> support@bookhub.unn.edu.ng</div>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <h4 style={{ fontSize: 15, fontWeight: 800 }}>Stay Updated</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Get alerts on new arrivals and library updates.</p>
          <input
            type="email"
            placeholder="Student email"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 10,
              padding: '10px 12px',
              color: 'var(--text-primary)',
            }}
          />
          <button
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              padding: '10px 12px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Subscribe
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 11, color: 'var(--text-secondary)' }}>
          <span>© {new Date().getFullYear()} UNN BookHub. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#" style={linkStyle}>Privacy</a>
            <a href="#" style={linkStyle}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
