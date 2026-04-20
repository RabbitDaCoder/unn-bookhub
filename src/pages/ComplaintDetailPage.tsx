import { Link, useParams } from "react-router-dom";

export default function ComplaintDetailPage() {
  const { id } = useParams();

  // In a full app this would fetch from Firebase
  return (
    <div className="min-h-screen bg-ink-900">
      <section className="bg-ink-800 border-b border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Link
            to="/complaints"
            className="text-white/40 hover:text-white text-sm mb-3 inline-block"
          >
            ← Back to Complaints
          </Link>
          <h1 className="text-3xl font-extrabold text-white">
            Complaint #{id?.slice(0, 8)}
          </h1>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10">
        <div className="bg-ink-700 border border-white/[0.06] rounded-2xl p-6 text-center">
          <p className="text-white/40 text-sm">
            Complaint details will load here once connected to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
