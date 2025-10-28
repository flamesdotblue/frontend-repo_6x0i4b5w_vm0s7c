import { useEffect, useRef, useState } from "react";

function BotBubble({ children }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 via-fuchsia-500 to-amber-400" />
      <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/10 px-4 py-3 text-white/90 max-w-[80%]">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }) {
  return (
    <div className="flex items-start gap-2 justify-end">
      <div className="rounded-2xl rounded-tr-none bg-white text-black px-4 py-3 max-w-[80%]">
        {children}
      </div>
      <div className="h-8 w-8 rounded-full bg-white" />
    </div>
  );
}

export default function ChatPreview() {
  const [streamText, setStreamText] = useState("");
  const full = "Absolutely! I can synthesize your uploaded notes and answer with citations. Here's a quick overview…";
  const timer = useRef(null);

  useEffect(() => {
    let i = 0;
    timer.current = setInterval(() => {
      setStreamText(full.slice(0, i));
      i += 2;
      if (i > full.length) {
        clearInterval(timer.current);
      }
    }, 30);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <section id="chat" className="relative py-20 bg-gradient-to-b from-black to-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Chat preview</h2>
          <p className="mt-3 text-white/70">A taste of the live streaming experience you’ll get with WebSockets.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6">
          <div className="space-y-4">
            <UserBubble>Summarize the document I just uploaded and list key takeaways.</UserBubble>
            <BotBubble>
              <span className="whitespace-pre-wrap">{streamText}</span>
              {streamText.length < full.length && (
                <span className="inline-flex animate-pulse">▍</span>
              )}
            </BotBubble>
            <UserBubble>Great. Also create an outline for a 5-minute talk.</UserBubble>
          </div>
        </div>
      </div>
    </section>
  );
}
