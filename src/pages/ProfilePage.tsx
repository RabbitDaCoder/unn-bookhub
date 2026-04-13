import React, { useState } from 'react';
import { useAuthStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { User, BookOpen, GraduationCap } from 'lucide-react';

export default function ProfilePage() {
  const userProfile = useAuthStore((s) => s.userProfile);
  const initials = (userProfile?.fullName || 'Student')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-1)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '28px 0 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Identity card */}
        <div
          style={{
            position: 'sticky',
            top: 84,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--r-2xl)',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
            alignSelf: 'start',
          }}
        >
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.fullName}
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--amber-400)', margin: '0 auto' }}
            />
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
                color: '#0f172a',
                fontSize: 28,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              {initials}
            </div>
          )}

          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 16 }}>{userProfile?.fullName || 'Student Name'}</div>
          <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>{userProfile?.email || 'you@unn.edu.ng'}</div>
          <div className="badge badge-amber" style={{ marginTop: 12 }}>
            {userProfile?.role || 'Student'}
          </div>

          <div style={{ borderTop: '1px solid var(--border-faint)', margin: '16px 0' }} />

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Orders', value: 3 },
              { label: 'Books Ordered', value: 7 },
              { label: 'Total Spent', value: '?24,500' },
            ].map((s, idx) => (
              <div key={s.label} style={{ display: 'grid', gap: 4, paddingBottom: idx < 2 ? 12 : 0, borderBottom: idx < 2 ? '1px solid var(--border-faint)' : undefined }}>
                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{s.label}</span>
                <span style={{ color: 'var(--text-1)', fontSize: 15, fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-faint)', margin: '16px 0' }} />

          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              window.dispatchEvent(new CustomEvent('logout-click'));
            }}
            style={{ boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
          >
            Sign Out
          </Button>
        </div>

        {/* Form side */}
        <div style={{ display: 'grid', gap: 20 }}>
          <Card padding={20}>
            <Header icon={<User size={16} color="var(--text-amber)" />} title="Personal Information" />
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))' }}>
              <Input label="Full Name" defaultValue={userProfile?.fullName || ''} requiredMark />
              <Input label="Phone" defaultValue={userProfile?.phone || ''} />
              <Input label="Email" defaultValue={userProfile?.email || ''} />
              <Input label="Address" defaultValue={userProfile?.address || ''} style={{ gridColumn: '1/-1' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <Button variant={saved ? 'secondary' : 'primary'} onClick={handleSave}>
                {saved ? 'Saved ?' : 'Save changes'}
              </Button>
            </div>
          </Card>

          <Card padding={20}>
            <Header icon={<GraduationCap size={16} color="var(--text-amber)" />} title="Academic Details" />
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))' }}>
              <Input label="Faculty" defaultValue={userProfile?.faculty || ''} />
              <Input label="Department" defaultValue={userProfile?.department || ''} />
              <Input label="Level" defaultValue={userProfile?.level || ''} />
              <Input label="Matric No" defaultValue={userProfile?.matricNo || ''} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <Button variant={saved ? 'secondary' : 'primary'} onClick={handleSave}>
                {saved ? 'Saved ?' : 'Save academic info'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Header({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.18)', display: 'grid', placeItems: 'center', color: 'var(--text-amber)' }}>
        {icon}
      </div>
      <h4 style={{ margin: 0 }}>{title}</h4>
    </div>
  );
}
