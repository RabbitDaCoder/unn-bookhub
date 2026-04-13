import { BookOpen, ShoppingCart, Wallet, MessageSquare } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store/useStore';

export default function DashboardPage() {
  const userProfile = useAuthStore((s) => s.userProfile);
  const cart = useCartStore();
  const isTablet = typeof window !== 'undefined' && window.innerWidth <= 1100;
  const isNarrow = typeof window !== 'undefined' && window.innerWidth <= 960;

  const stats = [
    { label: 'Books in Cart', value: cart.totalItems, icon: BookOpen },
    { label: 'Active Orders', value: cart.totalItems ? Math.min(3, cart.totalItems) : 0, icon: ShoppingCart },
    { label: 'Estimated Total', value: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(cart.totalAmount || 0), icon: Wallet },
    { label: 'Support Requests', value: 1, icon: MessageSquare },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <div className="container" style={{ padding: '28px 0 48px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #162032 100%)',
            border: '1px solid rgba(245,158,11,0.15)',
            borderRadius: 20,
            padding: '28px 32px',
            display: 'grid',
            gridTemplateColumns: isNarrow ? '1fr' : '2fr 1fr',
            gap: 16,
          }}
        >
          <div>
            <div style={{ color: '#f1f5f9', fontSize: 26, fontWeight: 800 }}>
              Good day, {userProfile?.fullName?.split(' ')[0] || 'Student'} ??
            </div>
            <div style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
              {userProfile?.email || 'student@unn.edu.ng'} · {userProfile?.role || 'student'}
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="/books"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Browse books
              </a>
              <a
                href="/orders"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f1f5f9',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                View orders
              </a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, alignItems: 'center' }}>
            {stats.slice(0, 2).map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(245,158,11,0.1)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#f59e0b',
                  }}
                >
                  <stat.icon size={20} />
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {stat.label}
                  </div>
                  <div style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 800 }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'repeat(4, minmax(0,1fr))', gap: 14 }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(245,158,11,0.1)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#f59e0b',
                }}
              >
                <stat.icon size={20} />
              </div>
              <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4, marginTop: 10 }}>
                {stat.label}
              </div>
              <div style={{ color: '#f1f5f9', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>Updated just now</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1.3fr 1fr', gap: 16 }}>
          <div
            style={{
              background: '#1e293b',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>Recent activity</h3>
              <span style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}>Live</span>
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {["Order placed", "Profile updated", "Wishlist saved"].map((title, idx) => (
                <div
                  key={title}
                  style={{
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    padding: 14,
                    background: '#0f172a',
                  }}
                >
                  <div style={{ color: '#f1f5f9', fontWeight: 700 }}>{title}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                    {idx === 0
                      ? 'Your book order has been confirmed and is being prepared for delivery.'
                      : idx === 1
                        ? 'Email and department were saved successfully.'
                        : 'New books added for next semester courses.'}
                  </div>
                  <div style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>Today</div>
                </div>
              ))}
            </div>
          </div>

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
            <h3 style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>Cart preview</h3>
            <div>
              {cart.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 56,
                      borderRadius: 10,
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
                    ?{item.price * item.quantity}
                  </div>
                </div>
              ))}
              {cart.items.length === 0 && (
                <div style={{ color: '#64748b', fontSize: 13 }}>No items in cart.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
