import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookCover } from './ui/BookCover';
import { useCartStore } from '../store/useStore';
import type { Book } from '../data/books';

export function BookCard({ book }: { book: Book }) {
  const navigate = useNavigate();
  const { addItem, items } = useCartStore();
  const [adding, setAdding] = useState(false);
  const inCart = items.some((i) => i.id === book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart || !book.inStock) return;
    setAdding(true);
    addItem(book as any);
    setTimeout(() => setAdding(false), 450);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.transform = 'translateY(-4px)';
        target.style.boxShadow = 'var(--shadow-card-strong)';
        target.style.borderColor = 'var(--border-amber)';
        target.style.background = 'var(--bg-card-hover)';
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget as HTMLDivElement;
        t.style.transform = 'translateY(0)';
        t.style.boxShadow = 'var(--shadow-card)';
        t.style.borderColor = 'var(--border-subtle)';
        t.style.background = 'var(--bg-card)';
      }}
    >
      {!book.inStock && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            background: 'rgba(248,113,113,0.18)',
            border: '1px solid rgba(248,113,113,0.35)',
            color: 'var(--error)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            padding: '3px 10px',
            borderRadius: '999px',
            textTransform: 'uppercase',
          }}
        >
          Out of Stock
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 180,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-faint)',
        }}
      >
        <BookCover
          courseCode={book.courseCode}
          title={book.title}
          color={book.coverColor}
          size="md"
        />
      </div>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span
            style={{
              background: 'rgba(245,158,11,0.12)',
              color: 'var(--text-amber)',
              border: '1px solid var(--border-amber)',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1,
              padding: '3px 9px',
              borderRadius: 999,
              textTransform: 'uppercase',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {book.courseCode}
          </span>
          {book.inStock && (
            <span className="badge badge-success">In Stock</span>
          )}
        </div>

        <h3
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: 'var(--text-1)',
            lineHeight: 1.4,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {book.title}
        </h3>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {book.author} · {book.edition}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>
            {formatPrice(book.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!book.inStock}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              border: '1px solid var(--border-amber)',
              background: inCart ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
              color: inCart ? 'var(--success)' : 'var(--text-amber)',
              cursor: book.inStock ? 'pointer' : 'not-allowed',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 16,
              transition: 'transform 0.15s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            title={inCart ? 'In cart' : 'Add to cart'}
          >
            {adding ? '…' : inCart ? '?' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
