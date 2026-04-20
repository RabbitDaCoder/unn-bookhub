import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { books, searchBooks } from "../data/books";
import { BookCard } from "../components/BookCard";

const FACULTIES = [
  "All",
  "Science",
  "Arts",
  "Engineering",
  "Medicine",
  "Law",
  "Education",
  "Social Sciences",
  "Business",
];

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name"
  >("default");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = search ? searchBooks(search) : [...books];
    if (faculty !== "All") {
      result = result.filter(
        (b) => b.faculty?.toLowerCase() === faculty.toLowerCase(),
      );
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [search, faculty, sortBy]);

  const handleFacultyChange = (f: string) => {
    setFaculty(f);
    if (f === "All") searchParams.delete("category");
    else searchParams.set("category", f);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Header */}
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-2">Bookstore</h1>
          <p className="text-white/50 text-sm">
            Browse {books.length}+ academic textbooks
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, course code, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-ink-700 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-ink-700 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
          <div className="hidden md:flex bg-ink-700 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`px-3.5 py-3 text-sm ${view === "grid" ? "bg-amber-500/20 text-amber-500" : "text-white/50 hover:text-white"}`}
            >
              ▦
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3.5 py-3 text-sm ${view === "list" ? "bg-amber-500/20 text-amber-500" : "text-white/50 hover:text-white"}`}
            >
              ≡
            </button>
          </div>
        </div>

        {/* Faculty tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {FACULTIES.map((f) => (
            <button
              key={f}
              onClick={() => handleFacultyChange(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                faculty === f
                  ? "bg-amber-500 text-ink-900"
                  : "bg-ink-700 text-white/50 border border-white/10 hover:border-amber-500/40 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-white/50 text-lg font-semibold">
              No books found
            </p>
            <p className="text-white/30 text-sm mt-1">
              Try a different search or category
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/40 text-sm mb-5">
              {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  layout={view === "list" ? "horizontal" : "vertical"}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
