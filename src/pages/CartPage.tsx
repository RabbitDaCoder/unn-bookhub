import { Link } from "react-router-dom";
import { useCartStore } from "../store/useStore";
import { BookCover } from "../components/ui/BookCover";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  const totalAmount = items.reduce((a, i) => a + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-white/40 mb-6">Add some books and come back!</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-bold shadow-amber hover:bg-amber-600 transition-all duration-200"
          >
            Browse Bookstore →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            Shopping Cart
          </h1>
          <p className="text-white/40 text-sm">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-ink-700 border border-white/[0.06] rounded-2xl p-5 flex gap-5 items-start"
              >
                <div className="flex-shrink-0">
                  <BookCover
                    courseCode={item.courseCode}
                    title={item.title}
                    color={item.coverColor}
                    size="sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${item.id}`}
                    className="text-white font-bold text-sm hover:text-amber-400 transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <p className="text-white/40 text-xs mt-1">
                    {item.courseCode} · {item.author}
                  </p>
                  <p className="text-amber-500 font-extrabold mt-2">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400/60 hover:text-red-400 text-xs font-bold transition-colors"
                  >
                    Remove
                  </button>
                  <div className="flex items-center gap-2 bg-ink-600 rounded-lg border border-white/10">
                    <button
                      onClick={() =>
                        updateQty(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1.5 text-white/60 hover:text-white text-sm"
                    >
                      −
                    </button>
                    <span className="text-white text-sm font-bold min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-white/60 hover:text-white text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-400/60 hover:text-red-400 text-sm font-semibold transition-colors self-start mt-2"
            >
              🗑 Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-5">
                Order Summary
              </h3>
              <div className="flex flex-col gap-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="text-white font-semibold">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Delivery</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-amber-500 text-xl font-extrabold">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full py-3.5 rounded-xl bg-amber-500 text-ink-900 font-extrabold text-sm text-center shadow-amber hover:bg-amber-600 transition-all duration-200"
              >
                Proceed to Checkout →
              </Link>
              <Link
                to="/books"
                className="block w-full py-3 text-center text-white/50 text-sm font-semibold hover:text-white mt-3 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
            <p className="text-white/25 text-xs text-center mt-4">
              💳 Pay on delivery — no online payment required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
