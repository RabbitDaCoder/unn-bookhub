import { useParams, Link } from "react-router-dom";
import { getLibraryBookById } from "../data/libraryBooks";
import { useMusicStore } from "../store/useStore";

export default function ReaderPage() {
  const { id } = useParams();
  const book = getLibraryBookById(id || "");
  const { isPlaying, togglePlay } = useMusicStore();

  if (!book) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">📖</p>
          <p className="text-white text-xl font-bold mb-2">Book not found</p>
          <Link
            to="/library"
            className="text-music-light hover:text-music-DEFAULT font-semibold text-sm"
          >
            ← Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Top bar */}
      <div className="sticky top-[68px] z-30 bg-ink-800/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/library"
            className="text-white/50 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            ← Library
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-music-DEFAULT/20 border border-music-light/30 text-music-light text-xs font-bold hover:bg-music-DEFAULT/30 transition-all"
            >
              {isPlaying ? "⏸" : "▶"} Music
            </button>
          </div>
        </div>
      </div>

      {/* Reader content */}
      <article className="max-w-3xl mx-auto px-6 lg:px-12 py-12">
        <header className="mb-10 pb-8 border-b border-white/[0.06]">
          <span className="text-music-light text-xs font-bold uppercase tracking-widest mb-3 block">
            {book.genre}
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
            {book.title}
          </h1>
          <p className="text-white/50 text-lg">
            by{" "}
            <span className="text-white/70 font-semibold">{book.author}</span>
          </p>
          {book.year && (
            <p className="text-white/30 text-sm mt-2">Published {book.year}</p>
          )}
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-white/70 leading-[2] text-[17px] font-serif whitespace-pre-line drop-cap">
            {book.content || "Content coming soon..."}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between items-center">
          <Link
            to="/library"
            className="text-white/50 hover:text-white text-sm font-semibold transition-colors"
          >
            ← Back to Library
          </Link>
          <div className="text-white/30 text-xs">
            {book.pages ? `${book.pages} pages` : ""}
          </div>
        </div>
      </article>
    </div>
  );
}
