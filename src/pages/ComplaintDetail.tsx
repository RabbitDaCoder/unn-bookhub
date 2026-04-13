import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { Complaint, ComplaintResponse } from '../types';
import { 
  ChevronLeft, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User as UserIcon,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;

    const fetchComplaint = async () => {
      try {
        const complaintDoc = await getDoc(doc(db, 'complaints', id));
        if (complaintDoc.exists()) {
          const complaintData = { id: complaintDoc.id, ...complaintDoc.data() } as Complaint;
          if (complaintData.userId !== user.uid && user.role !== 'ADMIN') {
            setError('Unauthorized access to this request.');
          } else {
            setComplaint(complaintData);
          }
        } else {
          setError('Request not found.');
        }
      } catch (error) {
        console.error('Error fetching complaint:', error);
        setError('Failed to load request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, user]);

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !responseText.trim()) return;

    setSending(true);
    try {
      const newResponse: ComplaintResponse = {
        id: Math.random().toString(36).substr(2, 9),
        complaintId: id,
        userId: user.uid,
        userName: user.fullName,
        userRole: user.role,
        message: responseText,
        createdAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'complaints', id), {
        responses: arrayUnion(newResponse),
        updatedAt: new Date().toISOString(),
        status: user.role === 'ADMIN' ? 'IN_PROGRESS' : 'OPEN'
      });

      setComplaint(prev => prev ? {
        ...prev,
        responses: [...(prev.responses || []), newResponse],
        status: user.role === 'ADMIN' ? 'IN_PROGRESS' : 'OPEN'
      } : null);
      setResponseText('');
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="h-10 w-48 bg-bg-cream rounded-xl animate-pulse" />
        <div className="h-96 w-full bg-bg-cream rounded-[2.5rem] animate-pulse" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold">{error || 'Request not found'}</h1>
        <Link to="/complaints" className="text-primary hover:underline">Back to My Requests</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/complaints')} className="p-2 hover:bg-bg-cream rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold">Request Details</h1>
            <p className="text-sm opacity-60">Request ID: #{complaint.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className={cn(
          "px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs",
          complaint.status === 'resolved' ? "bg-green-100 text-green-700" : 
          complaint.status === 'in-progress' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
        )}>
          {complaint.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Conversation Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Original Request */}
          <section className="bg-white border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-bg-cream rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 opacity-40" />
                </div>
                <div>
                  <div className="font-bold">{complaint.userName}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{formatDate(complaint.createdAt)}</div>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-3 py-1 bg-bg-cream rounded-full">
                {complaint.category}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold">{complaint.subject}</h2>
              <p className="text-sm opacity-60 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </section>

          {/* Responses */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {complaint.responses.map((response) => (
                <motion.div 
                  key={response.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col space-y-2",
                    response.userRole === 'admin' ? "items-start" : "items-end"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-6 rounded-[2rem] shadow-sm",
                    response.userRole === 'admin' ? "bg-primary text-white rounded-tl-none" : "bg-white border border-border rounded-tr-none"
                  )}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                        {response.userRole === 'admin' ? 'Support Team' : 'You'}
                      </span>
                      {response.userRole === 'admin' && <ShieldCheck className="w-3 h-3" />}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{response.message}</p>
                    <div className="mt-4 text-[8px] font-bold uppercase tracking-widest opacity-40 text-right">
                      {formatDate(response.createdAt)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Reply Box */}
          {complaint.status !== 'resolved' && (
            <form onSubmit={handleSendResponse} className="bg-white border border-border p-6 rounded-[2.5rem] shadow-xl space-y-4">
              <textarea 
                required 
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full bg-bg-cream border border-border rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-all resize-none text-sm"
              />
              <div className="flex justify-between items-center">
                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                  Press Enter to send
                </p>
                <button 
                  type="submit" 
                  disabled={sending || !responseText.trim()}
                  className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Reply</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-bg-cream border border-border p-8 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-display font-bold">Request Info</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Category</div>
                <div className="text-sm font-bold capitalize">{complaint.category}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Priority</div>
                <div className="text-sm font-bold capitalize">{complaint.priority}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">Last Updated</div>
                <div className="text-sm font-bold">{formatDate(complaint.updatedAt)}</div>
              </div>
            </div>
          </section>

          <section className="p-8 border border-border rounded-[2.5rem] space-y-4">
            <h2 className="text-lg font-display font-bold">Need more help?</h2>
            <p className="text-xs opacity-60 leading-relaxed">
              If your issue is urgent, you can visit the UNN Library Digital Wing in person during working hours.
            </p>
            <div className="pt-4 border-t border-border">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Support Email</div>
              <a href="mailto:support@unnbookhub.edu.ng" className="text-sm font-bold text-primary hover:underline">
                support@unnbookhub.edu.ng
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
