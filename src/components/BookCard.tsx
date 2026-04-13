import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Book } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import { useCartStore } from "../store/useStore";
import { useToast } from "./ui/ToastContext";
import BookCover from "./ui/BookCover";
import { motion } from "motion/react";

interface BookCardProps {
  book: Book;
  viewMode?: "grid" | "shelf";
}

export default function BookCard({ book, viewMode = "grid" }: BookCardProps) {
  const { addItem, items } = useCartStore();
  const { pushToast } = useToast();
  const inCart = items.some((item) => item.id === book.id);

  if (viewMode === "shelf") {
    return (
      <motion.div
        whileHover={{ y: -10 }}
        className="min-w-[90px] flex flex-col items-center gap-3"
      >
        <div className="w-14 h-52 rounded-xl bg-gradient-to-b from-slate-900 to-slate-700 shadow-2xl border border-white/10" />
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 text-center">
          {book.courseCode}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl transition-all hover:-translate-y-1"
    >
      <Link to={`/books/${book.id}`} className="block">
        <BookCover
          title={book.title}
          courseCode={book.courseCode}
          coverColor={book.coverColor}
          featured={book.featured}
        />
      </Link>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.22em] text-amber-300">
            {book.courseCode}
          </span>
          <span
            className={cn(
              "text-[11px] font-semibold uppercase rounded-full px-2 py-1",
              book.inStock
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-red-500/10 text-red-300",
            )}
          >
            {book.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">{book.author}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-emerald-400">
            {formatCurrency(book.price)}
          </span>
          <button
            onClick={() => {
              addItem(book);
              pushToast({
                title: "Added to cart",
                message: `${book.title} was added to your cart.`,
                variant: "success",
              });
            }}
            disabled={!book.inStock}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
              book.inStock
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                : "bg-white/10 text-slate-400 cursor-not-allowed",
            )}
          >
            {inCart ? "In Cart" : "Add"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
