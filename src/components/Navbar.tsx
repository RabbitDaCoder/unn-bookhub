import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store/useStore';
import { logOut } from '../firebase';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, loading } = useAuthStore();
  const { totalItems } = useCartStore();
  const isMobile = useIsMobile(900);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Bookstore', to: '/books' },
      { label: 'Library', to: '/library' },
      { label: 'Dashboard', to: '/dashboard', auth: true },
      { label: 'Orders', to: '/orders', auth: true },
    ],
    [],
  );

  const isActive = (path: string) => location.pathname === path;

  const brand = (
    <Link
      to="/"
      style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
      onClick={() => setMenuOpen(false)}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
          display: 'grid',
          placeItems: 'center',
          color: '#0f172a',
          fontWeight: 800,
          boxShadow: '0 10px 28px rgba(245,158,11,0.25)',
        }}
      >
        ??
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: 'var(--text-1)', fontWeight: 800, fontSize: 17 }}>UNN BookHub</span>
        <span style={{ color: 'var(--text-3)', fontSize: 11, letterSpacing: 0.4 }}>University of Nigeria</span>
      </div>
    </Link>
  );

  const NavLinks = ({ variant }: { variant: 'desktop' | 'mobile' }) => (
    <>
      {links
        .filter((l) => !l.auth || user)
        .map((link) => (
          <button
            key={link.to}
            onClick={() => {
              setMenuOpen(false);
              navigate(link.to);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isActive(link.to) ? 'var(--text-amber)' : 'var(--text-1)',
              padding: variant === 'desktop' ? '10px 12px' : '16px 0',
              borderBottom: variant === 'mobile' ? '1px solid var(--border-faint)' : 'none',
              textAlign: variant === 'mobile' ? 'left' : 'center',
              width: variant === 'mobile' ? '100%' : 'auto',
              fontSize: variant === 'mobile' ? 22 : 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {link.label}
          </button>
        ))}
    </>
  );

  const hamburger = (
    <button
      aria-label="Toggle navigation"
      onClick={() => setMenuOpen((v) => !v)}
      style={{
        width: 40,
        height: 40,
        background: 'var(--layer-05)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative', width: 18, height: 14 }}>
        {[0, 1, 2].map((i) => {
          const positions = [0, 6, 12];
          const transform = menuOpen
            ? i === 0
              ? 'translateY(6px) rotate(45deg)'
              : i === 1
                ? 'scaleX(0)'
                : 'translateY(-6px) rotate(-45deg)'
            : `translateY(${positions[i]}px)`;
          const opacity = menuOpen && i === 1 ? 0 : 1;
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                width: 18,
                height: 2,
                borderRadius: 999,
                background: 'var(--text-1)',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transform,
                opacity,
              }}
            />
          );
        })}
      </div>
    </button>
  );

  const authArea = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {loading ? (
        <div style={{ width: 90, height: 36, borderRadius: 12, background: 'var(--layer-08)' }} />
      ) : user ? (
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: 'var(--layer-05)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            color: 'var(--text-1)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
              display: 'grid',
              placeItems: 'center',
              color: '#0f172a',
              fontWeight: 800,
            }}
          >
            {(userProfile?.fullName || user.email || 'UN')[0]}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            {userProfile?.fullName?.split(' ')[0] || user.email}
          </span>
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            to="/login"
            style={{
              border: '1px solid var(--border-default)',
              color: 'var(--text-1)',
              padding: '10px 12px',
              borderRadius: 12,
              fontWeight: 700,
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              background: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
              color: '#0f172a',
              padding: '10px 12px',
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 150,
        backdropFilter: 'blur(14px)',
        background: 'rgba(15,23,42,0.92)',
        borderBottom: '1px solid var(--border-faint)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 70,
          gap: 16,
        }}
      >
        {brand}

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavLinks variant="desktop" />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245,158,11,0.12)',
              color: 'var(--text-amber)',
              border: '1px solid var(--border-amber)',
              padding: '10px 12px',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            ??
            <span>{totalItems} items</span>
          </Link>

          {!isMobile && authArea}
          {isMobile && hamburger}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            padding: '80px 32px 32px',
            gap: 10,
          }}
        >
          <NavLinks variant="mobile" />

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  style={{
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-1)',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  View Profile
                </button>
                <button
                  onClick={async () => {
                    await logOut();
                    setMenuOpen(false);
                    navigate('/');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
                    color: '#0f172a',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              authArea
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
