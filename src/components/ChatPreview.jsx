import { useEffect, useMemo, useRef, useState } from "react";

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

function useBackendUrls() {
  // Derive REST and WS URLs from VITE_BACKEND_URL, falling back to same origin
  const base = import.meta.env.VITE_BACKEND_URL || window.location.origin;
  const restBase = base.replace(/\/$/, "");
  const wsBase = useMemo(() => {
    try {
      const url = new URL(restBase);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      return url.toString().replace(/\/$/, "");
    } catch {
      const origin = window.location.origin;
      const proto = origin.startsWith("https") ? "wss" : "ws";
      return origin.replace(/^https?/, proto);
    }
  }, [restBase]);
  return { restBase, wsBase };
}

const CHAT_KEY_PREFIX = "cerebro.chat.";

export default function ChatPreview({ settings = { userId: "pavitra", temperature: 0.7, model: "gpt-4o-mini", persona: "balanced" } }) {
  const { userId, temperature, model, persona } = settings;
  const storageKey = `${CHAT_KEY_PREFIX}${userId}`;
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { role: "user", content: "Summarize the document I just uploaded and list key takeaways." },
    ];
  });
  const [inputText, setInputText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const wsRef = useRef(null);
  const { restBase, wsBase } = useBackendUrls();
  const scrollRef = useRef(null);

  // Persist chat per user
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // Auto scroll on message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  useEffect(() => {
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || streaming) return;

    // Append user message and a placeholder assistant message we will stream into
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInputText("");
    setStreaming(true);

    const wsUrl = `${wsBase}/ws/chat`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      const payload = { user_id: userId, message: text, stream: true, temperature, model, persona };
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "partial") {
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
              updated[lastIdx] = { ...updated[lastIdx], content: (updated[lastIdx].content || "") + (payload.text || "") };
            }
            return updated;
          });
        } else if (payload.type === "done") {
          ws.close();
        }
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    };

    ws.onerror = () => {
      setStreaming(false);
    };

    ws.onclose = () => {
      setStreaming(false);
    };
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const ingestTxt = async (file) => {
    const text = await file.text();
    const body = { user_id: userId, doc_name: file.name, text };
    const res = await fetch(`${restBase}/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  };

  const ingestPdf = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("user_id", userId);
    form.append("doc_name", file.name);
    const res = await fetch(`${restBase}/ingest`, {
      method: "POST",
      body: form,
    });
    return res;
  };

  const handleIngest = async (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    try {
      let res;
      if (name.endsWith(".txt")) {
        res = await ingestTxt(file);
      } else if (name.endsWith(".pdf")) {
        res = await ingestPdf(file);
      } else {
        alert("Please upload a .txt or .pdf file.");
        return;
      }

      if (!res.ok) {
        const msg = await res.text();
        alert(`Ingestion failed: ${msg}`);
        return;
      }
      alert("Document ingested successfully.");
    } catch (e) {
      alert(`Ingestion error: ${e?.message || e}`);
    }
  };

  return (
    <section id="chat" className="relative py-20 bg-gradient-to-b from-black to-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">Chat</h2>
          <p className="mt-3 text-white/70">Type a message and watch live streaming responses over WebSockets. You can also ingest .txt or .pdf files to power RAG.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat panel */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6 flex flex-col min-h-[420px]">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                m.role === "user" ? (
                  <UserBubble key={idx}>{m.content}</UserBubble>
                ) : (
                  <BotBubble key={idx}>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                    {streaming && idx === messages.length - 1 && (
                      <span className="inline-flex animate-pulse">▍</span>
                    )}
                  </BotBubble>
                )
              ))}
            </div>
            <div className="mt-4 flex items-end gap-3">
              <textarea
                className="flex-1 resize-none rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                rows={2}
                placeholder="Ask anything…"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={streaming || !inputText.trim()}
                className="shrink-0 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-black bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {streaming ? "Streaming…" : "Send"}
              </button>
            </div>
            <div className="mt-2 text-xs text-white/50">
              Using <span className="font-medium text-white/80">{model}</span> · Temp <span className="font-medium text-white/80">{temperature.toFixed(1)}</span> · Persona {persona}
            </div>
          </div>

          {/* Ingestion panel */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6">
            <h3 className="text-lg font-medium text-white">Document Ingestion</h3>
            <p className="mt-2 text-sm text-white/70">Upload a .txt or .pdf file to add it to your personal knowledge base.</p>
            <div className="mt-4">
              <label className="block">
                <input
                  type="file"
                  accept=".txt,.pdf"
                  onChange={(e) => handleIngest(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-white/90"
                />
              </label>
            </div>
            <p className="mt-3 text-xs text-white/50">Text files are sent as JSON; PDFs are sent as form-data for server-side parsing.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
