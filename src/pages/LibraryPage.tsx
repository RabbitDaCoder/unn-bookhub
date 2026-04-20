import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  libraryBooks,
  libraryGenres,
  getLibraryBooksByGenre,
} from "../data/libraryBooks";
import { LibraryBookCard } from "../components/LibraryBookCard";

export default function LibraryPage() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result =
      activeGenre === "All"
        ? [...libraryBooks]
        : getLibraryBooksByGenre(activeGenre);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeGenre, search]);

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Header */}
      <section className="relative bg-music-bg border-b border-music-light/20 py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-music-DEFAULT/10 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📖</span>
            <h1 className="text-3xl font-extrabold text-white">E-Library</h1>
          </div>
          <p className="text-white/50 max-w-lg">
            Explore Nigerian literature — poems, novels, and short stories with
            ambient music to set the mood.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-ink-700 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-music-light/50 transition-colors"
            />
          </div>
        </div>

        {/* Genre tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {["All", ...libraryGenres].map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeGenre === g
                  ? "bg-music-DEFAULT text-white"
                  : "bg-ink-700 text-white/50 border border-white/10 hover:border-music-light/40 hover:text-white"
              }`}
            >
              {g}
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
            <p className="text-white/30 text-sm mt-1">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((book) => (
              <LibraryBookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
