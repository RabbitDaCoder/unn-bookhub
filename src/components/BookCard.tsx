import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useStore";
import { BookCover } from "./ui/BookCover";
import type { Book } from "../types";

export function BookCard({ book }: { book: Book }) {
  const { addItem, items } = useCartStore();
  const navigate = useNavigate();
  const inCart = items.some((i) => i.id === book.id);
  const [adding, setAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCart || !book.inStock) return;
    setAdding(true);
    addItem(book);
    setTimeout(() => setAdding(false), 700);
  };

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="bg-ink-700 border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer group hover:border-amber-500/50 hover:-translate-y-1.5 hover:shadow-card-hover transition-all duration-300 flex flex-col relative"
    >
      {!book.inStock && (
        <div className="absolute top-4 right-0 bg-red-500/15 border-l border-y border-red-500/25 text-red-400 text-[9px] font-black px-2 py-1 uppercase tracking-wide z-10">
          Out of Stock
        </div>
      )}

      <div className="relative h-[190px] bg-ink-900 flex items-center justify-center overflow-hidden bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="transition-transform duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1 filter drop-shadow-xl">
          <BookCover
            courseCode={book.courseCode}
            title={book.title}
            color={book.coverColor}
            size="md"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {book.courseCode}
          </span>
          {book.inStock && (
            <span className="text-[9px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>

        <h3 className="text-white font-bold text-[13px] leading-snug line-clamp-2 flex-1">
          {book.title}
        </h3>

        <p className="text-white/30 text-[11px]">
          {book.author} · {book.edition}
        </p>

        <div className="border-t border-white/[0.04] pt-3 mt-1 flex items-center justify-between">
          <span className="text-white font-extrabold text-[17px]">
            ₦{book.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            disabled={!book.inStock}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200
              ${
                inCart
                  ? "bg-green-500/15 border border-green-500/30 text-green-400"
                  : book.inStock
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-ink-900"
                    : "bg-white/[0.04] text-white/20 cursor-not-allowed"
              }
              ${adding ? "scale-110" : ""}`}
          >
            {adding ? "✓" : inCart ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
