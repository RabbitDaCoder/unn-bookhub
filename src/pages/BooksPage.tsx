import React, { useEffect, useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import { books } from '../data/books';
import { useIsMobile } from '../hooks/useIsMobile';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export default function BooksPage() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceCap, setPriceCap] = useState(10000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sheetOpen]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(books.map((b) => b.category))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return books
      .filter((b) => {
        const matchesSearch = normalizedSearch
          ? `${b.title} ${b.author} ${b.courseCode}`.toLowerCase().includes(normalizedSearch)
          : true;
        const matchesCategory = category === 'All' || b.category === category;
        const matchesPrice = b.price <= priceCap;
        const matchesStock = !inStockOnly || b.inStock;
        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sort === 'priceAsc') return a.price - b.price;
        if (sort === 'priceDesc') return b.price - a.price;
        if (sort === 'title') return a.title.localeCompare(b.title);
        return Number(b.featured) - Number(a.featured);
      });
  }, [search, category, priceCap, inStockOnly, sort]);

  const activeFilters = [category !== 'All', priceCap < 10000, inStockOnly, !!search, sort !== 'featured'].filter(Boolean).length;

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label style={sectionLabelStyle}>Search</label>
        <input
          type="search"
          placeholder="Title, author, course code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            marginTop: 8,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            padding: '12px 14px',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div>
        <span style={sectionLabelStyle}>Category</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {categories.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                  border: active
                    ? '1px solid rgba(245,158,11,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: active ? '#f59e0b' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span style={sectionLabelStyle}>Price range</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: 'var(--text-muted)', fontSize: 12 }}>
          <span>?0</span>
          <span>?10,000</span>
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={priceCap}
          onChange={(e) => setPriceCap(Number(e.target.value))}
          style={{ width: '100%', marginTop: 10, accentColor: '#f59e0b' }}
        />
        <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12, marginTop: 6 }}>
          Max: {currency.format(priceCap)}
        </div>
      </div>

      <div>
        <span style={sectionLabelStyle}>In Stock</span>
        <div
          onClick={() => setInStockOnly((v) => !v)}
          style={{
            marginTop: 10,
            width: 52,
            height: 28,
            borderRadius: 14,
            background: inStockOnly ? '#f59e0b' : '#334155',
            padding: 3,
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: 3,
              left: inStockOnly ? 27 : 3,
              transition: 'left 0.2s',
            }}
          />
        </div>
      </div>

      <div>
        <span style={sectionLabelStyle}>Sort</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            marginTop: 8,
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid var(--border-default)',
            padding: '10px 12px',
            borderRadius: 10,
          }}
        >
          <option value="featured">Featured</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      <button
        onClick={() => {
          setSearch('');
          setCategory('All');
          setPriceCap(10000);
          setInStockOnly(false);
          setSort('featured');
        }}
        style={{
          background: 'transparent',
          border: '1px solid rgba(248,113,113,0.3)',
          color: '#f87171',
          width: '100%',
          padding: 8,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Clear filters
      </button>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div className="container" style={{ paddingTop: 28, paddingBottom: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0' }}>
          <p style={{ color: '#94a3b8', letterSpacing: 1.6, fontSize: 12, textTransform: 'uppercase' }}>Bookstore</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Browse official UNN course books</h1>
            <div style={{ color: '#64748b', fontSize: 13 }}>
              Showing {filtered.length} of {books.length} books
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 50,
            background: '#1e293b',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              color: '#f59e0b',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Filters
            {activeFilters > 0 && (
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0f172a',
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {activeFilters}
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              flex: 1,
              background: '#0f172a',
              color: '#f1f5f9',
              border: '1px solid var(--border-default)',
              padding: '10px 12px',
              borderRadius: 8,
            }}
          >
            <option value="featured">Featured</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      )}

      <div className="container" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: 20, paddingBottom: 48 }}>
        {!isMobile && (
          <aside
            style={{
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: 20,
              position: 'sticky',
              top: 90,
              height: 'fit-content',
            }}
          >
            <span style={sectionLabelStyle}>Filters</span>
            <div style={{ marginTop: 12 }}>{filterContent}</div>
          </aside>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  background: '#0f172a',
                  color: '#f1f5f9',
                  border: '1px solid var(--border-default)',
                  padding: '10px 12px',
                  borderRadius: 10,
                  minWidth: 180,
                }}
              >
                <option value="featured">Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fill, minmax(195px, 1fr))',
              gap: isMobile ? 12 : 16,
            }}
          >
            {filtered.map((book) => (
              <BookCard key={book.id} book={book as any} />
            ))}
          </div>
        </div>
      </div>

      {sheetOpen && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
          onClick={() => setSheetOpen(false)}
        >
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#1e293b',
              borderRadius: '20px 20px 0 0',
              padding: 20,
              maxHeight: '80vh',
              overflowY: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: '#475569',
                borderRadius: 2,
                margin: '0 auto 20px',
              }}
            />
            {filterContent}
          </div>
        </div>
      )}
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  color: '#f59e0b',
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  marginBottom: 10,
  display: 'block',
};
