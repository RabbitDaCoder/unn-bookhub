import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message sent! We'll respond within 24 hours.", "success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Contact Us
          </h1>
          <p className="text-white/50">
            Have a question? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-ink-700 border border-white/[0.06] rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              Send a Message
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div className="mb-6">
              <label className="text-white/50 text-xs font-bold uppercase tracking-wide mb-1.5 block">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-ink-600 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3 rounded-full bg-amber-500 text-ink-900 font-bold text-sm shadow-amber hover:bg-amber-600 transition-all duration-200"
            >
              Send Message →
            </button>
          </form>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {[
              {
                icon: "📍",
                title: "Address",
                lines: [
                  "University of Nigeria, Nsukka",
                  "Enugu State, Nigeria",
                ],
              },
              {
                icon: "📧",
                title: "Email",
                lines: ["forgivenessagubuzu@gmail.com"],
              },
              { icon: "📞", title: "Phone", lines: ["09162332235"] },
              {
                icon: "⏰",
                title: "Hours",
                lines: ["Mon - Sat: 8am - 7pm", "Sun: Closed"],
              },
            ].map((info) => (
              <div
                key={info.title}
                className="bg-ink-700 border border-white/[0.06] rounded-xl p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{info.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">
                      {info.title}
                    </p>
                    {info.lines.map((l) => (
                      <p key={l} className="text-white/40 text-sm">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
