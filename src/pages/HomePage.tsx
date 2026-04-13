import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { BookCard } from "../components/BookCard";
import { BookCover } from "../components/ui/BookCover";
import { books } from "../data/books";
import { useIsMobile } from "../hooks/useIsMobile";

export default function HomePage() {
  const isMobile = useIsMobile();
  const featured = books.filter((b) => b.featured).slice(0, 6);

  return (
    <div style={{ color: "var(--text-1)", background: "var(--bg-base)" }}>
      <section
        style={{
          padding: isMobile ? "64px 0" : "96px 0",
          background:
            "radial-gradient(circle at 10% 20%, rgba(245,158,11,0.08), transparent 35%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.04), transparent 30%), linear-gradient(135deg, #0f172a 0%, #0b1222 100%)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 0.95fr",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid var(--border-amber)",
                borderRadius: 999,
                width: "fit-content",
                color: "var(--text-amber)",
                fontWeight: 700,
                letterSpacing: 0.6,
              }}
            >
              Official UNN Bookstore
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 58px)",
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Course books with zero guesswork.
            </h1>
            <p
              style={{ color: "var(--text-3)", fontSize: 16, lineHeight: 1.6 }}
            >
              Browse by course code, faculty, or featured picks. We deliver to
              hostels and departments across Nsukka campus.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 12,
              }}
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth={isMobile}
                onClick={() => (window.location.href = "/books")}
              >
                Browse Bookstore
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth={isMobile}
                onClick={() => (window.location.href = "/library")}
              >
                Enter E-Library
              </Button>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 18,
              padding: 18,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
                gap: 12,
              }}
            >
              {featured.slice(0, isMobile ? 2 : 4).map((book) => (
                <div
                  key={book.id}
                  style={{
                    background: "var(--bg-card-hover)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 12,
                    padding: 12,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <BookCover
                      courseCode={book.courseCode}
                      title={book.title}
                      color={book.coverColor}
                      size="sm"
                    />
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}
                  >
                    {book.title}
                  </div>
                  <div
                    style={{
                      color: "var(--text-amber)",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {book.courseCode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="container"
        style={{ padding: "32px 0 48px", display: "grid", gap: 16 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Featured books</h2>
          <Link
            to="/books"
            style={{ color: "var(--text-amber)", fontWeight: 700 }}
          >
            See all ?
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, minmax(0,1fr))"
              : "repeat(auto-fill, minmax(190px,1fr))",
            gap: 12,
          }}
        >
          {featured.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
