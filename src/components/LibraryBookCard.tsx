import { useNavigate } from "react-router-dom";
import { BookCover } from "./ui/BookCover";
import type { LibraryBook } from "../data/libraryBooks";

export function LibraryBookCard({ book }: { book: LibraryBook }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/reader/${book.id}`)}
      className="bg-ink-700 border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer group hover:border-music-light/40 hover:-translate-y-1.5 transition-all duration-300"
    >
      <div className="relative h-44 bg-ink-900 flex items-center justify-center bg-book-card overflow-hidden">
        <BookCover
          courseCode={book.genre}
          title={book.title}
          color={book.coverColor}
          author={book.author}
          size="md"
        />
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-music-DEFAULT/70 text-white text-[10px] font-bold backdrop-blur-sm">
          {book.genre}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-music-light transition-colors duration-200 mb-1">
          {book.title}
        </h3>
        <p className="text-white/40 text-xs italic mb-3">{book.author}</p>

        <div className="flex items-center justify-between">
          <span className="text-white/30 text-[10px]">
            ~{Math.round(book.wordCount / 200)} min read
          </span>
          <span className="text-music-light text-xs font-bold group-hover:translate-x-1 transition-transform duration-200">
            Read →
          </span>
        </div>
      </div>
    </div>
  );
}
