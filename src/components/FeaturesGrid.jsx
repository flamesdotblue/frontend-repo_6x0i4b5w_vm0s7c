import { MessageSquare, FileText, Search, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Real‑time Chat",
    desc: "Converse seamlessly with low‑latency streaming responses over WebSockets.",
  },
  {
    icon: FileText,
    title: "Document Ingestion",
    desc: "Upload .txt and more. We chunk, index, and make your knowledge searchable.",
  },
  {
    icon: Search,
    title: "RAG Retrieval",
    desc: "Context‑aware answers grounded in your data using vector search.",
  },
  {
    icon: Zap,
    title: "Personalization",
    desc: "Learns preferences to tailor tone, depth, and formatting to you.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-20 bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Why Cerebro</h2>
          <p className="mt-3 text-white/70">A focused toolkit for personal knowledge, fast reasoning, and delightful UX.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-white/10 bg-zinc-900/40 p-5 hover:border-white/20 transition">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/30 via-fuchsia-500/30 to-amber-400/30 grid place-items-center">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
