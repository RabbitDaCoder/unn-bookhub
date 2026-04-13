import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/books';
import { useIsMobile } from '../hooks/useIsMobile';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export default function Home() {
  const isMobile = useIsMobile();

  const featured = useMemo(
    () => books.filter((b) => b.featured).slice(0, 8),
    [],
  );

  const testimonials = [
    {
      name: 'Chika, Computer Science',
      quote:
        'Ordering COS textbooks has become effortless. The delivery to my hostel was same-day.',
    },
    {
      name: 'Amarachi, Law',
      quote:
        'The curated list by course code means I never buy the wrong edition anymore.',
    },
    {
      name: 'Femi, Medicine',
      quote:
        'Great UX on mobile; the amber accents make it easy to spot important info.',
    },
  ];

  const stats = [
    { label: 'Departments', value: '45+' },
    { label: 'Active students', value: '25k+' },
    { label: 'Texts in stock', value: '430+' },
  ];

  const steps = [
    {
      title: 'Search by course code',
      description: 'Filter by faculty, see matching editions, and compare prices instantly.',
    },
    {
      title: 'Add to cart',
      description: 'Save multiple books and switch between hostel or department pickup.',
    },
    {
      title: 'Place order',
      description: 'Share delivery details; payment is arranged via WhatsApp or call.',
    },
    {
      title: 'Receive & review',
      description: 'Get your books, confirm condition, and leave quick feedback.',
    },
  ];

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <section
        style={{
          padding: isMobile ? '80px 20px' : '120px 0',
          background: 'radial-gradient(circle at 10% 20%, rgba(245,158,11,0.08), transparent 35%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.04), transparent 30%), linear-gradient(135deg, #0f172a 0%, #0b1222 100%)',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 999,
                width: 'fit-content',
                color: '#f59e0b',
                fontWeight: 700,
                letterSpacing: 0.8,
                fontSize: 12,
              }}
            >
              Official UNN BookHub
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              All your UNN course books.
              <span style={{ color: '#f59e0b' }}> Zero guesswork.</span>
            </h1>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(15px, 2.5vw, 18px)',
                maxWidth: 640,
              }}
            >
              Browse by course code, faculty, or featured picks. We deliver to hostels and departments across Nsukka campus.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 12,
              }}
            >
              <Link
                to="/books"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0f172a',
                  padding: isMobile ? '14px 18px' : '16px 24px',
                  borderRadius: 14,
                  fontWeight: 800,
                  textAlign: 'center',
                  boxShadow: '0 15px 45px rgba(245,158,11,0.35)',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                Browse Bookstore
              </Link>
              <Link
                to="/library"
                style={{
                  border: '1px solid var(--border-default)',
                  color: '#f1f5f9',
                  padding: isMobile ? '14px 18px' : '16px 24px',
                  borderRadius: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                  width: isMobile ? '100%' : 'auto',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                Enter E-Library
              </Link>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #162032 100%)',
              border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: 20,
              padding: isMobile ? 20 : 28,
              boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {featured.slice(0, isMobile ? 2 : 4).map((book) => (
                <div
                  key={book.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: 14,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 56,
                      borderRadius: 8,
                      background: book.coverColor,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
                      {book.title}
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {book.courseCode}
                    </div>
                  </div>
                  <div style={{ color: '#fcd34d', fontWeight: 800, fontSize: 12 }}>
                    {currency.format(book.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '48px 0', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 6 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', flexDirection: isMobile ? 'column' : 'row', gap: 12, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>How it works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Four simple steps to get the right book on time.</p>
          </div>
          <Link to="/books" style={{ color: '#f59e0b', fontWeight: 700 }}>Shop now ?</Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={step.title}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(245,158,11,0.15)',
                  border: '2px solid rgba(245,158,11,0.4)',
                  color: '#f59e0b',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: 16,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>{step.title}</div>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 0 64px' }}>
        <div className="container" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Featured books</h2>
          {!isMobile && <span style={{ color: 'var(--text-muted)' }}>Swipe to explore</span>}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            padding: '0 20px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {featured.map((book) => (
            <div
              key={book.id}
              style={{
                minWidth: isMobile ? 'calc(50% - 8px)' : 220,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                padding: 16,
                scrollSnapAlign: 'start',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  height: 160,
                  borderRadius: 12,
                  background: book.coverColor,
                  marginBottom: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>
                {book.title}
              </div>
              <div style={{ color: '#f59e0b', fontSize: 12, fontWeight: 700, marginTop: 4 }}>
                {book.courseCode}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 6 }}>
                {book.author}
              </div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>
                  {currency.format(book.price)}
                </span>
                <Link
                  to={`/books/${book.id}`}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b',
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 72 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Students love BookHub</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real feedback from UNN students.</p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                minWidth: isMobile ? '90%' : '32%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                padding: 20,
                scrollSnapAlign: 'start',
              }}
            >
              <div style={{ color: '#fcd34d', fontWeight: 800, marginBottom: 10 }}>“</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t.quote}</p>
              <div style={{ color: '#f1f5f9', fontWeight: 700, marginTop: 12 }}>{t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
