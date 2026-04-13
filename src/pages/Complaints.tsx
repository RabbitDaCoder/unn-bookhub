import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useStore';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Complaint } from '../types';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Complaints() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      try {
        const complaintsQuery = query(
          collection(db, 'complaints'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(complaintsQuery);
        setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint)));
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  const filteredComplaints = complaints.filter(c => 
    statusFilter === 'all' || c.status === statusFilter
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 w-48 bg-bg-cream rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-bg-cream rounded-[2rem] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold">Support & Complaints</h1>
          <p className="text-sm opacity-60">We're here to help. Track your support requests.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-bg-cream border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-all appearance-none"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <Link 
            to="/complaints/new" 
            className="bg-primary text-white hover:bg-primary-light px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint, i) => (
              <motion.div 
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-border p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    complaint.status === 'resolved' ? "bg-green-100 text-green-600" : 
                    complaint.status === 'in-progress' ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                  )}>
                    {complaint.status === 'resolved' ? <CheckCircle2 className="w-6 h-6" /> : 
                     complaint.status === 'in-progress' ? <Clock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">#{complaint.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">•</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{complaint.category}</span>
                    </div>
                    <h3 className="font-bold truncate">{complaint.subject}</h3>
                    <p className="text-xs opacity-60 line-clamp-1">{complaint.description}</p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end md:space-x-8">
                    <div className="text-right">
                      <div className="text-xs font-bold opacity-40">{formatDate(complaint.createdAt)}</div>
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        complaint.status === 'resolved' ? "text-green-600" : 
                        complaint.status === 'in-progress' ? "text-blue-600" : "text-orange-600"
                      )}>
                        {complaint.status}
                      </div>
                    </div>
                    <Link 
                      to={`/complaints/${complaint.id}`}
                      className="p-3 bg-bg-cream hover:bg-primary hover:text-white rounded-xl transition-all group-hover:translate-x-1"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-bg-cream/50 border border-dashed border-border p-20 rounded-[3rem] text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <MessageSquare className="w-8 h-8 opacity-20" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold">No requests found</h3>
                <p className="text-sm opacity-40">Need help? Create a new support request.</p>
              </div>
              <Link to="/complaints/new" className="inline-flex items-center space-x-2 text-primary font-bold hover:underline">
                <span>New Request</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Support Info Sidebar */}
        <div className="space-y-8">
          <section className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 space-y-6">
            <h2 className="text-xl font-display font-bold">Our Commitment</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">Response Time</div>
                  <p className="text-sm opacity-60">We aim to respond to all academic queries within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">Resolution Rate</div>
                  <p className="text-sm opacity-60">98% of student complaints are resolved within 48 hours.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-4">
            <h2 className="text-lg font-display font-bold">Common Topics</h2>
            <div className="space-y-2">
              {['Payment Issues', 'E-Library Access', 'Book Availability', 'Account Verification', 'Technical Support'].map(topic => (
                <button key={topic} className="w-full text-left p-3 hover:bg-bg-cream rounded-xl text-sm font-bold opacity-60 hover:opacity-100 transition-all flex items-center justify-between group">
                  <span>{topic}</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
