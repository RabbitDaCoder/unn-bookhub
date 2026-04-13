import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
        background: "var(--bg-base)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          minHeight: "100vh",
        }}
      >
        <div
          className="hide-mobile"
          style={{
            background: "linear-gradient(160deg, #0f172a 0%, #1a2540 100%)",
            borderRight: "1px solid var(--border-subtle)",
            display: "grid",
            placeItems: "center",
            padding: 32,
          }}
        >
          <div
            style={{
              maxWidth: 360,
              display: "grid",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, var(--amber-400), var(--amber-500))",
                  display: "grid",
                  placeItems: "center",
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: 26,
                  margin: "0 auto",
                }}
              >
                ??
              </div>
            </div>
            <h2
              style={{ fontSize: 32, fontWeight: 800, color: "var(--text-1)" }}
            >
              UNN BookHub
            </h2>
            <p style={{ color: "var(--text-3)" }}>
              Modern access to UNN course books and library resources.
            </p>
            <div
              style={{
                display: "grid",
                gap: 10,
                color: "var(--text-1)",
                textAlign: "left",
              }}
            >
              {[
                "500+ course books curated",
                "Fast hostel delivery",
                "Verified student accounts",
              ].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ color: "var(--text-amber)" }}>?</span> {t}
                </div>
              ))}
            </div>
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>
              500+ Books � Fast Delivery � Student Verified
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-base)",
            display: "grid",
            placeItems: "center",
            padding: "32px 16px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>Welcome back</h2>
              <p style={{ color: "var(--text-3)", fontSize: 14 }}>
                Sign in to continue
              </p>
            </div>

            <Button
              variant="secondary"
              fullWidth
              style={{
                background: "#fff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <LogIn size={18} /> Continue with Google
              </div>
            </Button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "18px 0",
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--border-subtle)",
                }}
              />
              <span style={{ color: "var(--text-3)", fontSize: 12 }}>or</span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--border-subtle)",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <Input
                label="Email"
                type="email"
                placeholder="you@unn.edu.ng"
                requiredMark
              />
              <Input
                label="Password"
                type="password"
                placeholder="��������"
                requiredMark
              />
            </div>

            <div style={{ textAlign: "right", marginTop: 8 }}>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-amber)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <Button variant="primary" fullWidth size="lg">
                Sign in
              </Button>
            </div>

            <div
              style={{
                marginTop: 16,
                color: "var(--text-3)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              New to UNN BookHub?{" "}
              <Link
                to="/register"
                style={{ color: "var(--text-amber)", fontWeight: 700 }}
              >
                Register ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
