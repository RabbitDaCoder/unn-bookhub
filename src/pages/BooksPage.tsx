import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Filter } from "lucide-react";
import BookCard from "../components/BookCard";
import { books } from "../data/books";
import { cn } from "../lib/utils";

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const departments = useMemo(
    () => Array.from(new Set(books.map((book) => book.department))).sort(),
    [],
  );

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort(),
    [],
  );

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch = [book.title, book.author, book.courseCode]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" || book.category === selectedCategory;
        const matchesDepartment =
          selectedDepartment === "All" ||
          book.department === selectedDepartment;

        return matchesSearch && matchesCategory && matchesDepartment;
      })
      .sort((a, b) => {
        if (sortBy === "priceLow") return a.price - b.price;
        if (sortBy === "priceHigh") return b.price - a.price;
        if (sortBy === "course")
          return a.courseCode.localeCompare(b.courseCode);
        return Number(b.featured) - Number(a.featured);
      });
  }, [search, selectedCategory, selectedDepartment, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                <Sparkles className="h-4 w-4" />
                New local bookstore experience
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Browse official UNN course books
              </h1>
              <p className="max-w-2xl text-slate-300">
                Search across departments, filter by course and faculty, then
                add books to your cart instantly.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Available catalog
              </div>
              <div className="mt-3 flex items-center gap-4 text-3xl font-bold text-white">
                {filteredBooks.length}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                books matching your filters
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden xl:block sticky top-24 self-start rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-slate-200">
              <Filter className="h-5 w-5 text-emerald-300" />
              <h2 className="text-lg font-semibold">Refine results</h2>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Search books
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title, author, course code"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Category
                </div>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-left text-sm transition",
                        selectedCategory === category
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-white/5 text-slate-300 hover:bg-white/10",
                      )}
                    >
                      {category}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    Show all categories
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Department
                </div>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition"
                >
                  <option value="All">All departments</option>
                  {departments.map((department) => (
                    <option
                      key={department}
                      value={department}
                      className="bg-slate-950 text-white"
                    >
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Sort by
                </div>
                <div className="grid gap-2">
                  <button
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm transition",
                      sortBy === "featured"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-white/5 text-slate-300 hover:bg-white/10",
                    )}
                    type="button"
                    onClick={() => setSortBy("featured")}
                  >
                    Featured first
                  </button>
                  <button
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm transition",
                      sortBy === "priceLow"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-white/5 text-slate-300 hover:bg-white/10",
                    )}
                    type="button"
                    onClick={() => setSortBy("priceLow")}
                  >
                    Price: low to high
                  </button>
                  <button
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm transition",
                      sortBy === "priceHigh"
                        ? "bg-emerald-500/10 text-emerald-200"
                        : "bg-white/5 text-slate-300 hover:bg-white/10",
                    )}
                    type="button"
                    onClick={() => setSortBy("priceHigh")}
                  >
                    Price: high to low
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Shop UNN books
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Explore the latest collections
                </h2>
              </div>
              <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                <SlidersHorizontal className="h-5 w-5 text-emerald-300" />
                {filteredBooks.length} books available
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
