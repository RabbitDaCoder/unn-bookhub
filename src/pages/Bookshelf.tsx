import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Book } from "../types";
import { books as dummyBooks } from "../data/books";
import { FACULTIES, DEPARTMENTS, BOOK_TYPES, LEVELS } from "../constants";
import BookCard from "../components/BookCard";
import {
  Search,
  Filter,
  LayoutGrid,
  Columns,
  ChevronDown,
  X,
  BookOpen,
  Library,
} from "lucide-react";
import { useUIStore } from "../store/useStore";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Bookshelf() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "shelf">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isDarkMode } = useUIStore();

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [faculty, setFaculty] = useState(searchParams.get("faculty") || "");
  const [department, setDepartment] = useState(
    searchParams.get("department") || "",
  );
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksRef = collection(db, "books");
        let q = query(booksRef);

        if (faculty) q = query(q, where("faculty", "==", faculty));
        if (department) q = query(q, where("department", "==", department));
        if (level) q = query(q, where("level", "==", level));
        if (type) q = query(q, where("type", "==", type));

        q = query(q, orderBy("createdAt", "desc"));

        const snapshot = await getDocs(q);
        let booksData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Book,
        );

        if (booksData.length === 0) {
          booksData = dummyBooks as Book[];
        }

        const filtered = booksData.filter((book) => {
          const matchesFilters =
            (!faculty || book.faculty === faculty) &&
            (!department || book.department === department) &&
            (!level || book.level === level) &&
            (!type || book.type === type);

          const matchesSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(search.toLowerCase());

          return matchesFilters && matchesSearch;
        });

        setBooks(filtered);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks(dummyBooks as Book[]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [faculty, department, level, type, search]);

  const clearFilters = () => {
    setSearch("");
    setFaculty("");
    setDepartment("");
    setLevel("");
    setType("");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-display font-bold">
            Academic Bookshelf
          </h1>
          <p className="opacity-60">
            Browse our collection of textbooks, journals, and reference
            materials.
          </p>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
            <input
              type="text"
              placeholder="Search by title, course, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-3 border rounded-xl transition-all shadow-sm flex items-center space-x-2 font-bold text-sm",
              isFilterOpen
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-emerald-500/10 text-emerald-900 border-emerald-500/20 hover:bg-emerald-500/20",
            )}
          >
            <Filter className="w-5 h-5 text-emerald-700" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-border rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 shadow-xl">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Faculty
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full bg-bg-cream border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-secondary"
                >
                  <option value="">All Faculties</option>
                  {FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-bg-cream border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-secondary"
                >
                  <option value="">All Departments</option>
                  {faculty &&
                    DEPARTMENTS[faculty]?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-bg-cream border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-secondary"
                >
                  <option value="">All Levels</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Book Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-bg-cream border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-secondary"
                >
                  <option value="">All Types</option>
                  {BOOK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-error flex items-center space-x-1 hover:underline"
                >
                  <X className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode & Results Count */}
      <div className="flex justify-between items-center border-b border-border pb-6">
        <p className="text-sm opacity-60 font-medium">
          Showing <span className="text-primary font-bold">{books.length}</span>{" "}
          results
        </p>
        <div className="flex items-center bg-white border border-border rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === "grid"
                ? "bg-primary text-white shadow-lg"
                : "hover:bg-primary/10",
            )}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("shelf")}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === "shelf"
                ? "bg-primary text-white shadow-lg"
                : "hover:bg-primary/10",
            )}
          >
            <Columns className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-2xl p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[3/4] bg-bg-cream rounded-xl" />
              <div className="h-4 bg-bg-cream rounded w-3/4" />
              <div className="h-3 bg-bg-cream rounded w-1/2" />
              <div className="flex justify-between">
                <div className="h-6 bg-bg-cream rounded w-1/4" />
                <div className="h-6 bg-bg-cream rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        viewMode === "shelf" ? (
          <div className="space-y-12">
            {[0, 1, 2].map((row) => (
              <div key={row} className="relative pt-12 pb-4">
                <div className="flex items-end space-x-1 overflow-x-auto pb-2 px-4 scrollbar-hide">
                  {books.slice(row * 20, (row + 1) * 20).map((book) => (
                    <BookCard key={book.id} book={book} viewMode="shelf" />
                  ))}
                </div>
                {/* Shelf Wood Visual */}
                <div className="h-4 w-full bg-gradient-to-b from-[#5D4037] to-[#3E2723] rounded-full shadow-2xl border-t border-white/10" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-black/10 blur-xl -z-10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} viewMode="grid" />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-24 space-y-6">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-12 h-12 text-primary opacity-20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold">No books found</h3>
            <p className="opacity-60 max-w-md mx-auto">
              We couldn't find any books matching your current filters. Try
              adjusting your search or clearing the filters.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
