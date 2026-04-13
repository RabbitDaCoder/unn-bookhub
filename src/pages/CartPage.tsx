import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useStore';
import { BookCover } from '../components/ui/BookCover';

const format = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export default function Cart() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();
  const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 900;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = items.length ? 800 : 0;

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64 }}>??</div>
        <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800 }}>
          Your cart is empty
        </h1>
        <p style={{ color: '#64748b' }}>Browse the bookstore to find your course books</p>
        <Link
          to="/books"
          style={{
            background: '#f59e0b',
            color: '#0f172a',
            padding: '12px 18px',
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Browse Bookstore ?
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '28px 0 48px', display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Shopping Cart</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>You have {items.length} item(s) in your cart.</p>
        </div>
        <button
          onClick={clearCart}
          style={{
            background: 'transparent',
            border: '1px solid rgba(248,113,113,0.3)',
            color: '#f87171',
            padding: '8px 12px',
            borderRadius: 10,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Clear cart
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isNarrow ? '1fr' : '1.6fr 1fr',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <BookCover
                courseCode={item.courseCode}
                title={item.title}
                color={item.coverColor}
                size="sm"
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15 }}>
                    {item.title}
                  </span>
                  <span className="badge badge-amber">{item.courseCode}</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{item.author}</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                  style={qtyBtnStyle}
                >
                  -
                </button>
                <div
                  style={{
                    background: '#0f172a',
                    color: '#f1f5f9',
                    fontWeight: 700,
                    fontSize: 14,
                    padding: '0 16px',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 44,
                    textAlign: 'center',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                    borderRight: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {item.quantity}
                </div>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  style={qtyBtnStyle}
                >
                  +
                </button>
              </div>

              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 16 }}>
                  {format.format(item.price * item.quantity)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    marginTop: 6,
                    color: '#64748b',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: 24,
            position: isNarrow ? 'static' : 'sticky',
            top: 80,
            height: 'fit-content',
          }}
        >
          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>Order Summary</h3>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 12 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#94a3b8', fontSize: 14 }}>
            <span>Subtotal</span>
            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{format.format(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#94a3b8', fontSize: 14 }}>
            <span>Delivery</span>
            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{format.format(delivery)}</span>
          </div>
          <div
            style={{
              borderTop: '2px solid rgba(255,255,255,0.1)',
              paddingTop: 14,
              marginTop: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ color: '#f59e0b', fontSize: 22, fontWeight: 800 }}>
              {format.format(subtotal + delivery)}
            </span>
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>
            Flat rate · Delivered to your hostel/address
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              marginTop: 16,
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#d97706')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f59e0b')}
          >
            Proceed to checkout
          </button>

          <div
            style={{
              marginTop: 12,
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#94a3b8',
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            ?? We'll contact you via WhatsApp to arrange payment
          </div>
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  background: '#273548',
  color: '#f1f5f9',
  border: 'none',
  width: 32,
  height: 32,
  cursor: 'pointer',
  fontSize: 16,
  transition: 'background 0.15s',
};
