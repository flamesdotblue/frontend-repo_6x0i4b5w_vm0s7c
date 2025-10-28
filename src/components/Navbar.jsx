import { Rocket, Settings } from "lucide-react";

export default function Navbar({ onOpenSettings }) {
  return (
    <header className="w-full fixed top-0 left-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 via-fuchsia-500 to-amber-400 p-[2px]">
            <div className="h-full w-full rounded-md bg-black grid place-items-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="font-semibold tracking-tight">Cerebro</span>
          <span className="text-white/50 hidden sm:inline">AI Assistant</span>
        </div>
        <nav className="flex items-center gap-3">
          <a href="#features" className="text-sm text-white/80 hover:text-white transition">Features</a>
          <a href="#chat" className="text-sm text-white/80 hover:text-white transition">Chat</a>
          <button onClick={onOpenSettings} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white transition">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
}
