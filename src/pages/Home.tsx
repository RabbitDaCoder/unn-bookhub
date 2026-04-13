import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Library, GraduationCap, Users, Building2, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { useUIStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function Home() {
  const { isDarkMode } = useUIStore();

  const stats = [
    { label: 'Total Books', value: '12,400+', icon: BookOpen },
    { label: 'Authors', value: '850+', icon: Users },
    { label: 'Departments', value: '45+', icon: Building2 },
    { label: 'Students Served', value: '25,000+', icon: GraduationCap },
  ];

  const faculties = [
    { name: 'Sciences', icon: '🔬', color: 'bg-blue-500' },
    { name: 'Engineering', icon: '⚙️', color: 'bg-orange-500' },
    { name: 'Arts', icon: '🎨', color: 'bg-purple-500' },
    { name: 'Law', icon: '⚖️', color: 'bg-red-500' },
    { name: 'Medicine', icon: '🏥', color: 'bg-green-500' },
    { name: 'Business', icon: '📊', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className={cn(
        "relative min-h-[80vh] flex items-center overflow-hidden",
        isDarkMode ? "bg-bg-dark" : "bg-bg-cream"
      )}>
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Official UNN Bookstore</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1]">
                Your Academic <br />
                <span className="text-secondary italic">Journey</span> Starts Here.
              </h1>
              
              <p className="text-lg opacity-80 max-w-lg leading-relaxed">
                Access thousands of textbooks, research journals, and digital resources tailored for the University of Nigeria, Nsukka community.
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/bookshelf" className="bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-primary/30 group">
                  <span>Browse Bookshelf</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/library" className="bg-white border border-border hover:border-secondary text-text-dark px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg group">
                  <Library className="w-5 h-5 text-secondary" />
                  <span>Enter E-Library</span>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl border border-border transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800" 
                  alt="Library" 
                  className="rounded-2xl shadow-inner mb-6"
                  referrerPolicy="no-referrer"
                />
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-xl">Nnamdi Azikiwe Library</h3>
                    <p className="text-xs opacity-60">Digital Wing • Open 24/7</p>
                  </div>
                  <div className="bg-secondary text-white p-3 rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white border border-border rounded-3xl p-8 shadow-xl">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Department Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold">Browse by Faculty</h2>
            <p className="opacity-60">Find resources specific to your academic department.</p>
          </div>
          <Link to="/bookshelf" className="text-primary font-bold flex items-center space-x-1 hover:text-secondary transition-colors group">
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {faculties.map((faculty, i) => (
            <Link 
              key={i} 
              to={`/bookshelf?faculty=${faculty.name}`}
              className="group bg-white border border-border p-6 rounded-2xl hover:border-secondary hover:shadow-xl transition-all text-center space-y-4"
            >
              <div className={cn("w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform", faculty.color + " bg-opacity-10")}>
                {faculty.icon}
              </div>
              <h3 className="font-bold text-sm">{faculty.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="bg-primary py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex justify-between items-end text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold">Featured Textbooks</h2>
              <p className="opacity-60">Handpicked essential reads for this semester.</p>
            </div>
            <Link to="/bookshelf" className="text-secondary font-bold flex items-center space-x-1 hover:text-white transition-colors group">
              <span>Explore Shelf</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex space-x-8 overflow-x-auto pb-12 scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="min-w-[280px] bg-white rounded-2xl p-4 shadow-2xl border border-white/10 group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-lg">
                  <img 
                    src={`https://picsum.photos/seed/book${i}/400/600`} 
                    alt="Book Cover" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    NEW
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-secondary">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <h3 className="font-display font-bold text-text-dark line-clamp-1">Data Structures & Algorithms</h3>
                  <p className="text-xs text-text-muted">Prof. Emeka Okafor</p>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-primary font-bold">₦5,500</p>
                    <button className="p-2 bg-primary/5 hover:bg-primary hover:text-white rounded-lg transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E-Library Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-bg-dark rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-l from-secondary/40 to-transparent" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Access the <span className="text-secondary italic">Digital Wing</span> <br />
                of Nnamdi Azikiwe Library.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Borrow digital textbooks, read journals, and study with our curated ambient music player. All from the comfort of your room.
              </p>
              <Link to="/library" className="inline-flex bg-secondary hover:bg-secondary/90 text-white px-10 py-4 rounded-xl font-bold items-center space-x-3 transition-all shadow-xl hover:shadow-secondary/20">
                <span>Enter Digital Wing</span>
                <Library className="w-6 h-6" />
              </Link>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-80 h-80 bg-white/5 rounded-full border border-white/10 flex items-center justify-center relative animate-pulse">
                <div className="w-64 h-64 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                  <Library className="w-32 h-32 text-secondary opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
