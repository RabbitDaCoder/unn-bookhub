import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { BookCover } from '../components/ui/BookCover';
import { ArrowLeft } from 'lucide-react';

const steps = ['Order Placed', 'Confirmed', 'Sourcing Books', 'Delivered'];

const mock = {
  id: 'ORD-10241',
  date: '2026-04-10',
  status: 'Confirmed',
  items: [
    { id: 'book-cos-101', courseCode: 'COS 101', title: 'Intro to Computer Science', coverColor: '#1f2937', price: 4200 },
    { id: 'book-mth-101', courseCode: 'MTH 101', title: 'Calculus', coverColor: '#2563eb', price: 3500 },
  ],
  delivery: {
    name: 'Adaeze Okafor',
    phone: '0803 000 0000',
    address: 'Room 204, Alvan Ikoku Hostel',
  },
  fees: { delivery: 800 },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const order = mock; // would fetch by id
  const subtotal = order.items.reduce((a, i) => a + i.price, 0);

  const currentIndex = steps.findIndex((s) => s === order.status) || 0;

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-1)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '28px 0 48px', display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/orders" style={{ color: 'var(--text-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Orders
          </Link>
          <span style={{ color: 'var(--text-amber)', fontFamily: '"JetBrains Mono", monospace', fontWeight: 800 }}>{order.id}</span>
        </div>

        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ margin: 0, fontSize: 16 }}>Status</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))`,
                gap: 10,
              }}
            >
              {steps.map((step, idx) => {
                const completed = idx < currentIndex;
                const current = idx === currentIndex;
                return (
                  <div key={step} style={{ display: 'grid', gap: 6, justifyItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {idx > 0 && (
                        <span
                          style={{
                            flex: 1,
                            height: 2,
                            background: completed ? 'var(--text-amber)' : 'var(--border-subtle)',
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: current || completed ? 'var(--text-amber)' : 'var(--border-subtle)',
                          boxShadow: current ? '0 0 0 6px rgba(245,158,11,0.18)' : undefined,
                        }}
                      />
                      {idx < steps.length - 1 && (
                        <span
                          style={{
                            flex: 1,
                            height: 2,
                            background: idx < currentIndex ? 'var(--text-amber)' : 'var(--border-subtle)',
                          }}
                        />
                      )}
                    </div>
                    <div style={{ textAlign: 'center', color: current ? 'var(--text-amber)' : 'var(--text-3)', fontSize: 12 }}>{step}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <Card padding={20}>
            <h4 style={{ marginBottom: 12 }}>Items</h4>
            <div style={{ display: 'grid', gap: 10 }}>
              {order.items.map((i) => (
                <div key={i.id} style={{ display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid var(--border-faint)', paddingBottom: 10 }}>
                  <BookCover courseCode={i.courseCode} title={i.title} color={i.coverColor} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{i.title}</div>
                    <div className="badge badge-amber" style={{ marginTop: 6 }}>{i.courseCode}</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>?{i.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={20}>
            <h4 style={{ marginBottom: 12 }}>Delivery</h4>
            <div style={{ color: 'var(--text-3)', fontSize: 14, display: 'grid', gap: 6 }}>
              <div><strong style={{ color: 'var(--text-1)' }}>Name:</strong> {order.delivery.name}</div>
              <div><strong style={{ color: 'var(--text-1)' }}>Phone:</strong> {order.delivery.phone}</div>
              <div><strong style={{ color: 'var(--text-1)' }}>Address:</strong> {order.delivery.address}</div>
            </div>
          </Card>

          <Card padding={20}>
            <h4 style={{ marginBottom: 12 }}>Summary</h4>
            <div style={{ display: 'grid', gap: 6, color: 'var(--text-3)', fontSize: 14 }}>
              <Row label="Subtotal" value={`?${subtotal.toLocaleString()}`} />
              <Row label="Delivery" value={`?${order.fees.delivery.toLocaleString()}`} />
              <div style={{ borderTop: '1px solid var(--border-faint)', marginTop: 6, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: 'var(--text-1)' }}>
                <span>Total</span>
                <span>?{(subtotal + order.fees.delivery).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{label}</span>
      <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{value}</span>
    </div>
  );
}
