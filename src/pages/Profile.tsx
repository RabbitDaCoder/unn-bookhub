import React, { useState } from 'react';
import { useAuthStore } from '../store/useStore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Faculty } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  School, 
  GraduationCap, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Camera,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { FACULTIES, DEPARTMENTS } from '../constants';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [faculty, setFaculty] = useState<string>(user?.faculty || '');
  const [department, setDepartment] = useState<string>(user?.department || '');
  const [level, setLevel] = useState<string>(user?.level || '100');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updatedData: Partial<User> = {
        fullName,
        phone,
        faculty,
        department,
        level,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', user.uid), updatedData);
      setUser({ ...user, ...updatedData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">My Profile</h1>
          <p className="text-sm opacity-60">Manage your academic identity and settings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={cn(
            "px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2",
            user.isVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
          )}>
            <ShieldCheck className="w-3 h-3" />
            <span>{user.isVerified ? 'Verified Student' : 'Unverified'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="space-y-8">
          <div className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-bg-cream rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <UserIcon className="w-16 h-16 opacity-20" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary-light transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold">{user.fullName}</h2>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{user.borrowedBooks.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Borrows</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{user.wishlist.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Wishlist</div>
              </div>
            </div>
          </div>

          <section className="bg-bg-cream border border-border p-8 rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-display font-bold">Account Security</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-white rounded-xl text-sm font-bold opacity-60 hover:opacity-100 transition-all flex items-center justify-between group">
                <span>Change Password</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full text-left p-3 hover:bg-white rounded-xl text-sm font-bold opacity-60 hover:opacity-100 transition-all flex items-center justify-between group">
                <span>Two-Factor Auth</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </section>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-200 text-green-700 p-4 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p>Profile updated successfully!</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Student Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <input 
                      type="email" 
                      value={user.email}
                      readOnly
                      className="w-full bg-bg-cream/50 border border-border rounded-xl pl-12 pr-4 py-3 opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Level</label>
                  <select 
                    required 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all appearance-none"
                  >
                    {['100', '200', '300', '400', '500', '600', 'Postgraduate'].map(l => <option key={l} value={l}>{l} Level</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Faculty</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <select 
                      required 
                      value={faculty}
                      onChange={(e) => {
                        setFaculty(e.target.value as Faculty);
                        setDepartment('');
                      }}
                      className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all appearance-none"
                    >
                      <option value="">Select Faculty</option>
                      {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Department</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <select 
                      required 
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={!faculty}
                      className="w-full bg-bg-cream border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="">Select Department</option>
                      {faculty && DEPARTMENTS[faculty as Faculty]?.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary hover:bg-primary-light text-white px-10 py-4 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
