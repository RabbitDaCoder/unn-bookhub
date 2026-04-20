import { useParams, Link } from "react-router-dom";
import { getBookById, getBooksByCategory } from "../data/books";
import { useCartStore } from "../store/useStore";
import { useToast } from "../context/ToastContext";
import { BookCover } from "../components/ui/BookCover";
import { BookCard } from "../components/BookCard";

export default function BookDetailPage() {
  const { id } = useParams();
  const book = getBookById(id || "");
  const { addItem, items } = useCartStore();
  const { toast } = useToast();

  if (!book) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-white text-xl font-bold mb-2">Book not found</p>
          <Link
            to="/books"
            className="text-amber-500 hover:text-amber-400 font-semibold text-sm"
          >
            ← Back to Bookstore
          </Link>
        </div>
      </div>
    );
  }

  const inCart = items.some((i) => i.id === book.id);
  const related = getBooksByCategory(book.category || book.faculty || "")
    .filter((b) => b.id !== book.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(book);
    toast("Added to cart!", "success");
  };

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Breadcrumb */}
      <div className="bg-ink-800 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/books" className="hover:text-white transition-colors">
              Bookstore
            </Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">
              {book.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[380px_1fr] gap-12">
          {/* Left: Cover */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-ink-700 border border-white/[0.06] rounded-3xl p-8 w-full flex items-center justify-center">
              <BookCover
                courseCode={book.courseCode}
                title={book.title}
                color={book.coverColor}
                size="hero"
              />
            </div>
            {book.isELibraryAvailable && (
              <div className="flex items-center gap-2 bg-music-DEFAULT/15 border border-music-light/30 rounded-full px-4 py-2 text-music-light text-xs font-bold">
                <span>📖</span> Also available in E-Library
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                  {book.courseCode}
                </span>
                {book.faculty && (
                  <span className="bg-white/5 text-white/50 px-3 py-1 rounded-full text-xs font-semibold">
                    {book.faculty}
                  </span>
                )}
                {book.department && (
                  <span className="bg-white/5 text-white/50 px-3 py-1 rounded-full text-xs font-semibold">
                    {book.department}
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-white/50 text-lg">
                by{" "}
                <span className="text-white/70 font-semibold">
                  {book.author}
                </span>
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-amber-500">
                ₦{book.price.toLocaleString()}
              </span>
              {book.inStock ? (
                <span className="text-green-400 text-sm font-bold">
                  ✓ In Stock
                </span>
              ) : (
                <span className="text-red-400 text-sm font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            {book.description && (
              <p className="text-white/50 text-sm leading-[1.8] max-w-lg">
                {book.description}
              </p>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { label: "Edition", value: book.edition || "-" },
                {
                  label: "Pages",
                  value: book.pages ? `${book.pages} pages` : "-",
                },
                { label: "ISBN", value: book.isbn || "-" },
                { label: "Type", value: book.type || "Physical" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-ink-700 border border-white/[0.06] rounded-xl p-3"
                >
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-wide mb-1">
                    {m.label}
                  </p>
                  <p className="text-white text-sm font-semibold">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-2">
              {inCart ? (
                <Link
                  to="/cart"
                  className="px-7 py-3.5 rounded-full bg-green-500/15 border border-green-500/40 text-green-400 font-bold text-sm"
                >
                  ✓ In Cart — View Cart
                </Link>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={!book.inStock}
                  className="px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-extrabold text-sm shadow-amber hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart 🛒
                </button>
              )}
              <Link
                to="/books"
                className="px-7 py-3.5 rounded-full border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:text-white transition-all duration-200"
              >
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h3 className="text-xl font-extrabold text-white mb-6">
              Related Books
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
