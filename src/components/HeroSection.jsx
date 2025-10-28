import Spline from "@splinetool/react-spline";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] pt-24 overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black" aria-label="Hero">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/pDXeCthqjmzYX5Zk/scene.splinecode" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Subtle radial gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.75)_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-tight">
            Cerebro — your personal, real‑time AI that learns you.
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            Chat naturally, upload knowledge, and get smarter answers powered by Retrieval‑Augmented Generation and live streaming.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#chat" className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-black bg-white hover:bg-white/90 transition">
              Start chatting
            </a>
            <a href="#features" className="inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition">
              Explore features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
