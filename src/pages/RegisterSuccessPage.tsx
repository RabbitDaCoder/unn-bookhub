import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-block mb-8">
          <Logo size="lg" />
        </Link>

        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-3">
          Check your email
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          We've sent a confirmation link to your email address.
          <br />
          Please click the link to verify your account before logging in.
        </p>

        <div className="bg-ink-700 border border-white/[0.06] rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3 text-left">
            <div className="w-5 h-5 mt-0.5 text-amber-400 shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">
                Didn't get the email?
              </p>
              <ul className="text-white/40 text-xs space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes and try again</li>
              </ul>
            </div>
          </div>
        </div>

        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-ink-900 font-bold rounded-xl transition-colors"
        >
          Go to Login
        </Link>

        <p className="text-white/30 text-xs mt-4">
          Already confirmed?{" "}
          <Link to="/login" className="text-amber-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
