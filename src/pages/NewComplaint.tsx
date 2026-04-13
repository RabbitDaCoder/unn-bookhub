import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Complaint } from '../types';
import { 
  ChevronLeft, 
  Send, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export default function NewComplaint() {
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<Complaint['category']>('other');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const complaintData: Omit<Complaint, 'id'> = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.fullName,
        subject,
        category,
        description,
        status: 'OPEN',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };

      await addDoc(collection(db, 'complaints'), complaintData);
      setSuccess(true);
      setTimeout(() => navigate('/complaints'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Request Submitted</h1>
          <p className="text-lg opacity-60">Your support request has been received. We'll get back to you shortly.</p>
        </div>
        <Link 
          to="/complaints" 
          className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-primary/20"
        >
          <span>View My Requests</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/complaints')} className="p-2 hover:bg-bg-cream rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-display font-bold">New Support Request</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-border p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center space-x-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Category</label>
                <select 
                  required 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                  className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all appearance-none"
                >
                  <option value="payment">Payment Issue</option>
                  <option value="access">Access Problem</option>
                  <option value="book">Book Availability</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Subject</label>
                <input 
                  type="text" 
                  required 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe the issue"
                  className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Detailed Description</label>
                <textarea 
                  required 
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide as much detail as possible to help us resolve the issue faster."
                  className="w-full bg-bg-cream border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-light text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <section className="bg-bg-cream border border-border p-8 rounded-[2.5rem] space-y-6">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-display font-bold">Need Immediate Help?</h2>
            <div className="space-y-4 text-sm opacity-60 leading-relaxed">
              <p>Check our FAQ section for instant answers to common questions about payments and digital access.</p>
              <div className="space-y-2">
                <div className="font-bold text-text-dark">Support Hours:</div>
                <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p>Sat: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </section>

          <section className="p-8 border border-border rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-display font-bold">Tips for Faster Resolution</h2>
            <ul className="space-y-3 text-xs opacity-60 list-disc pl-4">
              <li>Include your Order ID if it's a payment issue.</li>
              <li>Be specific about the book title and author.</li>
              <li>Describe the exact steps that led to the problem.</li>
              <li>Mention your device and browser if it's a technical issue.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
