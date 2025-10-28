import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesGrid from "./components/FeaturesGrid";
import ChatPreview from "./components/ChatPreview";
import SettingsPanel from "./components/SettingsPanel";

const SETTINGS_KEY = "cerebro.settings";

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    userId: "pavitra",
    temperature: 0.7,
    model: "gpt-4o-mini",
    persona: "balanced",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <ChatPreview settings={settings} />
      </main>
      <footer className="border-t border-white/10 py-10 text-center bg-black/60">
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Cerebro AI Assistant. Built for delightful, real‑time intelligence.</p>
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        value={settings}
        onChange={setSettings}
      />
    </div>
  );
}

export default App;
