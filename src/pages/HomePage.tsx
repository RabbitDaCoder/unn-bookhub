import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookCover } from "../components/ui/BookCover";
import { BookCard } from "../components/BookCard";
import { getFeaturedBooks } from "../data/books";

export default function HomePage() {
  const featuredBooks = getFeaturedBooks();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * 230, behavior: "smooth" });
  };
  const scrollPrev = () =>
    scrollRef.current?.scrollBy({ left: -230, behavior: "smooth" });
  const scrollNext = () =>
    scrollRef.current?.scrollBy({ left: 230, behavior: "smooth" });

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const next = (activeIndex + 1) % featuredBooks.length;
        scrollToIndex(next);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, featuredBooks.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const idx = Math.round(el.scrollLeft / 230);
      setActiveIndex(idx);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen bg-ink-800 grid-bg overflow-hidden flex items-center">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/[0.08] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-ink-900 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
          <div className="grid lg:grid-cols-[55%_45%] gap-16 items-center">
            <div className="flex flex-col gap-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 w-fit">
                <span className="text-lg">📚</span>
                <span className="text-amber-400 text-[11px] font-black tracking-[1.5px] uppercase">
                  UNN Campus Official Bookstore
                </span>
              </div>

              <h1 className="text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.08] tracking-[-1.5px] text-white">
                Every textbook
                <br />
                you need,{" "}
                <span className="text-gradient-amber relative inline-block">
                  one click
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 4 Q25 0 50 4 Q75 8 100 4 Q125 0 150 4 Q175 8 200 4"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                away.
              </h1>

              <p className="text-[clamp(15px,1.8vw,18px)] text-white/60 leading-[1.75] max-w-[480px]">
                Browse 500+ academic textbooks for all UNN departments. Order
                online — we source and deliver straight to your hostel.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-extrabold text-[15px] shadow-amber hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-amber-lg transition-all duration-200"
                >
                  Browse Bookstore <span className="text-lg">→</span>
                </Link>
                <Link
                  to="/library"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold text-[15px] hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
                >
                  Explore Library 🎵
                </Link>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/30 flex-wrap">
                {[
                  "No payment online",
                  "WhatsApp confirmation",
                  "Fast delivery",
                ].map((t, i) => (
                  <span key={t} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span className="w-1 h-1 rounded-full bg-white/20 -ml-2" />
                    )}
                    <span className="text-amber-500/70">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual column */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative animate-float">
                <div
                  className="absolute"
                  style={{
                    transform:
                      "rotate(-22deg) translateX(-110px) translateY(50px)",
                    opacity: 0.55,
                    zIndex: 0,
                  }}
                >
                  <BookCover
                    courseCode="MTH 101"
                    title="Elementary Mathematics"
                    color="#c81e1e"
                    size="md"
                  />
                </div>
                <div
                  className="absolute"
                  style={{
                    transform:
                      "rotate(-12deg) translateX(-55px) translateY(20px)",
                    zIndex: 1,
                  }}
                >
                  <BookCover
                    courseCode="ENG 101"
                    title="Use of English"
                    color="#b45309"
                    size="lg"
                  />
                </div>
                <div className="relative z-10">
                  <BookCover
                    courseCode="COS 101"
                    title="Introduction to Computer Science"
                    color="#1a56db"
                    size="hero"
                  />
                </div>
                <div
                  className="absolute"
                  style={{
                    transform:
                      "rotate(11deg) translateX(55px) translateY(20px)",
                    zIndex: 1,
                  }}
                >
                  <BookCover
                    courseCode="ECO 101"
                    title="Principles of Economics"
                    color="#1e40af"
                    size="lg"
                  />
                </div>
                <div
                  className="absolute"
                  style={{
                    transform:
                      "rotate(20deg) translateX(110px) translateY(50px)",
                    opacity: 0.55,
                    zIndex: 0,
                  }}
                >
                  <BookCover
                    courseCode="CHM 101"
                    title="General Chemistry"
                    color="#6d28d9"
                    size="md"
                  />
                </div>
              </div>

              <div
                className="absolute bottom-4 -left-8 bg-ink-700 border border-amber-500/40 rounded-2xl px-4 py-3 shadow-amber animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="text-white text-sm font-bold">500+ Books</p>
                    <p className="text-white/40 text-[11px]">Available now</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 bg-ink-700 border border-green-500/30 rounded-xl px-3 py-2 shadow-card animate-float"
                style={{ animationDelay: "2s" }}
              >
                <p className="text-green-400 text-xs font-bold">
                  ⚡ 48hr Delivery
                </p>
              </div>

              <div
                className="absolute bottom-16 -right-8 bg-ink-700 border border-amber-500/20 rounded-xl px-3 py-2 shadow-card animate-float"
                style={{ animationDelay: "0.5s" }}
              >
                <p className="text-amber-400 text-xs font-bold">
                  ⭐ 4.8 Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-ink-700 border-y border-white/[0.06] py-7">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            {[
              { icon: "📚", value: "500+", label: "Course Books" },
              { icon: "🏛️", value: "30+", label: "Departments" },
              { icon: "⚡", value: "48hr", label: "Avg. Delivery" },
              { icon: "⭐", value: "4.8", label: "Student Rating" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${i < 3 ? "md:border-r md:border-white/[0.06] md:pr-6" : ""} ${i > 0 ? "md:pl-6" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white text-2xl font-extrabold leading-none">
                    {stat.value}
                  </p>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-ink-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-3">
              How It Works
            </h2>
            <p className="text-white/50 text-lg">
              Getting your books has never been easier
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                num: "01",
                icon: "🔍",
                title: "Browse & Search",
                desc: "Find books by course code, author, or department",
              },
              {
                num: "02",
                icon: "🛒",
                title: "Add to Cart",
                desc: "Build your book list, check prices and availability",
              },
              {
                num: "03",
                icon: "📋",
                title: "Place Order",
                desc: "Submit delivery details — no online payment needed",
              },
              {
                num: "04",
                icon: "🚀",
                title: "We Deliver",
                desc: "Our team sources your books and brings them to you",
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7 hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 group relative"
              >
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 -right-2.5 w-5 h-[2px] bg-amber-500/20 z-10" />
                )}
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-500 text-lg font-black mb-5 group-hover:bg-amber-500/20 transition-colors duration-300">
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section className="py-20 bg-ink-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white">
                Featured Textbooks
              </h2>
              <p className="text-white/40 text-sm mt-1.5">
                Most popular picks this semester
              </p>
            </div>
            <Link
              to="/books"
              className="text-amber-500 font-bold text-sm hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              View all <span>→</span>
            </Link>
          </div>

          <div className="relative">
            <button
              onClick={scrollPrev}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink-600 border border-white/10 flex items-center justify-center text-white hover:border-amber-500/50 hover:bg-ink-500 shadow-card transition-all duration-200 hidden md:flex"
            >
              ←
            </button>
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto no-scrollbar scroll-snap-x pb-4"
            >
              {featuredBooks.map((book) => (
                <div
                  key={book.id}
                  className="scroll-snap-start flex-shrink-0 w-[210px]"
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-ink-600 border border-white/10 flex items-center justify-center text-white hover:border-amber-500/50 hover:bg-ink-500 shadow-card transition-all duration-200 hidden md:flex"
            >
              →
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {featuredBooks.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 h-2 bg-amber-500" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-ink-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              Browse by Faculty
            </h2>
            <p className="text-white/40">Find books for your department</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Science",
                emoji: "🔬",
                count: 45,
                color: "from-blue-900/60 to-blue-950/80",
                border: "hover:border-blue-500/50",
              },
              {
                name: "Arts",
                emoji: "🎨",
                count: 32,
                color: "from-amber-900/60 to-amber-950/80",
                border: "hover:border-amber-500/50",
              },
              {
                name: "Engineering",
                emoji: "⚙️",
                count: 28,
                color: "from-green-900/60 to-green-950/80",
                border: "hover:border-green-500/50",
              },
              {
                name: "Medicine",
                emoji: "🏥",
                count: 22,
                color: "from-red-900/60 to-red-950/80",
                border: "hover:border-red-500/50",
              },
              {
                name: "Law",
                emoji: "⚖️",
                count: 18,
                color: "from-yellow-900/60 to-yellow-950/80",
                border: "hover:border-yellow-500/50",
              },
              {
                name: "Education",
                emoji: "📝",
                count: 24,
                color: "from-purple-900/60 to-purple-950/80",
                border: "hover:border-purple-500/50",
              },
              {
                name: "Social Sci",
                emoji: "🌍",
                count: 30,
                color: "from-cyan-900/60 to-cyan-950/80",
                border: "hover:border-cyan-500/50",
              },
              {
                name: "Business",
                emoji: "💼",
                count: 26,
                color: "from-orange-900/60 to-orange-950/80",
                border: "hover:border-orange-500/50",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/books?category=${cat.name}`}
                className={`bg-gradient-to-br ${cat.color} border border-white/[0.06] ${cat.border} rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:translate-x-1 transition-all duration-250 group`}
              >
                <div className="text-3xl">{cat.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[15px] truncate">
                    {cat.name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {cat.count} books
                  </p>
                </div>
                <span className="text-white/30 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LIBRARY TEASER */}
      <section className="relative py-20 bg-music-bg overflow-hidden border-y border-music-light/20">
        {["♪", "♫", "♩", "♬"].map((note, i) => (
          <span
            key={i}
            className="absolute text-4xl text-white/5 animate-float pointer-events-none"
            style={{
              left: `${15 + i * 22}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            {note}
          </span>
        ))}

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 bg-music-DEFAULT/20 border border-music-light/30 rounded-full px-4 py-1.5 w-fit">
                <span>🎵</span>
                <span className="text-music-light text-[11px] font-black tracking-wider uppercase">
                  Free E-Library
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Read. Relax.
                <br />
                <span className="text-music-light">Listen.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed font-serif italic">
                Poems, novels, short stories — with ambient music that sets the
                perfect reading mood.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Curated poems and Nigerian literature",
                  "Ambient music player while you read",
                  "Classic novels and short stories",
                  "New content added every week",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-white/60 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-music-DEFAULT/30 flex items-center justify-center text-music-light text-xs flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/library"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-music-DEFAULT text-white font-bold text-[15px] w-fit hover:bg-music-dark shadow-music hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Library →
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative animate-float">
                <div
                  className="bg-ink-700 border border-music-light/20 rounded-3xl p-6 shadow-music w-72"
                  style={{ transform: "rotate(3deg)" }}
                >
                  <BookCover
                    courseCode="LIT"
                    title="Things Fall Apart"
                    color="#92400e"
                    size="lg"
                  />
                  <div className="mt-4 bg-music-DEFAULT/20 rounded-2xl p-3 border border-music-light/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-music-DEFAULT/40 flex items-center justify-center text-sm">
                        🎵
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-bold">
                          Quiet Library
                        </p>
                        <p className="text-white/40 text-[10px]">
                          Ambient · Playing
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-music-light/30 flex items-center justify-center text-white text-sm">
                        ⏸
                      </button>
                    </div>
                    <div className="flex items-end gap-1 justify-center h-5">
                      {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.4].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-music-light rounded-full animate-music-pulse"
                          style={{
                            height: `${h * 100}%`,
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -z-10 rounded-3xl blur-2xl bg-music-DEFAULT/20 scale-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-ink-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              What Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Finally a solution to the Nsukka book market stress. Got all my 300L books in 2 days without leaving my hostel.",
                name: "Chukwuemeka O.",
                dept: "Computer Science, 300L",
              },
              {
                quote:
                  "The library section is amazing. I read Purple Hibiscus with lo-fi playing. Best study experience ever.",
                name: "Adaeze N.",
                dept: "English Literature, 200L",
              },
              {
                quote:
                  "Prices are fair and they actually deliver. My COS 201 textbook came the next morning. Impressive.",
                name: "Obiora M.",
                dept: "Mathematics, 200L",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-ink-700 border border-white/[0.06] rounded-2xl p-7 relative hover:border-amber-500/30 transition-all duration-300"
              >
                <span className="absolute top-4 left-5 text-[60px] leading-none text-amber-500/15 font-serif select-none">
                  "
                </span>
                <div className="flex gap-0.5 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm">
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-white/60 text-sm leading-[1.8] font-serif italic mb-6 relative z-10">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-ink-900 text-sm font-black">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-950/80 via-ink-700 to-amber-950/40 border border-amber-500/25 rounded-4xl p-12 md:p-16 text-center overflow-hidden">
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[180px] opacity-[0.03] select-none pointer-events-none leading-none">
              📚
            </span>
            <div className="absolute inset-0 bg-amber-glow opacity-30 pointer-events-none" />
            <div className="relative">
              <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold text-white mb-4">
                Ready to get your course books?
              </h2>
              <p className="text-white/50 text-lg mb-8">
                Create a free account and start ordering in seconds.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-full bg-amber-500 text-ink-900 font-extrabold text-[15px] shadow-amber-lg hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started →
                </Link>
                <Link
                  to="/books"
                  className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-[15px] hover:border-white/40 transition-all duration-200"
                >
                  Browse Books
                </Link>
              </div>
              <p className="text-white/30 text-sm mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
