import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookCover } from '../components/ui/BookCover';
import Card from '../components/ui/Card';

const mockOrders = [
  {
    id: 'ORD-10241',
    date: '2026-04-10',
    status: 'Pending',
    items: [
      { id: 'book-cos-101', courseCode: 'COS 101', title: 'Intro to Computer Science', coverColor: '#1f2937' },
      { id: 'book-mth-101', courseCode: 'MTH 101', title: 'Calculus', coverColor: '#2563eb' },
    ],
    total: 8200,
  },
  {
    id: 'ORD-10198',
    date: '2026-04-02',
    status: 'Delivered',
    items: [
      { id: 'book-eng-101', courseCode: 'ENG 101', title: 'English Language', coverColor: '#c2410c' },
    ],
    total: 2600,
  },
];

const tabs = ['All', 'Pending', 'Confirmed', 'Delivered'];

export default function OrdersPage() {
  const [tab, setTab] = useState('All');

  const filtered = useMemo(
    () => mockOrders.filter((o) => (tab === 'All' ? true : o.status === tab)),
    [tab],
  );

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-1)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '28px 0 48px', display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>My Orders</h2>
            <span className="badge badge-amber">{filtered.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    background: active ? 'var(--amber-200)' : 'var(--bg-elevated)',
                    color: active ? 'var(--text-amber)' : 'var(--text-3)',
                    border: active ? '1px solid var(--border-amber)' : '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    padding: '8px 12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((order) => (
            <Card key={order.id} padding={20} style={{ borderRadius: 'var(--r-xl)', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s' }}>
              <Link to={`/orders/${order.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', color: 'var(--text-amber)', fontWeight: 800 }}>{order.id}</span>
                    <span style={{ color: 'var(--text-3)', fontSize: 13 }}>{order.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {order.items.map((i) => (
                        <BookCover key={i.id} courseCode={i.courseCode} title={i.title} color={i.coverColor} size="sm" />
                      ))}
                    </div>
                    <span style={{ color: 'var(--text-3)', fontSize: 13 }}>+ {order.items.length} item(s)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <strong style={{ color: 'var(--text-1)', fontSize: 16 }}>?{order.total.toLocaleString()}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        className="badge"
                        style={{
                          background: order.status === 'Delivered' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          border: '1px solid var(--border-subtle)',
                          color: order.status === 'Delivered' ? 'var(--success)' : 'var(--text-amber)',
                        }}
                      >
                        {order.status}
                      </span>
                      <span style={{ color: 'var(--text-amber)', fontWeight: 700 }}>View Details ?</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
