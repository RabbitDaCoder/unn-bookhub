import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookCover } from '../components/ui/BookCover';
import { books } from '../data/books';
import { useCartStore } from '../store/useStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { ShoppingCart, ArrowLeft, CheckCircle, Clock3, Truck, Info, Sparkles } from 'lucide-react';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile(900);
  const { addItem, items } = useCartStore();

  const book = useMemo(() => books.find((b) => b.id === id), [id]);
  const inCart = items.some((i) => i.id === book?.id);

  if (!book) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          gap: 12,
          color: 'var(--text-primary)',
          padding: '32px 16px',
        }}
      >
        <div style={{ fontSize: 48 }}>??</div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Book not found</h1>
        <p style={{ color: 'var(--text-muted)' }}>Try browsing the bookstore or pick a different title.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
          <Link
            to="/books"
            style={{
              background: '#f59e0b',
              color: '#0f172a',
              padding: '10px 16px',
              borderRadius: 10,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Browse Bookstore ?
          </Link>
        </div>
      </div>
    );
  }

  const metaItems: { label: string; value: string | number | undefined }[] = [
    { label: 'Course code', value: book.courseCode },
    { label: 'Department', value: book.department },
    { label: 'Faculty', value: book.faculty },
    { label: 'Edition', value: book.edition },
    { label: 'Pages', value: book.pages },
  ];

  const related = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: isMobile ? '20px 0 40px' : '32px 0 48px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
            background: 'rgba(255,255,255,0.04)',
            padding: '8px 12px',
            borderRadius: 10,
            cursor: 'pointer',
            marginBottom: 18,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
            gap: 24,
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 18,
                padding: isMobile ? 16 : 20,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BookCover
                  courseCode={book.courseCode}
                  title={book.title}
                  color={book.coverColor}
                  size={isMobile ? 'md' : 'lg'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-amber">{book.courseCode}</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                    {book.category}
                  </span>
                  {book.inStock ? (
                    <span className="badge badge-success">In stock</span>
                  ) : (
                    <span className="badge badge-error">Out of stock</span>
                  )}
                </div>

                <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, lineHeight: 1.25 }}>
                  {book.title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                  {book.description}
                </p>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Author</p>
                    <p style={{ fontWeight: 700 }}>{book.author}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Edition</p>
                    <p style={{ fontWeight: 700 }}>{book.edition}</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 18,
                padding: 20,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0,1fr))',
                gap: 12,
              }}
            >
              {metaItems.map((m) => (
                <div key={m.label} style={{ padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</p>
                  <p style={{ fontWeight: 700 }}>{m.value}</p>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 18,
                padding: 20,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))',
                gap: 16,
              }}
            >
              <InfoCard
                icon={<Truck size={16} color="#f59e0b" />}
                title="Delivery"
                body="Hostel / Department drop-off. Same-day on campus; next-day off-campus within Nsukka."
              />
              <InfoCard
                icon={<Clock3 size={16} color="#f59e0b" />}
                title="Returns"
                body="48-hour quality check window. Report wrong edition or damage for replacement."
              />
            </div>
          </div>

          {/* Right column sticky card */}
          <div
            style={{
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? undefined : 88,
              alignSelf: 'start',
            }}
          >
            <div
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 18,
                padding: 20,
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Price</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#f59e0b', fontSize: 26, fontWeight: 800 }}>{currency.format(book.price)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>/ copy</span>
                </div>
              </div>

              <button
                onClick={() => addItem(book as any)}
                disabled={!book.inStock}
                style={{
                  background: book.inStock ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255,255,255,0.05)',
                  color: book.inStock ? '#0f172a' : '#64748b',
                  border: 'none',
                  padding: '14px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: book.inStock ? 'pointer' : 'not-allowed',
                  boxShadow: book.inStock ? '0 12px 28px rgba(245,158,11,0.25)' : 'none',
                  transition: 'transform 0.15s, opacity 0.2s',
                }}
              >
                {book.inStock ? (inCart ? 'In cart ?' : 'Add to cart') : 'Out of stock'}
              </button>

              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                ?? We’ll confirm availability via WhatsApp and arrange payment (transfer or COD).
              </div>

              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, display: 'grid', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Course</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{book.courseCode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Faculty</span>
                  <span style={{ color: '#fcd34d', fontWeight: 700 }}>{book.faculty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Category</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>{book.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={16} color="#f59e0b" />
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Related books</h3>
              </div>
              <Link to="/books" style={{ color: '#f59e0b', fontWeight: 700 }}>Browse all ?</Link>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))',
                gap: 12,
              }}
            >
              {related.map((b) => (
                <Link
                  key={b.id}
                  to={`/books/${b.id}`}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <BookCover
                      courseCode={b.courseCode}
                      title={b.title}
                      color={b.coverColor}
                      size="sm"
                    />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.35 }}>{b.title}</div>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 12 }}>{currency.format(b.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-default)', display: 'flex', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'grid', placeItems: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{body}</p>
      </div>
    </div>
  );
}
