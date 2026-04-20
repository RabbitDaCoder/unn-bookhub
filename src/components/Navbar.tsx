import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useCartStore } from "../store/useStore";
import { logOut } from "../supabase";
import { Logo } from "./Logo";

export function Navbar() {
  const { user, userProfile, loading } = useAuthStore();
  const { items } = useCartStore();
  const totalItems = items.reduce((a, i) => a + i.quantity, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Bookstore" },
    { to: "/library", label: "Library" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-ink-900/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[68px] flex items-center justify-between">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    isActive(link.to)
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-px left-3 right-3 h-[2px] bg-amber-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-amber-500 text-ink-900 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-ink-900 ${cartBounce ? "animate-bounce" : ""}`}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {loading ? (
              <div className="w-20 h-9 bg-white/10 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/15 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-ink-900 text-xs font-black flex-shrink-0">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-white text-sm font-semibold max-w-[100px] truncate hidden sm:block">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Student"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-white/50 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-ink-600 border border-white/10 rounded-2xl p-2 shadow-xl z-50 animate-fade-up">
                    <div className="px-3 py-2.5 mb-1 border-b border-white/[0.06]">
                      <p className="text-white text-sm font-semibold truncate">
                        {user.user_metadata?.full_name || "Student"}
                      </p>
                      <p className="text-white/40 text-xs truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    {[
                      { to: "/dashboard", label: "Dashboard", icon: "⊞" },
                      { to: "/profile", label: "My Profile", icon: "👤" },
                      { to: "/orders", label: "My Orders", icon: "📦" },
                      { to: "/complaints", label: "Complaints", icon: "💬" },
                      ...(userProfile?.role === "admin"
                        ? [{ to: "/admin", label: "Admin Panel", icon: "⚙️" }]
                        : []),
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 text-sm hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                      >
                        <span className="text-base w-5 text-center">
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                      <button
                        onClick={() => {
                          logOut();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 text-sm hover:bg-red-400/10 transition-all duration-150"
                      >
                        <span className="text-base w-5 text-center">→</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 rounded-xl text-white/70 text-sm font-semibold border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-ink-900 text-sm font-bold hover:bg-amber-600 transition-all duration-200 shadow-amber"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white/70 hover:text-white transition-all duration-200"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 bg-current rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink-900/98 backdrop-blur-2xl flex flex-col pt-20 pb-8 px-6 animate-fade-up md:hidden">
          <div className="flex flex-col gap-2 flex-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-3xl font-extrabold py-4 border-b border-white/[0.06] animate-fade-up transition-colors duration-200 ${isActive(link.to) ? "text-amber-500" : "text-white hover:text-amber-400"}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!user ? (
            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 text-center rounded-2xl border border-white/20 text-white text-lg font-bold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 text-center rounded-2xl bg-amber-500 text-ink-900 text-lg font-bold"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logOut();
                setMobileOpen(false);
              }}
              className="w-full py-4 text-center rounded-2xl border border-red-400/30 text-red-400 text-lg font-bold mt-8"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </>
  );
}
