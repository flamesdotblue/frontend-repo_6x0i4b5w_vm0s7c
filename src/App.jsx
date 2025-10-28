import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import ChatPreview from "./components/ChatPreview";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <ChatPreview />
      </main>
      <footer className="border-t border-white/10 py-10 text-center bg-black/60">
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Cerebro AI Assistant. Built for delightful, real‑time intelligence.</p>
      </footer>
    </div>
  );
}

export default App;
