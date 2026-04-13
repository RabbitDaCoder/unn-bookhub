import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../store/useStore';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 900;

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [level, setLevel] = useState('');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = items.length ? 800 : 0;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      clearCart();
    }, 900);
  };

  if (items.length === 0 && !placed) {
    return (
      <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', gap: 12, textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>??</div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Your cart is empty</h2>
        <Link to="/books" style={{ color: '#f59e0b', fontWeight: 700 }}>Return to Bookstore</Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center', maxWidth: 720 }}>
        <div style={{ fontSize: 48 }}>?</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>Order placed</h1>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>
          We will contact you via WhatsApp or phone to confirm availability and arrange payment.
        </p>
        <div style={{ marginTop: 16 }}>
          <Link to="/dashboard" style={{ color: '#f59e0b', fontWeight: 700, marginRight: 12 }}>Go to dashboard</Link>
          <Link to="/books" style={{ color: '#f1f5f9', fontWeight: 700 }}>Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '28px 0 48px', display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1.5fr 1fr', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            background: 'rgba(245,158,11,0.07)',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '0 12px 12px 0',
            padding: '16px 20px',
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fcd34d', fontWeight: 700 }}>
            <span style={{ fontSize: 18 }}>??</span>
            <span>How Payment Works</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
            After placing your order, our team will reach out via WhatsApp or phone call to confirm book availability and arrange payment. We accept bank transfer and cash on delivery.
          </p>
        </div>

        <Section title="Delivery Information">
          <Field label="Full Name" required>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Eg. Adaeze Okafor" />
          </Field>
          <Field label="Phone Number" required>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" />
          </Field>
          <Field label="Hostel / Address" required>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Room 204, Alvan Ikoku Hostel or Department office"
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'repeat(2,1fr)', gap: 12 }}>
            <Field label="Level" required>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="">Select level</option>
                <option value="100L">100L</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>
                <option value="500L">500L</option>
                <option value="500L+">500L+</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </Field>
            <Field label="Additional Note">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional delivery note" />
            </Field>
          </div>
        </Section>

        <Section title="Contact & Confirmation">
          <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
            Keep your phone reachable. If we cannot reach you within 24 hours, your order may be cancelled. Payment is confirmed only after we speak with you.
          </p>
        </Section>

        <button
          onClick={handlePlaceOrder}
          disabled={!fullName || !phone || !address || !level || placing}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#0f172a',
            border: 'none',
            padding: '16px 32px',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            width: '100%',
            cursor: placing ? 'wait' : 'pointer',
            boxShadow: '0 8px 32px rgba(245,158,11,0.25)',
            transition: 'all 0.2s',
            opacity: placing ? 0.8 : 1,
          }}
        >
          {placing ? 'Placing order…' : `Place Order — ${currency.format(subtotal + delivery)}`}
        </button>
      </div>

      <aside
        style={{
          background: '#1e293b',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16,
          padding: 24,
          position: isNarrow ? 'static' : 'sticky',
          top: 80,
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 700 }}>Order Summary</h3>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

        <div style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 6 }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 60,
                  borderRadius: 8,
                  background: item.coverColor,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                  {item.title}
                </div>
                <div className="badge badge-amber" style={{ marginTop: 6 }}>{item.courseCode}</div>
              </div>
              <div style={{ color: '#f59e0b', fontWeight: 700 }}>
                {item.quantity} x {currency.format(item.price)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#94a3b8', fontSize: 14 }}>
          <span>Subtotal</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{currency.format(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#94a3b8', fontSize: 14 }}>
          <span>Delivery</span>
          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{currency.format(delivery)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 10,
            borderTop: '2px solid rgba(255,255,255,0.1)',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>Total</span>
          <span style={{ color: '#f59e0b', fontSize: 22, fontWeight: 800 }}>
            {currency.format(subtotal + delivery)}
          </span>
        </div>
        <div style={{ color: '#64748b', fontSize: 11 }}>Flat rate · Delivered to your hostel/address</div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          color: '#f1f5f9',
          fontSize: 16,
          fontWeight: 700,
          paddingBottom: 12,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
      <span
        style={{
          color: '#94a3b8',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.3px',
          textTransform: 'uppercase',
        }}
      >
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </span>
      {children}
    </label>
  );
}
