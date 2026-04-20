import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-3xl font-extrabold text-white mb-2">
            About UNN BookHub
          </h1>
          <p className="text-white/50 max-w-lg">
            The story behind the platform that's changing how UNN students get
            their books.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {/* Mission */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-white/60 leading-[1.8]">
            UNN BookHub exists to solve one problem: getting the right academic
            textbooks to UNN students without the stress. No more trekking to
            Nsukka market, no more overpriced books from middlemen, no more
            starting the semester without materials.
          </p>
          <p className="text-white/60 leading-[1.8] mt-4">
            We source textbooks directly and deliver to your hostel or
            department — at fair, transparent prices.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-6">
            How We Work
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: "📚",
                title: "We Stock Widely",
                desc: "Course materials for every department across UNN faculties.",
              },
              {
                icon: "💳",
                title: "Pay on Delivery",
                desc: "No online payment. Verify your book, then pay on delivery.",
              },
              {
                icon: "🚀",
                title: "Fast Delivery",
                desc: "Most orders are delivered within 24–48 hours on campus.",
              },
              {
                icon: "💬",
                title: "WhatsApp Support",
                desc: "Order confirmed via WhatsApp. Chat us anytime.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-ink-600 border border-white/[0.04] rounded-xl p-5"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-4">
            Built by Students
          </h2>
          <p className="text-white/60 leading-[1.8]">
            BookHub was created by a team of UNN students who understood the
            problem because we lived it. We're passionate about making academic
            life at UNN just a little easier.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-ink-900 font-extrabold shadow-amber hover:bg-amber-600 transition-all duration-200"
          >
            Browse Bookstore →
          </Link>
        </div>
      </div>
    </div>
  );
}
