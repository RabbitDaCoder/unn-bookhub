import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink-700 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" showSub={true} />
            <p className="text-white/40 text-sm mt-4 leading-relaxed">
              The official course material marketplace for University of
              Nigeria, Nsukka students.
            </p>
            <p className="text-amber-500/70 text-xs mt-4 font-semibold">
              Built with ❤️ for UNN students
            </p>
          </div>

          <div>
            <h5 className="text-white/50 text-[11px] font-black uppercase tracking-[1.2px] mb-5">
              Quick Links
            </h5>
            {[
              { to: "/", label: "Home" },
              { to: "/books", label: "Bookstore" },
              { to: "/library", label: "Library" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-white/40 text-sm py-1.5 hover:text-amber-400 transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <h5 className="text-white/50 text-[11px] font-black uppercase tracking-[1.2px] mb-5">
              Student Services
            </h5>
            {[
              { to: "/dashboard", label: "Dashboard" },
              { to: "/orders", label: "My Orders" },
              { to: "/cart", label: "Cart" },
              { to: "/complaints", label: "File Complaint" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block text-white/40 text-sm py-1.5 hover:text-amber-400 transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div>
            <h5 className="text-white/50 text-[11px] font-black uppercase tracking-[1.2px] mb-5">
              Contact Us
            </h5>
            {[
              { icon: "📍", text: "University of Nigeria, Nsukka" },
              { icon: "🌐", text: "Enugu State, Nigeria" },
              { icon: "📧", text: "forgivenessagubuzu@gmail.com" },
              { icon: "📞", text: "09162332235" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5 py-1.5">
                <span className="text-sm mt-0.5">{item.icon}</span>
                <span className="text-white/40 text-sm leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2026 UNN BookHub. All rights reserved.
          </p>
          <p className="text-amber-500/60 text-xs font-semibold">
            Made for students, by students ❤️ SEN 201 Group 3
          </p>
        </div>
      </div>
    </footer>
  );
}
