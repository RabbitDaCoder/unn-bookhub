import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useCartStore } from "../store/useStore";
import { logOut } from "../firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userProfile, loading } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logOut();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(245, 158, 11, 0.18)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 68,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTaeVz_LUxcpFrCvJfHElkABq1acTU1u4wQ&s"
            alt="UNN BookHub logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              objectFit: "cover",
              background: "#f8fafc",
            }}
            referrerPolicy="no-referrer"
          />
          <div>
            <div style={{ color: "#f8fafc", fontSize: 18, fontWeight: 700 }}>
              UNN BookHub
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 11, letterSpacing: 1.2 }}>
              University of Nigeria, Nsukka
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            to="/"
            style={{
              color: isActive("/") ? "#f59e0b" : "#cbd5e1",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              background: isActive("/")
                ? "rgba(245, 158, 11, 0.12)"
                : "transparent",
              fontWeight: 600,
            }}
          >
            Home
          </Link>
          <Link
            to="/books"
            style={{
              color: isActive("/books") ? "#f59e0b" : "#cbd5e1",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              background: isActive("/books")
                ? "rgba(245, 158, 11, 0.12)"
                : "transparent",
              fontWeight: 600,
            }}
          >
            Bookstore
          </Link>
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#cbd5e1",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <span style={{ fontSize: 16 }}>🛒</span>
            <span style={{ fontWeight: 600 }}>{totalItems} items</span>
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("toggle-theme"))
            }
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "10px 12px",
              background: "transparent",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            🌙
          </button>

          {loading ? (
            <div
              style={{
                width: 88,
                height: 40,
                borderRadius: 14,
                background: "rgba(255,255,255,0.08)",
              }}
            />
          ) : user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 14,
                  padding: "10px 14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#f8fafc",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  {user.displayName
                    ? user.displayName.split(" ")[0]
                    : user.email}
                </span>
                <span style={{ fontSize: 14 }}>▾</span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    width: 220,
                    borderRadius: 16,
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
                    padding: 12,
                    zIndex: 200,
                  }}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 12px",
                      color: "#e2e8f0",
                      textDecoration: "none",
                      borderRadius: 12,
                      marginBottom: 6,
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 12px",
                      color: "#e2e8f0",
                      textDecoration: "none",
                      borderRadius: 12,
                      marginBottom: 6,
                    }}
                  >
                    My Orders
                  </Link>
                  {userProfile?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "block",
                        padding: "10px 12px",
                        color: "#e2e8f0",
                        textDecoration: "none",
                        borderRadius: 12,
                        marginBottom: 6,
                      }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      marginTop: 6,
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                to="/login"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontWeight: 600,
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  color: "#0f172a",
                  background: "#f59e0b",
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: 12,
                  fontWeight: 700,
                }}
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              display: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "10px 12px",
              background: "transparent",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            Menu
          </button>
        </div>
      </div>
    </nav>
  );
}
