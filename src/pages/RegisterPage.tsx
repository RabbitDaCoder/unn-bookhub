import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LogIn } from "lucide-react";

export default function RegisterPage() {
  const [password, setPassword] = useState("");

  const strength = Math.min(4, Math.ceil(password.length / 3));
  const labels = ["Weak", "Fair", "Good", "Strong"];

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
            <h2
              style={{ fontSize: 32, fontWeight: 800, color: "var(--text-1)" }}
            >
              UNN BookHub
            </h2>
            <p style={{ color: "var(--text-3)" }}>
              Join thousands of UNN students using BookHub.
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
                "Official course materials",
                "Verified student accounts",
                "Fast campus delivery",
              ].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ color: "var(--text-amber)" }}>?</span> {t}
                </div>
              ))}
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
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>
                Create your account
              </h2>
              <p style={{ color: "var(--text-3)", fontSize: 14 }}>
                Join thousands of UNN students
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
                label="Full Name"
                placeholder="Adaeze Okafor"
                requiredMark
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 999,
                      background:
                        i <= strength
                          ? "var(--amber-400)"
                          : "var(--border-subtle)",
                    }}
                  />
                ))}
              </div>
              <div style={{ color: "var(--text-3)", fontSize: 11 }}>
                {strength === 0 ? "Enter a password" : labels[strength - 1]}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                requiredMark
              />
            </div>

            <label
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                marginTop: 10,
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: "1px solid var(--border-default)",
                  accentColor: "var(--amber-400)",
                  marginTop: 2,
                }}
              />
              <span style={{ color: "var(--text-2)", fontSize: 13 }}>
                I agree to the Terms and Privacy Policy.
              </span>
            </label>

            <div style={{ marginTop: 16 }}>
              <Button variant="primary" fullWidth size="lg">
                Create Account
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
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "var(--text-amber)", fontWeight: 700 }}
              >
                Sign in ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
